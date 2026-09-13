"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Sparkles,
  Gift,
  Lock,
  Heart,
  Camera,
  MessageSquare,
  PartyPopper,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RecipientExperiencePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [gift, setGift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PIN Unlock State
  const [isLocked, setIsLocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  // Story Unfolding State
  const [step, setStep] = useState<"welcome" | "unwrapped">("welcome");

  useEffect(() => {
    if (!slug) return;

    if (slug === "test" || slug === "demo" || slug === "demo-sarah") {
      // Demo mock data
      setGift({
        id: "demo-id",
        slug: "demo-sarah",
        recipientName: "Sarah",
        message: "Happy 25th Birthday! Wishing you a bright year ahead full of warmth and laughter! 🎉",
        letter:
          "Dear Sarah,\n\nOn this special day, I wanted to create a small digital memory book just for you. Thank you for always bringing joy to everyone around you. Hope your 25th year is the best one yet!",
        theme: "sunset-glow",
        hasPin: true,
        photos: [
          {
            id: "p1",
            url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800",
            caption: "Cherished moments from our trip!",
          },
          {
            id: "p2",
            url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
            caption: "Celebrating another amazing milestone!",
          },
        ],
        wishes: [
          { id: "w1", text: "Endless laughter and genuine smiles every single day!" },
          { id: "w2", text: "Courage to pursue all your wildest dreams and passions." },
          { id: "w3", text: "Unforgettable adventures and sweet memories." },
        ],
      });
      setIsLocked(true);
      setLoading(false);
      return;
    }

    async function fetchPublicGift() {
      try {
        const res = await fetch(`/api/gifts?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Surprise not found");
        setGift(data.gift);
        setIsLocked(Boolean(data.gift.hasPin));
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Could not find this birthday surprise");
      } finally {
        setLoading(false);
      }
    }

    fetchPublicGift();
  }, [slug]);

  const handleUnlockPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    if (!enteredPin.trim()) {
      setPinError("Please enter the PIN");
      return;
    }

    setUnlocking(true);

    try {
      if (slug === "test" || slug === "demo" || slug === "demo-sarah") {
        if (enteredPin === "1234" || enteredPin.length >= 4) {
          setIsLocked(false);
          setStep("unwrapped");
        } else {
          setPinError("Incorrect PIN. Try 1234 for demo.");
        }
        setUnlocking(false);
        return;
      }

      const res = await fetch(`/api/gifts/${gift.id}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: enteredPin.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.unlocked) {
        throw new Error(data.error || "Incorrect PIN code");
      }

      setIsLocked(false);
      setStep("unwrapped");
    } catch (err: any) {
      setPinError(err.message || "Failed to verify PIN");
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 animate-spin text-rose-400" />
          <span>Preparing your birthday surprise...</span>
        </div>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center p-6 text-center">
        <div className="glass-card p-8 rounded-2xl max-w-md">
          <Gift className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-white mb-2">Surprise Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">
            {error || "This surprise link may be invalid or expired."}
          </p>
        </div>
      </div>
    );
  }

  // Locked Overlay Screen
  if (isLocked) {
    return (
      <div className="relative min-h-screen bg-midnight-950 text-slate-100 flex items-center justify-center p-4 sm:p-6">
        <div className="ambient-glow-pink top-[20%] left-[30%] opacity-40" />

        <div className="relative z-10 w-full max-w-sm glass-card p-8 rounded-3xl text-center space-y-6 border-rose-500/30">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-white">
              Surprise for {gift.recipientName}!
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              This digital gift is PIN protected. Enter your passcode to unwrap.
            </p>
          </div>

          <form onSubmit={handleUnlockPin} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN..."
              className="text-center font-mono text-lg tracking-widest"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              error={pinError || undefined}
            />

            <Button
              type="submit"
              size="lg"
              disabled={unlocking}
              className="w-full gap-2 text-sm shadow-xl shadow-rose-500/30"
            >
              <KeyRound className="w-4 h-4" />{" "}
              {unlocking ? "Unlocking..." : "Unwrap Gift"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-midnight-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="ambient-glow-pink top-[10%] left-[10%] opacity-50" />
      <div className="ambient-glow-purple bottom-[10%] right-[10%] opacity-40" />

      <div className="relative z-10 mx-auto max-w-lg space-y-8">
        {step === "welcome" ? (
          /* Initial Welcome Stage */
          <div className="glass-card p-8 sm:p-10 rounded-3xl text-center space-y-6 border-rose-500/30">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-rose-500/40 animate-float">
              <PartyPopper className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-widest">
                A Special Birthday Message For You
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Happy Birthday, {gift.recipientName}! 🎈
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{gift.message}"
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => setStep("unwrapped")}
              className="w-full gap-2 text-base py-4 shadow-xl shadow-rose-500/30"
            >
              <Sparkles className="w-5 h-5" /> Open Your Digital Surprise
            </Button>
          </div>
        ) : (
          /* Full Interactive Story Stage */
          <div className="space-y-8 animate-fade-in">
            {/* Header Greeting */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl text-center space-y-3 border-rose-500/30">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Celebrating {gift.recipientName} ✨
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {gift.message}
              </p>
            </div>

            {/* Letter Section */}
            {gift.letter && (
              <Card className="p-6 sm:p-8 rounded-3xl glass-card space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-rose-300 border-b border-slate-800 pb-3">
                  <Heart className="w-4 h-4 text-rose-400" /> A Heartfelt Note
                </div>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-serif">
                  {gift.letter}
                </p>
              </Card>
            )}

            {/* Photo Memories */}
            {gift.photos && gift.photos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest px-2">
                  <Camera className="w-4 h-4 text-amber-400" /> Memory Gallery
                </div>

                {gift.photos.map((photo: any, idx: number) => (
                  <div
                    key={photo.id || idx}
                    className="glass-card rounded-3xl overflow-hidden p-3 border-slate-800 space-y-3"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || "Birthday Memory"}
                      className="w-full h-64 sm:h-72 object-cover rounded-2xl"
                    />
                    {photo.caption && (
                      <p className="text-center text-xs text-slate-300 italic px-2">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Birthday Wishes */}
            {gift.wishes && gift.wishes.length > 0 && (
              <Card className="p-6 sm:p-8 rounded-3xl glass-card space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300 border-b border-slate-800 pb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Special Wishes
                </div>
                <div className="space-y-3">
                  {gift.wishes.map((wish: any, idx: number) => (
                    <div
                      key={wish.id || idx}
                      className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-slate-200 flex items-start gap-3"
                    >
                      <span className="text-emerald-400 font-bold text-base">•</span>
                      <span className="leading-relaxed">{wish.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Footer Branding */}
            <div className="text-center py-6 text-xs text-slate-500 space-y-2">
              <p>Made with ❤️ using JoyCraft</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
