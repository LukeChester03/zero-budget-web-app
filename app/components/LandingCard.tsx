"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";

type LandingCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export default function LandingCard({ title, description, icon, onClick }: LandingCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(72, 187, 120, 0.3)" }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer bg-white rounded-3xl shadow-md border border-gray-200 p-8 flex flex-col items-center justify-center text-center transition-colors duration-300 hover:bg-green-50"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          onClick();
        }
      }}
    >
      {icon && <div className="mb-4 text-green-600 text-6xl">{icon}</div>}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
    </motion.div>
  );
}
