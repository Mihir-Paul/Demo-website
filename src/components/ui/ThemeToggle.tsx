"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : false;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1688D4] dark:focus-visible:ring-[#A99AF4] select-none ${
        isDark
          ? "bg-[#151E2D] text-slate-200 border border-white/10 shadow-inner hover:bg-[#1B2535]"
          : "bg-white text-[#26364A] border border-[#1688D4]/20 shadow-sm hover:bg-[#F5FAFF]"
      } ${className}`}
    >
      <span className="flex items-center gap-1.5">
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 ${
            isDark
              ? "bg-[#A99AF4]/20 text-[#A99AF4]"
              : "bg-[#1688D4]/15 text-[#1688D4]"
          }`}
        >
          {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </span>
        <span className="hidden sm:inline-block font-medium">
          {isDark ? "Dark" : "Light"}
        </span>
      </span>
    </button>
  );
}
