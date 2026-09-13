import React, { useState } from "react";
import { KeyRound, Gift as GiftIcon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface PinLockSceneProps {
  giftId: string;
  recipientName: string;
  pinHint?: string | null;
  onUnlockSuccess: () => void;
  themeConfig?: ThemeConfig;
}

export function PinLockScene({
  giftId,
  recipientName,
  pinHint,
  onUnlockSuccess,
  themeConfig,
}: PinLockSceneProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const theme = themeConfig || getThemeConfig("sky-clouds");
  const emojis = theme.floatingEmojis;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pin.trim()) {
      setError("Please enter the PIN");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/gifts/${giftId}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.unlocked) {
        throw new Error(data.error || "Not quite! Try again.");
      }

      onUnlockSuccess();
    } catch (err: any) {
      setError(err.message || "Not quite! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between items-center py-12 px-4 sm:px-6 ${theme.bgGradient} ${theme.titleText} overflow-hidden`}>
      {/* Floating Atmosphere Elements */}
      <div className="absolute top-8 left-8 text-3xl animate-float">{emojis[0]}</div>
      <div className="absolute bottom-12 right-8 text-3xl animate-float-slow">{emojis[2]}</div>
      <div className="absolute top-1/4 right-12 text-2xl animate-pulse-slow">{emojis[1]}</div>

      <div className="pt-4 text-center">
        <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${theme.pillText} ${theme.pillBg} px-4 py-1.5 rounded-full border ${theme.pillBorder} shadow-sm backdrop-blur-md`}>
          SECRET PASSCODE
        </span>
      </div>

      <div className={`relative z-10 my-auto w-full max-w-sm ${theme.cardBg} backdrop-blur-md p-8 rounded-3xl text-center space-y-6 border ${theme.cardBorder} ${theme.cardShadow}`}>
        <div className={`w-16 h-16 rounded-2xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center mx-auto shadow-lg animate-float`}>
          <GiftIcon className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${theme.titleText}`}>
            For {recipientName} {emojis[0]}
          </h1>
          <p className={`text-xs ${theme.mutedText}`}>
            Someone created a digital birthday surprise for you. Enter the 4-digit PIN.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <Input
            type="password"
            placeholder="• • • •"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
            error={error || undefined}
            className={`text-center font-mono text-xl tracking-[0.5em] sm:text-2xl ${theme.innerCardBg} ${theme.cardBorder} ${theme.titleText}`}
          />

          {pinHint && (
            <div className={`flex items-center justify-center gap-1.5 text-xs ${theme.accentText} italic`}>
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hint: "{pinHint}"</span>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className={`w-full gap-2 text-sm py-5 ${theme.primaryBtnBg} ${theme.primaryBtnText} ${theme.primaryBtnShadow} font-semibold`}
          >
            <KeyRound className="w-4 h-4" />{" "}
            {loading ? "Verifying..." : "Unlock Surprise"}
          </Button>
        </form>
      </div>

      <div className="pb-4" />
    </div>
  );
}
