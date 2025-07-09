"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";

type LandingCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** If provided, renders as a `<Link>`; otherwise falls back to `onClick` button behavior. */
  href?: string;
  onClick?: () => void;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  hover: { scale: 1.05, boxShadow: "0 10px 25px rgba(72, 187, 120, 0.3)" },
  tap: { scale: 0.95 },
};

export const LandingCard: React.FC<LandingCardProps> = ({
  title,
  description,
  icon,
  href,
  onClick,
}) => {
  const commonClasses = clsx(
    "block w-full h-full bg-white rounded-3xl border border-gray-200 p-8",
    "flex flex-col items-center justify-center text-center",
    "cursor-pointer transition-colors duration-300",
    "focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300",
    "hover:bg-green-50"
  );

  const content = (
    <>
      {icon && <div className="mb-4 text-green-600 text-6xl">{icon}</div>}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
    </>
  );

  // 1️⃣ If `href` is provided, render as a prefetched Next <Link>
  if (href) {
    return (
      <Link href={href} passHref>
        <motion.a
          {...{ href: undefined }}
          variants={cardVariants}
          initial="hidden"
          whileHover="hover"
          whileTap="tap"
          animate="visible"
          className={commonClasses}
        >
          {content}
        </motion.a>
      </Link>
    );
  }

  // 2️⃣ Otherwise, fallback to button-like div with onClick
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileHover="hover"
      whileTap="tap"
      animate="visible"
      className={commonClasses}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          onClick();
        }
      }}
      aria-label={title}
    >
      {content}
    </motion.div>
  );
};

export default LandingCard;
