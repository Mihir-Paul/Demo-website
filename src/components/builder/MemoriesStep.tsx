import React, { useRef, useState } from "react";
import { Camera, Plus, Trash2, ArrowUp, ArrowDown, AlertCircle, RefreshCw, CheckCircle2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GiftPhotoDraft } from "@/types/gift";
import { cryptoNativeRandomString } from "@/lib/utils";

interface MemoriesStepProps {
  photos: GiftPhotoDraft[];
  onChange: (photos: GiftPhotoDraft[]) => void;
  onRetryUpload?: (id: string) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_PHOTOS = 10;

export function MemoriesStep({ photos, onChange, onRetryUpload }: MemoriesStepProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFiles = (files: FileList | File[]) => {
    setErrorMsg(null);

    if (photos.length >= MAX_PHOTOS) {
      setErrorMsg(`Maximum limit of ${MAX_PHOTOS} photos reached.`);
      return;
    }

    const validFiles: GiftPhotoDraft[] = [];
    let rejectedType = false;
    let rejectedSize = false;

    Array.from(files).forEach((file) => {
      if (photos.length + validFiles.length >= MAX_PHOTOS) return;

      if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        rejectedType = true;
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        rejectedSize = true;
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      validFiles.push({
        id: cryptoNativeRandomString(8),
        file,
        previewUrl,
        storedUrl: undefined,
        caption: "",
        order: photos.length + validFiles.length,
        uploadStatus: "pending",
      });
    });

    if (rejectedType) {
      setErrorMsg("Some files were skipped. Only JPG, PNG, and WEBP formats are supported.");
    } else if (rejectedSize) {
      setErrorMsg(`Some files exceeded the maximum size limit of ${MAX_FILE_SIZE_MB}MB.`);
    }

    if (validFiles.length > 0) {
      onChange([...photos, ...validFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (id: string) => {
    const photoToRemove = photos.find((p) => p.id === id);
    if (photoToRemove?.previewUrl) {
      URL.revokeObjectURL(photoToRemove.previewUrl);
    }
    const updated = photos
      .filter((p) => p.id !== id)
      .map((p, idx) => ({ ...p, order: idx }));
    onChange(updated);
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    onChange(
      photos.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const reordered = [...photos];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    onChange(reordered.map((p, idx) => ({ ...p, order: idx })));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D7E8F5] dark:border-[#29374A] pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#26364A] dark:text-[#F5F7FA] font-serif flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:bg-[#F1D9A6]/20 dark:border-[#F1D9A6]/40 dark:text-[#F1D9A6] flex items-center justify-center text-sm shadow-sm">
              📸
            </span>
            Add your favorite memories
          </h2>
          <span className="text-xs font-mono text-[#26364A] dark:text-[#F5F7FA] bg-[#F7FBFF] dark:bg-[#151F2E] px-2.5 py-1 rounded-md border border-[#D7E8F5] dark:border-[#29374A]">
            {photos.length}/{MAX_PHOTOS} photos
          </span>
        </div>
        <p className="text-xs text-[#60758D] dark:text-[#A8B6C8] mt-1.5 leading-relaxed font-normal">
          Select photos directly from your device. Local previews appear instantly.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full py-10 px-6 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center space-y-3 ${
          isDragging
            ? "border-[#1688D4] bg-[#1688D4]/10 dark:border-[#A99AF4] dark:bg-[#A99AF4]/10 scale-[0.99]"
            : "border-[#CBD5E1] bg-[#F7FBFF] hover:border-[#1688D4] hover:bg-white dark:border-[#29374A] dark:bg-[#151F2E] dark:hover:border-[#A99AF4]"
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/30 dark:bg-[#F1D9A6]/20 dark:text-[#F1D9A6] dark:border-[#F1D9A6]/40 flex items-center justify-center shadow-md">
          <Camera className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-[#26364A] dark:text-[#F5F7FA]">
            Add your memories
          </h3>
          <p className="text-xs text-[#60758D] dark:text-[#A8B6C8]">
            Drag photos here or click to upload from your device
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="gap-2 pointer-events-auto"
        >
          <Plus className="w-4 h-4" /> Add Photos
        </Button>

        <span className="text-[11px] font-mono text-[#71859A] dark:text-[#A8B6C8] tracking-wider">
          JPG • PNG • WEBP (Max {MAX_FILE_SIZE_MB}MB each)
        </span>
      </div>

      {/* Uploaded Photos Grid */}
      {photos.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#26364A] dark:text-[#A8B6C8]">
            Selected Memories ({photos.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photos.map((photo, index) => {
              const displayUrl = photo.storedUrl || photo.previewUrl;

              return (
                <div
                  key={photo.id}
                  className="p-3 rounded-2xl border border-[#D7E8F5] bg-[#F7FBFF] dark:border-[#29374A] dark:bg-[#151F2E] flex flex-col space-y-3 relative group shadow-sm"
                >
                  {/* Image Preview Container */}
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#0B111D] border border-[#D7E8F5] dark:border-[#29374A] relative">
                    <img
                      src={displayUrl}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Top Badges & Delete Button */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <span className="px-2 py-1 rounded-md bg-white/90 dark:bg-[#0B111D]/80 backdrop-blur text-[10px] font-semibold text-[#1688D4] dark:text-[#A99AF4] border border-[#D7E8F5] dark:border-white/10 shadow-sm">
                        #{index + 1}
                      </span>

                      {/* Status Indicator */}
                      {photo.uploadStatus === "uploading" && (
                        <span className="px-2 py-1 rounded-md bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                          <UploadCloud className="w-3 h-3 animate-bounce" /> Uploading...
                        </span>
                      )}
                      {photo.uploadStatus === "uploaded" && (
                        <span className="px-2 py-1 rounded-md bg-[#1688D4] dark:bg-[#A99AF4] text-white dark:text-[#0B111D] text-[10px] font-bold flex items-center gap-1 shadow">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                      )}
                      {photo.uploadStatus === "error" && (
                        <span className="px-2 py-1 rounded-md bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                          <AlertCircle className="w-3 h-3" /> Failed
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemove(photo.id)}
                        className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white shadow-md transition-transform hover:scale-105"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Caption & Controls */}
                  <div className="space-y-2">
                    <Input
                      placeholder="Add a sweet caption (e.g. That trip to the beach!)"
                      value={photo.caption}
                      onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                      maxLength={150}
                      className="text-xs py-2"
                    />

                    {photo.uploadError && (
                      <p className="text-[11px] text-rose-500 dark:text-rose-300 flex items-center gap-1">
                        <span>{photo.uploadError}</span>
                        {onRetryUpload && (
                          <button
                            type="button"
                            onClick={() => onRetryUpload(photo.id)}
                            className="underline text-[#1688D4] dark:text-[#F1D9A6] font-semibold ml-1 flex items-center gap-0.5"
                          >
                            <RefreshCw className="w-3 h-3" /> Retry
                          </button>
                        )}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-[#60758D] dark:text-[#A8B6C8]">
                      <span className="text-[10px] text-[#60758D] dark:text-[#A8B6C8] truncate max-w-[140px]">
                        {photo.file ? photo.file.name : "Device Image"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0}
                          className="p-1 text-[#60758D] hover:text-[#26364A] dark:text-slate-400 dark:hover:text-white disabled:opacity-30"
                          title="Move Left/Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(index, "down")}
                          disabled={index === photos.length - 1}
                          className="p-1 text-[#60758D] hover:text-[#26364A] dark:text-slate-400 dark:hover:text-white disabled:opacity-30"
                          title="Move Right/Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
