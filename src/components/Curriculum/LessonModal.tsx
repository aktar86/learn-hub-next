"use client";
import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Globe, Lock } from "lucide-react";
import { LessonDoc, LessonType } from "@/src/models/Curriculum";
import { useCurriculumStore } from "@/src/store/curriculumStore";
import FileUploader from "./FileUploader";

interface Props {
  sId: string;
  mId: string;
  lesson: LessonDoc;
  onClose: () => void;
}

const TYPES: { value: LessonType; label: string; emoji: string }[] = [
  { value: "video", label: "Video", emoji: "🎬" },
  { value: "pdf", label: "PDF", emoji: "📄" },
  { value: "text", label: "Text", emoji: "📝" },
  { value: "assignment", label: "Assignment", emoji: "📋" },
];

const inputClass =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition-all";

export default function LessonModal({ sId, mId, lesson, onClose }: Props) {
  const { updateLesson, showToast } = useCurriculumStore();

  const [form, setForm] = useState<LessonDoc>({ ...lesson });

  // Sync if lesson prop changes
  useEffect(() => { setForm({ ...lesson }); }, [lesson]);

  const set = (key: keyof LessonDoc, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.title.trim()) {
      showToast("Lesson title is required", "error");
      return;
    }
    updateLesson(sId, mId, lesson._id, form);
    showToast("Lesson updated");
    onClose();
  };

  const needsFile = form.type !== "text";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="font-bold text-gray-900 dark:text-white">Edit Lesson</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Lesson type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Lesson Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set("type", t.value)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    form.type === t.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Lesson title"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What will students learn in this lesson?"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Duration (manual for non-video) */}
          {form.type !== "video" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Duration
              </label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="e.g. 15 min"
                className={inputClass}
              />
            </div>
          )}

          {/* File upload */}
          {needsFile && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                {form.type === "video" ? "Video File" : form.type === "pdf" ? "PDF File" : "Assignment File"}
              </label>
              <FileUploader
                lessonType={form.type}
                currentUrl={form.cloudinaryUrl}
                currentPublicId={form.publicId}
                onUploadComplete={(result) => {
                  set("cloudinaryUrl", result.secure_url);
                  set("publicId", result.public_id);
                  set("fileType", result.format);
                  set("fileSize", result.bytes);
                  if (result.duration) {
                    const mins = Math.floor(result.duration / 60);
                    const secs = Math.floor(result.duration % 60);
                    set("duration", `${mins}:${secs.toString().padStart(2, "0")}`);
                  }
                }}
              />
            </div>
          )}

          {/* Text content */}
          {form.type === "text" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Content
              </label>
              <textarea
                value={form.cloudinaryUrl}
                onChange={(e) => set("cloudinaryUrl", e.target.value)}
                placeholder="Write your lesson content here…"
                rows={8}
                className={`${inputClass} resize-none font-mono text-xs`}
              />
            </div>
          )}

          {/* Toggles */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => set("isPreviewFree", !form.isPreviewFree)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                form.isPreviewFree
                  ? "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-600"
                  : "border-gray-200 dark:border-gray-700 text-gray-500"
              }`}
            >
              {form.isPreviewFree ? <Eye size={14} /> : <EyeOff size={14} />}
              {form.isPreviewFree ? "Free Preview" : "Locked"}
            </button>

            <button
              type="button"
              onClick={() => set("isPublished", !form.isPublished)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                form.isPublished
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                  : "border-gray-200 dark:border-gray-700 text-gray-500"
              }`}
            >
              {form.isPublished ? <Globe size={14} /> : <Lock size={14} />}
              {form.isPublished ? "Published" : "Draft"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            Save Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
