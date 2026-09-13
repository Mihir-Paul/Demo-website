import React from "react";
import { CheckCircle, Heart, Camera, MessageSquare, Sparkles, Palette, Lock, ArrowLeft, Eye, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GiftBuilderState } from "@/types/gift";

interface ReviewStepProps {
  state: GiftBuilderState;
  onEditStep: (stepNumber: number) => void;
  onSaveDraft: () => void;
  onPreview: () => void;
  isSaving: boolean;
}

export function ReviewStep({
  state,
  onEditStep,
  onSaveDraft,
  onPreview,
  isSaving,
}: ReviewStepProps) {
  const themeLabels: Record<string, string> = {
    dreamy: "Dreamy Atmosphere",
    romantic: "Romantic Rose",
    celebration: "Festive Celebration",
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <CardHeader className="p-0 border-b border-slate-800 pb-4">
        <CardTitle className="flex items-center gap-2 text-rose-400">
          <CheckCircle className="w-5 h-5" /> Your surprise is ready
        </CardTitle>
        <CardDescription>
          Review your gift details below before previewing or saving your draft.
        </CardDescription>
      </CardHeader>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recipient */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Recipient
            </span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-[11px] text-slate-400 hover:text-white underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-white">
            {state.recipientName || "—"}
          </p>
          <p className="text-xs text-slate-400 italic line-clamp-1">
            "{state.message || "—"}"
          </p>
        </div>

        {/* Memories */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" /> Memories
            </span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-[11px] text-slate-400 hover:text-white underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-white">
            {state.photos.length} photos added
          </p>
          <p className="text-xs text-slate-400">
            {state.photos.length > 0 ? "Photo gallery story ready" : "No photos attached"}
          </p>
        </div>

        {/* Letter */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-pink-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-pink-400" /> Personal Letter
            </span>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-[11px] text-slate-400 hover:text-white underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-white">
            {state.letter ? `${state.letter.length} characters` : "None"}
          </p>
          <p className="text-xs text-slate-400">
            {state.letter ? "Heartfelt note ready" : "No letter added"}
          </p>
        </div>

        {/* Wishes */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Wishes
            </span>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-[11px] text-slate-400 hover:text-white underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-white">
            {state.wishes.length} wishes added
          </p>
          <p className="text-xs text-slate-400">
            {state.wishes.length > 0 ? "Blessings attached" : "No wishes added"}
          </p>
        </div>

        {/* Theme */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" /> Theme
            </span>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              className="text-[11px] text-slate-400 hover:text-white underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-white capitalize">
            {themeLabels[state.theme] || state.theme}
          </p>
        </div>

        {/* PIN */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" /> Passcode PIN
            </span>
            <button
              type="button"
              onClick={() => onEditStep(6)}
              className="text-[11px] text-slate-400 hover:text-white underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-white">
            {state.pin ? "•••• Configured" : "None"}
          </p>
          {state.pinHint && (
            <p className="text-xs text-slate-400 italic">Hint: "{state.pinHint}"</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onEditStep(6)}
          className="w-full sm:w-auto gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Edit Details
        </Button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="secondary"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="w-full sm:w-auto gap-2"
          >
            <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Draft"}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={onPreview}
            disabled={isSaving}
            className="w-full sm:w-auto gap-2 shadow-xl shadow-rose-500/30"
          >
            <Eye className="w-4 h-4" /> Preview Surprise
          </Button>
        </div>
      </div>
    </Card>
  );
}
