"use client";

import { useBudgetStore } from "@/app/lib/store";
import { budgetTemplate } from "@/app/utils/template";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";

// — Motion variants —
const containerVariants: Variants = {
  hidden: {},
  visible: {
    when: "beforeChildren",
    staggerChildren: 0.1,
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 25 },
  },
  hover: { scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

export default function SavingsSummaryCard() {
  const budgets = useBudgetStore((state) => state.budgets);

  const savingsCategories =
    budgetTemplate.find((g) => g.title === "Savings & Investments")?.categories || [];

  const totalSaved = budgets.reduce((sum, b) => {
    const saved = b.allocations
      .filter((a) => savingsCategories.includes(a.category))
      .reduce((a, c) => a + c.amount, 0);
    return sum + saved;
  }, 0);

  const categoryTotals = savingsCategories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = budgets.reduce((s, b) => {
      const amt = b.allocations.find((a) => a.category === cat)?.amount || 0;
      return s + amt;
    }, 0);
    return acc;
  }, {});

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={clsx(
        "w-full max-w-md mx-auto p-8 bg-white",
        "rounded-3xl shadow-2xl border border-gray-200",
        "flex flex-col items-center text-center",
        "space-y-6 transition-shadow"
      )}
      variants={cardVariants}
    >
      <motion.h2
        variants={rowVariants}
        className="text-3xl font-extrabold text-gray-900 tracking-tight"
      >
        💰 Savings Summary
      </motion.h2>

      <motion.div variants={rowVariants} className="text-3xl font-extrabold text-green-600">
        Total Saved: £{totalSaved.toFixed(2)}
      </motion.div>

      <motion.div variants={rowVariants} className="w-full divide-y divide-gray-200">
        {savingsCategories.map((category) => (
          <motion.div
            key={category}
            variants={rowVariants}
            className={clsx(
              "flex justify-between py-3 px-4 rounded-lg",
              "hover:bg-gray-50 transition-colors"
            )}
          >
            <span className="text-gray-800 font-medium text-lg">{category}</span>
            <span className="text-gray-800 font-medium text-lg">
              £{categoryTotals[category]?.toFixed(2) || "0.00"}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
