import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PinLockScene } from "./PinLockScene";
import { UnlockAnimScene } from "./UnlockAnimScene";
import { WelcomeScene } from "./WelcomeScene";
import { CapturedMemoryScene } from "./CapturedMemoryScene";
import { MemoryGalleryScene } from "./MemoryGalleryScene";
import { BirthdayCakeScene } from "./BirthdayCakeScene";
import { LetterScene } from "./LetterScene";
import { WishesScene } from "./WishesScene";
import { FinalRevealScene } from "./FinalRevealScene";
import { getThemeConfig } from "@/lib/themeConfig";

export interface GiftData {
  id: string;
  slug: string;
  recipientName: string;
  message: string;
  letter?: string | null;
  theme?: string | null;
  pinHint?: string | null;
  hasPin: boolean;
  musicUrl?: string | null;
  musicName?: string | null;
  photos?: Array<{ id: string; url: string; caption?: string | null }>;
  wishes?: Array<{ id: string; text: string }>;
}

type SceneKey =
  | "locked"
  | "unlocking"
  | "welcome"
  | "captured_memory"
  | "gallery"
  | "cake"
  | "letter"
  | "wishes"
  | "final";

interface RecipientExperienceShellProps {
  gift: GiftData;
  isUnlockedDefault?: boolean;
}

export function RecipientExperienceShell({
  gift,
  isUnlockedDefault = false,
}: RecipientExperienceShellProps) {
  const [currentScene, setCurrentScene] = useState<SceneKey>(
    gift.hasPin && !isUnlockedDefault ? "locked" : "welcome"
  );

  const themeConfig = getThemeConfig(gift.theme);

  // Helper to determine active scene sequence for progress bar
  const validScenes: SceneKey[] = ["welcome"];
  if (gift.photos && gift.photos.length > 0) {
    validScenes.push("captured_memory");
    if (gift.photos.length > 1) {
      validScenes.push("gallery");
    }
  }
  validScenes.push("cake");
  if (gift.letter && gift.letter.trim().length > 0) {
    validScenes.push("letter");
  }
  if (gift.wishes && gift.wishes.length > 0) {
    validScenes.push("wishes");
  }
  validScenes.push("final");

  const activeStepIndex = validScenes.indexOf(currentScene);

  const getNextScene = (fromScene: SceneKey): SceneKey => {
    const idx = validScenes.indexOf(fromScene);
    if (idx !== -1 && idx + 1 < validScenes.length) {
      return validScenes[idx + 1];
    }
    return "final";
  };

  const handleUnlockSuccess = () => {
    setCurrentScene("unlocking");
  };

  const handleUnlockAnimComplete = () => {
    setCurrentScene("welcome");
  };

  const advanceScene = () => {
    const next = getNextScene(currentScene);
    setCurrentScene(next);
  };

  const handleReplay = () => {
    setCurrentScene("welcome");
  };

  return (
    <div className={`min-h-screen ${themeConfig.bgGradient} ${themeConfig.titleText} relative overflow-hidden flex flex-col justify-between`}>
      {/* Background Ambient Glows */}
      <div className={`absolute top-[10%] left-[15%] w-96 h-96 ${themeConfig.glow1} rounded-full blur-3xl pointer-events-none animate-pulse-slow`} />
      <div className={`absolute bottom-[10%] right-[15%] w-96 h-96 ${themeConfig.glow2} rounded-full blur-3xl pointer-events-none animate-pulse-slow`} />
      <div className={`absolute top-[50%] left-[40%] w-72 h-72 ${themeConfig.glow3} rounded-full blur-3xl pointer-events-none`} />

      {/* Progress Dots Header (Only when unlocked and active in sequence) */}
      {currentScene !== "locked" && currentScene !== "unlocking" && (
        <div className="relative z-20 pt-6 px-4 flex items-center justify-center gap-1.5 max-w-xs mx-auto">
          {validScenes.map((s, idx) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeStepIndex
                  ? themeConfig.progressActive
                  : idx < activeStepIndex
                  ? themeConfig.progressPassed
                  : themeConfig.progressUpcoming
              }`}
            />
          ))}
        </div>
      )}

      {/* Scene Render Shell with AnimatePresence */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentScene === "locked" && (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PinLockScene
                giftId={gift.id}
                recipientName={gift.recipientName}
                pinHint={gift.pinHint}
                onUnlockSuccess={handleUnlockSuccess}
                themeConfig={themeConfig}
              />
            </motion.div>
          )}

          {currentScene === "unlocking" && (
            <motion.div
              key="unlocking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <UnlockAnimScene onComplete={handleUnlockAnimComplete} themeConfig={themeConfig} />
            </motion.div>
          )}

          {currentScene === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <WelcomeScene
                recipientName={gift.recipientName}
                headlineMessage={gift.message}
                onNext={advanceScene}
                themeConfig={themeConfig}
              />
            </motion.div>
          )}

          {currentScene === "captured_memory" && gift.photos && gift.photos.length > 0 && (
            <motion.div
              key="captured_memory"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <CapturedMemoryScene
                photo={gift.photos[0]}
                recipientName={gift.recipientName}
                onNext={advanceScene}
                themeConfig={themeConfig}
              />
            </motion.div>
          )}

          {currentScene === "gallery" && gift.photos && gift.photos.length > 1 && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <MemoryGalleryScene
                photos={gift.photos}
                recipientName={gift.recipientName}
                onNext={advanceScene}
                themeConfig={themeConfig}
              />
            </motion.div>
          )}

          {currentScene === "cake" && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <BirthdayCakeScene
                recipientName={gift.recipientName}
                onNext={advanceScene}
                themeConfig={themeConfig}
              />
            </motion.div>
          )}

          {currentScene === "letter" && gift.letter && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <LetterScene
                recipientName={gift.recipientName}
                letterText={gift.letter}
                onNext={advanceScene}
                themeConfig={themeConfig}
              />
            </motion.div>
          )}

          {currentScene === "wishes" && gift.wishes && gift.wishes.length > 0 && (
            <motion.div
              key="wishes"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <WishesScene
                wishes={gift.wishes}
                recipientName={gift.recipientName}
                onNext={advanceScene}
                themeConfig={themeConfig}
              />
            </motion.div>
          )}

          {currentScene === "final" && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <FinalRevealScene
                recipientName={gift.recipientName}
                message={gift.message}
                onReplay={handleReplay}
                themeConfig={themeConfig}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Footer */}
      <footer className={`relative z-20 py-4 text-center text-[11px] ${themeConfig.mutedText} font-medium`}>
        Digital Birthday Surprise
      </footer>
    </div>
  );
}
