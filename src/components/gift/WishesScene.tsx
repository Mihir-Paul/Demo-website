import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface WishItem {
  id: string;
  text: string;
}

interface WishesSceneProps {
  wishes: WishItem[];
  recipientName: string;
  onNext: () => void;
  themeConfig?: ThemeConfig;
}

export function WishesScene({
  wishes,
  recipientName,
  onNext,
  themeConfig,
}: WishesSceneProps) {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const theme = themeConfig || getThemeConfig("sky-clouds");
  const emojis = theme.floatingEmojis;

  if (!wishes || wishes.length === 0) {
    onNext();
    return null;
  }

  const toggleWish = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between items-center py-12 px-4 sm:px-6 ${theme.bgGradient} ${theme.titleText} overflow-hidden`}>
      {/* Floating Atmosphere */}
      <div className="absolute top-10 left-8 text-3xl pointer-events-none opacity-80">{emojis[0]}</div>
      <div className="absolute bottom-16 right-10 text-3xl pointer-events-none opacity-80">{emojis[1]}</div>

      {/* Header Label */}
      <div className="pt-4 text-center space-y-1">
        <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${theme.pillText} ${theme.pillBg} px-4 py-1.5 rounded-full border ${theme.pillBorder} shadow-sm backdrop-blur-md`}>
          A FEW WISHES FOR YOU
        </span>
        <h2 className={`font-serif text-3xl sm:text-4xl font-bold ${theme.titleText}`}>
          Everything I hope this year brings
        </h2>
        <p className={`text-xs sm:text-sm ${theme.mutedText}`}>
          Tap each card to reveal wishes for {recipientName}
        </p>
      </div>

      {/* Center Interactive Light Wish Cards */}
      <div className="relative z-10 my-auto w-full max-w-md space-y-4">
        {wishes.map((wish, idx) => {
          const isRevealed = Boolean(revealedIds[wish.id]);

          return (
            <motion.div
              key={wish.id || idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: idx % 2 === 0 ? 1 : -1,
              }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => toggleWish(wish.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                isRevealed
                  ? `${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow}`
                  : `${theme.innerCardBg} ${theme.innerCardBorder} hover:border-sky-300 shadow-md`
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isRevealed
                    ? `${theme.iconBg} ${theme.iconColor} font-bold`
                    : `${theme.pillBg} ${theme.pillText} font-semibold`
                }`}
              >
                {isRevealed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-mono">{idx + 1}</span>
                )}
              </div>

              <div className="space-y-1 my-auto">
                {isRevealed ? (
                  <p className={`font-serif text-sm sm:text-base font-semibold ${theme.bodyText} leading-relaxed`}>
                    {wish.text}
                  </p>
                ) : (
                  <p className={`text-xs font-medium ${theme.accentText} italic`}>
                    ✨ Tap to reveal wish #{idx + 1}...
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}

        <Button
          size="lg"
          onClick={onNext}
          className={`w-full gap-2 text-base py-5 ${theme.primaryBtnBg} ${theme.primaryBtnText} ${theme.primaryBtnShadow} font-semibold`}
        >
          <span>Continue to Final Surprise →</span>
        </Button>
      </div>

      <div className="pb-4" />
    </div>
  );
}
