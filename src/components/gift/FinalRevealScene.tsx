import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { PartyPopper, RotateCcw, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fireCelebrationConfetti } from "@/lib/confetti";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface FinalRevealSceneProps {
  recipientName: string;
  message: string;
  musicUrl?: string | null;
  onReplay: () => void;
  themeConfig?: ThemeConfig;
}

export function FinalRevealScene({
  recipientName,
  message,
  onReplay,
  themeConfig,
}: FinalRevealSceneProps) {
  const theme = themeConfig || getThemeConfig("sky-clouds");
  const emojis = theme.floatingEmojis;

  // Trigger celebration confetti on mount
  useEffect(() => {
    fireCelebrationConfetti();
  }, []);

  return (
    <div
      className={`relative min-h-[100svh] w-full flex flex-col justify-between items-center py-8 px-4 sm:px-6 ${theme.bgGradient} ${theme.titleText} overflow-hidden`}
    >

      {/* Perimeter Floating Decorations */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 left-8 text-4xl sm:text-5xl pointer-events-none filter drop-shadow-md"
      >
        {emojis[0]}
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-12 right-8 text-4xl sm:text-5xl pointer-events-none filter drop-shadow-md"
      >
        {emojis[1]}
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-6 text-3xl pointer-events-none"
      >
        {emojis[2]}
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 text-3xl pointer-events-none"
      >
        {emojis[3]}
      </motion.div>

      {/* Header Badge */}
      <div className="pt-2 sm:pt-4 text-center">
        <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${theme.pillText} ${theme.pillBg} px-4 py-1.5 rounded-full border ${theme.pillBorder} shadow-sm backdrop-blur-md`}>
          CELEBRATION TIME
        </span>
      </div>

      {/* Center Story Climax */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 my-auto flex flex-col items-center text-center max-w-xl w-full px-4 py-4 sm:py-6"
      >
        {/* Celebration Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.6 }}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center mx-auto shadow-2xl mb-6 sm:mb-8 shrink-0`}
        >
          <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10" />
        </motion.div>

        {/* Heading Block */}
        <div className="space-y-3 mb-6 sm:mb-8">
          <p className={`font-serif text-2xl sm:text-3xl font-medium ${theme.mutedText} italic leading-snug`}>
            Have The Best Birthday Ever,
          </p>
          <h1 className={`font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text ${theme.headingGradient} drop-shadow-sm py-1 leading-tight`}>
            {recipientName}! 🎉
          </h1>
          {message && (
            <p className={`font-serif text-base sm:text-lg ${theme.bodyText} italic leading-relaxed max-w-lg mx-auto pt-2`}>
              "{message}"
            </p>
          )}
        </div>

        {/* Wish Banner */}
        <div className={`p-4 rounded-2xl ${theme.innerCardBg} border ${theme.innerCardBorder} text-xs sm:text-sm ${theme.accentText} font-semibold shadow-md max-w-md w-full mb-6 sm:mb-8`}>
          ✨ Here's to another amazing year filled with warmth and joy!
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 max-w-sm w-full mx-auto">
          <Button
            size="lg"
            onClick={onReplay}
            variant="outline"
            className={`w-full gap-2 text-sm ${theme.secondaryBtnBorder} ${theme.secondaryBtnBg} ${theme.secondaryBtnText} font-semibold shadow-sm`}
          >
            <RotateCcw className="w-4 h-4" /> Replay Experience
          </Button>

          <Link href="/create" className="block w-full">
            <Button
              size="lg"
              className={`w-full gap-2 text-base py-5 ${theme.primaryBtnBg} ${theme.primaryBtnText} ${theme.primaryBtnShadow} font-semibold`}
            >
              <PlusCircle className="w-5 h-5" /> Create Your Own Birthday Surprise
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className={`relative z-10 pb-4 text-center text-[11px] ${theme.mutedText}`}>
        Digital Birthday Surprise • Craft your own free surprise anytime!
      </footer>
    </div>
  );
}
