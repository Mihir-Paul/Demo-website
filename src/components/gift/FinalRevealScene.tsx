import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { PartyPopper, RotateCcw, PlusCircle, Play, Pause, Disc, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fireCelebrationConfetti } from "@/lib/confetti";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface FinalRevealSceneProps {
  recipientName: string;
  message: string;
  musicUrl?: string | null;
  musicName?: string | null;
  onReplay: () => void;
  themeConfig?: ThemeConfig;
}

export function FinalRevealScene({
  recipientName,
  message,
  musicUrl,
  musicName,
  onReplay,
  themeConfig,
}: FinalRevealSceneProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const theme = themeConfig || getThemeConfig("sky-clouds");
  const emojis = theme.floatingEmojis;

  useEffect(() => {
    fireCelebrationConfetti();
  }, []);

  // Handle Audio events & initial autoplay attempt on final reveal mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicUrl) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // Attempt autoplay if permitted by browser policy
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        // Autoplay restricted by browser — recipient can press Play button
        setIsPlaying(false);
      });

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [musicUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Audio playback error:", err));
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className={`relative min-h-[100svh] w-full flex flex-col justify-between items-center py-8 px-4 sm:px-6 ${theme.bgGradient} ${theme.titleText} overflow-hidden`}>
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

        {/* Uploaded Birthday Soundtrack Player (If music exists) */}
        {musicUrl && (
          <div className={`${theme.cardBg} backdrop-blur-md p-5 sm:p-6 rounded-3xl border ${theme.cardBorder} ${theme.cardShadow} max-w-md w-full mb-6 text-center space-y-4 opacity-100`}>
            <audio ref={audioRef} src={musicUrl} preload="auto" />

            <div className="flex items-center justify-center gap-3">
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                className={`w-12 h-12 rounded-full ${theme.iconBg} ${theme.iconColor} flex items-center justify-center shadow-md shrink-0`}
              >
                <Disc className="w-6 h-6" />
              </motion.div>
              <div className="text-left truncate flex-1">
                <div className={`text-xs font-bold ${theme.titleText} truncate flex items-center gap-1.5`}>
                  <Music className={`w-3.5 h-3.5 ${theme.accentText} shrink-0`} />
                  <span className="truncate">{musicName || "Birthday Soundtrack"}</span>
                </div>
                <div className={`text-[11px] ${theme.mutedText} font-mono mt-0.5`}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>

            {/* Equalizer Spectrum Bars */}
            <div className="flex items-center justify-center gap-1.5 h-5">
              {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3].map((val, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    height: isPlaying ? [4, 20, 8, 22, 4] : 4,
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: isPlaying ? Infinity : 0,
                    delay: idx * 0.1,
                  }}
                  className={`w-1 rounded-full ${theme.iconBg}`}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <Button
              size="lg"
              onClick={togglePlay}
              className={`w-full gap-2 text-sm py-4 ${theme.primaryBtnBg} ${theme.primaryBtnText} ${theme.primaryBtnShadow} font-semibold rounded-xl`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Pause Song
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Play Song 🎵
                </>
              )}
            </Button>
          </div>
        )}

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
