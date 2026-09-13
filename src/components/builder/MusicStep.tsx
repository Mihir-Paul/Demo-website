"use client";

import React, { useRef, useState, useEffect } from "react";
import { Music, Upload, Trash2, RefreshCw, Play, Pause, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".mp3", ".wav", ".m4a", ".ogg", ".mp4", ".aac", ".flac"];
const ALLOWED_MIME_PREFIXES = ["audio/", "video/mp4", "video/ogg"];

interface MusicStepProps {
  musicFile?: File | null;
  musicPreviewUrl?: string | null;
  musicCloudinaryUrl?: string | null;
  musicName?: string | null;
  uploadStatus?: "idle" | "uploading" | "uploaded" | "error";
  uploadError?: string;
  onChange: (musicData: {
    musicFile?: File | null;
    musicPreviewUrl?: string | null;
    musicCloudinaryUrl?: string | null;
    musicName?: string | null;
    musicUploadStatus?: "idle" | "uploading" | "uploaded" | "error";
    musicUploadError?: string;
  }) => void;
}

export function MusicStep({
  musicFile,
  musicPreviewUrl,
  musicCloudinaryUrl,
  musicName,
  uploadStatus = "idle",
  uploadError,
  onChange,
}: MusicStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(uploadError || null);

  const activeAudioUrl = musicPreviewUrl || musicCloudinaryUrl || null;
  const activeFileName = musicName || musicFile?.name || "Birthday Song";

  // Update audio duration and current time listener
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [activeAudioUrl]);

  const handleFileSelect = (file: File) => {
    setErrorMsg(null);

    // 1. Validate extension / mime
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
    const isValidMime = ALLOWED_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix));

    if (!isValidExt && !isValidMime) {
      setErrorMsg("Please choose an MP3, WAV, M4A, or OGG file.");
      return;
    }

    // 2. Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(`This file is too large. Please choose a file under ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    // Create local object URL for preview
    const localUrl = URL.createObjectURL(file);

    onChange({
      musicFile: file,
      musicPreviewUrl: localUrl,
      musicCloudinaryUrl: null, // New file needs Cloudinary upload on save
      musicName: file.name,
      musicUploadStatus: "idle",
      musicUploadError: undefined,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Playback error:", err));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleRemove = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setErrorMsg(null);

    if (musicPreviewUrl && musicPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(musicPreviewUrl);
    }

    onChange({
      musicFile: null,
      musicPreviewUrl: null,
      musicCloudinaryUrl: null,
      musicName: null,
      musicUploadStatus: "idle",
      musicUploadError: undefined,
    });
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D7E8F5] dark:border-[#29374A] pb-4">
        <h2 className="text-xl font-bold text-[#26364A] dark:text-[#F5F7FA] font-serif flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-[#1688D4]/10 border border-[#1688D4]/30 text-[#1688D4] dark:bg-[#8FAED8]/15 dark:border-[#8FAED8]/30 dark:text-[#8FAED8] flex items-center justify-center text-sm shadow-sm">
            🎵
          </span>
          Add a little soundtrack
        </h2>
        <p className="text-xs text-[#60758D] dark:text-[#A8B6C8] mt-1.5 leading-relaxed font-normal">
          Choose a song from your device to play during their birthday experience.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mpeg,audio/wav,audio/x-m4a,audio/ogg,audio/mp4,audio/aac,audio/flac"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Validation Error Banner */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-semibold text-rose-600 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Audio File Selected -> Local Player */}
      {activeAudioUrl ? (
        <div className="p-6 rounded-2xl border border-[#D7E8F5] bg-[#F7FBFF] dark:border-[#29374A] dark:bg-[#151F2E] space-y-4 shadow-sm opacity-100">
          <audio ref={audioRef} src={activeAudioUrl} preload="metadata" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#1688D4] text-white dark:bg-[#A99AF4] dark:text-[#0B111D] flex items-center justify-center shrink-0 shadow-md">
                <Music className="w-5 h-5 animate-pulse" />
              </div>
              <div className="truncate">
                <div className="text-sm font-semibold text-[#26364A] dark:text-[#F5F7FA] truncate">{activeFileName}</div>
                <div className="text-[11px] text-[#60758D] dark:text-[#A8B6C8] flex items-center gap-2">
                  {uploadStatus === "uploading" && (
                    <span className="text-amber-600 dark:text-[#F1D9A6] flex items-center gap-1 font-semibold">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Uploading music...
                    </span>
                  )}
                  {uploadStatus === "uploaded" && (
                    <span className="text-[#1688D4] dark:text-[#A99AF4] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  )}
                  {uploadStatus === "idle" && (
                    <span className="text-[#1688D4] dark:text-[#8FAED8] font-medium">Local preview ready</span>
                  )}
                  {uploadStatus === "error" && (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">Upload failed — will retry on save</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-1 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 dark:text-rose-400 dark:hover:text-rose-300 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Audio Player Controls */}
          <div className="bg-white dark:bg-[#101827] p-4 rounded-xl border border-[#D7E8F5] dark:border-[#29374A] space-y-3 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                className="w-11 h-11 rounded-full bg-[#1688D4] hover:bg-[#0284c7] text-white dark:bg-[#A99AF4] dark:hover:bg-[#b8abf6] dark:text-[#0B111D] flex items-center justify-center font-bold transition-transform active:scale-95 shadow-md shrink-0"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-[#1688D4] dark:accent-[#A99AF4] h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#60758D] dark:text-[#A8B6C8]">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#CBD5E1] hover:border-[#1688D4] bg-[#F7FBFF] hover:bg-white dark:border-[#29374A] dark:hover:border-[#A99AF4] dark:bg-[#151F2E] dark:hover:bg-[#172235] transition-all rounded-3xl p-8 text-center cursor-pointer space-y-4 group opacity-100"
        >
          <div className="w-16 h-16 rounded-full bg-[#1688D4]/10 border border-[#1688D4]/30 text-[#1688D4] dark:bg-[#8FAED8]/15 dark:border-[#8FAED8]/30 dark:text-[#8FAED8] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Music className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#26364A] dark:text-[#F5F7FA]">Add a birthday song</h3>
            <p className="text-xs text-[#60758D] dark:text-[#A8B6C8]">
              Choose a music file from your device
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            className="gap-2 rounded-full px-6 shadow-md"
          >
            <Upload className="w-4 h-4" /> + Choose Music
          </Button>

          <p className="text-[11px] font-mono text-[#71859A] dark:text-[#A8B6C8] uppercase tracking-widest">
            MP3 • WAV • M4A • OGG (Up to 20 MB)
          </p>
        </div>
      )}
    </div>
  );
}
