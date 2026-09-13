import React, { useRef, useState } from "react";
import { Camera, Plus, Trash2, ArrowUp, ArrowDown, UploadCloud, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GiftPhotoDraft } from "@/types/gift";
import { cryptoNativeRandomString } from "@/lib/utils";

interface MemoriesStepProps {
  photos: GiftPhotoDraft[];
  onChange: (photos: GiftPhotoDraft[]) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function MemoriesStep({ photos, onChange }: MemoriesStepProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFiles = (files: FileList | File[]) => {
    setErrorMsg(null);
    const validFiles: GiftPhotoDraft[] = [];
    let rejectedCount = 0;
    let oversizeCount = 0;

    Array.from(files).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        rejectedCount++;
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversizeCount++;
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      validFiles.push({
        id: cryptoNativeRandomString(8),
        file,
        previewUrl,
        caption: "",
        order: photos.length + validFiles.length,
      });
    });

    if (rejectedCount > 0) {
      setErrorMsg("Some files were skipped. Only JPG, PNG, and WEBP images are supported.");
    } else if (oversizeCount > 0) {
      setErrorMsg(`Some files exceeded the maximum ${MAX_FILE_SIZE_MB}MB size limit.`);
    }

    if (validFiles.length > 0) {
      onChange([...photos, ...validFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (id: string) => {
    const target = photos.find((p) => p.id === id);
    if (target && target.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(target.previewUrl);
    }
    onChange(photos.filter((p) => p.id !== id));
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    onChange(photos.map((p) => (p.id === id ? { ...p, caption } : p)));
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
    <Card className="p-6 sm:p-8 space-y-6">
      <CardHeader className="p-0 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Camera className="w-5 h-5" /> Add your favorite memories
          </CardTitle>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
            3–6 photos recommended
          </span>
        </div>
        <CardDescription>
          Select photos directly from your device to turn your favorite moments into part of the story.
        </CardDescription>
      </CardHeader>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
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

      {/* Polished Drag-and-Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full py-10 px-6 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center space-y-3 ${
          isDragging
            ? "border-rose-400 bg-rose-500/10 scale-[0.99]"
            : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60"
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-lg shadow-amber-500/10">
          <Camera className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-white">
            Add your memories
          </h3>
          <p className="text-xs text-slate-400">
            Drag photos here or click to select from your device
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
          className="gap-2 shadow-lg shadow-rose-500/25 pointer-events-auto"
        >
          <Plus className="w-4 h-4" /> Add Photos
        </Button>

        <span className="text-[11px] font-mono text-slate-500 tracking-wider">
          JPG • PNG • WEBP (Up to {MAX_FILE_SIZE_MB}MB each)
        </span>
      </div>

      {/* Uploaded Memories Grid / List */}
      {photos.length > 0 && (
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Selected Memories ({photos.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="glass-card p-3 rounded-2xl border-slate-800 flex flex-col space-y-3 relative group"
              >
                {/* Photo Preview Container */}
                <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                  <img
                    src={photo.previewUrl}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Top Badge & Delete Button */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                    <span className="px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur text-[10px] font-semibold text-rose-300 border border-slate-800">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(photo.id)}
                      className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 shadow-md transition-transform hover:scale-105"
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

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                      {photo.file ? photo.file.name : "Local Image"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Left/Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, "down")}
                        disabled={index === photos.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Right/Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
