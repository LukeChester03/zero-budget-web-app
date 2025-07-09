"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Past Budgets", path: "/previous-budgets" },
    { label: "View Savings", path: "/savings" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b-4 border-blue-300 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-8 relative">
        {/* Left nav */}
        <nav className="flex space-x-10">
          {navItems.map(({ label, path }) => (
            <motion.button
              key={label}
              onClick={() => router.push(path)}
              whileHover={{ scale: 1.1, color: "#3b82f6" }} // blue-500
              whileFocus={{ scale: 1.1, color: "#3b82f6" }}
              className="text-lg font-medium text-gray-700 cursor-pointer focus:outline-none"
              aria-label={`Go to ${label}`}
              tabIndex={0}
              type="button"
            >
              {label}
            </motion.button>
          ))}
        </nav>

        {/* Center title */}
        <motion.button
          onClick={() => router.push("/")}
          whileHover={{ scale: 1.05, color: "#2563eb" }} // blue-600
          whileFocus={{ scale: 1.05, color: "#2563eb" }}
          className="text-4xl font-extrabold text-gray-900 cursor-pointer focus:outline-none select-none absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          aria-label="Go to homepage"
          tabIndex={0}
          type="button"
        >
          Zero Budgeting
        </motion.button>

        {/* Right side empty spacer for symmetry */}
        <div className="w-40" aria-hidden="true" />
      </div>
    </motion.header>
  );
}
