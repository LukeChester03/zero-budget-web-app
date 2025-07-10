"use client";

import { motion } from "framer-motion";
import LandingCard from "./components/LandingCard";
import { FaPlusCircle, FaPiggyBank, FaFolderOpen } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleAddBudget = () => {
    router.push("/budget");
  };
  const handleViewSavings = () => {
    router.push("/savings");
  };
  const handleViewBudgets = () => {
    router.push("/previous-budgets");
  };
  const handleLoanManagement = () => {
    router.push("/loans");
  };
  const handleAnalysis = () => {
    router.push("/analysis");
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-6 py-16 bg-[var(--background)] text-[var(--foreground)]"
    >
      <h1 className="max-w-3xl mx-auto text-5xl font-extrabold text-center mb-12 text-[var(--accent)]">
        Welcome to Zero Budgeting
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <LandingCard
          title="Add This Month’s Budget"
          description="Create and manage your monthly budget easily."
          icon={<FaPlusCircle />}
          onClick={handleAddBudget}
        />

        <LandingCard
          title="View Total Savings"
          description="Track your overall savings and investments."
          icon={<FaPiggyBank />}
          onClick={handleViewSavings}
        />

        <LandingCard
          title="View Previous Budgets"
          description="Review your past budgets."
          icon={<FaFolderOpen />}
          onClick={handleViewBudgets}
        />
        <LandingCard
          title="View Debts"
          description="Review how much you owe to better track it."
          icon={<FaFolderOpen />}
          onClick={handleLoanManagement}
        />
        {/* <LandingCard
          title="AI Analysis"
          description="AI analysis of you finances."
          icon={<FaFolderOpen />}
          onClick={handleAnalysis}
        /> */}
      </div>
    </motion.main>
  );
}
