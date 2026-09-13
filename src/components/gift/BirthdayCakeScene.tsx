import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flame, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fireCakeCandleConfetti } from "@/lib/confetti";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface BirthdayCakeSceneProps {
  recipientName: string;
  onNext: () => void;
  themeConfig?: ThemeConfig;
}

export function BirthdayCakeScene({
  recipientName,
  onNext,
  themeConfig,
}: BirthdayCakeSceneProps) {
  const [candlesBlown, setCandlesBlown] = useState(false);

  const theme = themeConfig || getThemeConfig("sky-clouds");
  const emojis = theme.floatingEmojis;

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    fireCakeCandleConfetti();
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between items-center py-12 px-4 sm:px-6 ${theme.bgGradient} ${theme.titleText} overflow-hidden`}>
      {/* Floating Atmosphere Elements */}
      <div className="absolute top-10 left-8 text-3xl pointer-events-none opacity-80">{emojis[0]}</div>
      <div className="absolute bottom-16 right-10 text-3xl pointer-events-none opacity-80">{emojis[1]}</div>

      {/* Header Label */}
      <div className="pt-4 text-center space-y-1">
        <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${theme.pillText} ${theme.pillBg} px-4 py-1.5 rounded-full border ${theme.pillBorder} shadow-sm backdrop-blur-md`}>
          A LITTLE CELEBRATION
        </span>
        <h2 className={`font-serif text-3xl sm:text-4xl font-bold ${theme.titleText}`}>
          {candlesBlown ? "Wish Made! ✨" : "Blow Out the Candles 🎂"}
        </h2>
        <p className={`text-xs sm:text-sm ${theme.mutedText} max-w-sm mx-auto`}>
          {candlesBlown
            ? `Your wish has been sent to the universe for ${recipientName}!`
            : "Close your eyes, make a special wish, and blow out the candles!"}
        </p>
      </div>

      {/* Center Illustrated Birthday Cake */}
      <div className="relative z-10 my-auto w-full max-w-sm text-center">
        <div
          onClick={handleBlowCandles}
          className={`${theme.cardBg} backdrop-blur-md p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardShadow} hover:border-amber-300 transition-all cursor-pointer space-y-6`}
        >
          {/* Candle Flames */}
          <div className="flex items-center justify-center gap-6 z-10 -mb-2">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex flex-col items-center">
                {!candlesBlown ? (
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 0.9, 1.1],
                      opacity: [0.9, 1, 0.8, 1],
                    }}
                    transition={{
                      duration: 0.6 + idx * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="text-amber-500 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]"
                  >
                    <Flame className="w-6 h-6 fill-amber-400 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -12 }}
                    className="text-slate-400 text-xs font-mono"
                  >
                    💨
                  </motion.div>
                )}
                {/* Candle Stick */}
                <div className="w-2.5 h-8 bg-gradient-to-b from-sky-300 to-indigo-500 rounded-t-sm shadow-sm" />
              </div>
            ))}
          </div>

          {/* SVG Birthday Cake */}
          <div className="relative flex justify-center">
            <svg
              width="200"
              height="120"
              viewBox="0 0 180 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              {/* Top Layer */}
              <rect x="25" y="15" width="130" height="35" rx="8" fill="#38BDF8" />
              <path
                d="M25 35 Q 35 48 45 35 Q 55 48 65 35 Q 75 48 85 35 Q 95 48 105 35 Q 115 48 125 35 Q 135 48 155 35 L 155 50 L 25 50 Z"
                fill="#FFFFFF"
              />

              {/* Bottom Layer */}
              <rect x="10" y="50" width="160" height="45" rx="10" fill="#6366F1" />
              <path
                d="M10 70 Q 25 85 40 70 Q 55 85 70 70 Q 85 85 100 70 Q 115 85 130 70 Q 145 85 160 70 L 170 95 C 170 100 165 105 160 105 L 20 105 C 15 105 10 100 10 95 Z"
                fill="#E0E7FF"
              />

              {/* Plate */}
              <rect x="0" y="98" width="180" height="8" rx="4" fill="#CBD5E1" />
            </svg>
          </div>

          {!candlesBlown ? (
            <span className={`block text-xs font-semibold ${theme.accentText} animate-pulse pt-1`}>
              👇 Tap the cake to blow out candles
            </span>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-semibold text-sm pt-1">
              <CheckCircle2 className="w-4 h-4" /> Wish Sent to the Universe!
            </div>
          )}

          {!candlesBlown ? (
            <Button
              size="lg"
              onClick={handleBlowCandles}
              className="w-full gap-2 text-base py-5 shadow-xl shadow-amber-500/25 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-semibold text-white"
            >
              <Flame className="w-5 h-5" /> Blow Out Candles
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={onNext}
              className={`w-full gap-2 text-base py-5 ${theme.primaryBtnBg} ${theme.primaryBtnText} ${theme.primaryBtnShadow} font-semibold`}
            >
              <span>Continue →</span>
            </Button>
          )}
        </div>
      </div>

      <div className="pb-4" />
    </div>
  );
}
