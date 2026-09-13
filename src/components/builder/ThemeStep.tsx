import React from "react";
import { Palette, Check, Cloud, PartyPopper, Sparkles } from "lucide-react";
import { GiftTheme } from "@/types/gift";

interface ThemeStepProps {
  theme: GiftTheme;
  onChange: (theme: GiftTheme) => void;
}

export function ThemeStep({ theme, onChange }: ThemeStepProps) {
  const themes: Array<{
    id: GiftTheme;
    title: string;
    description: string;
    gradient: string;
    border: string;
    badge: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "sky-clouds",
      title: "Sky Clouds ☁️",
      description: "Airy light sky blue, soft clouds, and gentle violet accents.",
      gradient: "from-sky-400 via-cyan-400 to-indigo-500",
      border: "border-[#8FAED8]",
      badge: "Default",
      icon: <Cloud className="w-4 h-4 text-white" />,
    },
    {
      id: "festive-party",
      title: "Festive Party 🎉",
      description: "Bright cheerful balloons, confetti, and golden party sparkles.",
      gradient: "from-amber-400 via-rose-500 to-pink-500",
      border: "border-[#E7A6B7]",
      badge: "Festive",
      icon: <PartyPopper className="w-4 h-4 text-white" />,
    },
    {
      id: "midnight-celebration",
      title: "Midnight Celebration ✨",
      description: "Deep starlight night sky with cozy golden evening glows.",
      gradient: "from-indigo-600 via-purple-600 to-slate-900",
      border: "border-[#A99AF4]",
      badge: "Starlight",
      icon: <Sparkles className="w-4 h-4 text-white" />,
    },
  ];

  return (
    <div className="space-y-6 opacity-100">
      <div className="border-b border-[#D7E8F5] dark:border-[#29374A] pb-4">
        <h2 className="text-xl font-bold text-[#26364A] dark:text-[#F5F7FA] font-serif flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-[#8E7CC3]/10 border border-[#8E7CC3]/30 text-[#8E7CC3] dark:bg-[#A99AF4]/15 dark:border-[#A99AF4]/30 dark:text-[#A99AF4] flex items-center justify-center text-sm shadow-sm">
            🎨
          </span>
          Choose the mood
        </h2>
        <p className="text-xs text-[#60758D] dark:text-[#A8B6C8] mt-1.5 leading-relaxed font-normal">
          Select a visual atmosphere for your recipient's digital birthday world.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map((t) => {
          const isSelected = theme === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`text-left p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? `bg-[#F7FBFF] border-[#1688D4] dark:bg-[#151F2E] dark:${t.border} ring-2 ring-[#1688D4]/20 dark:ring-[#A99AF4]/40 shadow-lg scale-[1.02]`
                  : "bg-white border-[#D7E8F5] hover:border-[#1688D4] dark:bg-[#111A29] dark:border-[#29374A] dark:hover:border-[#A99AF4]"
              }`}
            >
              {/* Top Banner Preview */}
              <div
                className={`w-full h-16 rounded-xl bg-gradient-to-tr ${t.gradient} mb-4 relative flex items-center justify-between p-3 shadow-md`}
              >
                <div className="p-1.5 rounded-lg bg-black/30 backdrop-blur">
                  {t.icon}
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#1688D4] dark:bg-[#A99AF4] text-white dark:text-[#0B111D] flex items-center justify-center shadow">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-sm text-[#26364A] dark:text-[#F5F7FA]">
                    {t.title}
                  </h3>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#1688D4]/10 text-[#1688D4] dark:bg-white/10 dark:text-slate-200">
                    {t.badge}
                  </span>
                </div>
                <p className="text-xs text-[#60758D] dark:text-[#A8B6C8] leading-relaxed">
                  {t.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
