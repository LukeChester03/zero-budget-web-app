"use client";

import { useBudgetStore } from "@/app/lib/store";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function IncomeInput() {
  const income = useBudgetStore((state) => state.income);
  const incomeLocked = useBudgetStore((state) => state.incomeLocked);
  const updateIncome = useBudgetStore((state) => state.updateIncome);
  const setIncomeLocked = useBudgetStore((state) => state.setIncomeLocked);

  const [input, setInput] = useState(income);

  useEffect(() => {
    setInput(income);
  }, [income]);

  const handleSave = () => {
    updateIncome(input);
    setIncomeLocked(true);
  };

  const handleChangeIncome = () => {
    setIncomeLocked(false);
  };

  return (
    <div className="p-6 rounded-xl shadow-md bg-white border border-gray-200 space-y-2">
      <label className="block text-lg font-medium text-gray-700">💷 Monthly Income</label>

      <div className="flex items-center gap-4">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(parseFloat(e.target.value) || 0)}
          disabled={incomeLocked}
          className={`w-full px-4 py-2 border rounded-md transition focus:outline-none ${
            incomeLocked
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-gray-50 text-gray-800 border-gray-300 focus:ring-2 focus:ring-green-500"
          }`}
          placeholder="Enter your monthly income"
        />

        {incomeLocked ? (
          <motion.button
            onClick={handleChangeIncome}
            className="px-4 py-2 font-semibold flex flex-row rounded-md bg-amber-500 text-white hover:bg-amber-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔓 Change
          </motion.button>
        ) : (
          <motion.button
            onClick={handleSave}
            className="px-4 py-2 flex flex-row font-semibold rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔒 Save
          </motion.button>
        )}
      </div>
    </div>
  );
}
