"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the types for the component props
type NavItemProps = {
  href: string;
  children: React.ReactNode;
};

// Animation variants for the nav item itself
const navItemVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

// Animation variants for the active link indicator
const activeLinkVariants = {
  initial: { width: 0 },
  active: { width: "100%", transition: { duration: 0.3 } },
  inactive: { width: 0, transition: { duration: 0.3 } },
};

export function NavItem({ href, children }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <motion.div
      variants={navItemVariants}
      whileHover="hover"
      whileTap="tap"
      className="relative flex flex-col items-center"
    >
      <Link
        href={href}
        className="text-lg font-medium text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1"
        aria-current={isActive ? "page" : undefined}
      >
        {children}
      </Link>
      <motion.div
        className="absolute -bottom-1 h-0.5 bg-blue-500"
        initial="initial"
        animate={isActive ? "active" : "inactive"}
        variants={activeLinkVariants}
      />
    </motion.div>
  );
}
