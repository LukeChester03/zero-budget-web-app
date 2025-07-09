"use client";

import { useBudgetStore } from "@/app/lib/store";
import BudgetCard from "./BudgetCard";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BudgetList() {
  const budgets = useBudgetStore((state) => state.budgets);
  const router = useRouter();

  if (budgets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-[60vh] max-w-lg mx-auto p-12 bg-white border border-gray-200 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center space-y-8"
      >
        <h2 className="text-4xl font-semibold text-gray-700">No Budgets Found</h2>
        <p className="text-gray-600 text-lg max-w-md">
          You haven’t created any budgets yet. Start budgeting now to take control of your finances!
        </p>
        <motion.button
          onClick={() => router.push("/budget")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-green-500 text-white rounded-2xl font-semibold shadow-lg hover:bg-green-600 transition focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          + Create New Budget
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-8 bg-gray-50 border border-gray-200 rounded-3xl shadow-xl space-y-6"
    >
      <h2 className="text-3xl font-bold text-gray-800 border-b border-gray-300 pb-2">
        📅 Previous Budgets
      </h2>

      <div className="space-y-4">
        {[...budgets]
          .slice()
          .reverse()
          .map((budget, index) => (
            <BudgetCard key={budget.id} budget={budget} index={index} />
          ))}
      </div>
    </motion.div>
  );
}
