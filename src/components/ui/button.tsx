import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-95";

    const variants = {
      primary:
        "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:from-rose-600 hover:to-pink-700",
      secondary:
        "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
      outline:
        "border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 hover:border-rose-400",
      ghost: "text-slate-300 hover:bg-slate-800/60 hover:text-white",
      glass:
        "glass-card text-white hover:bg-white/10 border-white/20 shadow-xl backdrop-blur-md",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs tracking-wide",
      md: "px-5 py-2.5 text-sm font-semibold",
      lg: "px-7 py-3.5 text-base font-semibold tracking-wide",
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
