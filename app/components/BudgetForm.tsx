"use client";

import { useBudgetStore } from "@/app/lib/store";
import { budgetTemplate } from "@/app/utils/template";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import AddCategoryModal from "./AddCategoryModal";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  // Store selectors
  const income = useBudgetStore((s) => s.income);
  const addBudget = useBudgetStore((s) => s.addBudget);
  const getBudgetTotal = useBudgetStore((s) => s.getBudgetTotal);
  const getBudgetRemaining = useBudgetStore((s) => s.getBudgetRemaining);
  const getCustomCategories = useBudgetStore((s) => s.getCustomCategories);
  const addCustomCategory = useBudgetStore((s) => s.addCustomCategory);
  const debts = useBudgetStore((s) => s.debts);
  const budgets = useBudgetStore((s) => s.budgets);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [month, setMonth] = useState("");
  const [amounts, setAmounts] = useState<{ [cat: string]: number }>({});
  const [lockedInputs, setLockedInputs] = useState<{ [cat: string]: boolean }>({});
  const [initialized, setInitialized] = useState(false);

  // Normalize month format from YYYY-MM to MMMM YYYY
  const normalizeMonth = (input: string) => {
    if (!input) return new Date().toLocaleString("default", { month: "long", year: "numeric" });
    const [year, month] = input.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  // Get previous month's budget
  const getPreviousMonthBudget = (currentMonth: string) => {
    const [monthName, year] = currentMonth.split(" ");
    const currentDate = new Date(`${monthName} 1, ${year}`);
    const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const previousMonth = previousDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    return budgets.find((b) => b.month === previousMonth);
  };

  // Initialize amounts and lockedInputs on mount
  useEffect(() => {
    // Initialize with debt amounts
    const initialAmounts = debts.reduce((acc, debt) => {
      acc[debt.name] = debt.monthlyRepayment;
      return acc;
    }, {} as { [cat: string]: number });

    // Get previous month's budget to prefill non-debt categories
    const currentMonth = normalizeMonth(month);
    const previousBudget = getPreviousMonthBudget(currentMonth);

    const newLocked: { [cat: string]: boolean } = {};
    if (previousBudget) {
      // Prefill non-debt allocations from previous month
      previousBudget.allocations.forEach(({ category, amount }) => {
        if (!debts.some((d) => d.name === category)) {
          initialAmounts[category] = amount;
          newLocked[category] = true; // Lock non-debt categories
        }
      });
    }

    setAmounts(initialAmounts);
    setLockedInputs(newLocked);
    setInitialized(true);
  }, [debts, month, budgets]);

  if (!initialized) return null; // or loading spinner

  // Derived data
  const allocationsArray = Object.entries(amounts).map(([category, amount]) => ({
    category,
    amount,
  }));

  const totalAllocated = getBudgetTotal(allocationsArray);
  const remaining = getBudgetRemaining(allocationsArray, income);

  console.log(remaining, "REMAINING");

  const statusColor =
    remaining > 0 ? "text-amber-500" : remaining < 0 ? "text-red-500" : "text-green-600";

  // Handlers
  const handleAmountChange = (category: string, value: string) => {
    if (debts.some((d) => d.name === category)) return; // prevent editing debts
    if (lockedInputs[category]) return; // prevent editing locked inputs

    setAmounts((prev) => ({ ...prev, [category]: parseFloat(value) || 0 }));
  };

  const handleSubmit = () => {
    const normalizedMonth = normalizeMonth(month);
    // Check if month is valid
    if (!normalizedMonth) {
      console.log("MONTH NOT FILLED IN");
      toast.error("Please select a valid month!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    // Check if a budget already exists for this month
    if (budgets.some((b) => b.month === normalizedMonth)) {
      toast.error("Budget for this month already exists. Please edit existing record.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // Save all allocations (including debts)
    const allocations = allocationsArray.filter((a) => a.amount > 0);
    console.log("Saving budget with allocations:", allocations); // Debugging
    addBudget({
      id: uuidv4(),
      month: normalizedMonth,
      income,
      allocations,
    });

    // Reset form to debt amounts only
    const resetAmounts = debts.reduce((acc, debt) => {
      acc[debt.name] = debt.monthlyRepayment;
      return acc;
    }, {} as { [cat: string]: number });
    setAmounts(resetAmounts);
    setMonth("");
    setLockedInputs({}); // Unlock all non-debt inputs for next budget
    toast.success("Budget Successfully Saved!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const toggleEdit = (category: string) => {
    setLockedInputs((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const openAddModal = (section: string) => {
    setActiveSection(section);
    setModalOpen(true);
  };

  const confirmAddCategory = (name: string) => {
    if (activeSection) addCustomCategory(activeSection, name);
  };

  const uncategorizedDebts = debts.filter(
    (debt) =>
      !budgetTemplate.some((group) =>
        [...group.categories, ...getCustomCategories(group.title)].includes(debt.name)
      )
  );

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
      <motion.h2 variants={sectionVariants} className="text-4xl font-bold mb-6 text-gray-800">
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
          const debtsInGroup = debts.filter((d) => allCategories.includes(d.name));
          const userCategories = allCategories.filter((cat) => !debts.some((d) => d.name === cat));

          return (
            <motion.div
              key={group.title}
              variants={sectionVariants}
              className={clsx("p-6 rounded-2xl bg-gray-50 shadow-sm border border-gray-200")}
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
                {userCategories.map((cat) => (
                  <div
                    key={cat}
                    className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4"
                  >
                    <label htmlFor={`amt-${cat}`} className="text-lg text-gray-600 w-full sm:w-1/2">
                      {cat}
                    </label>
                    <div className="relative w-full sm:w-1/2">
                      <input
                        id={`amt-${cat}`}
                        type="number"
                        value={amounts[cat] ?? ""}
                        onChange={(e) => handleAmountChange(cat, e.target.value)}
                        className={clsx(
                          "w-full px-4 py-2 border rounded-xl bg-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 transition",
                          lockedInputs[cat] ? "opacity-70 cursor-not-allowed" : ""
                        )}
                        placeholder="0.00"
                        disabled={lockedInputs[cat] ?? false}
                      />
                      {lockedInputs[cat] && (
                        <button
                          type="button"
                          onClick={() => toggleEdit(cat)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm bg-yellow-300 rounded hover:bg-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                          aria-label={`Edit ${cat} amount`}
                          tabIndex={-1}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {debtsInGroup.map((debt) => (
                  <div
                    key={debt.id}
                    className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4 bg-red-50 p-3 rounded-lg border border-red-300"
                  >
                    <label className="text-lg text-red-700 w-full sm:w-1/2 font-semibold">
                      {debt.name} (Debt)
                    </label>
                    <input
                      type="number"
                      value={amounts[debt.name]?.toFixed(2) ?? "0.00"}
                      readOnly
                      className="w-full sm:w-1/2 px-4 py-2 border border-red-300 rounded-xl bg-red-100 text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 transition cursor-not-allowed"
                      aria-label={`${debt.name} monthly repayment`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {uncategorizedDebts.length > 0 && (
          <motion.div
            key="debts-uncategorized"
            variants={sectionVariants}
            className={clsx("p-6 rounded-2xl bg-red-50 shadow-sm border border-red-300")}
          >
            <h3 className="text-2xl font-semibold text-red-700 mb-4">Debts</h3>
            <div className="space-y-4">
              {uncategorizedDebts.map((debt) => (
                <div
                  key={debt.id}
                  className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4 bg-red-100 p-3 rounded-lg border border-red-300"
                >
                  <label className="text-lg text-red-700 w-full sm:w-1/2 font-semibold">
                    {debt.name} (Debt)
                  </label>
                  <input
                    type="number"
                    value={amounts[debt.name]?.toFixed(2) ?? "0.00"}
                    readOnly
                    className="w-full sm:w-1/2 px-4 py-2 border border-red-300 rounded-xl bg-red-100 text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 transition cursor-not-allowed"
                    aria-label={`${debt.name} monthly repayment`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Totals */}
      <motion.div
        variants={sectionVariants}
        className="flex justify-between text-xl font-semibold mt-10 pt-6 border-t border-gray-200"
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
      <ToastContainer />
    </motion.div>
  );
}
