import React from "react";
import { ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PinStepProps {
  pin: string;
  pinHint: string;
  onChange: (fields: { pin?: string; pinHint?: string }) => void;
  error?: string;
}

export function PinStep({ pin, pinHint, onChange, error }: PinStepProps) {
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 4);
    onChange({ pin: numericValue });
  };

  return (
    <div className="space-y-6 opacity-100">
      <div className="border-b border-slate-200 dark:border-[#29374A] pb-4">
        <h2 className="text-2xl font-bold text-[#26364A] dark:text-[#F5F7FA] font-serif flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-[#1688D4]/15 border border-[#1688D4]/30 text-[#1688D4] dark:bg-[#F1D9A6]/20 dark:border-[#F1D9A6]/40 dark:text-[#F1D9A6] flex items-center justify-center text-base shrink-0 shadow-sm">
            🔒
          </span>
          Keep it a secret
        </h2>
        <p className="text-xs sm:text-sm text-[#60758D] dark:text-[#A8B6C8] mt-1.5 leading-relaxed font-normal">
          Only someone with this 4-digit PIN will be able to open and unwrap the birthday surprise.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Input
            label="4-DIGIT PASSCODE PIN *"
            type="password"
            placeholder="e.g. 1234"
            value={pin}
            onChange={handlePinChange}
            error={error}
            maxLength={4}
            className="text-center font-mono text-xl tracking-[0.5em] sm:text-2xl"
          />
          <p className="text-[11px] text-[#60758D] dark:text-[#A8B6C8] mt-1.5 font-normal">
            PIN must be exactly 4 numeric digits (0–9).
          </p>
        </div>

        <div>
          <Input
            label="OPTIONAL SECRET PIN HINT"
            placeholder="e.g. Something only we know or an inside joke year..."
            value={pinHint}
            onChange={(e) => onChange({ pinHint: e.target.value })}
            maxLength={100}
          />
          <p className="text-[11px] text-[#60758D] dark:text-[#A8B6C8] mt-1 font-normal">
            This hint can be displayed on their lock screen.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F7FBFF] border border-[#D7E8F5] dark:bg-[#172235] dark:border-[#29374A] flex items-start gap-3 shadow-sm opacity-100">
          <ShieldCheck className="w-5 h-5 text-[#1688D4] dark:text-[#A99AF4] shrink-0 mt-0.5" />
          <p className="text-xs text-[#26364A] dark:text-[#F5F7FA] leading-relaxed">
            <strong className="font-bold">Security Note:</strong> Your PIN is encrypted securely. Only your recipient can unlock their gift with the PIN you choose!
          </p>
        </div>
      </div>
    </div>
  );
}
