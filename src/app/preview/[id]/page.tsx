"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Gift,
  Share2,
  Lock,
  Eye,
  CheckCircle2,
  Copy,
  ArrowLeft,
  Heart,
  Camera,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PreviewSurprisePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [gift, setGift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    if (id === "test" || id === "demo") {
      // Mock data for test preview
      setGift({
        id: "test-id",
        slug: "demo-sarah",
        recipientName: "Sarah",
        message: "Happy 25th Birthday! Wishing you a magic day! 🎉",
        letter: "Dear Sarah, you make every day brighter. Thank you for being an amazing friend!",
        theme: "sunset-glow",
        hasPin: true,
        status: "DRAFT",
        photos: [
          { id: "p1", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800", caption: "Beach vacation memories!" },
        ],
        wishes: [
          { id: "w1", text: "Wishing you infinite happiness and adventures!" },
          { id: "w2", text: "May all your big dreams take flight this year!" },
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
        setShareUrl(`${window.location.origin}/g/demo-sarah`);
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
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 animate-spin text-rose-400" />
          <span>Loading Surprise Preview...</span>
        </div>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen bg-midnight-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-card p-8 rounded-2xl max-w-md">
          <h2 className="text-xl font-serif text-rose-400 mb-2">Preview Error</h2>
          <p className="text-xs text-slate-400 mb-6">{error || "Gift not found"}</p>
          <Link href="/create">
            <Button variant="primary">Create New Surprise</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-midnight-950 text-slate-100 py-8 px-4 sm:px-6">
      <div className="ambient-glow-pink top-[10%] left-[20%] opacity-30" />

      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        {/* Preview Top Banner */}
        <div className="glass-card p-6 rounded-2xl border-rose-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-white">
                  Preview: Surprise for {gift.recipientName}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    gift.status === "PUBLISHED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {gift.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Review your digital story before sharing it with {gift.recipientName}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Link href="/create">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Edit Details
              </Button>
            </Link>

            {gift.status !== "PUBLISHED" ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handlePublish}
                disabled={publishing}
                className="gap-2 shadow-lg shadow-rose-500/25"
              >
                <Sparkles className="w-4 h-4" />{" "}
                {publishing ? "Publishing..." : "Publish Surprise"}
              </Button>
            ) : (
              <Link href={`/g/${gift.slug}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" /> Open Recipient Page
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Shareable Link Alert (If Published) */}
        {shareUrl && (
          <div className="glass-card p-6 rounded-2xl border-emerald-500/40 bg-emerald-500/5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5" /> Surprise Published & Ready to Share!
            </div>
            <p className="text-xs text-slate-300">
              Send this private link to {gift.recipientName}:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full rounded-xl bg-slate-950 px-4 py-2.5 text-xs text-slate-200 border border-slate-800 font-mono"
              />
              <Button variant="primary" size="sm" onClick={handleCopyLink} className="gap-1.5 shrink-0">
                <Copy className="w-4 h-4" /> {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
        )}

        {/* Live Story Preview Card Container */}
        <div className="mx-auto max-w-md rounded-3xl border border-rose-500/30 bg-midnight-900 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 shadow-lg shadow-rose-500/40 text-white">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">
              Happy Birthday, {gift.recipientName}! 🎉
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{gift.message}"
            </p>
          </div>

          {/* Letter Section */}
          {gift.letter && (
            <Card className="p-4 rounded-xl bg-slate-900/80 border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 mb-2">
                <Heart className="w-4 h-4 text-rose-400" /> A Personal Note
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {gift.letter}
              </p>
            </Card>
          )}

          {/* Photo Section */}
          {gift.photos && gift.photos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Camera className="w-4 h-4 text-amber-400" /> Photo Memories
              </div>
              {gift.photos.map((photo: any, index: number) => (
                <div
                  key={photo.id || index}
                  className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || "Memory"}
                    className="w-full h-48 object-cover"
                  />
                  {photo.caption && (
                    <div className="p-3 text-xs text-slate-400 italic text-center">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Wishes Section */}
          {gift.wishes && gift.wishes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Birthday Wishes
              </div>
              <ul className="space-y-2">
                {gift.wishes.map((wish: any, index: number) => (
                  <li
                    key={wish.id || index}
                    className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-200 flex items-start gap-2"
                  >
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{wish.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Security Badge */}
          {gift.hasPin && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              <Lock className="w-3.5 h-3.5" /> PIN Code Protected Experience
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
