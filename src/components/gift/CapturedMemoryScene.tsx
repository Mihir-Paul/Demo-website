import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface PhotoItem {
  id: string;
  url: string;
  caption?: string | null;
}

interface CapturedMemorySceneProps {
  photo: PhotoItem;
  totalPhotosCount?: number;
  recipientName: string;
  onNext: () => void;
  themeConfig?: ThemeConfig;
}

export function CapturedMemoryScene({
  photo,
  totalPhotosCount = 1,
  recipientName,
  onNext,
  themeConfig,
}: CapturedMemorySceneProps) {
  const [revealed, setRevealed] = useState(false);
  const [flashing, setFlashing] = useState(false);

  const theme = themeConfig || getThemeConfig("sky-clouds");
  const emojis = theme.floatingEmojis;

  const handleReveal = () => {
    setFlashing(true);
    setTimeout(() => {
      setFlashing(false);
      setRevealed(true);
    }, 450);
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between items-center py-12 px-4 sm:px-6 ${theme.bgGradient} ${theme.titleText} overflow-hidden`}>
      {/* Flash Overlay */}
      <AnimatePresence>
        {flashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white"
          />
        )}
      </AnimatePresence>

      {/* Floating Atmosphere Elements */}
      <div className="absolute top-12 left-8 text-3xl pointer-events-none opacity-80">{emojis[0]}</div>
      <div className="absolute bottom-16 right-10 text-3xl pointer-events-none opacity-80">{emojis[1]}</div>

      {/* Top Header Label */}
      <div className="pt-4 text-center space-y-1">
        <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${theme.pillText} ${theme.pillBg} px-4 py-1.5 rounded-full border ${theme.pillBorder} shadow-sm backdrop-blur-md`}>
          CAPTURED MOMENTS
        </span>
        <h2 className={`font-serif text-3xl sm:text-4xl font-bold ${theme.titleText}`}>
          Press for a memory
        </h2>
      </div>

      {/* Center Interactive Camera or Polaroid Card */}
      <div className="relative z-10 my-auto w-full max-w-sm text-center">
        {!revealed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${theme.cardBg} backdrop-blur-md p-8 rounded-3xl space-y-6 border ${theme.cardBorder} ${theme.cardShadow}`}
          >
            {/* Illustrated Camera Component */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              onClick={handleReveal}
              className={`w-24 h-24 rounded-3xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center mx-auto shadow-2xl cursor-pointer hover:scale-105 transition-transform`}
            >
              <Camera className="w-12 h-12" />
            </motion.div>

            <div className="space-y-1">
              <p className={`font-serif text-lg font-bold ${theme.titleText}`}>
                Snap to Reveal 📸
              </p>
              <p className={`text-xs ${theme.accentText} font-medium`}>
                Tap the camera · {totalPhotosCount} memory waiting
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleReveal}
              className={`w-full gap-2 py-5 text-sm ${theme.primaryBtnBg} ${theme.primaryBtnText} ${theme.primaryBtnShadow} font-semibold`}
            >
              <Sparkles className="w-4 h-4" /> Reveal Memory
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="space-y-6"
          >
            {/* Physical Polaroid Card */}
            <div className="p-4 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900 space-y-4 transform hover:rotate-0 transition-transform">
              <div className="relative overflow-hidden rounded-xl bg-slate-100 aspect-square sm:aspect-[4/3] shadow-inner">
                <img
                  src={photo.url}
                  alt={photo.caption || "Captured memory"}
                  className="w-full h-full object-cover"
                />
              </div>
              {photo.caption && (
                <p className="font-serif text-center text-sm font-medium text-slate-800 px-2 italic">
                  "{photo.caption}"
                </p>
              )}
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

      {/* Bottom Spacer */}
      <div className="pb-4" />
    </div>
  );
}
