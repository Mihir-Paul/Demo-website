import React from "react";
import { Check } from "lucide-react";

export interface StepItem {
  number: number;
  label: string;
}

interface BuilderProgressProps {
  currentStep: number;
  steps: StepItem[];
  onStepClick: (stepNumber: number) => void;
}

export function BuilderProgress({
  currentStep,
  steps,
  onStepClick,
}: BuilderProgressProps) {
  return (
    <div className="w-full py-2 max-w-full overflow-hidden">
      {/* Desktop Progress Bar */}
      <div className="hidden md:flex items-center justify-between relative px-2">
        {/* Connecting Line Background */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800/80 z-0" />
        {/* Active Connecting Line */}
        <div
          className="absolute top-4 left-6 h-0.5 bg-[#1688D4] dark:bg-[#A99AF4] transition-all duration-300 z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 92}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <button
              key={step.number}
              type="button"
              onClick={() => step.number < currentStep && onStepClick(step.number)}
              disabled={step.number > currentStep}
              className="relative z-10 flex flex-col items-center group disabled:cursor-not-allowed max-w-[68px]"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isCompleted
                    ? "bg-[#1688D4] text-white shadow-md shadow-[#1688D4]/20 dark:bg-[#A99AF4] dark:text-[#0B111D] dark:shadow-[#A99AF4]/20"
                    : isCurrent
                    ? "bg-[#1688D4] text-white ring-4 ring-[#1688D4]/20 shadow-md scale-110 font-bold dark:bg-[#A99AF4] dark:text-[#0B111D] dark:ring-[#A99AF4]/20"
                    : "bg-white border border-slate-300 text-slate-500 dark:bg-[#1E293B] dark:border-white/10 dark:text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
              </div>
              <span
                className={`mt-1.5 text-[10px] sm:text-[11px] font-medium tracking-wide transition-colors truncate max-w-full text-center ${
                  isCurrent
                    ? "text-[#1688D4] dark:text-[#A99AF4] font-semibold"
                    : isCompleted
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile Compact / Scrollable Stepper */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold px-1">
          <span className="text-[#1688D4] dark:text-[#A99AF4] flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#1688D4] text-white dark:bg-[#A99AF4] dark:text-[#0B111D] text-[10px] inline-flex items-center justify-center font-bold">
              {currentStep}
            </span>
            {steps[currentStep - 1]?.label}
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#1E293B] overflow-hidden border border-slate-300/40 dark:border-white/5">
          <div
            className="h-full bg-[#1688D4] dark:bg-[#A99AF4] transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
