"use client";

import { motion } from "framer-motion";
import SavingsSummaryCard from "../components/SavingsSummaryCard";

export default function BudgetPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-6 py-16 bg-[var(--background)] text-[var(--foreground)] flex justify-center"
    >
      <div className="w-full max-w-4xl">
        <SavingsSummaryCard />
      </div>
    </motion.main>
  );
}
