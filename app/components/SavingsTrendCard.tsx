"use client";

import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { useBudgetStore } from "@/app/lib/store";
import { budgetTemplate } from "@/app/utils/template";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Animation variants for card entry
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 25 },
  },
};

export default function SavingsTrendCard() {
  // Fetch budgets and savings categories
  const budgets = useBudgetStore((state) => state.budgets);
  const savingsGroup = budgetTemplate.find((g) => g.title === "Savings & Investments");
  const savingsCategories = savingsGroup?.categories || [];

  // Prepare data for the chart: array of { month, total }
  const data = useMemo(() => {
    return (
      budgets
        .map((b) => {
          const total = b.allocations
            .filter((a) => savingsCategories.includes(a.category))
            .reduce((sum, a) => sum + a.amount, 0);
          return { month: b.month, total };
        })
        // Sort by chronological month: assume b.month is "YYYY-MM" or "MMMM YYYY"
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    );
  }, [budgets, savingsCategories]);

  // Fallback card if no data
  if (data.length === 0) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={clsx(
          "bg-white border border-gray-200 rounded-3xl shadow-xl p-6",
          "flex items-center justify-center h-60"
        )}
      >
        <div className="flex flex-col items-center text-center space-y-2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l6-6m0 0l6-6m-6 6V3" />
          </svg>
          <p className="text-lg font-medium">No savings data to display</p>
          <p className="text-sm">Start by creating and saving budgets to see trends over time.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        "bg-white border border-gray-200 rounded-3xl shadow-xl p-6",
        "flex flex-col space-y-4"
      )}
    >
      <h3 className="text-2xl font-bold text-gray-800">📈 Savings Over Time</h3>
      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => `£${value.toFixed(2)}`} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#16A34A"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
