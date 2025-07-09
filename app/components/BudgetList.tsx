"use client";

import React from "react";
import { useBudgetStore } from "@/app/lib/store";
import BudgetCard from "./BudgetCard";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { FaPiggyBank } from "react-icons/fa";

// — Motion variants —
const containerVariants: Variants = {
  hidden: {},
  visible: {
    when: "beforeChildren",
    staggerChildren: 0.1,
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const emptyVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const buttonVariants: Variants = {
  hover: { scale: 1.07, boxShadow: "0 12px 24px rgba(16,185,129,0.4)" },
  tap: { scale: 0.95 },
};

export default function BudgetList() {
  const budgets = useBudgetStore((state) => state.budgets);
  const router = useRouter();

  // Empty state
  if (budgets.length === 0) {
    return (
      <motion.div
        variants={emptyVariants}
        initial="hidden"
        animate="visible"
        className={clsx(
          "min-h-[70vh] max-w-xl mx-auto p-10",
          "bg-white border-green-500",
          "rounded-3xl shadow-2xl shadow-green-200",
          "flex flex-col items-center justify-center text-center",
          "space-y-8"
        )}
      >
        <motion.div
          variants={emptyVariants}
          className="text-green-500 text-7xl"
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <FaPiggyBank aria-hidden="true" />
        </motion.div>

        <h2 className="text-5xl font-extrabold text-gray-800">Welcome to Zero Budgeting!</h2>

        <p className="text-gray-600 text-lg max-w-lg">
          It looks like you haven’t created any budgets yet. Let’s start planning your first budget
          to take control of your finances.
        </p>

        <motion.button
          onClick={() => router.push("/budget")}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={clsx(
            "px-12 py-4 bg-green-600 text-white",
            "rounded-full font-bold text-lg shadow-lg",
            "hover:bg-green-700 transition-colors",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300"
          )}
        >
          Create Your First Budget
        </motion.button>
      </motion.div>
    );
  }

  // List of budgets
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        "max-w-3xl mx-auto p-8",
        "bg-white border border-gray-200",
        "rounded-3xl shadow-xl",
        "space-y-6"
      )}
    >
      <motion.h2
        variants={listVariants}
        className="text-3xl font-bold text-gray-800 border-b border-gray-300 pb-2"
      >
        📅 Previous Budgets
      </motion.h2>

      <motion.div variants={listVariants} className="space-y-4">
        {[...budgets]
          .slice()
          .reverse()
          .map((budget, idx) => (
            <motion.div key={budget.id} variants={listVariants}>
              <BudgetCard budget={budget} index={idx} />
            </motion.div>
          ))}
      </motion.div>
    </motion.div>
  );
}
