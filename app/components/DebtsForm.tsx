"use client";

import React, { useState, useEffect } from "react";
import { useBudgetStore } from "@/app/lib/store";
import { motion, AnimatePresence } from "framer-motion";

interface DebtInput {
  id: string;
  name: string;
  totalAmount: string;
  months: string;
}

interface DebtRepayment {
  id: string;
  name: string;
  totalAmount: number;
  months: number;
  repaidAmount: number;
}

const rowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.25, ease: "easeIn" } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function DebtsForm() {
  const debts = useBudgetStore((s) => s.debts);
  const budgets = useBudgetStore((s) => s.budgets);
  const addDebt = useBudgetStore((s) => s.addDebt);
  const updateDebt = useBudgetStore((s) => s.updateDebt);
  const removeDebt = useBudgetStore((s) => s.removeDebt);
  const income = useBudgetStore((s) => s.income);
  const getRepaidAmountForDebt = useBudgetStore((s) => s.getRepaidAmountForDebt);

  // Initialize local state for debt creation
  const [localDebts, setLocalDebts] = useState<DebtInput[]>(
    debts.map((d) => ({
      id: d.id,
      name: d.name,
      totalAmount: d.totalAmount.toString(),
      months: d.months.toString(),
    }))
  );

  // State for repayment tracking with calculated repaidAmount
  const [repaymentDebts, setRepaymentDebts] = useState<DebtRepayment[]>([]);

  useEffect(() => {
    // Sync debt creation form if debts updated externally
    setLocalDebts(
      debts.map((d) => ({
        id: d.id,
        name: d.name,
        totalAmount: d.totalAmount.toString(),
        months: d.months.toString(),
      }))
    );

    // Sync repayment tracking, calculate repaidAmount from past budgets
    const updatedRepaymentDebts = debts
      .filter((d) => d.totalAmount > 0 && d.months > 0)
      .map((d) => {
        const repaidAmount = getRepaidAmountForDebt(d.name);
        console.log(`Debt: ${d.name}, Repaid Amount: ${repaidAmount}`); // Debugging
        return {
          id: d.id,
          name: d.name,
          totalAmount: d.totalAmount,
          months: d.months,
          repaidAmount,
        };
      });
    setRepaymentDebts(updatedRepaymentDebts);
    console.log("Budgets in store:", budgets); // Debugging
  }, [debts, budgets, getRepaidAmountForDebt]);

  const addNewDebtRow = (): void => {
    setLocalDebts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", totalAmount: "", months: "" },
    ]);
  };

  const handleDebtChange = (
    id: string,
    field: keyof Omit<DebtInput, "id">,
    value: string
  ): void => {
    setLocalDebts((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const handleSaveDebts = (): void => {
    localDebts.forEach(({ id, name, totalAmount, months }) => {
      const amtNum = parseFloat(totalAmount);
      const monthsNum = parseInt(months);

      if (name.trim() && amtNum > 0 && monthsNum > 0) {
        const existing = debts.find((d) => d.id === id);
        if (existing) {
          updateDebt(id, {
            name: name.trim(),
            totalAmount: amtNum,
            months: monthsNum,
          });
        } else {
          addDebt({
            name: name.trim(),
            totalAmount: amtNum,
            months: monthsNum,
          });
        }
      }
    });
  };

  const handleRemoveDebt = (id: string): void => {
    removeDebt(id);
    setLocalDebts((prev) => prev.filter((d) => d.id !== id));
  };

  // Calculate total monthly repayments
  const totalMonthlyRepayments = localDebts.reduce((acc, d) => {
    const amt = parseFloat(d.totalAmount);
    const mths = parseInt(d.months);
    if (amt > 0 && mths > 0) {
      return acc + amt / mths;
    }
    return acc;
  }, 0);

  // Calculate total remaining debt
  const totalRemainingDebt = repaymentDebts.reduce((acc, d) => {
    return acc + (d.totalAmount - d.repaidAmount);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Add Debts Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 tracking-wide text-center">
          Add Your Debts
        </h2>
        <p className="mb-6 text-center text-gray-700 max-w-xl mx-auto text-sm sm:text-base">
          Enter each debt with the total amount owed and repayment period.
        </p>

        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[2.5fr_1.3fr_1.3fr_1.5fr_auto] gap-4 mb-3 font-semibold text-gray-600 border-b border-gray-300 pb-2 select-none text-sm sm:text-base">
              <div>Debt Name</div>
              <div>Total Amount (£)</div>
              <div>Months to Repay</div>
              <div>Monthly Repayment (£)</div>
              <div></div>
            </div>

            <AnimatePresence initial={false}>
              {localDebts.map(({ id, name, totalAmount, months }) => {
                const amt = parseFloat(totalAmount);
                const mths = parseInt(months);
                const monthlyRepayment = amt > 0 && mths > 0 ? amt / mths : 0;

                return (
                  <motion.div
                    key={id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="grid grid-cols-[2.5fr_1.3fr_1.3fr_1.5fr_auto] gap-4 items-center py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="text"
                      placeholder="e.g. Car Loan"
                      value={name}
                      onChange={(e) => handleDebtChange(id, "name", e.target.value)}
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition"
                      aria-label="Debt name"
                      spellCheck={false}
                      autoComplete="off"
                    />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      value={totalAmount}
                      onChange={(e) => handleDebtChange(id, "totalAmount", e.target.value)}
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition"
                      aria-label="Total amount owed"
                    />
                    <input
                      type="number"
                      min={1}
                      placeholder="12"
                      value={months}
                      onChange={(e) => handleDebtChange(id, "months", e.target.value)}
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition"
                      aria-label="Months to repay"
                    />
                    <div
                      className="px-4 py-2 text-gray-700 font-semibold select-none"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      £{monthlyRepayment.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemoveDebt(id)}
                      aria-label={`Remove debt ${name || "unnamed"}`}
                      className="text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      title="Remove debt"
                    >
                      ×
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-8 gap-4">
          <button
            onClick={addNewDebtRow}
            className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label="Add new debt row"
          >
            + Add Debt
          </button>
          <button
            onClick={handleSaveDebts}
            className="flex-1 md:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            aria-label="Save debts"
          >
            Save Debts
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-300 rounded-md text-blue-800 font-semibold text-center text-lg select-none">
          Total Monthly Repayments: £{totalMonthlyRepayments.toFixed(2)}
        </div>

        <div className="mt-2 text-center text-gray-600 text-sm sm:text-base select-none">
          Your monthly income: <span className="font-semibold">£{income.toFixed(2)}</span>
        </div>
      </motion.section>

      {/* Repayment Tracking Section */}
      <AnimatePresence>
        {repaymentDebts.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-200 p-6"
          >
            <h2 className="text-3xl font-semibold mb-6 text-gray-900 tracking-wide text-center">
              Track Your Progress
            </h2>
            <p className="mb-6 text-center text-gray-700 max-w-xl mx-auto text-sm sm:text-base">
              This section shows your repayment progress based on your past budgets.
            </p>

            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1.2fr_1.2fr] gap-4 mb-3 font-semibold text-gray-600 border-b border-green-300 pb-2 select-none text-sm sm:text-base">
                  <div>Debt Name</div>
                  <div>Total Amount (£)</div>
                  <div>Monthly Payment (£)</div>
                  <div>Amount Repaid (£)</div>
                  <div>Amount Left (£)</div>
                  <div>Progress</div>
                </div>

                <AnimatePresence initial={false}>
                  {repaymentDebts.map((debt) => {
                    const monthlyPayment = debt.totalAmount / debt.months;
                    const amountLeft = debt.totalAmount - debt.repaidAmount;
                    const progressPercentage = (debt.repaidAmount / debt.totalAmount) * 100;

                    return (
                      <motion.div
                        key={debt.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1.2fr_1.2fr] gap-4 items-center py-4 border-b border-green-100 last:border-b-0"
                      >
                        <div className="font-semibold text-gray-800 select-none">{debt.name}</div>
                        <div className="text-gray-700 font-medium select-none">
                          £{debt.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-gray-700 font-medium select-none">
                          £{monthlyPayment.toFixed(2)}
                        </div>
                        <div className="font-semibold text-gray-800 select-none">
                          £{debt.repaidAmount.toFixed(2)}
                        </div>
                        <div className="font-semibold text-gray-800 select-none">
                          £{amountLeft.toFixed(2)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{progressPercentage.toFixed(1)}%</span>
                            <span>{amountLeft <= 0 ? "Complete!" : "In Progress"}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full transition-colors duration-300 ${
                                amountLeft <= 0 ? "bg-green-500" : "bg-green-400"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              className="mt-8 p-4 bg-green-100 border border-green-400 rounded-md text-green-800 font-semibold text-center text-lg select-none"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Total Remaining Debt: £{totalRemainingDebt.toFixed(2)}
            </motion.div>

            {totalRemainingDebt <= 0 && repaymentDebts.length > 0 && (
              <motion.div
                className="mt-4 p-4 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-md font-bold text-center text-xl shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                🎉 Congratulations! You're debt-free! 🎉
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
