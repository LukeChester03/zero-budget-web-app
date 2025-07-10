"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { NavItem } from "@/app/components/NavItem";
import { FaMoneyBillWave } from "react-icons/fa";

// Entry animation for header
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Header() {
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Past Budgets", path: "/previous-budgets" },
    { label: "Create Budget", path: "/budget" },
    { label: "View Savings", path: "/savings" },
    { label: "View Debts", path: "/loans" },
  ];

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white border-b-4 border-blue-300 shadow-sm"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center h-24 px-6 md:px-10">
        {/* Left nav */}
        <nav className="hidden md:flex space-x-10 whitespace-nowrap">
          {navItems.map(({ label, path }) => (
            <NavItem key={path} href={path}>
              {label}
            </NavItem>
          ))}
        </nav>

        {/* Right decorative text */}
        <div className="flex justify-end">
          <FaMoneyBillWave className="text-6xl text-blue-600" aria-hidden="true" />
        </div>

        {/* Mobile placeholder for symmetry */}
        <div className="md:hidden" />
      </div>
    </motion.header>
  );
}
