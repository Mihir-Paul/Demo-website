"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Share2,
  Copy,
  ArrowLeft,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipientExperienceShell, GiftData } from "@/components/gift/RecipientExperienceShell";

export default function PreviewSurprisePage() {
  const params = useParams();
  const id = params?.id as string;

  const [gift, setGift] = useState<GiftData & { status?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    if (id === "test" || id === "demo") {
      setGift({
        id: "test-id",
        slug: "demo-sarah",
        recipientName: "Birthday Star",
        message: "Wishing you the happiest birthday ever! May your year ahead be full of magic, laughter, and joy!",
        letter:
          "Happy Birthday!\n\nI wanted to create something truly special for your birthday to remind you of how wonderful you are...\n\nThank you for bringing so much light into all of our lives. Here's to another amazing year!",
        theme: "sky-clouds",
        hasPin: true,
        pinHint: "Something only we know",
        status: "DRAFT",
        photos: [
          {
            id: "p1",
            url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800",
            caption: "Unforgettable birthday moments!",
          },
          {
            id: "p2",
            url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800",
            caption: "Celebrations & good times ✨",
          },
        ],
        wishes: [
          { id: "w1", text: "Endless joy and laughter all year round 🌟" },
          { id: "w2", text: "New adventures and wonderful memories ✈️" },
          { id: "w3", text: "Your happiest and brightest year yet ✨" },
        ],
      });
      setLoading(false);
      return;
    }

    async function fetchGift() {
      try {
        const res = await fetch(`/api/gifts/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load gift preview");
        setGift(data.gift);
        if (data.gift.status === "PUBLISHED") {
          setShareUrl(`${window.location.origin}/g/${data.gift.slug}`);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load surprise draft");
      } finally {
        setLoading(false);
      }
    }

    fetchGift();
  }, [id]);

  const handlePublish = async () => {
    if (!gift) return;
    setPublishing(true);
    setError(null);

    try {
      if (id === "test" || id === "demo") {
        const url = `${window.location.origin}/g/demo-sarah`;
        setShareUrl(url);
        setGift({ ...gift, status: "PUBLISHED" });
        return;
      }

      const res = await fetch(`/api/gifts/${id}/publish`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to publish gift");

      setGift({ ...gift, status: "PUBLISHED" });
      const fullUrl = `${window.location.origin}${data.gift.shareUrl}`;
      setShareUrl(fullUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to publish surprise");
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center text-slate-600">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 animate-spin text-sky-500" />
          <span className="font-serif font-medium">Loading Birthday Experience...</span>
        </div>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md border border-sky-100">
          <h2 className="text-xl font-serif text-slate-800 mb-2">Preview Error</h2>
          <p className="text-xs text-slate-500 mb-6">{error || "Gift not found"}</p>
          <Link href="/create">
            <Button variant="primary">Create New Surprise</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Unobtrusive Floating Creator Preview Controls */}
      <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Left Badge */}
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md text-slate-100 px-3 py-1.5 rounded-full shadow-lg border border-slate-700/60 flex items-center gap-2 text-xs font-semibold">
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span>PREVIEW</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Right Floating Actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          <Link href={`/create?draftId=${gift.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 border-sky-200 shadow-md text-xs gap-1.5 rounded-full"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Edit
            </Button>
          </Link>

          {gift.status !== "PUBLISHED" ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublish}
              disabled={publishing}
              className="bg-sky-600 hover:bg-sky-700 text-white shadow-md text-xs gap-1.5 rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {publishing ? "Publishing..." : "Publish"}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopyLink}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md text-xs gap-1.5 rounded-full"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Share Link"}
            </Button>
          )}
        </div>
      </div>

      {/* Published Share Toast Banner */}
      {shareUrl && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
          <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> Birthday Surprise is Live & Published!
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full rounded-xl bg-slate-950 px-3 py-1.5 text-[11px] text-slate-300 border border-slate-800 font-mono"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleCopyLink}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs shrink-0 rounded-xl"
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Full Viewport Recipient Birthday Experience */}
      <RecipientExperienceShell gift={gift} isUnlockedDefault={true} />
    </div>
  );
}
