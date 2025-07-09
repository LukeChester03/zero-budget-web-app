"use client";

import React, { useMemo } from "react";
import { useBudgetStore } from "@/app/lib/store";
import { budgetTemplate } from "@/app/utils/template";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FaChartPie } from "react-icons/fa";

// Entry animation for the card
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

export default function CategoryBreakdownCard() {
  const budgets = useBudgetStore((state) => state.budgets);
  const savingsGroup = budgetTemplate.find((g) => g.title === "Savings & Investments");
  const categories = savingsGroup?.categories || [];

  // Compute total per category
  const data = useMemo(
    () =>
      categories.map((category) => {
        const total = budgets.reduce((sum, budget) => {
          const alloc = budget.allocations.find((a) => a.category === category);
          return sum + (alloc?.amount || 0);
        }, 0);
        return { name: category, value: parseFloat(total.toFixed(2)) };
      }),
    [budgets, categories]
  );

  // Decide if there is any data to show
  const totalValue = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);
  const hasData = budgets.length > 0 && totalValue > 0;

  // Fallback card
  if (!hasData) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={clsx(
          "bg-white border border-gray-200 rounded-3xl shadow-xl p-6",
          "flex flex-col items-center justify-center text-center space-y-4",
          "min-h-[240px]"
        )}
      >
        <FaChartPie className="text-6xl text-gray-300" aria-hidden="true" />
        <h3 className="text-2xl font-semibold text-gray-600">No Savings Data</h3>
        <p className="text-gray-500">
          Once you’ve added budgets with savings categories, you’ll see a breakdown here.
        </p>
      </motion.div>
    );
  }

  // Colors for segments
  const COLORS = ["#4ADE80", "#60A5FA", "#FBBF24", "#F472B6", "#A78BFA", "#F87171"];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={clsx("bg-white border border-gray-200 rounded-3xl shadow-xl p-6", "flex flex-col")}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-4">🔍 Savings by Category</h3>

      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={4}
            >
              {data.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `£${value.toFixed(2)}`} />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex justify-between text-gray-700 text-sm font-medium">
            <span>{d.name}</span>
            <span>£{d.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
