import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { fireCelebrationConfetti } from "@/lib/confetti";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface WelcomeSceneProps {
  recipientName: string;
  headlineMessage: string;
  onNext: () => void;
  themeConfig?: ThemeConfig;
}

export function WelcomeScene({
  recipientName,
  headlineMessage,
  onNext,
  themeConfig,
}: WelcomeSceneProps) {
  useEffect(() => {
    fireCelebrationConfetti();
  }, []);

  const theme = themeConfig || getThemeConfig("sky-clouds");
  const currentYear = new Date().getFullYear();
  const emojis = theme.floatingEmojis;

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between items-center py-12 px-4 sm:px-6 ${theme.bgGradient} ${theme.titleText} overflow-hidden`}>
      {/* Perimeter Floating Theme Emojis */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-6 text-4xl sm:text-5xl pointer-events-none filter drop-shadow-md"
      >
        {emojis[0]}
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], x: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-12 right-8 text-4xl sm:text-5xl pointer-events-none filter drop-shadow-sm opacity-90"
      >
        {emojis[1]}
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-20 left-8 text-3xl sm:text-4xl pointer-events-none filter drop-shadow-md"
      >
        {emojis[2]}
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-1/3 right-6 text-3xl sm:text-4xl pointer-events-none opacity-80"
      >
        {emojis[3]}
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-24 right-10 text-3xl sm:text-4xl pointer-events-none"
      >
        {emojis[4]}
      </motion.div>

      {/* Top Spacer / Header Brand */}
      <div className="pt-4 text-center">
        <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${theme.pillText} ${theme.pillBg} px-4 py-1.5 rounded-full border ${theme.pillBorder} shadow-sm backdrop-blur-md`}>
          ✦ A Birthday Made Just For You ✦
        </span>
      </div>

      {/* Main Center Story Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 my-auto text-center max-w-2xl space-y-6 px-4"
      >
        <div className="space-y-2">
          <p className={`font-serif text-2xl sm:text-3xl font-medium ${theme.mutedText} italic`}>
            Happy Birthday,
          </p>
          <h1 className={`font-serif text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text ${theme.headingGradient} drop-shadow-sm py-2`}>
            {recipientName}
          </h1>
        </div>

        {/* Year Pill Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.innerCardBg} border ${theme.innerCardBorder} ${theme.accentText} font-mono text-xs font-semibold shadow-sm`}>
          <span>🎂</span>
          <span>CELEBRATING {currentYear}</span>
          <span>🎂</span>
        </div>

        {/* Creator Message Quote */}
        {headlineMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <p className={`font-serif text-base sm:text-lg ${theme.bodyText} italic leading-relaxed max-w-lg mx-auto ${theme.cardBg} p-6 rounded-3xl border ${theme.cardBorder} ${theme.cardShadow} backdrop-blur-sm`}>
              "{headlineMessage}"
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onNext}
        className="pb-4 text-center cursor-pointer group flex flex-col items-center gap-1.5 z-10"
      >
        <span className={`text-[11px] font-bold uppercase tracking-widest ${theme.accentText} group-hover:opacity-80`}>
          Begin Story
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className={`w-9 h-9 rounded-full ${theme.pillBg} border ${theme.pillBorder} ${theme.pillText} flex items-center justify-center shadow-md group-hover:scale-105 transition-all`}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
}
