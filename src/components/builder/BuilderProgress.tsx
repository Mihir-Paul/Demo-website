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
    <div className="w-full py-4">
      {/* Desktop Progress Bar */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 -translate-y-1/2 transition-all duration-300 z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
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
              className="relative z-10 flex flex-col items-center group disabled:cursor-not-allowed"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isCompleted
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                    : isCurrent
                    ? "bg-midnight-950 border-2 border-rose-500 text-rose-400 ring-4 ring-rose-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-500"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={`mt-2 text-[11px] font-medium tracking-wide transition-colors ${
                  isCurrent
                    ? "text-rose-300 font-semibold"
                    : isCompleted
                    ? "text-slate-300"
                    : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile Compact Progress Bar */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-rose-300">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}
          </span>
          <span className="text-slate-400 font-mono">
            {Math.round((currentStep / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
