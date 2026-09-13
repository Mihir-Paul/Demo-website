"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderProgress } from "./BuilderProgress";
import { RecipientStep } from "./RecipientStep";
import { MemoriesStep } from "./MemoriesStep";
import { LetterStep } from "./LetterStep";
import { WishesStep } from "./WishesStep";
import { ThemeStep } from "./ThemeStep";
import { PinStep } from "./PinStep";
import { ReviewStep } from "./ReviewStep";
import { MusicStep } from "./MusicStep";
import { GiftBuilderState, GiftPhotoDraft } from "@/types/gift";
import { uploadFile } from "@/lib/upload";
import { safeFetchJson } from "@/lib/utils";

const LOCAL_STORAGE_KEY = "joycraft_gift_builder_draft";

const STEPS = [
  { number: 1, label: "Recipient" },
  { number: 2, label: "Memories" },
  { number: 3, label: "Soundtrack" },
  { number: 4, label: "Letter" },
  { number: 5, label: "Wishes" },
  { number: 6, label: "Theme" },
  { number: 7, label: "Secret PIN" },
  { number: 8, label: "Review" },
];

const DEFAULT_STATE: GiftBuilderState = {
  recipientName: "",
  message: "",
  photos: [],
  letter: "",
  wishes: [],
  theme: "sky-clouds",
  pin: "",
  pinHint: "",
  musicFile: null,
  musicPreviewUrl: null,
  musicUrl: null,
  musicName: null,
  musicUploadStatus: "idle",
};

export function GiftBuilderShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftIdParam = searchParams.get("draftId");

  const [currentStep, setCurrentStep] = useState(1);
  const [giftId, setGiftId] = useState<string | null>(draftIdParam);
  const [state, setState] = useState<GiftBuilderState>(DEFAULT_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // 1. Recover state from localStorage on initial render
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.state) {
          const loadedMusicUrl = parsed.state.musicUrl || null;
          setState((prev) => ({
            ...prev,
            ...parsed.state,
            photos: (parsed.state.photos || []).map((p: any) => {
              const url = p.storedUrl;
              return {
                id: p.id,
                previewUrl: p.previewUrl,
                storedUrl: url,
                caption: p.caption || "",
                order: p.order || 0,
                uploadStatus: url ? "uploaded" : "pending",
              };
            }),
            musicUrl: loadedMusicUrl,
            musicName: parsed.state.musicName || null,
            musicUploadStatus: loadedMusicUrl ? "uploaded" : "idle",
          }));
        }
        if (parsed.giftId) setGiftId(parsed.giftId);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      }
    } catch (e) {
      console.warn("Failed to load cached draft from localStorage", e);
    }
  }, []);

  // 2. Backup state to localStorage (stripping non-serializable File handles)
  useEffect(() => {
    try {
      const stateToCache = {
        ...state,
        photos: state.photos.map((p) => ({
          id: p.id,
          previewUrl: p.previewUrl,
          storedUrl: p.storedUrl,
          caption: p.caption,
          order: p.order,
          uploadStatus: p.uploadStatus,
        })),
        musicFile: undefined,
        musicPreviewUrl: undefined,
      };
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ state: stateToCache, giftId, currentStep })
      );
    } catch (e) {
      console.warn("Failed to backup draft to localStorage", e);
    }
  }, [state, giftId, currentStep]);

  // Validation per step
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!state.recipientName.trim()) {
        newErrors.recipientName = "Please enter the recipient's name.";
      }
      if (!state.message.trim()) {
        newErrors.message = "Please enter a birthday message.";
      }
    }

    if (stepNumber === 4) {
      if (state.letter && state.letter.length > 3000) {
        newErrors.letter = "Letter cannot exceed 3000 characters";
      }
    }

    if (stepNumber === 7) {
      if (state.pin && !/^\d{4}$/.test(state.pin)) {
        newErrors.pin = "PIN must be exactly 4 numeric digits (0-9)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload pending photos to persistent cloud storage
  const uploadPendingPhotos = async (): Promise<GiftPhotoDraft[]> => {
    const updatedPhotos = [...state.photos];

    for (let i = 0; i < updatedPhotos.length; i++) {
      const photo = updatedPhotos[i];

      if (photo.file && photo.uploadStatus !== "uploaded") {
        updatedPhotos[i] = { ...photo, uploadStatus: "uploading", uploadError: undefined };
        setState((prev) => ({ ...prev, photos: [...updatedPhotos] }));

        try {
          const url = await uploadFile(photo.file);
          updatedPhotos[i] = {
            ...photo,
            storedUrl: url,
            uploadStatus: "uploaded",
          };
          setState((prev) => ({ ...prev, photos: [...updatedPhotos] }));
        } catch (err: any) {
          console.warn(`Upload failed for photo ${photo.id}:`, err);
          updatedPhotos[i] = {
            ...photo,
            uploadStatus: "error",
            uploadError: err.message || "Photo upload failed. Please try again.",
          };
          setState((prev) => ({ ...prev, photos: [...updatedPhotos] }));
        }
      }
    }

    return updatedPhotos;
  };

  // Upload pending music to persistent cloud storage
  const uploadPendingMusic = async (): Promise<string | null> => {
    if (state.musicFile && state.musicUploadStatus !== "uploaded") {
      setState((prev) => ({ ...prev, musicUploadStatus: "uploading", musicUploadError: undefined }));

      try {
        const url = await uploadFile(state.musicFile);

        setState((prev) => ({
          ...prev,
          musicUrl: url,
          musicUploadStatus: "uploaded",
        }));
        return url;
      } catch (err: any) {
        console.warn("Music upload failed:", err);
        setState((prev) => ({
          ...prev,
          musicUploadStatus: "error",
          musicUploadError: err.message || "Music upload failed. Please try again.",
        }));
        return null;
      }
    }

    return state.musicUrl || null;
  };

  const handleRetrySinglePhoto = async (photoId: string) => {
    const index = state.photos.findIndex((p) => p.id === photoId);
    if (index === -1) return;

    const photo = state.photos[index];
    if (!photo.file) return;

    const updated = [...state.photos];
    updated[index] = { ...photo, uploadStatus: "uploading", uploadError: undefined };
    setState({ ...state, photos: updated });

    try {
      const url = await uploadFile(photo.file);
      updated[index] = { ...photo, storedUrl: url, uploadStatus: "uploaded" };
      setState({ ...state, photos: updated });
    } catch (err: any) {
      updated[index] = { ...photo, uploadStatus: "error", uploadError: err.message || "Photo upload failed." };
      setState({ ...state, photos: updated });
    }
  };

  // Sync draft data to backend API
  const saveToBackend = async (): Promise<string | null> => {
    setSaving(true);
    setSaveSuccessMsg(null);

    try {
      const currentPhotos = await uploadPendingPhotos();
      const storedMusicUrl = await uploadPendingMusic();

      const validPhotosPayload = currentPhotos
        .map((p, idx) => {
          const finalUrl = p.storedUrl || p.previewUrl;
          return {
            url: finalUrl.trim(),
            caption: p.caption.trim(),
            order: idx,
          };
        })
        .filter((p) => p.url.length > 0);

      const validWishesPayload = state.wishes
        .filter((w) => w.trim().length > 0)
        .map((w, idx) => ({ text: w.trim(), order: idx }));

      const payload = {
        recipientName: state.recipientName.trim(),
        message: state.message.trim(),
        letter: state.letter.trim() || undefined,
        theme: state.theme,
        pin: state.pin.trim() || undefined,
        pinHint: state.pinHint.trim() || undefined,
        musicUrl: storedMusicUrl || null,
        musicName: state.musicName || null,
        photos: validPhotosPayload,
        wishes: validWishesPayload,
      };

      if (giftId) {
        const data = await safeFetchJson(`/api/gifts/${giftId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setSaveSuccessMsg("Draft saved!");
        setTimeout(() => setSaveSuccessMsg(null), 3000);
        return giftId;
      } else {
        const data = await safeFetchJson("/api/gifts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const newId = data.gift.id;
        setGiftId(newId);
        setSaveSuccessMsg("Draft created!");
        setTimeout(() => setSaveSuccessMsg(null), 3000);
        return newId;
      }
    } catch (err: any) {
      console.error(err);
      setErrors({ global: err.message || "Failed to save draft" });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep >= 1 && currentStep <= 7) {
      await saveToBackend();
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber < currentStep || validateStep(currentStep)) {
      setCurrentStep(stepNumber);
    }
  };

  const handleExplicitSave = async () => {
    if (!validateStep(currentStep)) return;
    await saveToBackend();
  };

  const handlePreview = async () => {
    if (!validateStep(currentStep)) return;
    const targetId = await saveToBackend();
    if (targetId) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      router.push(`/preview/${targetId}`);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Progress Bar */}
      <BuilderProgress
        currentStep={currentStep}
        steps={STEPS}
        onStepClick={handleStepClick}
      />

      {/* Save Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-[#E6F9F0] border border-[#A2E9C8] text-xs font-semibold text-[#0E7044] dark:bg-[#0F2D1F] dark:border-[#1E5C3F] dark:text-[#52D696] text-center shadow-sm opacity-100">
          {saveSuccessMsg}
        </div>
      )}

      {/* Global Error Banner */}
      {errors.global && (
        <div className="p-4 rounded-xl bg-[#FFF0F2] border border-[#F2A5B0] text-xs font-medium text-[#A83B4A] dark:bg-[#2A1720] dark:border-[#6B3542] dark:text-[#F0A7B2] shadow-sm opacity-100 flex items-center justify-between gap-3">
          <span>{errors.global}</span>
          <button
            type="button"
            onClick={() => setErrors({})}
            className="text-xs font-bold underline shrink-0 hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Animated Step Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && (
            <RecipientStep
              recipientName={state.recipientName}
              message={state.message}
              onChange={(fields) => setState({ ...state, ...fields })}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <MemoriesStep
              photos={state.photos}
              onChange={(photos) => setState({ ...state, photos })}
              onRetryUpload={handleRetrySinglePhoto}
            />
          )}

          {currentStep === 3 && (
            <MusicStep
              musicFile={state.musicFile}
              musicPreviewUrl={state.musicPreviewUrl}
              musicUrl={state.musicUrl}
              musicName={state.musicName}
              uploadStatus={state.musicUploadStatus}
              uploadError={state.musicUploadError}
              onChange={(musicData) => setState({ ...state, ...musicData })}
            />
          )}

          {currentStep === 4 && (
            <LetterStep
              letter={state.letter}
              onChange={(letter) => setState({ ...state, letter })}
              error={errors.letter}
            />
          )}

          {currentStep === 5 && (
            <WishesStep
              wishes={state.wishes}
              onChange={(wishes) => setState({ ...state, wishes })}
            />
          )}

          {currentStep === 6 && (
            <ThemeStep
              theme={state.theme}
              onChange={(theme) => setState({ ...state, theme })}
            />
          )}

          {currentStep === 7 && (
            <PinStep
              pin={state.pin}
              pinHint={state.pinHint}
              onChange={(fields) => setState({ ...state, ...fields })}
              error={errors.pin}
            />
          )}

          {currentStep === 8 && (
            <ReviewStep
              state={state}
              onEditStep={(stepNum) => setCurrentStep(stepNum)}
              onSaveDraft={handleExplicitSave}
              onPreview={handlePreview}
              isSaving={saving}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Step Navigation Footer (Steps 1 to 7) */}
      {currentStep < 8 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#D7E8F5] dark:border-[#29374A]">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`gap-2 text-[#60758D] hover:text-[#26364A] dark:text-slate-300 dark:hover:text-white ${currentStep === 1 ? "invisible" : ""}`}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleExplicitSave}
              disabled={saving}
              className="gap-1.5 hidden sm:inline-flex"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Draft"}
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              disabled={saving}
              className={`gap-2 shadow-lg shadow-[#1688D4]/15 dark:shadow-[#A99AF4]/15 bg-[#1688D4] hover:bg-[#0284c7] text-white dark:bg-[#A99AF4] dark:hover:bg-[#b8abf6] dark:text-[#0B111D] font-bold ${
                currentStep === 1 ? "w-full sm:w-auto text-base py-3 px-8" : ""
              }`}
            >
              {saving ? "Uploading & Saving..." : currentStep === 1 ? "Continue →" : "Next Step"}{" "}
              {currentStep > 1 && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
