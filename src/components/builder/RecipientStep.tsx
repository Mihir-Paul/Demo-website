import React from "react";
import { Input, Textarea } from "@/components/ui/input";

interface RecipientStepProps {
  recipientName: string;
  message: string;
  onChange: (fields: { recipientName?: string; message?: string }) => void;
  errors: { recipientName?: string; message?: string };
}

export function RecipientStep({
  recipientName,
  message,
  onChange,
  errors,
}: RecipientStepProps) {
  return (
    <div className="space-y-6 opacity-100">
      <div className="border-b border-slate-200 dark:border-[#29374A] pb-4">
        <h2 className="text-2xl font-bold text-[#26364A] dark:text-[#F5F7FA] font-serif flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-[#1688D4]/15 border border-[#1688D4]/30 text-[#1688D4] dark:bg-[#A99AF4]/20 dark:border-[#A99AF4]/40 dark:text-[#A99AF4] flex items-center justify-center text-base shrink-0 shadow-sm">
            🎁
          </span>
          Who is celebrating a birthday?
        </h2>
        <p className="text-xs sm:text-sm text-[#60758D] dark:text-[#A8B6C8] mt-1.5 leading-relaxed font-normal">
          Personalize the main opening screen they will see when unwrapping their birthday surprise.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Input
            label="RECIPIENT'S NAME *"
            placeholder="Enter recipient's name"
            value={recipientName}
            onChange={(e) => onChange({ recipientName: e.target.value })}
            error={errors.recipientName}
            maxLength={100}
          />
          <p className="text-[11px] text-[#60758D] dark:text-[#A8B6C8] mt-1.5 font-normal">
            Works for friends, siblings, classmates, family, and anyone celebrating a birthday.
          </p>
        </div>

        <div>
          <Textarea
            label="MAIN BIRTHDAY WISH / MESSAGE *"
            placeholder="Write a birthday message..."
            value={message}
            onChange={(e) => onChange({ message: e.target.value })}
            error={errors.message}
            rows={3}
            maxLength={300}
          />
          <p className="text-[11px] text-[#1688D4] dark:text-[#8FAED8] font-medium mt-1.5">
            💡 Tip: Make the first message something they'll instantly recognize.
          </p>
        </div>
      </div>
    </div>
  );
}
