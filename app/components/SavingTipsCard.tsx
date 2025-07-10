"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { FaLightbulb } from "react-icons/fa";

// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// Static savings tips
const tips: string[] = [
  "Automate your savings: set up recurring transfers each payday.",
  "Round up your purchases to the nearest pound and save the difference.",
  "Review subscriptions monthly and cancel those you don’t use.",
  "Use cashback and reward apps for everyday spending.",
  "Set clear targets: small, achievable milestones boost motivation.",
];

export default function SavingsTipsCard() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        "bg-white border border-gray-200 rounded-3xl shadow-xl",
        "p-6 flex flex-col space-y-4"
      )}
    >
      <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
        <FaLightbulb className="text-yellow-500" />
        <span>Savings Tips</span>
      </h3>

      <div className="space-y-3">
        {tips.map((tip, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex items-start space-x-2"
          >
            <span className="mt-1 text-green-500 text-lg">•</span>
            <p className="text-gray-700 text-sm leading-snug">{tip}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
