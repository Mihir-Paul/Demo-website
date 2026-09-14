import React from "react";
import { Gift, Camera, Music, MessageSquare, Sparkles, Palette, Lock, ArrowLeft, Eye, Save } from "lucide-react";
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
    "sky-clouds": "Sky Clouds ☁️",
    "festive-party": "Festive Party 🎉",
    "midnight-celebration": "Midnight Celebration ✨",
  };

  const hasPhotos = state.photos.length > 0;
  const activeMusicUrl = state.musicUrl || state.musicPreviewUrl;

  return (
    <div className="space-y-6 opacity-100">
      <div className="border-b border-slate-200 dark:border-[#29374A] pb-4">
        <h2 className="text-2xl font-bold text-[#26364A] dark:text-[#F5F7FA] font-serif flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-[#1688D4]/15 border border-[#1688D4]/30 text-[#1688D4] dark:bg-[#A99AF4]/20 dark:border-[#A99AF4]/40 dark:text-[#A99AF4] flex items-center justify-center text-base shrink-0 shadow-sm">
            🎉
          </span>
          Your surprise is ready!
        </h2>
        <p className="text-xs sm:text-sm text-[#60758D] dark:text-[#A8B6C8] mt-1.5 leading-relaxed font-normal">
          Review your birthday gift details below before previewing or publishing.
        </p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Step 1: Recipient */}
        <div className="p-4 rounded-2xl bg-[#F7FBFF] border border-[#D7E8F5] dark:bg-[#172235] dark:border-[#29374A] space-y-1.5 opacity-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1688D4] dark:text-[#8FAED8] flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#1688D4] dark:text-[#8FAED8]" /> Recipient
            </span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-[11px] text-[#1688D4] dark:text-[#A99AF4] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-[#26364A] dark:text-[#F5F7FA]">
            {state.recipientName.trim() || "No recipient name yet"}
          </p>
          <p className="text-xs text-[#60758D] dark:text-[#A8B6C8] italic line-clamp-1">
            {state.message.trim() ? `"${state.message.trim()}"` : "No message added"}
          </p>
        </div>

        {/* Step 2: Memories */}
        <div className="p-4 rounded-2xl bg-[#F7FBFF] border border-[#D7E8F5] dark:bg-[#172235] dark:border-[#29374A] space-y-1.5 opacity-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E7CC3] dark:text-[#F1D9A6] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#8E7CC3] dark:text-[#F1D9A6]" /> Memories
            </span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-[11px] text-[#1688D4] dark:text-[#A99AF4] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-[#26364A] dark:text-[#F5F7FA]">
            {hasPhotos ? `${state.photos.length} photo${state.photos.length > 1 ? "s" : ""} added` : "No photos added"}
          </p>
          <p className="text-xs text-[#60758D] dark:text-[#A8B6C8]">
            {hasPhotos ? "Photo memory gallery ready" : "No photos added"}
          </p>
        </div>

        {/* Step 3: Soundtrack */}
        <div className="p-4 rounded-2xl bg-[#F7FBFF] border border-[#D7E8F5] dark:bg-[#172235] dark:border-[#29374A] space-y-1.5 opacity-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1688D4] dark:text-[#A99AF4] flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-[#1688D4] dark:text-[#A99AF4]" /> Soundtrack
            </span>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-[11px] text-[#1688D4] dark:text-[#A99AF4] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-[#26364A] dark:text-[#F5F7FA] truncate">
            {state.musicName || (activeMusicUrl ? "Custom Song Uploaded 🎵" : "Default Birthday Track 🎵")}
          </p>
          {activeMusicUrl && (
            <div className="pt-1">
              <audio controls src={activeMusicUrl} className="w-full h-8" />
            </div>
          )}
        </div>

        {/* Step 4: Birthday Note / Letter */}
        <div className="p-4 rounded-2xl bg-[#F7FBFF] border border-[#D7E8F5] dark:bg-[#172235] dark:border-[#29374A] space-y-1.5 opacity-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#E85D83] dark:text-[#E7A6B7] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#E85D83] dark:text-[#E7A6B7]" /> Birthday Note
            </span>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-[11px] text-[#1688D4] dark:text-[#A99AF4] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-[#26364A] dark:text-[#F5F7FA]">
            {state.letter?.trim() ? `${state.letter.trim().length} characters` : "No birthday note added"}
          </p>
          <p className="text-xs text-[#60758D] dark:text-[#A8B6C8]">
            {state.letter?.trim() ? "Special note attached" : "No birthday note added"}
          </p>
        </div>

        {/* Step 5: Wishes */}
        <div className="p-4 rounded-2xl bg-[#F7FBFF] border border-[#D7E8F5] dark:bg-[#172235] dark:border-[#29374A] space-y-1.5 opacity-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E7CC3] dark:text-[#F1D9A6] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8E7CC3] dark:text-[#F1D9A6]" /> Wishes
            </span>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              className="text-[11px] text-[#1688D4] dark:text-[#A99AF4] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-[#26364A] dark:text-[#F5F7FA]">
            {state.wishes.length > 0 ? `${state.wishes.length} wishes added` : "No wishes added"}
          </p>
          <p className="text-xs text-[#60758D] dark:text-[#A8B6C8]">
            {state.wishes.length > 0 ? "Birthday blessings attached" : "No wishes added"}
          </p>
        </div>

        {/* Step 6: Theme */}
        <div className="p-4 rounded-2xl bg-[#F7FBFF] border border-[#D7E8F5] dark:bg-[#172235] dark:border-[#29374A] space-y-1.5 opacity-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1688D4] dark:text-[#A99AF4] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#1688D4] dark:text-[#A99AF4]" /> Theme
            </span>
            <button
              type="button"
              onClick={() => onEditStep(6)}
              className="text-[11px] text-[#1688D4] dark:text-[#A99AF4] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-[#26364A] dark:text-[#F5F7FA]">
            {themeLabels[state.theme] || state.theme}
          </p>
        </div>

        {/* Step 7: PIN */}
        <div className="p-4 rounded-2xl bg-[#F7FBFF] border border-[#D7E8F5] dark:bg-[#172235] dark:border-[#29374A] space-y-1.5 sm:col-span-2 opacity-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1688D4] dark:text-[#8FAED8] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#1688D4] dark:text-[#8FAED8]" /> Secret PIN
            </span>
            <button
              type="button"
              onClick={() => onEditStep(7)}
              className="text-[11px] text-[#1688D4] dark:text-[#A99AF4] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="font-serif font-bold text-base text-[#26364A] dark:text-[#F5F7FA]">
            {state.pin ? "•••• Passcode Configured" : "None"}
          </p>
          {state.pinHint && (
            <p className="text-xs text-[#60758D] dark:text-[#A8B6C8] italic">Hint: "{state.pinHint}"</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onEditStep(7)}
          className="w-full sm:w-auto gap-2 text-[#26364A] dark:text-[#F5F7FA]"
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
            className="w-full sm:w-auto gap-2"
          >
            <Eye className="w-4 h-4" /> Preview Surprise
          </Button>
        </div>
      </div>
    </div>
  );
}
