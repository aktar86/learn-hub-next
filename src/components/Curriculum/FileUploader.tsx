"use client";
import { ChangeEvent, useRef, useState } from "react";
import { Upload, X, FileVideo, FileText, File, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { LessonType } from "@/src/models/Curriculum";

interface UploadResult {
  secure_url: string;
  public_id: string;
  duration?: number;
  bytes: number;
  format: string;
  resource_type: string;
}

interface Props {
  lessonType: LessonType;
  currentUrl?: string;
  currentPublicId?: string;
  onUploadComplete: (result: UploadResult) => void;
}

const ACCEPTED: Record<LessonType, string> = {
  video: "video/mp4,video/mov,video/avi,video/webm",
  pdf: "application/pdf",
  text: "text/plain,.txt,.md",
  assignment: "application/pdf,.doc,.docx,.zip",
};

const MAX_SIZE: Record<LessonType, number> = {
  video: 500 * 1024 * 1024,   // 500 MB
  pdf: 20 * 1024 * 1024,      // 20 MB
  text: 5 * 1024 * 1024,      // 5 MB
  assignment: 50 * 1024 * 1024, // 50 MB
};

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ type }: { type: LessonType }) {
  if (type === "video") return <FileVideo size={20} className="text-blue-500" />;
  if (type === "pdf") return <FileText size={20} className="text-red-500" />;
  return <File size={20} className="text-gray-500" />;
}

type UploadState = "idle" | "uploading" | "done" | "error";

export default function FileUploader({ lessonType, currentUrl, currentPublicId, onUploadComplete }: Props) {
  const [state, setState] = useState<UploadState>(currentUrl ? "done" : "idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(currentUrl ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate size
    if (file.size > MAX_SIZE[lessonType]) {
      setError(`File too large. Max ${formatBytes(MAX_SIZE[lessonType])}`);
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setError("");
    setState("uploading");
    setProgress(0);

    try {
      // 1. Get signed params from our API
      const folder = `learn-hub/lessons/${lessonType}`;
      const sigRes = await fetch(`/api/cloudinary/upload?folder=${encodeURIComponent(folder)}`);
      const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

      // 2. Delete old asset if replacing
      if (currentPublicId) {
        const resType = lessonType === "video" ? "video" : "raw";
        await fetch("/api/cloudinary/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: currentPublicId, resourceType: resType }),
        });
      }

      // 3. Upload directly to Cloudinary with XHR for progress tracking
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const resourceType = lessonType === "video" ? "video" : "raw";
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const result: UploadResult = JSON.parse(xhr.responseText);
            setPreviewUrl(result.secure_url);
            setState("done");
            onUploadComplete(result);
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
      setState("error");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setState("idle");
    setProgress(0);
    setFileName("");
    setPreviewUrl("");
    setError("");
  };

  // ── Done state ─────────────────────────────────────────────────────────────
  if (state === "done" && previewUrl) {
    return (
      <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle size={18} className="text-green-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {fileName || "File uploaded"}
            </p>
            {fileSize > 0 && (
              <p className="text-xs text-gray-400">{formatBytes(fileSize)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={reset}
            className="shrink-0 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <RefreshCw size={12} /> Replace
          </button>
        </div>

        {/* Video preview */}
        {lessonType === "video" && (
          <video
            src={previewUrl}
            controls
            className="mt-3 w-full rounded-lg max-h-48 bg-black"
          />
        )}

        {/* PDF link */}
        {lessonType === "pdf" && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
          >
            <FileText size={12} /> View PDF
          </a>
        )}
      </div>
    );
  }

  // ── Uploading state ────────────────────────────────────────────────────────
  if (state === "uploading") {
    return (
      <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <FileIcon type={lessonType} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{fileName}</p>
            <p className="text-xs text-gray-400">{formatBytes(fileSize)}</p>
          </div>
          <span className="text-sm font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-blue-100 dark:bg-blue-900/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-center">Uploading to Cloudinary…</p>
      </div>
    );
  }

  // ── Idle / Error state ─────────────────────────────────────────────────────
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED[lessonType]}
        onChange={handleInputChange}
        className="hidden"
      />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Upload size={18} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Drop file or <span className="text-blue-600">browse</span>
        </p>
        <p className="text-xs text-gray-400">
          Max {formatBytes(MAX_SIZE[lessonType])}
        </p>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
          <AlertCircle size={13} />
          {error}
        </div>
      )}
    </div>
  );
}
