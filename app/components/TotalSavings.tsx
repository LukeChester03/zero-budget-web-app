"use client";

import { useBudgetStore } from "@/app/lib/store";
import { budgetTemplate } from "@/app/utils/template";

export default function TotalSavings() {
  const totalSaved = useBudgetStore((state) => {
    const savingsCategories =
      budgetTemplate.find((group) => group.title === "Savings & Investments")?.categories || [];

    return state.budgets.reduce((sum, budget) => {
      const savingsInBudget = budget.allocations
        .filter((allocation) => savingsCategories.includes(allocation.category))
        .reduce((total, allocation) => total + allocation.amount, 0);

      return sum + savingsInBudget;
    }, 0);
  });

  return (
    <div className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm text-center">
      <h2 className="text-lg font-semibold text-green-800">💰 Total Saved</h2>
      <p className="text-3xl font-bold text-green-600 mt-1">£{totalSaved.toFixed(2)}</p>
    </div>
  );
}
