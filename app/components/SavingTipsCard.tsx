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
  hover: { scale: 1.02, backgroundColor: "rgba(229, 231, 235, 0.5)" },
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
  // Select a random tip as "Tip of the Day"
  const tipOfTheDay = tips[Math.floor(Math.random() * tips.length)];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        "bg-white border border-gray-100 rounded-3xl shadow-xl",
        "p-6 flex flex-col space-y-4 h-[500px]"
      )}
    >
      <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
        <FaLightbulb className="text-yellow-500" />
        <span>Savings Tips</span>
      </h3>

      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <motion.div
          variants={itemVariants}
          className={clsx(
            "p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100",
            "border border-yellow-200"
          )}
        >
          <div className="flex items-start space-x-2">
            <span className="mt-1 text-yellow-500 text-lg">★</span>
            <p className="text-gray-700 text-sm sm:text-base line-clamp-2">
              <span className="font-semibold">Tip of the Day: </span>
              {tipOfTheDay}
            </p>
          </div>
        </motion.div>

        {tips.map((tip, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="flex items-start space-x-2 p-2 rounded-lg"
            role="listitem"
          >
            <span className="mt-1 text-green-500 text-lg">•</span>
            <p className="text-gray-700 text-sm sm:text-base line-clamp-2">{tip}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
