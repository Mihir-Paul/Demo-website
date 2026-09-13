"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Disc, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface MusicSceneProps {
  musicUrl?: string | null;
  musicName?: string | null;
  recipientName: string;
  onNext: () => void;
  themeConfig?: ThemeConfig;
}

export function MusicScene({
  musicUrl,
  musicName,
  recipientName,
  onNext,
  themeConfig,
}: MusicSceneProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const theme = themeConfig || getThemeConfig("sky-clouds");
  const emojis = theme.floatingEmojis;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

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
        .catch((err) => console.warn("Playback error:", err));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between items-center py-12 px-4 sm:px-6 ${theme.bgGradient} ${theme.titleText} overflow-hidden`}>
      {/* Audio element (no autoplay) */}
      {musicUrl && <audio ref={audioRef} src={musicUrl} preload="metadata" />}

      {/* Floating Atmosphere */}
      <div className="absolute top-10 left-8 text-3xl pointer-events-none opacity-80 animate-float-slow">{emojis[0]}</div>
      <div className="absolute bottom-16 right-10 text-3xl pointer-events-none opacity-80 animate-float-delayed">{emojis[1]}</div>

      {/* Header Label */}
      <div className="pt-4 text-center space-y-1">
        <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${theme.pillText} ${theme.pillBg} px-4 py-1.5 rounded-full border ${theme.pillBorder} shadow-sm backdrop-blur-md`}>
          A LITTLE SOUNDTRACK
        </span>
        <h2 className={`font-serif text-3xl sm:text-4xl font-bold ${theme.titleText}`}>
          Press play for me
        </h2>
        <p className={`text-xs sm:text-sm ${theme.mutedText} max-w-sm mx-auto`}>
          A special birthday song for {recipientName}'s celebration.
        </p>
      </div>

      {/* Center Vinyl Soundtrack Card */}
      <div className="relative z-10 my-auto w-full max-w-sm text-center">
        <div className={`${theme.cardBg} backdrop-blur-md p-6 sm:p-8 rounded-3xl border ${theme.cardBorder} ${theme.cardShadow} space-y-6`}>
          {/* Vinyl Record */}
          <div className="relative py-2 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{
                duration: 4,
                repeat: isPlaying ? Infinity : 0,
                ease: "linear",
              }}
              className="w-36 h-36 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 border-4 border-slate-700 shadow-2xl flex items-center justify-center relative overflow-hidden"
            >
              <div className="w-28 h-28 rounded-full border border-slate-700/60 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-slate-700/60 flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-full ${theme.iconBg} flex items-center justify-center ${theme.iconColor} text-xs font-bold shadow-inner`}>
                    <Disc className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Equalizer Spectrum Bars */}
            <div className="flex items-center gap-1.5 h-6 mt-6">
              {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3].map((val, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    height: isPlaying ? [6, 24, 10, 28, 6] : 6,
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: isPlaying ? Infinity : 0,
                    delay: idx * 0.1,
                  }}
                  className={`w-1.5 ${theme.iconBg} rounded-full`}
                />
              ))}
            </div>
          </div>

          {/* Song Name & Progress Bar (If music exists) */}
          {musicUrl ? (
            <div className="space-y-4">
              <div className={`text-xs font-semibold ${theme.bodyText} truncate px-2 flex items-center justify-center gap-1.5`}>
                <Music className={`w-3.5 h-3.5 ${theme.accentText} shrink-0`} />
                <span className="truncate">{musicName || "Birthday Song"}</span>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-sky-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className={`flex justify-between text-[11px] font-mono ${theme.mutedText}`}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={togglePlay}
                variant="outline"
                className={`w-full gap-2 text-sm ${theme.secondaryBtnBorder} ${theme.secondaryBtnBg} ${theme.secondaryBtnText} font-semibold shadow-sm rounded-xl py-5`}
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
          ) : (
            <div className={`text-xs ${theme.mutedText} py-2 italic`}>
              Music wasn't added to this surprise.
            </div>
          )}

          {/* Continue Button */}
          <Button
            size="lg"
            onClick={onNext}
            className={`w-full gap-2 text-base py-5 ${theme.primaryBtnBg} ${theme.primaryBtnText} ${theme.primaryBtnShadow} font-semibold rounded-xl`}
          >
            <span>Continue →</span>
          </Button>
        </div>
      </div>

      <div className="pb-4" />
    </div>
  );
}
