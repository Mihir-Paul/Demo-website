import Link from "next/link";
import { Sparkles, Heart, Gift, Lock, Camera, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-midnight-950 text-slate-100 flex flex-col justify-between">
      {/* Background Glows */}
      <div className="ambient-glow-pink top-[-100px] left-1/2 -translate-x-1/2 opacity-70" />
      <div className="ambient-glow-purple bottom-[-100px] right-[-100px] opacity-50" />

      {/* Header Navigation */}
      <header className="relative z-10 mx-auto w-full max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-white">
            JoyCraft
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="primary" size="sm" className="gap-2">
              Create Surprise <Sparkles className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 mx-auto w-full max-w-4xl px-6 py-12 md:py-20 text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 backdrop-blur-md mb-6 animate-pulse-slow">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>100% Free Interactive Digital Birthday Platform</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
          Unwrap Unforgettable <br />
          <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-200 bg-clip-text text-transparent">
            Birthday Memories
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10">
          Craft personalized, magical birthday journeys with custom love notes, photo memory galleries, secret wishes, and PIN protection.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/create" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-3 text-base shadow-xl shadow-rose-500/30">
              Create a Birthday Surprise <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/g/demo" className="w-full sm:w-auto">
            <Button variant="glass" size="lg" className="w-full sm:w-auto">
              View Sample Experience
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left w-full">
          <div className="glass-card rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-white mb-2">Memory Gallery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curate cherished photos with heartfelt captions that unfold in an interactive story format.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4 border border-pink-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-white mb-2">Letter & Wishes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Write an emotional birthday letter and attach custom wishes for the recipient to discover.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-white mb-2">PIN Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure your intimate surprise stays private between you and the birthday recipient with a secure PIN.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} JoyCraft. Crafted with ❤️ for memorable moments.</p>
      </footer>
    </div>
  );
}
