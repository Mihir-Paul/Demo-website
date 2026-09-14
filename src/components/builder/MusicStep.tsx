import React, { useRef, useState } from "react";
import { Music, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MusicStepProps {
  musicUrl?: string;
  musicName?: string;
  musicPreviewUrl?: string;
  musicUploadStatus?: "pending" | "uploading" | "uploaded" | "error";
  musicUploadError?: string;
  onSelectFile: (file: File) => void;
  onRemoveSong: () => void;
  onRetryUpload: () => void;
}

const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/m4a",
  "audio/x-m4a",
  "audio/ogg",
  "audio/aac",
  "audio/flac",
];
const MAX_AUDIO_SIZE_MB = 35;
const MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024;

export function MusicStep({
  musicUrl,
  musicName,
  musicPreviewUrl,
  musicUploadStatus,
  musicUploadError,
  onSelectFile,
  onRemoveSong,
  onRetryUpload,
}: MusicStepProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localErrorMsg, setLocalErrorMsg] = useState<string | null>(null);

  const handleProcessFile = (file: File) => {
    setLocalErrorMsg(null);

    const isAudioType =
      ALLOWED_AUDIO_TYPES.includes(file.type.toLowerCase()) ||
      file.type.startsWith("audio/") ||
      /\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(file.name);

    if (!isAudioType) {
      setLocalErrorMsg("Unsupported audio format. Please select an MP3, WAV, M4A, or OGG file.");
      return;
    }

    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      setLocalErrorMsg(`Audio file size exceeds the ${MAX_AUDIO_SIZE_MB}MB maximum limit.`);
      return;
    }

    onSelectFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const activeAudioUrl = musicUrl || musicPreviewUrl;
  const isUploaded =
    musicUploadStatus === "uploaded" && Boolean(musicUrl) && !musicUrl?.startsWith("blob:");

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D7E8F5] dark:border-[#29374A] pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#26364A] dark:text-[#F5F7FA] font-serif flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:bg-[#A99AF4]/20 dark:border-[#A99AF4]/40 dark:text-[#A99AF4] flex items-center justify-center text-sm shadow-sm">
              🎵
            </span>
            Choose a soundtrack
          </h2>
        </div>
        <p className="text-xs text-[#60758D] dark:text-[#A8B6C8] mt-1.5 leading-relaxed font-normal">
          Choose a song from your device to play on the final surprise page.
        </p>
      </div>

      {(localErrorMsg || musicUploadError) && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
            <span>{localErrorMsg || musicUploadError}</span>
          </div>
          {musicUploadError && (
            <button
              type="button"
              onClick={onRetryUpload}
              className="underline font-bold text-[#1688D4] dark:text-[#A99AF4] flex items-center gap-1 shrink-0"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.m4a,.ogg,.aac,.flac,audio/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload Box or Active Track Card */}
      {!activeAudioUrl ? (
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
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 border border-sky-500/30 dark:bg-[#A99AF4]/20 dark:text-[#A99AF4] dark:border-[#A99AF4]/40 flex items-center justify-center shadow-md">
            <Music className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#26364A] dark:text-[#F5F7FA]">
              Choose a song from your device
            </h3>
            <p className="text-xs text-[#60758D] dark:text-[#A8B6C8]">
              Drag an audio file here or click to select from local files
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
            <Music className="w-4 h-4" /> Choose Audio File
          </Button>

          <span className="text-[11px] font-mono text-[#71859A] dark:text-[#A8B6C8] tracking-wider">
            MP3 • WAV • M4A • OGG (Max {MAX_AUDIO_SIZE_MB}MB)
          </span>
        </div>
      ) : (
        <div className="p-5 rounded-2xl border border-[#D7E8F5] bg-[#F7FBFF] dark:border-[#29374A] dark:bg-[#151F2E] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1688D4]/10 border border-[#1688D4]/30 text-[#1688D4] dark:bg-[#A99AF4]/20 dark:border-[#A99AF4]/40 dark:text-[#A99AF4] flex items-center justify-center">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#26364A] dark:text-[#F5F7FA] line-clamp-1">
                  {musicName || "Selected Soundtrack"}
                </h4>
                <p className="text-[11px] text-[#60758D] dark:text-[#A8B6C8] flex items-center gap-1.5 mt-0.5">
                  {musicUploadStatus === "uploading" && (
                    <span className="text-amber-500 font-medium flex items-center gap-1">
                      <UploadCloud className="w-3 h-3 animate-bounce" /> Uploading to cloud...
                    </span>
                  )}
                  {isUploaded && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Persistent Blob URL Ready
                    </span>
                  )}
                  {musicUploadStatus === "error" && (
                    <span className="text-rose-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Upload Failed
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs py-1 px-3"
              >
                Change
              </Button>
              <button
                type="button"
                onClick={onRemoveSong}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all"
                title="Remove Song"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Audio Preview Controls */}
          <div className="pt-2 border-t border-[#D7E8F5] dark:border-[#29374A]">
            <p className="text-[11px] font-semibold text-[#60758D] dark:text-[#A8B6C8] mb-1.5 flex items-center gap-1">
              <span>🎧 Audio Preview:</span>
            </p>
            <audio controls src={activeAudioUrl} className="w-full h-10 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
