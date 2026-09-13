import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GiftBuilderShell } from "@/components/builder/GiftBuilderShell";

export default function CreateSurprisePage() {
  return (
    <div className="relative min-h-screen bg-midnight-950 text-slate-100 py-10 px-4 sm:px-6">
      {/* Background ambient glows */}
      <div className="ambient-glow-pink top-[5%] left-[10%] opacity-30 pointer-events-none" />
      <div className="ambient-glow-purple bottom-[10%] right-[10%] opacity-30 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-3xl space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Gift className="w-4 h-4" />
            </div>
            <span className="font-serif font-semibold text-lg text-white">
              Surprise Creator
            </span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Craft a Birthday Experience
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Create a personalized digital story they'll remember forever.
          </p>
        </div>

        {/* Main Builder Wizard Shell */}
        <Suspense
          fallback={
            <div className="glass-card p-12 text-center text-slate-400 text-sm">
              Loading Builder...
            </div>
          }
        >
          <GiftBuilderShell />
        </Suspense>
      </div>
    </div>
  );
}
