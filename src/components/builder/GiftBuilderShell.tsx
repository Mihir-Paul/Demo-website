"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderProgress } from "./BuilderProgress";
import { RecipientStep } from "./RecipientStep";
import { MemoriesStep } from "./MemoriesStep";
import { LetterStep } from "./LetterStep";
import { WishesStep } from "./WishesStep";
import { ThemeStep } from "./ThemeStep";
import { PinStep } from "./PinStep";
import { ReviewStep } from "./ReviewStep";
import { GiftBuilderState, GiftPhotoDraft } from "@/types/gift";

const LOCAL_STORAGE_KEY = "joycraft_gift_builder_draft";

const STEPS = [
  { number: 1, label: "Recipient" },
  { number: 2, label: "Memories" },
  { number: 3, label: "Letter" },
  { number: 4, label: "Wishes" },
  { number: 5, label: "Theme" },
  { number: 6, label: "Secret PIN" },
  { number: 7, label: "Review" },
];

const DEFAULT_STATE: GiftBuilderState = {
  recipientName: "",
  message: "",
  photos: [],
  letter: "",
  wishes: [
    "Wishing you a year filled with love and laughter! 🎉",
    "May all your big dreams take flight today! ✨",
  ],
  theme: "dreamy",
  pin: "",
  pinHint: "",
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

  // 1. Recover cached state from localStorage on initial render
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.state) {
          setState((prev) => ({
            ...prev,
            ...parsed.state,
            // Retain photos array without non-serializable File handles
            photos: (parsed.state.photos || []).map((p: any) => ({
              id: p.id,
              previewUrl: p.previewUrl,
              caption: p.caption || "",
              order: p.order || 0,
            })),
          }));
        }
        if (parsed.giftId) setGiftId(parsed.giftId);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      }
    } catch (e) {
      console.warn("Failed to load cached draft from localStorage", e);
    }
  }, []);

  // 2. Backup state to localStorage (stripping non-serializable File objects)
  useEffect(() => {
    try {
      const stateToCache = {
        ...state,
        photos: state.photos.map((p) => ({
          id: p.id,
          previewUrl: p.previewUrl,
          caption: p.caption,
          order: p.order,
        })),
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
        newErrors.recipientName = "Recipient name is required";
      }
      if (!state.message.trim()) {
        newErrors.message = "Main birthday message is required";
      }
    }

    if (stepNumber === 3) {
      if (state.letter && state.letter.length > 3000) {
        newErrors.letter = "Letter cannot exceed 3000 characters";
      }
    }

    if (stepNumber === 6) {
      if (state.pin && !/^\d{4}$/.test(state.pin)) {
        newErrors.pin = "PIN must be exactly 4 numeric digits (0-9)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sync draft data to backend API
  const saveToBackend = async (): Promise<string | null> => {
    setSaving(true);
    setSaveSuccessMsg(null);

    try {
      const validPhotos = state.photos
        .filter((p) => p.previewUrl.trim().length > 0)
        .map((p, idx) => ({
          url: p.previewUrl.trim(),
          caption: p.caption.trim(),
          order: idx,
        }));

      const validWishes = state.wishes
        .filter((w) => w.trim().length > 0)
        .map((w, idx) => ({ text: w.trim(), order: idx }));

      const payload = {
        recipientName: state.recipientName.trim(),
        message: state.message.trim(),
        letter: state.letter.trim() || undefined,
        theme: state.theme,
        pin: state.pin.trim() || undefined,
        pinHint: state.pinHint.trim() || undefined,
        photos: validPhotos,
        wishes: validWishes,
      };

      if (giftId) {
        const res = await fetch(`/api/gifts/${giftId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update draft");
        setSaveSuccessMsg("Draft saved!");
        setTimeout(() => setSaveSuccessMsg(null), 3000);
        return giftId;
      } else {
        const res = await fetch("/api/gifts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create draft");

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

    if (currentStep === 1 || currentStep === 6) {
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

      {/* Save Toast */}
      {saveSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300 text-center animate-fade-in">
          {saveSuccessMsg}
        </div>
      )}

      {/* Global Errors */}
      {errors.global && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300">
          {errors.global}
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
            />
          )}

          {currentStep === 3 && (
            <LetterStep
              letter={state.letter}
              onChange={(letter) => setState({ ...state, letter })}
              error={errors.letter}
            />
          )}

          {currentStep === 4 && (
            <WishesStep
              wishes={state.wishes}
              onChange={(wishes) => setState({ ...state, wishes })}
            />
          )}

          {currentStep === 5 && (
            <ThemeStep
              theme={state.theme}
              onChange={(theme) => setState({ ...state, theme })}
            />
          )}

          {currentStep === 6 && (
            <PinStep
              pin={state.pin}
              pinHint={state.pinHint}
              onChange={(fields) => setState({ ...state, ...fields })}
              error={errors.pin}
            />
          )}

          {currentStep === 7 && (
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

      {/* Bottom Step Navigation Footer (Steps 1 to 6) */}
      {currentStep < 7 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          <div className="flex items-center gap-3">
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
              className="gap-2 shadow-lg shadow-rose-500/25"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
