import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MailOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface LetterSceneProps {
  recipientName: string;
  letterText?: string | null;
  onNext: () => void;
  themeConfig?: ThemeConfig;
}

export function LetterScene({
  recipientName,
  letterText,
  onNext,
  themeConfig,
}: LetterSceneProps) {
  const [isOpen, setIsOpen] = useState(false);

  const theme = themeConfig || getThemeConfig("sky-clouds");
  const emojis = theme.floatingEmojis;

  if (!letterText || !letterText.trim()) {
    onNext();
    return null;
  }

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between items-center py-12 px-4 sm:px-6 ${theme.bgGradient} ${theme.titleText} overflow-hidden`}>
      {/* Floating Atmosphere */}
      <div className="absolute top-12 left-8 text-3xl pointer-events-none opacity-80">{emojis[0]}</div>
      <div className="absolute bottom-16 right-10 text-3xl pointer-events-none opacity-80">{emojis[1]}</div>

      {/* Header Label */}
      <div className="pt-4 text-center space-y-1">
        <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${theme.pillText} ${theme.pillBg} px-4 py-1.5 rounded-full border ${theme.pillBorder} shadow-sm backdrop-blur-md`}>
          A MESSAGE FOR YOU
        </span>
        <h2 className={`font-serif text-3xl sm:text-4xl font-bold ${theme.titleText}`}>
          Something I wanted to say
        </h2>
      </div>

      {/* Center Sealed Envelope or Unsealed Paper Letter */}
      <div className="relative z-10 my-auto w-full max-w-md">
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${theme.cardBg} backdrop-blur-md p-8 rounded-3xl text-center space-y-6 border ${theme.cardBorder} ${theme.cardShadow}`}
          >
            <div className={`w-20 h-20 rounded-3xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center mx-auto shadow-xl`}>
              <Mail className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <p className={`font-serif text-xl font-bold ${theme.titleText}`}>
                A Sealed Note for {recipientName} ✉️
              </p>
              <p className={`text-xs ${theme.mutedText} leading-relaxed`}>
                Tap to unseal and read your birthday letter.
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className={`w-full gap-2 text-base py-5 ${theme.primaryBtnBg} ${theme.primaryBtnText} ${theme.primaryBtnShadow} font-semibold`}
            >
              <MailOpen className="w-5 h-5" /> Open Letter
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} ${theme.cardShadow} space-y-6 text-slate-900 relative`}
          >
            <div className={`flex items-center justify-between border-b ${theme.cardBorder} pb-3`}>
              <div className={`flex items-center gap-2 ${theme.accentText} text-xs font-bold uppercase tracking-widest`}>
                <Heart className="w-4 h-4 fill-current opacity-80" /> Birthday Letter
              </div>
              <span className={`font-serif text-xs italic ${theme.mutedText} font-semibold`}>
                For {recipientName}
              </span>
            </div>

            {/* Paper Text Container */}
            <div className={`${theme.innerCardBg} p-5 rounded-2xl border ${theme.innerCardBorder} max-h-80 overflow-y-auto custom-scrollbar`}>
              <p className={`font-serif text-sm sm:text-base ${theme.bodyText} leading-relaxed whitespace-pre-wrap`}>
                {letterText}
              </p>
            </div>

            <Button
              size="lg"
              onClick={onNext}
              className={`w-full gap-2 text-base py-5 ${theme.primaryBtnBg} ${theme.primaryBtnText} ${theme.primaryBtnShadow} font-semibold`}
            >
              <span>Continue →</span>
            </Button>
          </motion.div>
        )}
      </div>

      <div className="pb-4" />
    </div>
  );
}
