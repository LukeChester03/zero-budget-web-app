import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface BudgetState {
  budgets: BudgetEntry[];
  income: number;
  customCategoriesBySection: { [section: string]: string[] };
  incomeLocked: boolean;
  deleteBudget: (id: string) => void;
  addBudget: (entry: BudgetEntry) => void;
  updateIncome: (amount: number) => void;
  getBudgetTotal: (allocations: CategoryAllocation[]) => number;
  getBudgetRemaining: (allocations: CategoryAllocation[], income: number) => number;
  getTotalSaved: () => number;
  setIncomeLocked: (locked: boolean) => void;
  addCustomCategory: (section: string, name: string) => void;
  getCustomCategories: (section: string) => string[];
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],
      income: 0,
      customCategoriesBySection: {},
      incomeLocked: false,
      setIncomeLocked: (locked) => set({ incomeLocked: locked }),

      addBudget: (entry) =>
        set((state) => ({
          budgets: [...state.budgets, entry],
        })),

      updateIncome: (amount) => set(() => ({ income: amount })),

      deleteBudget: (id: string) =>
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        })),

      getBudgetTotal: (allocations) => allocations.reduce((sum, item) => sum + item.amount, 0),

      getBudgetRemaining: (allocations, income) => {
        const total = get().getBudgetTotal(allocations);
        return income - total;
      },

      getTotalSaved: () =>
        get().budgets.reduce((total, budget) => {
          const spent = budget.allocations.reduce((sum, item) => sum + item.amount, 0);
          return total + (budget.income - spent);
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
    }),
    {
      name: "budget-storage",
    }
  )
);
