import React from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PinStepProps {
  pin: string;
  pinHint: string;
  onChange: (fields: { pin?: string; pinHint?: string }) => void;
  error?: string;
}

export function PinStep({ pin, pinHint, onChange, error }: PinStepProps) {
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only numeric digits, exactly up to 4 chars
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 4);
    onChange({ pin: numericValue });
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <CardHeader className="p-0 border-b border-slate-800 pb-4">
        <CardTitle className="flex items-center gap-2 text-rose-400">
          <Lock className="w-5 h-5" /> Keep it a secret 🔒
        </CardTitle>
        <CardDescription>
          Only someone with this 4-digit PIN will be able to open and unwrap the surprise experience.
        </CardDescription>
      </CardHeader>

      <div className="space-y-5">
        <div>
          <Input
            label="4-Digit Passcode PIN *"
            type="password"
            placeholder="e.g. 1234"
            value={pin}
            onChange={handlePinChange}
            error={error}
            maxLength={4}
            className="text-center font-mono text-xl tracking-[0.5em] sm:text-2xl"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            PIN must be exactly 4 numeric digits (0–9).
          </p>
        </div>

        <div>
          <Input
            label="Optional PIN Hint"
            placeholder="e.g. Something only we know or your favorite birth year..."
            value={pinHint}
            onChange={(e) => onChange({ pinHint: e.target.value })}
            maxLength={100}
          />
          <p className="text-[11px] text-slate-400 mt-1">
            This hint can be shown to the recipient on their lock screen.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Security Note:</strong> Your PIN is encrypted with bcrypt before saving to the database. Plaintext PINs are never stored.
          </p>
        </div>
      </div>
    </Card>
  );
}
