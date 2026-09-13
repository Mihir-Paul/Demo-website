import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GiftBuilderShell } from "@/components/builder/GiftBuilderShell";

export default function CreateSurprisePage() {
  return (
    <div className="relative min-h-screen bg-[#EEF8FF] text-[#26364A] dark:bg-[#0B111D] dark:text-slate-100 py-8 px-4 sm:px-6 transition-colors duration-300">
      {/* Subtle Ambient Glows */}
      <div className="ambient-glow-sky top-[5%] left-[10%] opacity-50 pointer-events-none" />
      <div className="ambient-glow-purple bottom-[10%] right-[10%] opacity-50 pointer-events-none" />
      <div className="ambient-glow-pink top-[40%] right-[5%] opacity-40 pointer-events-none" />

      {/* Floating Edge Decorations */}
      <div className="absolute top-12 left-8 text-3xl animate-float pointer-events-none opacity-80 z-0 select-none">🎈</div>
      <div className="absolute top-28 right-10 text-3xl animate-float-slow pointer-events-none opacity-80 z-0 select-none">☁️</div>
      <div className="absolute bottom-20 left-10 text-2xl animate-pulse-slow pointer-events-none opacity-80 z-0 select-none">🎁</div>

      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#1688D4] to-[#8FCBF5] dark:from-[#A99AF4] dark:to-[#E7A6B7] flex items-center justify-center text-white dark:text-[#0B111D] shadow-md shadow-[#1688D4]/20 dark:shadow-[#A99AF4]/10">
              <Gift className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-serif font-bold text-xl text-[#26364A] dark:text-slate-100">
              Surprise Creator
            </span>
            <ThemeToggle className="ml-2" />
          </div>
        </div>

        {/* Page Heading */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#26364A] dark:text-slate-100 tracking-tight">
            Craft a Birthday Experience
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Create a personalized digital story they'll remember forever.
          </p>
        </div>

        {/* Creator Shell Panel Card */}
        <div className="bg-white border border-[#1688D4]/20 shadow-xl shadow-[#1688D4]/5 dark:bg-[#101827] dark:border-white/10 dark:shadow-2xl dark:shadow-black/60 rounded-3xl p-6 sm:p-8 transition-colors duration-300">
          <Suspense
            fallback={
              <div className="p-12 text-center text-slate-400 text-sm">
                Loading Birthday Creator...
              </div>
            }
          >
            <GiftBuilderShell />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
