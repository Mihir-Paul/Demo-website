import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface PhotoItem {
  id: string;
  url: string;
  caption?: string | null;
}

interface MemoryGallerySceneProps {
  photos: PhotoItem[];
  recipientName: string;
  onNext: () => void;
  themeConfig?: ThemeConfig;
}

export function MemoryGalleryScene({
  photos,
  recipientName,
  onNext,
  themeConfig,
}: MemoryGallerySceneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const theme = themeConfig || getThemeConfig("sky-clouds");
  const emojis = theme.floatingEmojis;

  if (!photos || photos.length === 0) {
    onNext();
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between items-center py-12 px-4 sm:px-6 ${theme.bgGradient} ${theme.titleText} overflow-hidden`}>
      {/* Floating Atmosphere */}
      <div className="absolute top-10 right-10 text-3xl pointer-events-none opacity-80">{emojis[0]}</div>
      <div className="absolute bottom-16 left-8 text-3xl pointer-events-none opacity-80">{emojis[1]}</div>

      {/* Header Label */}
      <div className="pt-4 text-center space-y-1">
        <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${theme.pillText} ${theme.pillBg} px-4 py-1.5 rounded-full border ${theme.pillBorder} shadow-sm backdrop-blur-md`}>
          MEMORY GALLERY
        </span>
        <h2 className={`font-serif text-3xl sm:text-4xl font-bold ${theme.titleText}`}>
          Moments Worth Keeping ✨
        </h2>
      </div>

      {/* Center Polaroid Collage / Card View */}
      <div className="relative z-10 my-auto w-full max-w-md space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={photos[currentIndex].id || currentIndex}
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: currentIndex % 2 === 0 ? 1.5 : -1.5 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
            transition={{ duration: 0.4 }}
            className="p-4 bg-white rounded-3xl shadow-2xl border border-slate-200 text-slate-900 space-y-4"
          >
            <div className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-square sm:aspect-[4/3] shadow-inner">
              <img
                src={photos[currentIndex].url}
                alt={photos[currentIndex].caption || "Memory"}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-3 left-3 ${theme.pillBg} backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold ${theme.pillText} shadow border ${theme.pillBorder}`}>
                #{currentIndex + 1} of {photos.length}
              </div>
            </div>

            {photos[currentIndex].caption && (
              <p className="font-serif text-center text-sm font-semibold text-slate-800 px-2 italic">
                "{photos[currentIndex].caption}"
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Polaroid Slider Controls */}
        {photos.length > 1 && (
          <div className="flex items-center justify-between px-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              className={`gap-1 text-xs ${theme.secondaryBtnBorder} ${theme.secondaryBtnBg} ${theme.secondaryBtnText} shadow-sm`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <div className="flex items-center gap-1.5">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "w-6 bg-sky-500"
                      : "w-2 bg-slate-300"
                  }`}
                  aria-label={`Go to photo ${idx + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPhoto}
              className={`gap-1 text-xs ${theme.secondaryBtnBorder} ${theme.secondaryBtnBg} ${theme.secondaryBtnText} shadow-sm`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        <Button
          size="lg"
          onClick={onNext}
          className={`w-full gap-2 text-base py-5 ${theme.primaryBtnBg} ${theme.primaryBtnText} ${theme.primaryBtnShadow} font-semibold`}
        >
          <span>Continue →</span>
        </Button>
      </div>

      <div className="pb-4" />
    </div>
  );
}
