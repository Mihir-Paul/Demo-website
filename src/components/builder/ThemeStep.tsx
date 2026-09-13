import React from "react";
import { Palette, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  }> = [
    {
      id: "dreamy",
      title: "Dreamy Atmosphere",
      description: "Soft violet, magenta, and ethereal glowing accents.",
      gradient: "from-purple-600 via-pink-600 to-indigo-700",
      border: "border-purple-500/40",
      badge: "Default",
    },
    {
      id: "romantic",
      title: "Romantic Rose",
      description: "Deep crimson, passionate rose gold, and soft candlelit warmth.",
      gradient: "from-rose-600 via-red-600 to-pink-700",
      border: "border-rose-500/40",
      badge: "Popular",
    },
    {
      id: "celebration",
      title: "Festive Celebration",
      description: "Vibrant golden confetti, bright pink, and sparkling joy.",
      gradient: "from-amber-500 via-rose-500 to-pink-500",
      border: "border-amber-500/40",
      badge: "Festive",
    },
  ];

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <CardHeader className="p-0 border-b border-slate-800 pb-4">
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Palette className="w-5 h-5" /> Choose the mood
        </CardTitle>
        <CardDescription>
          Select a visual theme atmosphere for your recipient's digital experience.
        </CardDescription>
      </CardHeader>

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
                  ? `bg-slate-900/90 ${t.border} ring-2 ring-rose-500/50 shadow-xl shadow-rose-500/10`
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              {/* Top Color Banner Preview */}
              <div
                className={`w-full h-16 rounded-xl bg-gradient-to-tr ${t.gradient} mb-4 relative flex items-center justify-end p-3 shadow-md`}
              >
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-white text-slate-950 flex items-center justify-center shadow">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-serif font-bold text-sm text-white">
                    {t.title}
                  </h4>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    {t.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
