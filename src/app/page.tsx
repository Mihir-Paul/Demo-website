"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Gift, Camera, MessageSquare, ArrowRight, Cake, PartyPopper, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EEF8FF] text-[#26364A] dark:bg-[#0B111D] dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      {/* Subtle Ambient Glows */}
      <div className="ambient-glow-sky top-[-100px] left-1/4 opacity-60 pointer-events-none" />
      <div className="ambient-glow-purple top-[20%] right-[-100px] opacity-60 pointer-events-none" />
      <div className="ambient-glow-pink bottom-[15%] left-[-100px] opacity-50 pointer-events-none" />

      {/* Edge Birthday Decorations (Soft Pastel Floating Elements) */}
      <div className="absolute top-24 left-8 sm:left-16 text-3xl sm:text-4xl animate-float pointer-events-none opacity-80 z-0 select-none">🎈</div>
      <div className="absolute top-36 right-10 sm:right-20 text-3xl sm:text-4xl animate-float-slow pointer-events-none opacity-80 z-0 select-none">☁️</div>
      <div className="absolute top-[50%] left-8 text-2xl sm:text-3xl animate-pulse-slow pointer-events-none opacity-80 z-0 select-none">🎁</div>
      <div className="absolute top-[35%] right-8 text-2xl sm:text-3xl animate-float pointer-events-none opacity-80 z-0 select-none">🌸</div>
      <div className="absolute bottom-32 right-16 text-2xl sm:text-3xl animate-float-slow pointer-events-none opacity-80 z-0 select-none">🧁</div>
      <div className="absolute bottom-48 left-12 text-2xl animate-pulse-slow pointer-events-none opacity-80 z-0 select-none">✨</div>

      {/* Header Navigation */}
      <header className="relative z-20 mx-auto w-full max-w-7xl px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1688D4] to-[#8FCBF5] dark:from-[#A99AF4] dark:to-[#E7A6B7] flex items-center justify-center text-white dark:text-[#0B111D] shadow-lg shadow-[#1688D4]/20 dark:shadow-[#A99AF4]/10 group-hover:scale-105 transition-transform">
            <Gift className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#26364A] dark:text-slate-100">
            JoyCraft
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300 font-medium mr-2">
            <a href="#" className="hover:text-[#1688D4] dark:hover:text-[#A99AF4] transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-[#1688D4] dark:hover:text-[#A99AF4] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#1688D4] dark:hover:text-[#A99AF4] transition-colors">Features</a>
          </div>

          <Link href="/dashboard" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Dashboard
            </Button>
          </Link>

          <Link href="/create">
            <Button variant="primary" size="sm" className="gap-2 rounded-xl">
              Create a Surprise <Sparkles className="w-4 h-4" />
            </Button>
          </Link>

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </nav>
      </header>

      {/* Main Centered Hero Section (REFERENCE 3 LAYOUT) */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-20 flex-1 flex flex-col items-center">
        
        {/* CENTERED HERO CONTAINER */}
        <div className="max-w-4xl mx-auto text-center space-y-8 py-6 sm:py-10">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1688D4]/20 bg-white/80 dark:border-white/10 dark:bg-[#151E2D]/80 px-4 py-1.5 text-xs font-semibold text-[#26364A] dark:text-slate-300 backdrop-blur-md shadow-sm">
            <span className="text-[#1688D4] dark:text-[#A99AF4]">✦</span>
            <span>INTERACTIVE DIGITAL BIRTHDAY PLATFORM FOR FRIENDS & FAMILY</span>
            <span className="text-[#1688D4] dark:text-[#A99AF4]">✦</span>
          </div>

          {/* Main Editorial Serif Heading with Multi-Color Birthday Gradient */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#26364A] dark:text-[#F8FAFC] leading-[1.12]">
            Create an Unforgettable <br />
            <span className="bg-gradient-to-r from-[#1688D4] via-[#8E7CC3] to-[#E85D83] dark:from-[#A99AF4] dark:via-[#E7A6B7] dark:to-[#F1D9A6] bg-clip-text text-transparent">
              Birthday Experience
            </span>
          </h1>

          {/* Centered Supporting Paragraph */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Turn your favorite memories and messages into a little birthday world they'll never forget.
          </p>

          {/* Centered Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/create">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2.5 text-base py-6 px-8 bg-[#1688D4] hover:bg-[#0284c7] text-white shadow-lg shadow-[#1688D4]/20 dark:bg-[#A99AF4] dark:hover:bg-[#b8abf6] dark:text-[#0B111D] dark:shadow-[#A99AF4]/15 font-bold rounded-2xl"
              >
                Create a Surprise <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="glass" size="lg" className="w-full sm:w-auto py-6 px-8 text-[#26364A] dark:text-slate-200 rounded-2xl">
                ▶ See How It Works
              </Button>
            </a>
          </div>

        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full pt-24 space-y-12 scroll-mt-24">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1688D4] bg-[#1688D4]/10 border border-[#1688D4]/20 dark:text-[#A99AF4] dark:bg-[#A99AF4]/10 dark:border-[#A99AF4]/20 px-3.5 py-1 rounded-full">
              Simple 3-Step Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#26364A] dark:text-slate-100">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-lg dark:bg-[#101827] dark:border-white/10 dark:shadow-xl space-y-4 relative">
              <span className="font-serif text-5xl font-bold text-[#1688D4]/30 dark:text-[#8FAED8]/40">01</span>
              <h3 className="font-serif text-xl font-bold text-[#26364A] dark:text-slate-100">Personalize</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Add their name, favorite photos, heartfelt note, and your birthday wish.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-lg dark:bg-[#101827] dark:border-white/10 dark:shadow-xl space-y-4 relative">
              <span className="font-serif text-5xl font-bold text-[#8E7CC3]/30 dark:text-[#A99AF4]/40">02</span>
              <h3 className="font-serif text-xl font-bold text-[#26364A] dark:text-slate-100">Create</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Build a little interactive birthday experience with custom themes and PIN protection.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-lg dark:bg-[#101827] dark:border-white/10 dark:shadow-xl space-y-4 relative">
              <span className="font-serif text-5xl font-bold text-[#E85D83]/30 dark:text-[#E7A6B7]/40">03</span>
              <h3 className="font-serif text-xl font-bold text-[#26364A] dark:text-slate-100">Share</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Send them their private surprise link and let them unwrap their digital story.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id="features" className="w-full pt-24 pb-16 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8E7CC3] bg-[#8E7CC3]/10 border border-[#8E7CC3]/20 dark:text-[#F1D9A6] dark:bg-[#F1D9A6]/10 dark:border-[#F1D9A6]/20 px-3.5 py-1 rounded-full">
              Interactive Story World
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#26364A] dark:text-slate-100">
              Designed For Moments That Matter
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-7 transition-transform hover:-translate-y-1 space-y-3.5 border border-slate-200/80 shadow-lg dark:bg-[#101827] dark:border-white/10 dark:shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#1688D4]/15 text-[#1688D4] dark:bg-[#8FAED8]/15 dark:text-[#8FAED8] flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#26364A] dark:text-slate-100">📸 Captured Memories</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Turn your favorite moments into an interactive memory wall with camera flash reveals.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 transition-transform hover:-translate-y-1 space-y-3.5 border border-slate-200/80 shadow-lg dark:bg-[#101827] dark:border-white/10 dark:shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#8E7CC3]/15 text-[#8E7CC3] dark:bg-[#F1D9A6]/15 dark:text-[#F1D9A6] flex items-center justify-center">
                <Cake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#26364A] dark:text-slate-100">🎂 Make a Wish</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Let them make a birthday wish and trigger a celebratory candle blow-out burst.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 transition-transform hover:-translate-y-1 space-y-3.5 border border-slate-200/80 shadow-lg dark:bg-[#101827] dark:border-white/10 dark:shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#E85D83]/15 text-[#E85D83] dark:bg-[#E7A6B7]/15 dark:text-[#E7A6B7] flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#26364A] dark:text-slate-100">💌 A Special Message</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Leave them a personal note in a digital envelope that they unseal along the way.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 transition-transform hover:-translate-y-1 space-y-3.5 border border-slate-200/80 shadow-lg dark:bg-[#101827] dark:border-white/10 dark:shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#1688D4]/15 text-[#1688D4] dark:bg-[#A99AF4]/15 dark:text-[#A99AF4] flex items-center justify-center">
                <PartyPopper className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#26364A] dark:text-slate-100">🎉 Interactive Celebration</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                More than a static greeting card — something they can actually step into and experience.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Footer Banner */}
        <section className="w-full max-w-4xl mx-auto py-12">
          <div className="bg-white border border-[#1688D4]/20 shadow-xl dark:bg-[#101827] dark:border-white/10 dark:shadow-2xl rounded-3xl p-8 sm:p-12 text-center space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#26364A] dark:text-slate-100">
              Ready to Make Their Day Unforgettable?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
              It only takes a few minutes to create a personalized interactive birthday surprise.
            </p>
            <Link href="/create" className="inline-block">
              <Button
                size="lg"
                className="gap-2.5 text-base py-6 px-8 bg-[#1688D4] hover:bg-[#0284c7] text-white shadow-lg shadow-[#1688D4]/20 dark:bg-[#A99AF4] dark:hover:bg-[#b8abf6] dark:text-[#0B111D] dark:shadow-[#A99AF4]/15 font-bold rounded-2xl"
              >
                Create a Surprise Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0B111D] py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} JoyCraft. Universal digital birthday experiences.</p>
      </footer>
    </div>
  );
}
