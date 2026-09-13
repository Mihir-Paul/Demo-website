import React from "react";
import { Textarea } from "@/components/ui/input";

interface LetterStepProps {
  letter: string;
  onChange: (letter: string) => void;
  error?: string;
}

export function LetterStep({ letter, onChange, error }: LetterStepProps) {
  const maxLength = 3000;
  const currentLength = letter.length;

  return (
    <div className="space-y-6 opacity-100">
      <div className="border-b border-slate-200 dark:border-[#29374A] pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#26364A] dark:text-[#F5F7FA] font-serif flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#E85D83]/15 border border-[#E85D83]/30 text-[#E85D83] dark:bg-[#E7A6B7]/20 dark:border-[#E7A6B7]/40 dark:text-[#E7A6B7] flex items-center justify-center text-base shrink-0 shadow-sm">
              💌
            </span>
            Write a special birthday note
          </h2>
          <span className="text-xs font-mono text-[#26364A] dark:text-[#F5F7FA] bg-[#F7FBFF] dark:bg-[#182436] px-2.5 py-1 rounded-md border border-[#D7E8F5] dark:border-[#29374A]">
            {currentLength}/{maxLength}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#60758D] dark:text-[#A8B6C8] mt-1.5 leading-relaxed font-normal">
          This is the personal letter or note they'll discover and unwrap during their story experience.
        </p>
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder="Write your special birthday note..."
          value={letter}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          error={error}
          rows={10}
          className="font-sans text-sm leading-relaxed"
        />

        <div className="flex items-center justify-between text-xs text-[#60758D] dark:text-[#A8B6C8] pt-1">
          <span>Line breaks and formatting will be preserved in the recipient view.</span>
          <span className={currentLength >= maxLength ? "text-rose-500 font-semibold" : ""}>
            {maxLength - currentLength} characters remaining
          </span>
        </div>
      </div>
    </div>
  );
}
