"use client";

import { useBudgetStore } from "@/app/lib/store";
import { budgetTemplate } from "@/app/utils/template";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddCategoryModal from "./AddCategoryModal";
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

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 25 },
  },
};

const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)",
  },
  tap: { scale: 0.95 },
};

export default function BudgetForm() {
  // —— store selectors (unchanged) ——
  const income = useBudgetStore((s) => s.income);
  const addBudget = useBudgetStore((s) => s.addBudget);
  const getBudgetTotal = useBudgetStore((s) => s.getBudgetTotal);
  const getBudgetRemaining = useBudgetStore((s) => s.getBudgetRemaining);
  const getCustomCategories = useBudgetStore((s) => s.getCustomCategories);
  const addCustomCategory = useBudgetStore((s) => s.addCustomCategory);

  // —— state (unchanged) ——
  const [month, setMonth] = useState("");
  const [amounts, setAmounts] = useState<{ [cat: string]: number }>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // —— derived data (unchanged) ——
  const allocationsArray = Object.entries(amounts).map(([category, amount]) => ({
    category,
    amount,
  }));
  const totalAllocated = getBudgetTotal(allocationsArray);
  const remaining = getBudgetRemaining(allocationsArray, income);

  const statusColor =
    remaining > 0 ? "text-amber-500" : remaining < 0 ? "text-red-500" : "text-green-600";

  // —— handlers (unchanged) ——
  const handleAmountChange = (category: string, value: string) => {
    setAmounts((prev) => ({ ...prev, [category]: parseFloat(value) || 0 }));
  };
  const handleSubmit = () => {
    const allocations = allocationsArray.filter((a) => a.amount > 0);
    addBudget({
      id: uuidv4(),
      month: month || new Date().toLocaleString("default", { month: "long", year: "numeric" }),
      income,
      allocations,
    });
    setMonth("");
    setAmounts({});
  };
  const openAddModal = (section: string) => {
    setActiveSection(section);
    setModalOpen(true);
  };
  const confirmAddCategory = (name: string) => {
    if (activeSection) addCustomCategory(activeSection, name);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        "max-w-3xl mx-auto p-8 md:p-10",
        "bg-white",
        "shadow-2xl rounded-3xl border",
        "border-gray-100"
      )}
    >
      {/* Title */}
      <motion.h2
        variants={sectionVariants}
        className={clsx("text-4xl font-bold mb-6", "text-gray-800")}
      >
        📝 Create New Budget
      </motion.h2>

      {/* Month Picker */}
      <motion.input
        variants={sectionVariants}
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className={clsx(
          "w-full px-5 py-3 text-lg",
          "border border-gray-300 rounded-xl",
          "bg-gray-50 shadow-inner",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
          "transition"
        )}
        placeholder="Month (e.g., July 2025)"
      />

      {/* Category Sections */}
      <motion.div variants={sectionVariants} className="mt-8 space-y-8">
        {budgetTemplate.map((group) => {
          const custom = getCustomCategories(group.title);
          const allCategories = [...group.categories, ...custom];

          return (
            <motion.div
              key={group.title}
              variants={sectionVariants}
              className={clsx("p-6 rounded-2xl", "bg-gray-50", "shadow-sm border border-gray-200")}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-700">{group.title}</h3>
                <motion.button
                  type="button"
                  onClick={() => openAddModal(group.title)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={clsx(
                    "px-4 py-2 rounded-lg font-medium shadow-md",
                    "bg-green-500 hover:bg-green-600 text-white",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300",
                    "transition-colors"
                  )}
                >
                  + Add
                </motion.button>
              </div>

              <div className="space-y-4">
                {allCategories.map((cat) => (
                  <div
                    key={cat}
                    className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4"
                  >
                    <label htmlFor={`amt-${cat}`} className="text-lg text-gray-600 w-full sm:w-1/2">
                      {cat}
                    </label>
                    <input
                      id={`amt-${cat}`}
                      type="number"
                      value={amounts[cat] ?? ""}
                      onChange={(e) => handleAmountChange(cat, e.target.value)}
                      className={clsx(
                        "w-full sm:w-1/2 px-4 py-2",
                        "border border-gray-300 rounded-xl",
                        "bg-white shadow-sm",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300",
                        "transition"
                      )}
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Totals */}
      <motion.div
        variants={sectionVariants}
        className={clsx(
          "flex justify-between text-xl font-semibold mt-10 pt-6 border-t",
          "border-gray-200"
        )}
      >
        <span className="text-gray-700">💰 Allocated: £{totalAllocated.toFixed(2)}</span>
        <span className={statusColor}>🧮 Remaining: £{remaining.toFixed(2)}</span>
      </motion.div>

      {/* Submit */}
      <motion.div variants={sectionVariants} className="flex justify-end mt-8">
        <motion.button
          onClick={handleSubmit}
          disabled={remaining !== 0}
          variants={buttonVariants}
          whileHover={remaining === 0 ? "hover" : undefined}
          whileTap={remaining === 0 ? "tap" : undefined}
          className={clsx(
            "px-8 md:px-10 py-3 rounded-xl text-xl font-bold shadow-lg transition",
            remaining === 0
              ? "bg-green-500 hover:bg-green-600 text-white focus-visible:ring-4 focus-visible:ring-green-300"
              : "bg-red-400 text-white cursor-not-allowed opacity-70"
          )}
        >
          {remaining === 0 ? "Save Budget" : "Please Complete Form"}
        </motion.button>
      </motion.div>

      {/* Modal */}
      <AddCategoryModal
        open={modalOpen}
        section={activeSection ?? ""}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAddCategory}
      />
    </motion.div>
  );
}
