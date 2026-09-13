"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Gift,
  Lock,
  Camera,
  MessageSquare,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";

export default function CreateSurprisePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [letter, setLetter] = useState("");
  const [theme, setTheme] = useState("sunset-glow");
  const [pin, setPin] = useState("");

  const [photos, setPhotos] = useState<Array<{ url: string; caption: string }>>([
    { url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800", caption: "Unforgettable birthday memories!" },
  ]);

  const [wishes, setWishes] = useState<string[]>([
    "Wishing you a year filled with love and laughter! 🎉",
    "May all your dreams come true today! ✨",
  ]);

  const handleAddPhoto = () => {
    setPhotos([...photos, { url: "", caption: "" }]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handlePhotoChange = (index: number, field: "url" | "caption", value: string) => {
    const updated = [...photos];
    updated[index][field] = value;
    setPhotos(updated);
  };

  const handleAddWish = () => {
    setWishes([...wishes, ""]);
  };

  const handleRemoveWish = (index: number) => {
    setWishes(wishes.filter((_, i) => i !== index));
  };

  const handleWishChange = (index: number, value: string) => {
    const updated = [...wishes];
    updated[index] = value;
    setWishes(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recipientName.trim()) {
      setError("Please enter the recipient's name");
      return;
    }

    if (!message.trim()) {
      setError("Please write a main birthday message");
      return;
    }

    setLoading(true);

    try {
      const validPhotos = photos.filter((p) => p.url.trim().length > 0);
      const validWishes = wishes.filter((w) => w.trim().length > 0);

      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: recipientName.trim(),
          message: message.trim(),
          letter: letter.trim() || undefined,
          theme,
          pin: pin.trim() || undefined,
          photos: validPhotos,
          wishes: validWishes.map((w) => ({ text: w })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create surprise draft");
      }

      // Navigate to preview page
      router.push(`/preview/${data.gift.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-midnight-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="ambient-glow-pink top-[5%] left-[10%] opacity-40" />
      <div className="ambient-glow-purple bottom-[10%] right-[10%] opacity-40" />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-rose-400" />
            <span className="font-serif font-semibold text-lg text-white">
              Surprise Creator
            </span>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            Craft a Birthday Experience
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Fill in the details below to create an interactive digital story for your recipient.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Recipient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-400">
                <Heart className="w-5 h-5" /> 1. Recipient & Core Message
              </CardTitle>
              <CardDescription>
                Who is this surprise for and what is your main birthday message?
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="Recipient's Name *"
                placeholder="e.g. Sarah, Alex, Mom..."
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />

              <Textarea
                label="Main Birthday Headline / Short Message *"
                placeholder="Happy 25th Birthday! Wishing you the happiest day ever! 🎉"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                required
              />
            </div>
          </Card>

          {/* Step 2: Birthday Letter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-400">
                <MessageSquare className="w-5 h-5" /> 2. Personal Letter (Optional)
              </CardTitle>
              <CardDescription>
                Write a heartfelt letter or longer note that the recipient can unwrap.
              </CardDescription>
            </CardHeader>
            <div>
              <Textarea
                label="Heartfelt Letter"
                placeholder="Dear Sarah, over the past years, you've brought so much warmth and light into my life..."
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                rows={6}
              />
            </div>
          </Card>

          {/* Step 3: Photo Memories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Camera className="w-5 h-5" /> 3. Memory Gallery (Photos)
              </CardTitle>
              <CardDescription>
                Add image URLs and sweet captions to build a photo gallery story.
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 relative"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Photo #{index + 1}</span>
                    {photos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <Input
                    placeholder="Image URL (e.g. https://...)"
                    value={photo.url}
                    onChange={(e) => handlePhotoChange(index, "url", e.target.value)}
                  />
                  <Input
                    placeholder="Caption (e.g. That trip to the beach last summer!)"
                    value={photo.caption}
                    onChange={(e) => handlePhotoChange(index, "caption", e.target.value)}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPhoto}
                className="w-full gap-2 border-dashed"
              >
                <Plus className="w-4 h-4" /> Add Another Photo
              </Button>
            </div>
          </Card>

          {/* Step 4: Special Wishes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-5 h-5" /> 4. Birthday Wishes
              </CardTitle>
              <CardDescription>
                Add bullet-point birthday wishes or blessings.
              </CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {wishes.map((wish, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Wish #${index + 1}...`}
                    value={wish}
                    onChange={(e) => handleWishChange(index, e.target.value)}
                  />
                  {wishes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveWish(index)}
                      className="p-2 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddWish}
                className="w-full gap-2 border-dashed"
              >
                <Plus className="w-4 h-4" /> Add Another Wish
              </Button>
            </div>
          </Card>

          {/* Step 5: Theme & PIN */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Lock className="w-5 h-5" /> 5. Theme & PIN Security
              </CardTitle>
              <CardDescription>
                Select a visual theme and optionally protect this gift with a passcode.
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-rose-300/80 mb-2">
                  Visual Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "sunset-glow", label: "Sunset Glow", color: "from-rose-500 to-amber-500" },
                    { id: "midnight-stars", label: "Midnight Stars", color: "from-purple-600 to-indigo-600" },
                    { id: "rose-romance", label: "Rose Romance", color: "from-pink-500 to-rose-400" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                        theme === t.id
                          ? "border-rose-400 bg-rose-500/20 text-white"
                          : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span>{t.label}</span>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${t.color}`} />
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Passcode / PIN (Optional)"
                type="password"
                placeholder="4-digit PIN (e.g. 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
          </Card>

          {/* Submit Action */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full sm:w-auto gap-2 min-w-[200px]"
            >
              {loading ? (
                <span>Creating Draft...</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Preview Surprise
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
