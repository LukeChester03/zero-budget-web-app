"use client";

import { BudgetEntry, useBudgetStore } from "@/app/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaChevronDown, FaTrash, FaPiggyBank } from "react-icons/fa";
import { budgetTemplate } from "@/app/utils/template";

type Props = {
  budget: BudgetEntry;
  index: number;
};

export default function BudgetCard({ budget, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const deleteBudget = useBudgetStore((s) => s.deleteBudget);

  const savingsCategories =
    budgetTemplate.find((group) => group.title === "Savings & Investments")?.categories || [];

  const savedThisMonth = budget.allocations
    .filter((allocation) => savingsCategories.includes(allocation.category))
    .reduce((sum, item) => sum + item.amount, 0);

  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white border border-gray-100 rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleExpand}>
        <div>
          <h3 className="text-2xl font-bold text-blue-600">{budget.month}</h3>
          <div className="text-lg font-semibold text-gray-700">💷 £{budget.income.toFixed(2)}</div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              deleteBudget(budget.id);
            }}
            className="text-red-500 hover:text-red-700 transition"
            whileHover={{ scale: 1.2 }}
          >
            <FaTrash />
          </motion.button>

          <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="text-gray-500">
            <FaChevronDown />
          </motion.span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-lg font-semibold text-green-600">
        <FaPiggyBank />
        <span>Saved this month: £{savedThisMonth.toFixed(2)}</span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            {budget.allocations.map((item, i) => (
              <li key={i} className="flex justify-between text-gray-600">
                <span>{item.category}</span>
                <span className="font-semibold text-gray-800">£{item.amount.toFixed(2)}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
