import { GiftTheme } from "@/types/gift";

export interface ThemeConfig {
  id: GiftTheme;
  name: string;
  
  // Page background & ambient glows
  bgGradient: string;
  glow1: string;
  glow2: string;
  glow3: string;
  
  // Progress indicators
  progressActive: string;
  progressPassed: string;
  progressUpcoming: string;
  
  // Main Card Surface
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  
  // Inner / Secondary Surfaces
  innerCardBg: string;
  innerCardBorder: string;
  
  // Typography
  titleText: string;
  headingGradient: string;
  bodyText: string;
  mutedText: string;
  accentText: string;
  
  // Badges & Pills
  pillBg: string;
  pillBorder: string;
  pillText: string;
  
  // Buttons
  primaryBtnBg: string;
  primaryBtnHover: string;
  primaryBtnText: string;
  primaryBtnShadow: string;
  
  secondaryBtnBg: string;
  secondaryBtnBorder: string;
  secondaryBtnText: string;
  
  // Icon / Graphic accents
  iconBg: string;
  iconColor: string;
  
  // Floating Background Emojis
  floatingEmojis: [string, string, string, string, string, string];
}

const THEME_CONFIGS: Record<GiftTheme, ThemeConfig> = {
  "sky-clouds": {
    id: "sky-clouds",
    name: "Sky Clouds",
    bgGradient: "bg-gradient-to-b from-[#F0F9FF] via-[#EEF7FF] to-[#E0F2FE]",
    glow1: "bg-sky-200/40",
    glow2: "bg-blue-200/30",
    glow3: "bg-pink-200/25",
    progressActive: "w-8 bg-[#1688D4]",
    progressPassed: "w-3 bg-sky-300",
    progressUpcoming: "w-2 bg-slate-300/60",
    cardBg: "bg-white/90 backdrop-blur-md",
    cardBorder: "border-sky-200/70",
    cardShadow: "shadow-xl shadow-sky-500/10",
    innerCardBg: "bg-sky-50/80",
    innerCardBorder: "border-sky-100",
    titleText: "text-slate-800",
    headingGradient: "bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500",
    bodyText: "text-slate-700",
    mutedText: "text-slate-600",
    accentText: "text-sky-600",
    pillBg: "bg-white/80 backdrop-blur-md",
    pillBorder: "border-sky-200/60",
    pillText: "text-sky-600",
    primaryBtnBg: "bg-gradient-to-r from-sky-500 to-indigo-600",
    primaryBtnHover: "hover:from-sky-600 hover:to-indigo-700",
    primaryBtnText: "text-white",
    primaryBtnShadow: "shadow-xl shadow-sky-500/25",
    secondaryBtnBg: "bg-white/80 hover:bg-white",
    secondaryBtnBorder: "border-sky-200",
    secondaryBtnText: "text-sky-700",
    iconBg: "bg-gradient-to-tr from-sky-400 via-indigo-500 to-sky-500",
    iconColor: "text-white",
    floatingEmojis: ["🎈", "☁️", "🎁", "🌸", "🧁", "✨"],
  },
  "festive-party": {
    id: "festive-party",
    name: "Festive Party",
    bgGradient: "bg-gradient-to-b from-[#FFF0F4] via-[#FFE4E9] to-[#FFD8E0]",
    glow1: "bg-rose-300/40",
    glow2: "bg-amber-300/35",
    glow3: "bg-pink-300/30",
    progressActive: "w-8 bg-[#E85D83]",
    progressPassed: "w-3 bg-rose-300",
    progressUpcoming: "w-2 bg-rose-200/60",
    cardBg: "bg-white/95 backdrop-blur-md",
    cardBorder: "border-[#F9C0CE]",
    cardShadow: "shadow-xl shadow-rose-500/10",
    innerCardBg: "bg-[#FFF5F7]",
    innerCardBorder: "border-[#FAD2DC]",
    titleText: "text-[#2D1A24]",
    headingGradient: "bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500",
    bodyText: "text-slate-800",
    mutedText: "text-rose-700/70",
    accentText: "text-[#E85D83]",
    pillBg: "bg-white/90 backdrop-blur-md",
    pillBorder: "border-rose-200",
    pillText: "text-[#E85D83]",
    primaryBtnBg: "bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500",
    primaryBtnHover: "hover:opacity-95",
    primaryBtnText: "text-white",
    primaryBtnShadow: "shadow-xl shadow-rose-500/25",
    secondaryBtnBg: "bg-white hover:bg-rose-50",
    secondaryBtnBorder: "border-rose-200",
    secondaryBtnText: "text-rose-700",
    iconBg: "bg-gradient-to-tr from-rose-400 via-pink-500 to-amber-400",
    iconColor: "text-white",
    floatingEmojis: ["🎈", "🎉", "🎁", "🥳", "🧁", "🎊"],
  },
  "midnight-celebration": {
    id: "midnight-celebration",
    name: "Midnight Celebration",
    bgGradient: "bg-gradient-to-b from-[#0B111D] via-[#111A29] to-[#192436]",
    glow1: "bg-indigo-900/40",
    glow2: "bg-purple-900/35",
    glow3: "bg-amber-500/10",
    progressActive: "w-8 bg-[#A99AF4]",
    progressPassed: "w-3 bg-[#A99AF4]/50",
    progressUpcoming: "w-2 bg-slate-700/60",
    cardBg: "bg-[#151F2E]/90 backdrop-blur-md",
    cardBorder: "border-[#29374A]",
    cardShadow: "shadow-2xl shadow-indigo-950/50",
    innerCardBg: "bg-[#0F1724]",
    innerCardBorder: "border-[#243347]",
    titleText: "text-[#F5F7FA]",
    headingGradient: "bg-gradient-to-r from-[#A99AF4] via-purple-300 to-[#F1D9A6]",
    bodyText: "text-[#D1D9E6]",
    mutedText: "text-[#8FAED8]",
    accentText: "text-[#F1D9A6]",
    pillBg: "bg-[#1D2B3F]/90 backdrop-blur-md",
    pillBorder: "border-[#A99AF4]/30",
    pillText: "text-[#F1D9A6]",
    primaryBtnBg: "bg-gradient-to-r from-[#8E7CC3] via-[#A99AF4] to-indigo-500",
    primaryBtnHover: "hover:opacity-95",
    primaryBtnText: "text-white font-bold",
    primaryBtnShadow: "shadow-xl shadow-indigo-950/60",
    secondaryBtnBg: "bg-[#151F2E] hover:bg-[#1C2A3E]",
    secondaryBtnBorder: "border-[#29374A]",
    secondaryBtnText: "text-[#A99AF4]",
    iconBg: "bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-400",
    iconColor: "text-white",
    floatingEmojis: ["✨", "⭐", "🌟", "🌙", "💫", "🌌"],
  },
};

export function getThemeConfig(themeId?: string | null): ThemeConfig {
  const normalized = (themeId || "").trim();

  // Legacy mappings if any exist in old rows
  if (normalized === "sky-cloud" || normalized === "sky" || normalized === "dreamy") {
    return THEME_CONFIGS["sky-clouds"];
  }
  if (normalized === "festive" || normalized === "party") {
    return THEME_CONFIGS["festive-party"];
  }
  if (normalized === "midnight" || normalized === "starlight" || normalized === "night") {
    return THEME_CONFIGS["midnight-celebration"];
  }

  if (normalized in THEME_CONFIGS) {
    return THEME_CONFIGS[normalized as GiftTheme];
  }

  if (normalized.length > 0) {
    console.error(
      `[ThemeError] Unknown theme identifier "${themeId}". Valid theme IDs are: "sky-clouds", "festive-party", "midnight-celebration".`
    );
  }

  return THEME_CONFIGS["sky-clouds"];
}
