"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { FaMedal, FaTrophy, FaStar } from "react-icons/fa";
import { useBudgetStore } from "@/app/lib/store";

// Sample milestone definitions
interface Milestone {
  id: string;
  label: string;
  icon: React.ReactNode;
  achievedAt?: string; // ISO date string
}

// Define possible milestones
const allMilestones: Milestone[] = [
  { id: "first-100", label: "First £100 Saved", icon: <FaMedal /> },
  { id: "steady-saver", label: "3 Months Consecutive", icon: <FaStar /> },
  { id: "halfway-goal", label: "50% of Goal", icon: <FaTrophy /> },
  { id: "full-goal", label: "100% of Goal", icon: <FaTrophy /> },
];

// Entry animation for the card
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

// Hover effect for each badge
const badgeVariants: Variants = {
  hover: { scale: 1.1, rotate: 5 },
  tap: { scale: 0.95 },
};

export default function MilestoneCard() {
  const budgets = useBudgetStore((s) => s.budgets);

  // Determine which milestones are achieved (placeholder logic)
  const achievedIds = React.useMemo(() => {
    // Example: if total saved across all budgets > 100 => first milestone
    const totalSaved = budgets.reduce(
      (sum, b) => sum + b.allocations.reduce((a, c) => a + c.amount, 0),
      0
    );
    const ids: string[] = [];
    if (totalSaved >= 100) ids.push("first-100");
    if (budgets.length >= 3) ids.push("steady-saver");
    // half and full goal milestones assume first budget has a goal target
    const firstBudget = budgets[0];
    if (firstBudget) {
      const goalTotal = firstBudget.allocations.reduce((a, c) => a + c.amount, 0);
      if (totalSaved >= goalTotal * 0.5) ids.push("halfway-goal");
      if (totalSaved >= goalTotal) ids.push("full-goal");
    }
    return new Set(ids);
  }, [budgets]);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        "bg-white border border-gray-200 rounded-3xl shadow-xl",
        "p-6 flex flex-col space-y-4"
      )}
    >
      <h3 className="text-2xl font-bold text-gray-800">🏅 Milestones</h3>

      <div className="flex flex-wrap gap-4">
        {allMilestones.map((ms) => {
          const achieved = achievedIds.has(ms.id);
          return (
            <motion.div
              key={ms.id}
              variants={badgeVariants}
              whileHover="hover"
              whileTap="tap"
              className={clsx(
                "flex items-center space-x-2 px-3 py-2 rounded-full",
                achieved ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
              )}
            >
              <span className="text-lg">{ms.icon}</span>
              <span className="text-sm font-medium">{ms.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
