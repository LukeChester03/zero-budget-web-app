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
          description="Review and edit your past budgets."
          icon={<FaFolderOpen />}
          onClick={handleViewBudgets}
        />
      </div>

      <section className="max-w-3xl mx-auto mt-20 text-center text-gray-600 dark:text-gray-300 space-y-6">
        <h2 className="text-3xl font-semibold">Why Choose Zero Budgeting?</h2>
        <p>
          Our app empowers you to allocate every pound intentionally, helping you save more, reduce
          waste, and take control of your financial future.
        </p>
        <ul className="list-disc list-inside space-y-2 max-w-md mx-auto text-left">
          <li>Simple, intuitive monthly budgeting</li>
          <li>Track savings across multiple categories</li>
          <li>Visualize your spending and savings progress</li>
          <li>Review and adjust previous budgets anytime</li>
          <li>Secure and private—your data stays with you</li>
        </ul>
      </section>
    </motion.main>
  );
}
