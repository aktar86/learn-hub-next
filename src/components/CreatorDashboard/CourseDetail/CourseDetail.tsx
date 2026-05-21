"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, Check, ChevronDown, ChevronRight,
  Clock, Edit2, Eye, EyeOff, FileText, Globe, Lock,
  Loader2, Play, Plus, Save, Trash2, Upload, X,
  ClipboardList, File, AlertCircle,
} from "lucide-react";
import { CourseDoc } from "@/src/models/Course";
import { CurriculumDoc, LessonDoc, LessonType, SectionDoc, ModuleDoc } from "@/src/models/Curriculum";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  course: CourseDoc & { _id: string };
  curriculum: CurriculumDoc | null;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const LESSON_ICON: Record<LessonType, React.ReactNode> = {
  video:      <Play size={12} className="text-blue-500" />,
  pdf:        <FileText size={12} className="text-red-500" />,
  text:       <File size={12} className="text-green-500" />,
  assignment: <ClipboardList size={12} className="text-orange-500" />,
};
const LESSON_BG: Record<LessonType, string> = {
  video:      "bg-blue-50 dark:bg-blue-900/20",
  pdf:        "bg-red-50 dark:bg-red-900/20",
  text:       "bg-green-50 dark:bg-green-900/20",
  assignment: "bg-orange-50 dark:bg-orange-900/20",
};

function fmtBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}
function totalStats(sections: SectionDoc[]) {
  let lessons = 0, secs = 0;
  sections.forEach(s => s.modules.forEach(m => m.lessons.forEach(l => {
    lessons++;
    if (l.type === "video" && l.duration) {
      const [min = 0, sec = 0] = l.duration.split(":").map(Number);
      secs += min * 60 + sec;
    }
  })));
  const dur = secs > 0
    ? `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`
    : null;
  return { lessons, dur };
}

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer({ url, title }: { url: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = useCallback(() => {
    const v = ref.current; if (!v) return;
    v.paused ? v.play() : v.pause();
  }, []);
  return (
    <div className="relative w-full bg-black rounded-2xl overflow-hidden aspect-video group">
      <video ref={ref} src={url} controls playsInline title={title}
        className="w-full h-full object-contain"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
      {!playing && (
        <button onClick={toggle} aria-label="Play"
          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
            <Play size={24} className="text-blue-600 ml-1" fill="currentColor" />
          </div>
        </button>
      )}
    </div>
  );
}

// ─── Lesson viewer ────────────────────────────────────────────────────────────
function LessonViewer({ lesson }: { lesson: LessonDoc }) {
  if (!lesson.cloudinaryUrl) return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <BookOpen size={32} className="text-gray-300 mb-3" />
      <p className="text-sm text-gray-400">No content uploaded yet for this lesson.</p>
    </div>
  );
  if (lesson.type === "video") return <VideoPlayer url={lesson.cloudinaryUrl} title={lesson.title} />;
  if (lesson.type === "pdf") return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileText size={14} className="text-red-500" />{lesson.title}
        </span>
        <a href={lesson.cloudinaryUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline">Open ↗</a>
      </div>
      <iframe src={`${lesson.cloudinaryUrl}#toolbar=1`} className="w-full" style={{ height: "65vh" }} title={lesson.title} />
    </div>
  );
  if (lesson.type === "text") return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{lesson.title}</h3>
      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{lesson.cloudinaryUrl}</div>
    </div>
  );
  return (
    <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <ClipboardList size={20} className="text-orange-500" />
        </div>
        <div><h3 className="font-bold text-gray-900 dark:text-white">{lesson.title}</h3><p className="text-xs text-gray-400">Assignment</p></div>
      </div>
      {lesson.description && <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{lesson.description}</p>}
      <a href={lesson.cloudinaryUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
        <FileText size={14} /> Download
      </a>
    </div>
  );
}

// ─── File uploader (inline, no external component dependency) ─────────────────
const MAX_SIZE: Record<LessonType, number> = {
  video: 500 * 1024 * 1024, pdf: 20 * 1024 * 1024,
  text: 5 * 1024 * 1024, assignment: 50 * 1024 * 1024,
};
const ACCEPT: Record<LessonType, string> = {
  video: "video/mp4,video/mov,video/avi,video/webm",
  pdf: "application/pdf",
  text: "text/plain,.txt,.md",
  assignment: "application/pdf,.doc,.docx,.zip",
};

interface UploadResult { secure_url: string; public_id: string; duration?: number; bytes: number; format: string; }

function InlineUploader({ lessonType, currentUrl, onDone }: {
  lessonType: LessonType; currentUrl?: string; onDone: (r: UploadResult) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">(currentUrl ? "done" : "idle");
  const [fileName, setFileName] = useState("");
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState(currentUrl ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (file.size > MAX_SIZE[lessonType]) { setErr(`Max ${fmtBytes(MAX_SIZE[lessonType])}`); return; }
    setFileName(file.name); setErr(""); setState("uploading"); setProgress(0);
    try {
      const folder = `learn-hub/lessons/${lessonType}`;
      const sig = await fetch(`/api/cloudinary/upload?folder=${encodeURIComponent(folder)}`).then(r => r.json());
      const fd = new FormData();
      fd.append("file", file); fd.append("api_key", sig.apiKey);
      fd.append("timestamp", String(sig.timestamp)); fd.append("signature", sig.signature);
      fd.append("folder", folder);
      const resType = lessonType === "video" ? "video" : "raw";
      await new Promise<void>((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resType}/upload`);
        xhr.upload.onprogress = e => { if (e.lengthComputable) setProgress(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => {
          if (xhr.status < 300) {
            const r: UploadResult = JSON.parse(xhr.responseText);
            setPreview(r.secure_url); setState("done"); onDone(r); res();
          } else rej(new Error("Upload failed"));
        };
        xhr.onerror = () => rej(new Error("Network error"));
        xhr.send(fd);
      });
    } catch { setErr("Upload failed. Try again."); setState("error"); }
  };

  if (state === "done" && preview) return (
    <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 p-3 flex items-center gap-3">
      <Check size={16} className="text-green-500 shrink-0" />
      <span className="text-xs text-gray-700 dark:text-gray-300 flex-1 truncate">{fileName || "Uploaded"}</span>
      <button type="button" onClick={() => { setState("idle"); setPreview(""); }}
        className="text-xs text-blue-600 hover:underline shrink-0">Replace</button>
    </div>
  );

  if (state === "uploading") return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 p-3 space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
        <span className="truncate flex-1">{fileName}</span>
        <span className="font-bold text-blue-600 ml-2">{progress}%</span>
      </div>
      <div className="h-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );

  return (
    <div>
      <input ref={inputRef} type="file" accept={ACCEPT[lessonType]} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      <div onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
          <Upload size={15} className="text-gray-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Click to upload {lessonType}</p>
          <p className="text-[10px] text-gray-400">Max {fmtBytes(MAX_SIZE[lessonType])}</p>
        </div>
      </div>
      {err && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{err}</p>}
    </div>
  );
}

// ─── Add Lesson Modal ─────────────────────────────────────────────────────────
function AddLessonModal({ sId, mId, onAdd, onClose }: {
  sId: string; mId: string;
  onAdd: (sId: string, mId: string, lesson: LessonDoc) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: "", type: "video" as LessonType, description: "", duration: "",
    cloudinaryUrl: "", publicId: "", fileType: "", fileSize: 0,
    isPreviewFree: false, isPublished: true,
  });
  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const TYPES: { value: LessonType; label: string; emoji: string }[] = [
    { value: "video", label: "Video", emoji: "🎬" },
    { value: "pdf", label: "PDF", emoji: "📄" },
    { value: "text", label: "Text", emoji: "📝" },
    { value: "assignment", label: "Assignment", emoji: "📋" },
  ];

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition-all";

  const handleSave = () => {
    if (!form.title.trim()) return;
    const lesson: LessonDoc = { _id: uid(), order: 0, ...form };
    onAdd(sId, mId, lesson);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="font-bold text-gray-900 dark:text-white">Add New Lesson</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Lesson Type</label>
            <div className="grid grid-cols-4 gap-2">
              {TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => set("type", t.value)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${form.type === t.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-gray-200 dark:border-gray-700 text-gray-500"}`}>
                  <span className="text-lg">{t.emoji}</span>{t.label}
                </button>
              ))}
            </div>
          </div>
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="Lesson title" className={inputCls} autoFocus />
          </div>
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="What will students learn?" rows={2} className={`${inputCls} resize-none`} />
          </div>
          {/* Duration for non-video */}
          {form.type !== "video" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Duration</label>
              <input type="text" value={form.duration} onChange={e => set("duration", e.target.value)}
                placeholder="e.g. 15 min" className={inputCls} />
            </div>
          )}
          {/* File upload */}
          {form.type !== "text" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {form.type === "video" ? "Video File" : form.type === "pdf" ? "PDF File" : "Assignment File"}
              </label>
              <InlineUploader lessonType={form.type} currentUrl={form.cloudinaryUrl}
                onDone={r => {
                  set("cloudinaryUrl", r.secure_url); set("publicId", r.public_id);
                  set("fileType", r.format); set("fileSize", r.bytes);
                  if (r.duration) {
                    const m = Math.floor(r.duration / 60), s = Math.floor(r.duration % 60);
                    set("duration", `${m}:${s.toString().padStart(2, "0")}`);
                  }
                }} />
            </div>
          )}
          {/* Text content */}
          {form.type === "text" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Content</label>
              <textarea value={form.cloudinaryUrl} onChange={e => set("cloudinaryUrl", e.target.value)}
                placeholder="Write lesson content…" rows={6} className={`${inputCls} resize-none font-mono text-xs`} />
            </div>
          )}
          {/* Toggles */}
          <div className="flex gap-3">
            <button type="button" onClick={() => set("isPreviewFree", !form.isPreviewFree)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${form.isPreviewFree ? "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-600" : "border-gray-200 dark:border-gray-700 text-gray-500"}`}>
              {form.isPreviewFree ? <Eye size={13} /> : <EyeOff size={13} />}
              {form.isPreviewFree ? "Free Preview" : "Locked"}
            </button>
            <button type="button" onClick={() => set("isPublished", !form.isPublished)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${form.isPublished ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-gray-200 dark:border-gray-700 text-gray-500"}`}>
              {form.isPublished ? <Globe size={13} /> : <Lock size={13} />}
              {form.isPublished ? "Published" : "Draft"}
            </button>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          <button type="button" onClick={handleSave} disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors">Add Lesson</button>
        </div>
      </div>
    </div>
  );
}

// ─── Curriculum Manager sidebar ───────────────────────────────────────────────
function CurriculumManager({ sections, activeLesson, onSelect, onAddLesson, onDeleteLesson, onSave, saving }: {
  sections: SectionDoc[];
  activeLesson: LessonDoc | null;
  onSelect: (l: LessonDoc) => void;
  onAddLesson: (sId: string, mId: string) => void;
  onDeleteLesson: (sId: string, mId: string, lId: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setCollapsed(p => ({ ...p, [id]: !p[id] }));
  const { lessons, dur } = totalStats(sections);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Course Content</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">{lessons} lessons{dur ? ` · ${dur}` : ""}</p>
        </div>
        <button type="button" onClick={onSave} disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold transition-colors">
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <BookOpen size={28} className="text-gray-300 mb-2" />
            <p className="text-xs text-gray-400">No curriculum yet.</p>
            <p className="text-xs text-gray-400">Go to Edit Course to add sections.</p>
          </div>
        )}
        {sections.map((section, si) => (
          <div key={section._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
            {/* Section header */}
            <button type="button" onClick={() => toggle(section._id)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <span className="text-[10px] font-black text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded shrink-0">S{si + 1}</span>
              <span className="flex-1 text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{section.title}</span>
              {collapsed[section._id] ? <ChevronRight size={12} className="text-gray-400 shrink-0" /> : <ChevronDown size={12} className="text-gray-400 shrink-0" />}
            </button>

            {!collapsed[section._id] && (
              <div className="pb-2">
                {section.modules.map((mod) => (
                  <div key={mod._id}>
                    {/* Module label + add button */}
                    <div className="flex items-center justify-between px-4 py-1.5">
                      <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider truncate">{mod.title}</p>
                      <button type="button" onClick={() => onAddLesson(section._id, mod._id)}
                        className="shrink-0 flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-semibold ml-2">
                        <Plus size={10} /> Add
                      </button>
                    </div>
                    {/* Lessons */}
                    {mod.lessons.length === 0 && (
                      <p className="px-4 pb-2 text-[10px] text-gray-400">No lessons yet</p>
                    )}
                    {mod.lessons.map(lesson => {
                      const isActive = activeLesson?._id === lesson._id;
                      return (
                        <div key={lesson._id}
                          className={`flex items-center gap-2 px-4 py-2 group transition-colors ${isActive ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}>
                          <button type="button" onClick={() => onSelect(lesson)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                            <div className={`w-5 h-5 rounded-md ${LESSON_BG[lesson.type]} flex items-center justify-center shrink-0`}>
                              {LESSON_ICON[lesson.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium truncate ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>{lesson.title}</p>
                              {lesson.duration && <p className="text-[10px] text-gray-400">{lesson.duration}</p>}
                            </div>
                          </button>
                          <button type="button" onClick={() => onDeleteLesson(section._id, mod._id, lesson._id)}
                            className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CourseDetail({ course, curriculum }: Props) {
  const [sections, setSections] = useState<SectionDoc[]>(curriculum?.sections ?? []);
  const [activeLesson, setActiveLesson] = useState<LessonDoc | null>(() => {
    const all = (curriculum?.sections ?? []).flatMap(s => s.modules.flatMap(m => m.lessons));
    return all[0] ?? null;
  });
  const [addTarget, setAddTarget] = useState<{ sId: string; mId: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Flatten lessons for prev/next
  const allLessons = sections.flatMap(s => s.modules.flatMap(m => m.lessons));
  const activeIdx = allLessons.findIndex(l => l._id === activeLesson?._id);
  const prevLesson = activeIdx > 0 ? allLessons[activeIdx - 1] : null;
  const nextLesson = activeIdx < allLessons.length - 1 ? allLessons[activeIdx + 1] : null;

  // Add lesson to state
  const handleAddLesson = (sId: string, mId: string, lesson: LessonDoc) => {
    setSections(prev => prev.map(s => s._id !== sId ? s : {
      ...s, modules: s.modules.map(m => m._id !== mId ? m : {
        ...m, lessons: [...m.lessons, { ...lesson, order: m.lessons.length }]
      })
    }));
    setActiveLesson(lesson);
    showToast("Lesson added — click Save to persist");
  };

  // Delete lesson from state
  const handleDeleteLesson = (sId: string, mId: string, lId: string) => {
    setSections(prev => prev.map(s => s._id !== sId ? s : {
      ...s, modules: s.modules.map(m => m._id !== mId ? m : {
        ...m, lessons: m.lessons.filter(l => l._id !== lId)
      })
    }));
    if (activeLesson?._id === lId) setActiveLesson(null);
  };

  // Save curriculum to MongoDB
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/curriculum/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      if (!res.ok) throw new Error();
      showToast("Curriculum saved!");
    } catch {
      showToast("Save failed", false);
    } finally {
      setSaving(false);
    }
  };

  const { lessons: lessonCount, dur } = totalStats(sections);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-5 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard/mycourse"
            className="shrink-0 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">{course.title}</h1>
          {course.status === "published"
            ? <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600"><Globe size={9} /> Published</span>
            : <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"><Lock size={9} /> Draft</span>
          }
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => setSidebarOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <BookOpen size={13} /> {sidebarOpen ? "Hide" : "Show"} Curriculum
          </button>
          <Link href={`/dashboard/createcourse?edit=${course._id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
            <Edit2 size={13} /> Edit Course
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main viewer */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-5 space-y-4">
            {activeLesson ? (
              <>
                <LessonViewer lesson={activeLesson} />
                {/* Lesson info */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-5 h-5 rounded-md ${LESSON_BG[activeLesson.type]} flex items-center justify-center`}>{LESSON_ICON[activeLesson.type]}</div>
                        <span className="text-xs text-gray-400 capitalize">{activeLesson.type} lesson</span>
                        {activeLesson.duration && <><span className="text-gray-300">·</span><span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} />{activeLesson.duration}</span></>}
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{activeLesson.title}</h2>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {activeLesson.isPreviewFree && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">Free</span>}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeLesson.isPublished ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                        {activeLesson.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  {activeLesson.description && <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{activeLesson.description}</p>}
                </div>
                {/* Prev / Next */}
                <div className="flex gap-3">
                  <button type="button" onClick={() => prevLesson && setActiveLesson(prevLesson)} disabled={!prevLesson}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    ← Previous
                  </button>
                  <button type="button" onClick={() => nextLesson && setActiveLesson(nextLesson)} disabled={!nextLesson}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all">
                    Next →
                  </button>
                </div>
              </>
            ) : (
              /* No lesson selected */
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                {course.thumbnailUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={course.thumbnailUrl} alt={course.title} className="w-full max-h-56 object-cover rounded-xl mb-5" />
                  : <div className="w-full h-40 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-5"><BookOpen size={40} className="text-blue-300" /></div>
                }
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{course.title}</h2>
                {course.subtitle && <p className="text-sm text-gray-500 mb-3">{course.subtitle}</p>}
                <div className="flex justify-center gap-3 flex-wrap mb-4">
                  {[course.category, course.level, course.language].filter(Boolean).map(v => (
                    <span key={v} className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 font-medium">{v}</span>
                  ))}
                </div>
                <div className="flex justify-center gap-6 text-sm text-gray-500 mb-5">
                  <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-blue-500" />{lessonCount} lessons</span>
                  {dur && <span className="flex items-center gap-1.5"><Clock size={14} className="text-orange-500" />{dur}</span>}
                </div>
                {course.description && <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">{course.description}</p>}
                {lessonCount === 0 && (
                  <p className="mt-5 text-sm text-gray-400">Select a module in the sidebar and click <strong>+ Add</strong> to upload your first lesson.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Curriculum sidebar */}
        {sidebarOpen && (
          <div className="w-80 shrink-0 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
            {allLessons.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                  <span>Lesson {Math.max(activeIdx + 1, 1)} of {allLessons.length}</span>
                  <span>{Math.round(((activeIdx + 1) / allLessons.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${((activeIdx + 1) / allLessons.length) * 100}%` }} />
                </div>
              </div>
            )}
            <CurriculumManager
              sections={sections}
              activeLesson={activeLesson}
              onSelect={setActiveLesson}
              onAddLesson={(sId, mId) => setAddTarget({ sId, mId })}
              onDeleteLesson={handleDeleteLesson}
              onSave={handleSave}
              saving={saving}
            />
          </div>
        )}
      </div>

      {/* Add lesson modal */}
      {addTarget && (
        <AddLessonModal
          sId={addTarget.sId} mId={addTarget.mId}
          onAdd={handleAddLesson}
          onClose={() => setAddTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-medium ${toast.ok ? "bg-white dark:bg-gray-900 border-green-200 dark:border-green-800 text-gray-800 dark:text-gray-200" : "bg-white dark:bg-gray-900 border-red-200 dark:border-red-800 text-gray-800 dark:text-gray-200"}`}>
          <span>{toast.ok ? "✅" : "❌"}</span>{toast.msg}
        </div>
      )}
    </div>
  );
}
