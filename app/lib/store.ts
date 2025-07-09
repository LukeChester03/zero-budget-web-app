import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type CategoryAllocation = {
  category: string;
  amount: number;
};

export type BudgetEntry = {
  id: string;
  month: string;
  income: number;
  allocations: CategoryAllocation[];
};

// 👇 New: a Goal type
export type GoalEntry = {
  id: string;
  title: string;
  saved: number;
  target: number;
  iconKey: string;
};

interface BudgetState {
  budgets: BudgetEntry[];
  income: number;
  customCategoriesBySection: { [section: string]: string[] };
  incomeLocked: boolean;

  // 👇 New: goals slice
  goals: GoalEntry[];

  // existing actions...
  deleteBudget: (id: string) => void;
  addBudget: (entry: BudgetEntry) => void;
  updateIncome: (amount: number) => void;
  getBudgetTotal: (allocations: CategoryAllocation[]) => number;
  getBudgetRemaining: (allocations: CategoryAllocation[], income: number) => number;
  getTotalSaved: () => number;
  setIncomeLocked: (locked: boolean) => void;
  addCustomCategory: (section: string, name: string) => void;
  getCustomCategories: (section: string) => string[];

  // 👇 New: goal actions
  addGoal: (goal: Omit<GoalEntry, "id">) => void;
  deleteGoal: (id: string) => void;
  updateGoalSaved: (id: string, saved: number) => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],
      income: 0,
      customCategoriesBySection: {},
      incomeLocked: false,

      // 👇 initialize goals array
      goals: [],

      // existing setters…
      setIncomeLocked: (locked) => set({ incomeLocked: locked }),

      addBudget: (entry) =>
        set((state) => ({
          budgets: [...state.budgets, entry],
        })),

      updateIncome: (amount) => set(() => ({ income: amount })),

      deleteBudget: (id: string) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      getBudgetTotal: (allocs) => allocs.reduce((s, a) => s + a.amount, 0),

      getBudgetRemaining: (allocs, income) => {
        const total = get().getBudgetTotal(allocs);
        return income - total;
      },

      getTotalSaved: () =>
        get().budgets.reduce((sum, b) => {
          const spent = b.allocations.reduce((s, a) => s + a.amount, 0);
          return sum + (b.income - spent);
        }, 0),

      addCustomCategory: (section, name) =>
        set((state) => {
          const current = state.customCategoriesBySection[section] || [];
          if (current.includes(name)) return state;
          return {
            customCategoriesBySection: {
              ...state.customCategoriesBySection,
              [section]: [...current, name],
            },
          };
        }),

      getCustomCategories: (section) => get().customCategoriesBySection[section] || [],

      // 👇 New: add a goal (auto-generate an id)
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { id: uuidv4(), ...goal }],
        })),

      // 👇 New: delete a goal by its id
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      // 👇 New: update only the saved amount for a specific goal
      updateGoalSaved: (id, saved) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, saved } : g)),
        })),
    }),
    {
      name: "budget-storage", // keeps budgets, income & goals in localStorage
    }
  )
);
