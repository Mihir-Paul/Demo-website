"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sparkles, Gift } from "lucide-react";
import { RecipientExperienceShell, GiftData } from "@/components/gift/RecipientExperienceShell";

export default function RecipientExperiencePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    if (slug === "test" || slug === "demo" || slug === "demo-sarah") {
      // Demo mock data
      setGift({
        id: "demo-id",
        slug: "demo-sarah",
        recipientName: "Birthday Star",
        message: "Happy Birthday! Wishing you a bright year ahead full of warmth and laughter! 🎉",
        letter:
          "Happy Birthday!\n\nOn this special day, I wanted to create a small digital memory book just for you. Thank you for always bringing joy to everyone around you. Hope this year is your best one yet!",
        theme: "sky-clouds",
        pinHint: "Year we met (e.g. 1234)",
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
      setLoading(false);
      return;
    }

    async function fetchPublicGift() {
      try {
        const res = await fetch(`/api/gifts?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Surprise not found");
        setGift(data.gift);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Could not find this birthday surprise");
      } finally {
        setLoading(false);
      }
    }

    fetchPublicGift();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center text-slate-600">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 animate-spin text-sky-500" />
          <span className="font-serif font-medium text-sm">Preparing your birthday surprise...</span>
        </div>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl max-w-md border border-sky-100 shadow-xl">
          <Gift className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-slate-800 mb-2">Surprise Not Found</h2>
          <p className="text-xs text-slate-500">
            {error || "This surprise link may be invalid or expired."}
          </p>
        </div>
      </div>
    );
  }

  return <RecipientExperienceShell gift={gift} />;
}

