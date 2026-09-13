import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "pink";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1688D4] dark:focus-visible:ring-[#A99AF4]/50 disabled:opacity-40 disabled:pointer-events-none rounded-xl active:scale-95";

    const variants = {
      primary:
        "bg-[#1688D4] hover:bg-[#0284c7] text-white shadow-md shadow-[#1688D4]/20 dark:bg-[#A99AF4] dark:hover:bg-[#b8abf6] dark:text-[#0B111D] dark:shadow-lg dark:shadow-[#A99AF4]/15 hover:-translate-y-0.5",
      pink:
        "bg-[#E85D83] hover:bg-[#d94f75] text-white shadow-md shadow-[#E85D83]/20 dark:bg-[#E7A6B7] dark:hover:bg-[#efaec0] dark:text-[#0B111D] dark:shadow-lg dark:shadow-[#E7A6B7]/15 hover:-translate-y-0.5",
      secondary:
        "bg-white hover:bg-[#F5FAFF] text-[#26364A] border border-slate-200 shadow-sm dark:bg-[#151E2D] dark:hover:bg-[#1B2535] dark:text-slate-100 dark:border-white/10",
      outline:
        "border border-[#1688D4]/40 text-[#1688D4] hover:bg-[#1688D4]/10 dark:border-[#A99AF4]/40 dark:text-[#A99AF4] dark:hover:bg-[#A99AF4]/10",
      ghost: "text-[#26364A] hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
      glass:
        "bg-white/80 backdrop-blur-md text-[#26364A] hover:bg-white border border-[#1688D4]/15 shadow-md dark:bg-[#151E2D]/80 dark:text-slate-200 dark:hover:bg-[#151E2D] dark:border-white/10",
    };

    const sizes = {
      sm: "px-3.5 py-1.5 text-xs tracking-wide",
      md: "px-5 py-2.5 text-sm tracking-wide",
      lg: "px-7 py-3.5 text-base tracking-wide",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
