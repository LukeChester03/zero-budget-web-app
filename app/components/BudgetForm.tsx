"use client";

import { useBudgetStore } from "@/app/lib/store";
import { budgetTemplate } from "@/app/utils/template";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddCategoryModal from "./AddCategoryModal";
import { motion } from "framer-motion";

export default function BudgetForm() {
  const income = useBudgetStore((s) => s.income);
  const addBudget = useBudgetStore((s) => s.addBudget);
  const getBudgetTotal = useBudgetStore((s) => s.getBudgetTotal);
  const getBudgetRemaining = useBudgetStore((s) => s.getBudgetRemaining);
  const getCustomCategories = useBudgetStore((s) => s.getCustomCategories);
  const addCustomCategory = useBudgetStore((s) => s.addCustomCategory);

  const [month, setMonth] = useState("");
  const [amounts, setAmounts] = useState<{ [category: string]: number }>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const allocationsArray = Object.entries(amounts).map(([category, amount]) => ({
    category,
    amount,
  }));

  const totalAllocated = getBudgetTotal(allocationsArray);
  const remaining = getBudgetRemaining(allocationsArray, income);

  const statusColor =
    remaining > 0 ? "text-amber-500" : remaining < 0 ? "text-red-500" : "text-green-600";

  const handleAmountChange = (category: string, value: string) => {
    setAmounts((prev) => ({
      ...prev,
      [category]: parseFloat(value) || 0,
    }));
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
    if (activeSection) {
      addCustomCategory(activeSection, name);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">📝 Create New Budget</h2>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl bg-gray-50 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        placeholder="Month (e.g., July 2025)"
      />

      <div className="mt-8 space-y-8">
        {budgetTemplate.map((group) => {
          const custom = getCustomCategories(group.title);
          const allCategories = [...group.categories, ...custom];

          return (
            <div
              key={group.title}
              className="p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-700">{group.title}</h3>
                <motion.button
                  onClick={() => openAddModal(group.title)}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium shadow-md hover:bg-green-600 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Add
                </motion.button>
              </div>

              {allCategories.map((cat) => (
                <div key={cat} className="flex justify-between items-center gap-4 my-2">
                  <label className="text-lg text-gray-600 w-1/2">{cat}</label>
                  <input
                    type="number"
                    value={amounts[cat] ?? ""}
                    onChange={(e) => handleAmountChange(cat, e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-green-300 transition"
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-xl font-semibold mt-10 pt-6 border-t border-gray-200">
        <span className="text-gray-700">💰 Allocated: £{totalAllocated.toFixed(2)}</span>
        <span className={`${statusColor}`}>🧮 Remaining: £{remaining.toFixed(2)}</span>
      </div>

      <div className="flex justify-end mt-8">
        <motion.button
          disabled={remaining !== 0}
          onClick={handleSubmit}
          className={`px-10 py-3 rounded-xl text-xl font-bold shadow-lg transition duration-300 ${
            remaining === 0
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-400 text-white cursor-not-allowed"
          }`}
          whileHover={remaining === 0 ? { scale: 1.05 } : {}}
          whileTap={remaining === 0 ? { scale: 0.95 } : {}}
        >
          {remaining === 0 ? "Save Budget" : "Please Complete Form"}
        </motion.button>
      </div>

      <AddCategoryModal
        open={modalOpen}
        section={activeSection ?? ""}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAddCategory}
      />
    </div>
  );
}
