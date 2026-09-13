import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { ThemeConfig, getThemeConfig } from "@/lib/themeConfig";

interface UnlockAnimSceneProps {
  onComplete: () => void;
  themeConfig?: ThemeConfig;
}

export function UnlockAnimScene({ onComplete, themeConfig }: UnlockAnimSceneProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const theme = themeConfig || getThemeConfig("sky-clouds");

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center text-center p-6 space-y-6 ${theme.bgGradient} ${theme.titleText}`}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1], opacity: 1, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`w-24 h-24 rounded-3xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center shadow-2xl`}
      >
        <motion.div
          animate={{ scale: [1, 0, 1] }}
          transition={{ duration: 1.2, times: [0, 0.5, 1] }}
        >
          <Gift className="w-12 h-12" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className={`font-serif text-2xl font-bold ${theme.titleText}`}>
          Unlocking Your Birthday Surprise... 🔑
        </h2>
        <p className={`text-xs ${theme.accentText} font-medium animate-pulse`}>
          Opening a world of memories & wishes!
        </p>
      </motion.div>
    </div>
  );
}
