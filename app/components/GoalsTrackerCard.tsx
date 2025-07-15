import React, { useState, FormEvent, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  FaUmbrellaBeach,
  FaRegLifeRing,
  FaCar,
  FaHome,
  FaPiggyBank,
  FaTrash,
} from "react-icons/fa";
import { useBudgetStore } from "@/app/lib/store";

// Progress bar animation
const barVariants: Variants = {
  hidden: { width: 0 },
  visible: (pct: number) => ({
    width: `${Math.min(pct, 100)}%`,
    transition: { duration: 0.8, ease: "easeOut" },
  }),
};

// Card animation
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  hover: { scale: 1.02, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" },
};

// Button animation
const buttonVariants: Variants = {
  hover: { scale: 1.05, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" },
  tap: { scale: 0.95 },
};

// Form input animation
const inputVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// Icon map
const ICONS = {
  emergency: { icon: <FaRegLifeRing />, label: "Emergency" },
  vacation: { icon: <FaUmbrellaBeach />, label: "Vacation" },
  car: { icon: <FaCar />, label: "Car" },
  home: { icon: <FaHome />, label: "Home" },
  piggy: { icon: <FaPiggyBank />, label: "Savings" },
} as const;
type IconKey = keyof typeof ICONS;

interface FormState {
  title: string;
  target: string;
  icon: IconKey;
}

export default function GoalsTrackerCard() {
  const { goals, addGoal, deleteGoal, getSavedAmountForGoal, budgets } = useBudgetStore();
  const [formState, setFormState] = useState<FormState>({
    title: "",
    target: "",
    icon: "piggy",
  });
  const [errors, setErrors] = useState<{ title?: string; target?: string }>({});

  // Update saved amounts when budgets change
  useEffect(() => {
    goals.forEach((goal) => {
      const saved = getSavedAmountForGoal(goal.title);
      if (saved !== goal.saved) {
        useBudgetStore.getState().updateGoal(goal.id, { saved });
      }
    });
  }, [budgets, goals, getSavedAmountForGoal]);

  const validateForm = (): boolean => {
    const newErrors: { title?: string; target?: string } = {};
    if (!formState.title.trim()) {
      newErrors.title = "Goal title is required";
    } else if (goals.some((g) => g.title.toLowerCase() === formState.title.trim().toLowerCase())) {
      newErrors.title = "Goal title already exists";
    }
    const targetNum = parseFloat(formState.target);
    if (!formState.target || isNaN(targetNum) || targetNum <= 0) {
      newErrors.target = "Valid target amount is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddGoal = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    addGoal({
      title: formState.title.trim(),
      target: parseFloat(formState.target),
      iconKey: formState.icon,
    });
    setFormState({ title: "", target: "", icon: "piggy" });
    setErrors({});
  };

  const handleInputChange = (field: keyof FormState, value: string | IconKey) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      className={clsx(
        "w-full p-6",
        "bg-white rounded-3xl shadow-xl border border-gray-100",
        "flex flex-col h-[500px]"
      )}
    >
      {/* Header */}
      <motion.h3 variants={cardVariants} className="text-2xl font-bold text-gray-800 mb-6">
        🎯 Savings Goals
      </motion.h3>

      {/* Goals List */}
      <motion.div
        variants={cardVariants}
        className="flex-1 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2"
      >
        <AnimatePresence>
          {goals.length === 0 ? (
            <motion.div variants={cardVariants} className="text-center text-gray-500 py-8">
              No goals yet. Add one below!
            </motion.div>
          ) : (
            goals.map((goal) => {
              const pct = (goal.saved / goal.target) * 100;
              return (
                <motion.div
                  key={goal.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover="hover"
                  className="relative bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  {/* Delete Button */}
                  <motion.button
                    onClick={() => deleteGoal(goal.id)}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    aria-label={`Delete goal: ${goal.title}`}
                  >
                    <FaTrash className="w-4 h-4" />
                  </motion.button>

                  {/* Title & Amount */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-500 text-xl">{ICONS[goal.iconKey].icon}</span>
                      <span className="text-lg font-semibold text-gray-800">{goal.title}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      £{goal.saved.toFixed(2)} / £{goal.target.toFixed(2)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-2">
                    <motion.div
                      custom={pct}
                      variants={barVariants}
                      initial="hidden"
                      animate="visible"
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                    />
                  </div>

                  {/* Percentage & Status */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{pct.toFixed(1)}%</span>
                    <span>{pct >= 100 ? "Complete!" : "In Progress"}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Goal Form */}
      <motion.form
        onSubmit={handleAddGoal}
        variants={cardVariants}
        className="mt-6 pt-6 border-t border-gray-200"
      >
        <div className="space-y-4">
          {/* Title Input */}
          <motion.div variants={inputVariants} className="space-y-1">
            <label htmlFor="goal-title" className="text-sm font-medium text-gray-600">
              Goal Title
            </label>
            <input
              id="goal-title"
              type="text"
              placeholder="e.g., Vacation Fund"
              value={formState.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={clsx(
                "w-full px-4 py-2.5 border rounded-lg text-sm",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                "transition-colors",
                errors.title ? "border-red-400" : "border-gray-300"
              )}
              aria-label="Goal title"
              aria-invalid={!!errors.title}
            />
            {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
          </motion.div>

          {/* Target & Icon Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Input */}
            <motion.div variants={inputVariants} className="space-y-1">
              <label htmlFor="goal-target" className="text-sm font-medium text-gray-600">
                Target Amount
              </label>
              <input
                id="goal-target"
                type="number"
                placeholder="0.00"
                value={formState.target}
                onChange={(e) => handleInputChange("target", e.target.value)}
                className={clsx(
                  "w-full px-4 py-2.5 border rounded-lg text-sm",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                  "transition-colors",
                  errors.target ? "border-red-400" : "border-gray-300"
                )}
                min="0"
                step="0.01"
                aria-label="Target amount"
                aria-invalid={!!errors.target}
              />
              {errors.target && <span className="text-xs text-red-500">{errors.target}</span>}
            </motion.div>

            {/* Icon Select */}
            <motion.div variants={inputVariants} className="space-y-1">
              <label htmlFor="goal-icon" className="text-sm font-medium text-gray-600">
                Icon
              </label>
              <div className="relative">
                <select
                  id="goal-icon"
                  value={formState.icon}
                  onChange={(e) => handleInputChange("icon", e.target.value as IconKey)}
                  className={clsx(
                    "w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                    "transition-colors appearance-none border-gray-300"
                  )}
                  aria-label="Select goal icon"
                >
                  {Object.entries(ICONS).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {ICONS[formState.icon].icon}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.button
          type="submit"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={clsx(
            "mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm",
            "hover:bg-blue-700 transition-colors shadow-md",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          )}
        >
          + Add Goal
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
