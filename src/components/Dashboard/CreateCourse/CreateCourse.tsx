"use client";
import { ChangeEvent, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ImagePlus,
  Info,
  LayoutList,
  Loader2,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import CurriculumBuilder from "@/src/components/Curriculum/CurriculumBuilder";
import { useCurriculumStore } from "@/src/store/curriculumStore";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Design",
  "Development",
  "Business",
  "Marketing",
  "Photography",
  "Music",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const LANGUAGES = ["English", "Bengali", "Hindi", "Spanish", "French"];

type Tab = "basic" | "curriculum" | "pricing";
type Status = "idle" | "saving" | "done" | "error";

interface FormData {
  courseTitle: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  language: string;
  tags: string;
  price: string;
}

// ─── Thumbnail uploader (Cloudinary signed upload) ────────────────────────────
function ThumbnailUploader({
  preview,
  onUpload,
  onRemove,
}: {
  preview: string;
  onUpload: (url: string, publicId: string) => void;
  onRemove: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Thumbnail must be under 2 MB");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Get signed params
      const sigRes = await fetch(
        "/api/cloudinary/upload?folder=learn-hub/thumbnails",
      );
      const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", apiKey);
      fd.append("timestamp", String(timestamp));
      fd.append("signature", signature);
      fd.append("folder", "learn-hub/thumbnails");

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        );
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const r = JSON.parse(xhr.responseText);
            onUpload(r.secure_url, r.public_id);
            resolve();
          } else reject(new Error("Upload failed"));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(fd);
      });
    } catch (err) {
      console.error("Thumbnail upload error:", err);
      alert("Thumbnail upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {preview ? (
        <div className="space-y-2">
          <div
            className="relative rounded-xl overflow-hidden aspect-video group cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Upload size={16} className="text-white" />
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-600 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="text-blue-500 animate-spin" />
              <p className="text-xs text-blue-500 font-medium">{progress}%</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Upload size={18} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Click to upload thumbnail
                <br />
                <span className="text-gray-400">PNG, JPG · max 2 MB</span>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CreateCourse() {
  const { data: session } = useSession();
  const router = useRouter();
  const { sections, saveCurriculum } = useCurriculumStore();

  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [courseId, setCourseId] = useState<string | null>(null); // set after first save

  const [form, setForm] = useState<FormData>({
    courseTitle: "",
    subtitle: "",
    description: "",
    category: "",
    level: "",
    language: "",
    tags: "",
    price: "",
  });

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailPublicId, setThumbnailPublicId] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.courseTitle.trim()) return "Course title is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.category) return "Please select a category.";
    return null;
  };

  // ── Save draft ──────────────────────────────────────────────────────────────
  const handleSaveDraft = async () => {
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg("");
    await submitCourse("draft");
  };

  // ── Publish ─────────────────────────────────────────────────────────────────
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg("");
    await submitCourse("published");
  };

  // ── Core submit logic ───────────────────────────────────────────────────────
  const submitCourse = async (publishStatus: "draft" | "published") => {
    setStatus("saving");

    try {
      const payload = {
        title: form.courseTitle.trim(),
        subtitle: form.subtitle.trim(),
        description: form.description.trim(),
        category: form.category,
        level: form.level,
        language: form.language,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        price: parseFloat(form.price) || 0,
        thumbnailUrl,
        thumbnailPublicId,
        status: publishStatus,
        instructorEmail: session?.email ?? "",
      };

      let savedCourseId = courseId;

      if (!savedCourseId) {
        // First save — create the course document
        const res = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error ?? "Failed to create course");
        }

        const { data } = await res.json();
        savedCourseId = data._id;
        setCourseId(savedCourseId);

        // Init curriculum store with the real courseId
        useCurriculumStore.getState().init(savedCourseId!, sections);
      } else {
        // Subsequent saves — update existing course
        const res = await fetch(`/api/courses/${savedCourseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload }),
        });
        if (!res.ok) throw new Error("Failed to update course");
      }

      // Save curriculum sections to MongoDB
      if (sections.length > 0 && savedCourseId) {
        await saveCurriculum();
      }

      setStatus("done");

      if (publishStatus === "published") {
        setTimeout(() => router.push("/dashboard/mycourse"), 1200);
      }
    } catch (err) {
      console.error("Course submit error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  // ─── Shared class strings ──────────────────────────────────────────────────
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400";

  const selectClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer";

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "basic", label: "Basic Info", icon: <Info size={15} /> },
    { id: "curriculum", label: "Curriculum", icon: <LayoutList size={15} /> },
    { id: "pricing", label: "Pricing", icon: <Tag size={15} /> },
  ];

  const isSaving = status === "saving";

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <form onSubmit={handlePublish}>
        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Course
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Fill in the details to publish your course.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-all flex items-center gap-2"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
              {isSaving ? "Saving…" : "Publish Course"}
            </button>
          </div>
        </div>

        {/* ── Success banner ────────────────────────────────────────────────── */}
        {status === "done" && (
          <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl px-5 py-3.5 mb-6 text-sm text-green-700 dark:text-green-400">
            <CheckCircle size={16} className="shrink-0" />
            Course saved successfully!
          </div>
        )}

        {/* ── Error banner ──────────────────────────────────────────────────── */}
        {errorMsg && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-5 py-3.5 mb-6 text-sm text-red-600 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        {/* ── Tab navigation ────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-1 mb-6 w-fit flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Main layout ───────────────────────────────────────────────────── */}
        <div className="flex gap-6 items-start">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Basic Info */}
            {activeTab === "basic" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Info size={16} className="text-blue-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <fieldset>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Course Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="courseTitle"
                      value={form.courseTitle}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Complete Web Development Bootcamp"
                      className={inputClass}
                    />
                  </fieldset>

                  <fieldset>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={form.subtitle}
                      onChange={handleChange}
                      placeholder="A short, catchy subtitle"
                      className={inputClass}
                    />
                  </fieldset>

                  <fieldset>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="What will students learn? What are the prerequisites?"
                      className={`${inputClass} resize-none`}
                    />
                  </fieldset>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        name: "category",
                        label: "Category",
                        options: CATEGORIES,
                        required: true,
                      },
                      {
                        name: "level",
                        label: "Level",
                        options: LEVELS,
                        required: false,
                      },
                      {
                        name: "language",
                        label: "Language",
                        options: LANGUAGES,
                        required: false,
                      },
                    ].map((sel) => (
                      <fieldset key={sel.name}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          {sel.label}{" "}
                          {sel.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        <div className="relative">
                          <select
                            name={sel.name}
                            value={form[sel.name as keyof FormData]}
                            onChange={handleChange}
                            required={sel.required}
                            className={selectClass}
                          >
                            <option value="" disabled>
                              Select {sel.label.toLowerCase()}
                            </option>
                            {sel.options.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </fieldset>
                    ))}
                  </div>

                  <fieldset>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Topic Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="e.g. React, JavaScript, CSS (comma separated)"
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Separate tags with commas
                    </p>
                  </fieldset>
                </div>
              </div>
            )}

            {/* Curriculum */}
            {activeTab === "curriculum" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <BookOpen size={16} className="text-purple-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Course Curriculum
                  </h2>
                </div>
                {/* courseId is "draft" until first save; store re-inits after save */}
                <CurriculumBuilder courseId={courseId ?? "draft"} />
              </div>
            )}

            {/* Pricing */}
            {activeTab === "pricing" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <Tag size={16} className="text-green-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Pricing
                  </h2>
                </div>

                <div className="space-y-4 max-w-sm">
                  <fieldset>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Course Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={`${inputClass} pl-8`}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Set to 0 for a free course
                    </p>
                  </fieldset>

                  {/* Price preview */}
                  {form.price && (
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                      <span className="text-sm text-gray-500">
                        Students pay
                      </span>
                      <span className="text-xl font-black text-gray-900 dark:text-white">
                        ${parseFloat(form.price || "0").toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-72 shrink-0 space-y-5">
            {/* Thumbnail */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <ImagePlus size={15} className="text-blue-600" />
                Course Thumbnail
              </h3>
              <ThumbnailUploader
                preview={thumbnailUrl}
                onUpload={(url, pid) => {
                  setThumbnailUrl(url);
                  setThumbnailPublicId(pid);
                }}
                onRemove={() => {
                  setThumbnailUrl("");
                  setThumbnailPublicId("");
                }}
              />
            </div>

            {/* Live summary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Course Summary
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "Title", value: form.courseTitle || "—" },
                  { label: "Category", value: form.category || "—" },
                  { label: "Level", value: form.level || "—" },
                  { label: "Language", value: form.language || "—" },
                  {
                    label: "Price",
                    value: form.price
                      ? `$${parseFloat(form.price).toFixed(2)}`
                      : "Free",
                  },
                  {
                    label: "Status",
                    value: courseId ? "Draft saved" : "Not saved yet",
                  },
                ].map((item) => (
                  <li key={item.label} className="flex justify-between gap-2">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-right truncate max-w-[140px]">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 p-5">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">
                💡 Tips
              </h3>
              <ul className="space-y-2 text-xs text-blue-600 dark:text-blue-300">
                <li>• Use a clear, descriptive title</li>
                <li>• Add a 16:9 thumbnail image</li>
                <li>• Build curriculum before publishing</li>
                <li>• Set a competitive price</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
