"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (!stored && prefersDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
    setDark(shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = dark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !dark);
    localStorage.setItem("theme", newTheme);
    setDark(!dark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 px-3 py-1 text-sm rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] hover:brightness-110 transition"
    >
      {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
