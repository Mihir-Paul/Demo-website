import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#26364A] dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm text-[#26364A] dark:text-slate-100 placeholder-slate-400 glass-input focus:border-[#1688D4] dark:focus:border-[#A99AF4] focus:ring-1 focus:ring-[#1688D4]/30 dark:focus:ring-[#A99AF4]/30 transition-all",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 dark:text-rose-300 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#26364A] dark:text-slate-300">
            {label}
          </label>
        )}
        <textarea
          rows={rows}
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm text-[#26364A] dark:text-slate-100 placeholder-slate-400 glass-input focus:border-[#1688D4] dark:focus:border-[#A99AF4] focus:ring-1 focus:ring-[#1688D4]/30 dark:focus:ring-[#A99AF4]/30 transition-all resize-none",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 dark:text-rose-300 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
