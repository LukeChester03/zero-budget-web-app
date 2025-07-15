import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type CategoryAllocation = {
  category: string;
  amount: number;
};

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  months: number;
  monthlyRepayment: number;
}

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

  debts: Debt[];
  addDebt: (debt: Omit<Debt, "id" | "monthlyRepayment">) => void;
  updateDebt: (id: string, data: Partial<Omit<Debt, "id" | "monthlyRepayment">>) => void;
  removeDebt: (id: string) => void;
  getTotalMonthlyDebtRepayments: () => number;
  getRepaidAmountForDebt: (debtName: string) => number;
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

      debts: [],

      addDebt: (debt) =>
        set((state) => {
          const monthlyRepayment = debt.months > 0 ? debt.totalAmount / debt.months : 0;
          return {
            debts: [...state.debts, { id: uuidv4(), monthlyRepayment, ...debt }],
          };
        }),

      updateDebt: (id, data) =>
        set((state) => {
          const debts = state.debts.map((d) => {
            if (d.id === id) {
              const updated = { ...d, ...data };
              const months = data.months ?? d.months;
              const totalAmount = data.totalAmount ?? d.totalAmount;
              updated.monthlyRepayment = months > 0 ? totalAmount / months : 0;
              return updated;
            }
            return d;
          });
          return { debts };
        }),

      removeDebt: (id) => set((state) => ({ debts: state.debts.filter((d) => d.id !== id) })),

      getTotalMonthlyDebtRepayments: () =>
        get().debts.reduce((sum, debt) => sum + debt.monthlyRepayment, 0),

      getRepaidAmountForDebt: (debtName: string) => {
        const budgets = get().budgets;
        let totalRepaid = 0;
        const target = debtName.trim().toLowerCase();

        budgets.forEach((budget) => {
          budget.allocations.forEach((alloc) => {
            if (alloc.category.trim().toLowerCase() === target) {
              totalRepaid += alloc.amount;
            }
          });
        });

        return totalRepaid;
      },
    }),
    {
      name: "budget-storage",
    }
  )
);
