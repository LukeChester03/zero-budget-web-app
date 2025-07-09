"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";

import SavingsSummaryCard from "@/app/components/SavingsSummaryCard";
import GoalsTrackerCard from "@/app/components/GoalsTrackerCard";
import SavingsTrendCard from "@/app/components/SavingsTrendCard";
import CategoryBreakdownCard from "@/app/components/CategoryBreakdownCard";
// import MilestoneCard from "@/app/components/MilestoneCard";
import SavingsTipsCard from "@/app/components/SavingTipsCard";

// Stagger container so cards animate in sequence
const containerVariants: Variants = {
  hidden: {},
  visible: { when: "beforeChildren", staggerChildren: 0.15 },
};

// Card entry animation
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 25 },
  },
};

export default function SavingsDashboard() {
  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={clsx("min-h-screen bg-white px-6 py-12", "text-gray-900")}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Row 1: Summary & Goals side-by-side */}
        <motion.div variants={cardVariants}>
          <SavingsSummaryCard />
        </motion.div>
        <motion.div variants={cardVariants}>
          <GoalsTrackerCard />
        </motion.div>

        {/* Row 2: Trend spans full width */}
        <motion.div variants={cardVariants} className="md:col-span-2">
          <SavingsTrendCard />
        </motion.div>

        {/* Row 3: Breakdown & Tips side-by-side */}
        <motion.div variants={cardVariants}>
          <CategoryBreakdownCard />
        </motion.div>
        <motion.div variants={cardVariants}>
          <SavingsTipsCard />
        </motion.div>
      </div>
    </motion.main>
  );
}
