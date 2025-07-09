"use client";

import React, { useState, FormEvent } from "react";
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

// Progress-bar animation
const barVariants: Variants = {
  hidden: { width: 0 },
  visible: (pct: number) => ({
    width: `${pct}%`,
    transition: { duration: 0.8, ease: "easeOut" },
  }),
};

// Row animation
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// Icon map
const ICONS = {
  emergency: <FaRegLifeRing />,
  vacation: <FaUmbrellaBeach />,
  car: <FaCar />,
  home: <FaHome />,
  piggy: <FaPiggyBank />,
} as const;
type IconKey = keyof typeof ICONS;

interface Goal {
  id: string;
  title: string;
  saved: number;
  target: number;
  iconKey: IconKey;
}

export default function GoalsTrackerCard() {
  const [goals, setGoals] = useState<Goal[]>([]);

  // form state
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newIcon, setNewIcon] = useState<IconKey>("piggy");

  const handleAddGoal = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget) return;
    setGoals((g) => [
      ...g,
      {
        id: Date.now().toString(),
        title: newTitle,
        saved: 0,
        target: parseFloat(newTarget),
        iconKey: newIcon,
      },
    ]);
    setNewTitle("");
    setNewTarget("");
  };

  const handleDelete = (id: string) => {
    setGoals((g) => g.filter((x) => x.id !== id));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      className={clsx(
        "w-full h-full", // fill parent
        "bg-white border border-gray-200",
        "rounded-3xl shadow-xl p-8",
        "flex flex-col"
      )}
    >
      {/* Header */}
      <motion.h3 variants={itemVariants} className="text-3xl font-extrabold text-gray-800 mb-6">
        🎯 Savings Goals
      </motion.h3>

      {/* Goals List */}
      <motion.div variants={itemVariants} className="flex-1 space-y-6 overflow-y-auto pr-2">
        <AnimatePresence>
          {goals.map((goal) => {
            const pct = Math.min((goal.saved / goal.target) * 100, 100);
            return (
              <motion.div
                key={goal.id}
                variants={itemVariants}
                exit="exit"
                className="relative bg-gray-50 rounded-lg p-4"
              >
                {/* Delete */}
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  aria-label={`Delete ${goal.title}`}
                >
                  <FaTrash className="w-5 h-5" />
                </button>

                {/* Title & Amount */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-2xl">{ICONS[goal.iconKey]}</span>
                    <span className="text-xl font-semibold">{goal.title}</span>
                  </div>
                  <span className="text-md font-medium text-gray-600">
                    £{goal.saved} / £{goal.target}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-1">
                  <motion.div
                    custom={pct}
                    variants={barVariants}
                    initial="hidden"
                    animate="visible"
                    className="h-full bg-green-500"
                  />
                </div>

                {/* Percentage */}
                <div className="text-right text-sm text-gray-500">{pct.toFixed(0)}%</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Add Goal Form */}
      <motion.form
        onSubmit={handleAddGoal}
        variants={itemVariants}
        className="mt-8 pt-6 border-t border-gray-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Title spans full row on all screens */}
          <input
            type="text"
            placeholder="New goal title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={clsx(
              "col-span-1 sm:col-span-4 w-full",
              "px-4 py-3 border border-gray-300 rounded-lg",
              "text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            )}
          />

          {/* Target & Icon side by side */}
          <input
            type="number"
            placeholder="Target amount"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className={clsx(
              "w-full",
              "px-4 py-3 border border-gray-300 rounded-lg",
              "text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            )}
          />
          <select
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value as IconKey)}
            className={clsx(
              "w-full",
              "px-4 py-3 border border-gray-300 rounded-lg",
              "text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            )}
          >
            {Object.keys(ICONS).map((key) => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={clsx(
            "mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold",
            "hover:bg-blue-700 transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
            "text-lg"
          )}
        >
          + Add Goal
        </button>
      </motion.form>
    </motion.div>
  );
}
