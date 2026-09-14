"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderProgress } from "./BuilderProgress";
import { RecipientStep } from "./RecipientStep";
import { MemoriesStep } from "./MemoriesStep";
import { MusicStep } from "./MusicStep";
import { LetterStep } from "./LetterStep";
import { WishesStep } from "./WishesStep";
import { ThemeStep } from "./ThemeStep";
import { PinStep } from "./PinStep";
import { ReviewStep } from "./ReviewStep";
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
  musicUrl: "",
  musicName: "",
  musicUploadStatus: "pending",
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
          const rawWishes = parsed.state.wishes || [];
          const normalizedWishes: string[] = rawWishes.map((w: any) =>
            typeof w === "string" ? w : (w?.text || "")
          );

          const recoveredMusicUrl =
            parsed.state.musicUrl && !parsed.state.musicUrl.startsWith("blob:")
              ? parsed.state.musicUrl
              : "";

          setState((prev) => ({
            ...prev,
            ...parsed.state,
            wishes: normalizedWishes,
            photos: (parsed.state.photos || []).map((p: any) => {
              const url = p.storedUrl;
              return {
                id: p.id,
                previewUrl: p.previewUrl && !p.previewUrl.startsWith("blob:") ? p.previewUrl : "",
                storedUrl: url,
                caption: p.caption || "",
                order: p.order || 0,
                uploadStatus: url ? "uploaded" : "pending",
              };
            }),
            musicUrl: recoveredMusicUrl,
            musicPreviewUrl: undefined, // Never restore blob: URLs as previewUrl
            musicName: parsed.state.musicName || "",
            musicUploadStatus: recoveredMusicUrl ? "uploaded" : "pending",
          }));
        }
        if (parsed.giftId) setGiftId(parsed.giftId);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      }
    } catch (e) {
      console.warn("Failed to load cached draft from localStorage", e);
    }
  }, []);

  // 2. Backup state to localStorage (stripping non-serializable File handles and blob: URLs)
  useEffect(() => {
    try {
      const stateToCache = {
        ...state,
        photos: state.photos.map((p) => ({
          id: p.id,
          previewUrl: p.previewUrl && !p.previewUrl.startsWith("blob:") ? p.previewUrl : "",
          storedUrl: p.storedUrl,
          caption: p.caption,
          order: p.order,
          uploadStatus: p.uploadStatus,
        })),
        musicUrl: state.musicUrl && !state.musicUrl.startsWith("blob:") ? state.musicUrl : "",
        musicPreviewUrl: undefined, // Never cache blob: object URLs
        musicFile: undefined,
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

  // Immediate Soundtrack Upload handler
  const handleSelectMusicFile = async (file: File) => {
    const localPreviewUrl = URL.createObjectURL(file);
    setState((prev) => ({
      ...prev,
      musicFile: file,
      musicPreviewUrl: localPreviewUrl,
      musicName: file.name,
      musicUrl: undefined, // Clear musicUrl until permanent upload finishes
      musicUploadStatus: "uploading",
      musicUploadError: undefined,
    }));

    try {
      const permanentUrl = await uploadFile(file);
      if (!permanentUrl || permanentUrl.startsWith("blob:")) {
        throw new Error("Vercel Blob storage returned an invalid or temporary blob URL.");
      }

      setState((prev) => ({
        ...prev,
        musicUrl: permanentUrl,
        musicUploadStatus: "uploaded",
      }));
    } catch (err: any) {
      console.warn("Music upload failed:", err);
      setState((prev) => ({
        ...prev,
        musicUrl: undefined,
        musicUploadStatus: "error",
        musicUploadError: err.message || "Audio upload failed. Please try again.",
      }));
    }
  };

  const handleRetryMusicUpload = async () => {
    if (!state.musicFile) return;
    await handleSelectMusicFile(state.musicFile);
  };

  const handleRemoveSong = () => {
    if (state.musicPreviewUrl && state.musicPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(state.musicPreviewUrl);
    }
    setState((prev) => ({
      ...prev,
      musicFile: undefined,
      musicPreviewUrl: undefined,
      musicUrl: undefined,
      musicName: undefined,
      musicUploadStatus: "pending",
      musicUploadError: undefined,
    }));
  };

  const uploadPendingMusic = async (): Promise<string | undefined> => {
    if (state.musicFile && state.musicUploadStatus !== "uploaded") {
      setState((prev) => ({ ...prev, musicUploadStatus: "uploading", musicUploadError: undefined }));
      try {
        const url = await uploadFile(state.musicFile);
        if (!url || url.startsWith("blob:")) {
          throw new Error("Storage returned an invalid or temporary URL.");
        }
        setState((prev) => ({
          ...prev,
          musicUrl: url,
          musicUploadStatus: "uploaded",
        }));
        return url;
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          musicUploadStatus: "error",
          musicUploadError: err.message || "Audio upload failed",
        }));
        throw new Error(`Music upload failed: ${err.message}`);
      }
    }
    return state.musicUrl && !state.musicUrl.startsWith("blob:") ? state.musicUrl : undefined;
  };

  // Upload pending photos to persistent cloud storage
  const uploadPendingPhotos = async (): Promise<GiftPhotoDraft[]> => {
    const updatedPhotos = [...state.photos];
    let hasUploadFailure = false;
    let firstError = "";

    for (let i = 0; i < updatedPhotos.length; i++) {
      const photo = updatedPhotos[i];

      if (photo.file && photo.uploadStatus !== "uploaded") {
        updatedPhotos[i] = { ...photo, uploadStatus: "uploading", uploadError: undefined };
        setState((prev) => ({ ...prev, photos: [...updatedPhotos] }));

        try {
          const url = await uploadFile(photo.file);
          if (!url || url.startsWith("blob:")) {
            throw new Error("Photo upload returned a temporary blob URL.");
          }
          updatedPhotos[i] = {
            ...photo,
            storedUrl: url,
            uploadStatus: "uploaded",
          };
          setState((prev) => ({ ...prev, photos: [...updatedPhotos] }));
        } catch (err: any) {
          console.warn(`Upload failed for photo ${photo.id}:`, err);
          hasUploadFailure = true;
          firstError = firstError || err.message || "Photo upload failed";
          updatedPhotos[i] = {
            ...photo,
            uploadStatus: "error",
            uploadError: err.message || "Photo upload failed. Please try again.",
          };
          setState((prev) => ({ ...prev, photos: [...updatedPhotos] }));
        }
      }
    }

    if (hasUploadFailure) {
      throw new Error(`Photo upload failed: ${firstError}`);
    }

    return updatedPhotos;
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
      if (!url || url.startsWith("blob:")) {
        throw new Error("Photo upload returned a temporary blob URL.");
      }
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
      const currentMusicUrl = await uploadPendingMusic();

      const validPhotosPayload = currentPhotos
        .map((p, idx) => {
          const finalUrl = p.storedUrl || p.previewUrl;
          return {
            url: finalUrl ? finalUrl.trim() : "",
            caption: p.caption ? p.caption.trim() : "",
            order: idx,
          };
        })
        .filter((p) => p.url.length > 0 && !p.url.startsWith("blob:"));

      const validWishesPayload = (state.wishes || [])
        .map((w: any) => (typeof w === "string" ? w : w?.text || ""))
        .filter((w) => typeof w === "string" && w.trim().length > 0)
        .map((w, idx) => ({ text: w.trim(), order: idx }));

      const sanitizedMusicUrl =
        currentMusicUrl && !currentMusicUrl.startsWith("blob:")
          ? currentMusicUrl.trim()
          : undefined;

      const payload = {
        recipientName: state.recipientName.trim() || "Someone Special",
        message: state.message.trim() || "Happy Birthday!",
        letter: state.letter.trim() || undefined,
        theme: state.theme,
        pin: state.pin.trim() || undefined,
        pinHint: state.pinHint.trim() || undefined,
        musicUrl: sanitizedMusicUrl,
        musicName: state.musicName || undefined,
        photos: validPhotosPayload,
        wishes: validWishesPayload,
      };

      if (giftId) {
        try {
          await safeFetchJson(`/api/gifts/${giftId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          setSaveSuccessMsg("Draft saved!");
          setTimeout(() => setSaveSuccessMsg(null), 3000);
          return giftId;
        } catch (err: any) {
          if (err.message?.includes("not found") || err.message?.includes("404")) {
            console.warn("Stale giftId not found on server. Creating new draft record...");
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
          throw err;
        }
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
              musicUrl={state.musicUrl}
              musicName={state.musicName}
              musicPreviewUrl={state.musicPreviewUrl}
              musicUploadStatus={state.musicUploadStatus}
              musicUploadError={state.musicUploadError}
              onSelectFile={handleSelectMusicFile}
              onRemoveSong={handleRemoveSong}
              onRetryUpload={handleRetryMusicUpload}
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
