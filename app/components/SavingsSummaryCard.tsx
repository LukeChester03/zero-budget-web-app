"use client";

import { useBudgetStore } from "@/app/lib/store";
import { budgetTemplate } from "@/app/utils/template";

export default function SavingsSummaryCard() {
  const budgets = useBudgetStore((state) => state.budgets);

  const savingsCategories =
    budgetTemplate.find((group) => group.title === "Savings & Investments")?.categories || [];

  // Aggregate total saved across all budgets in savings categories
  const totalSaved = budgets.reduce((sum, budget) => {
    const savedInBudget = budget.allocations
      .filter((alloc) => savingsCategories.includes(alloc.category))
      .reduce((a, c) => a + c.amount, 0);
    return sum + savedInBudget;
  }, 0);

  // Aggregate saved amounts by category across all budgets
  const categoryTotals = savingsCategories.reduce<Record<string, number>>((acc, category) => {
    acc[category] = budgets.reduce((sum, budget) => {
      const amount = budget.allocations.find((alloc) => alloc.category === category)?.amount || 0;
      return sum + amount;
    }, 0);
    return acc;
  }, {});

  return (
    <div
      className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-gray-300
                    space-y-8 sticky top-24
                    flex flex-col items-center
                    text-center
                   "
    >
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">💰 Savings Summary</h2>

      <div className="text-3xl font-extrabold text-green-600">
        Total Saved: £{totalSaved.toFixed(2)}
      </div>

      <div className="divide-y divide-gray-300 w-full mt-6">
        {savingsCategories.map((category) => (
          <div
            key={category}
            className="flex justify-between py-3 text-gray-800 font-semibold text-lg"
          >
            <span>{category}</span>
            <span>£{categoryTotals[category]?.toFixed(2) || "0.00"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
