"use client";
import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  GripVertical,
  PlayCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type LessonType = "video" | "text" | "quiz";

type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Section = {
  id: string;
  title: string;
  modules: Module[];
  collapsed: boolean;
};

const uid = () => Math.random().toString(36).slice(2, 9);

const LESSON_ICON: Record<LessonType, React.ReactNode> = {
  video: <PlayCircle size={15} className="text-blue-500" />,
  text: <FileText size={15} className="text-green-500" />,
  quiz: <span className="text-[11px] font-black text-orange-500 leading-none">Q</span>,
};

const LESSON_BG: Record<LessonType, string> = {
  video: "bg-blue-50 dark:bg-blue-900/20",
  text: "bg-green-50 dark:bg-green-900/20",
  quiz: "bg-orange-50 dark:bg-orange-900/20",
};

const LESSON_TYPE_LABEL: Record<LessonType, string> = {
  video: "Video",
  text: "Reading",
  quiz: "Quiz",
};

const defaultSections: Section[] = [
  {
    id: uid(),
    title: "Section 1: Introduction",
    collapsed: false,
    modules: [
      {
        id: uid(),
        title: "Getting Started",
        lessons: [
          { id: uid(), title: "Welcome to the Course", type: "video", duration: "5:00" },
          { id: uid(), title: "Course Overview", type: "text", duration: "3 min" },
        ],
      },
    ],
  },
];

// ── Inline editable label ─────────────────────────────────────────────────────
function InlineEdit({
  value,
  onSave,
  textClass = "",
}: {
  value: string;
  onSave: (v: string) => void;
  textClass?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    const trimmed = draft.trim();
    onSave(trimmed || value);
    setDraft(trimmed || value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") { setDraft(value); setEditing(false); }
          }}
          onBlur={commit}
          className="flex-1 min-w-0 text-sm px-2 py-1 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <button type="button" onClick={commit}
          className="shrink-0 w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
          <Check size={11} />
        </button>
        <button type="button" onClick={() => { setDraft(value); setEditing(false); }}
          className="shrink-0 w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <X size={11} />
        </button>
      </div>
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      className={`cursor-pointer hover:underline decoration-dashed underline-offset-2 ${textClass}`}
    >
      {value}
    </span>
  );
}

// ── Add lesson row ────────────────────────────────────────────────────────────
function AddLessonRow({ onAdd }: { onAdd: (title: string, type: LessonType, duration: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<LessonType>("video");
  const [duration, setDuration] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), type, duration.trim() || (type === "video" ? "0:00" : "1 min"));
    setTitle("");
    setDuration("");
    setType("video");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full mt-3 flex items-center justify-center gap-2 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-2.5 text-xs text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
      >
        <Plus size={13} /> Add Lesson
      </button>
    );
  }

  return (
    <div className="mt-3 border border-blue-200 dark:border-blue-800 rounded-xl p-3 bg-blue-50/50 dark:bg-blue-900/10 space-y-2">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") setOpen(false); }}
        placeholder="Lesson title..."
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
      />
      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as LessonType)}
          className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="video">Video</option>
          <option value="text">Reading</option>
          <option value="quiz">Quiz</option>
        </select>
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder={type === "video" ? "e.g. 10:30" : "e.g. 5 min"}
          className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
        />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={submit}
          className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
          Add
        </button>
        <button type="button" onClick={() => setOpen(false)}
          className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CurriculumBuilder() {
  const [sections, setSections] = useState<Section[]>(defaultSections);

  // ── Section helpers ──
  const addSection = () => {
    const n = sections.length + 1;
    setSections((prev) => [
      ...prev,
      { id: uid(), title: `Section ${n}: New Section`, collapsed: false, modules: [] },
    ]);
  };

  const removeSection = (sId: string) =>
    setSections((prev) => prev.filter((s) => s.id !== sId));

  const updateSectionTitle = (sId: string, title: string) =>
    setSections((prev) => prev.map((s) => s.id === sId ? { ...s, title } : s));

  const toggleSection = (sId: string) =>
    setSections((prev) => prev.map((s) => s.id === sId ? { ...s, collapsed: !s.collapsed } : s));

  // ── Module helpers ──
  const addModule = (sId: string) => {
    const section = sections.find((s) => s.id === sId);
    const n = (section?.modules.length ?? 0) + 1;
    setSections((prev) =>
      prev.map((s) =>
        s.id === sId
          ? { ...s, modules: [...s.modules, { id: uid(), title: `Module ${n}`, lessons: [] }] }
          : s,
      ),
    );
  };

  const removeModule = (sId: string, mId: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sId ? { ...s, modules: s.modules.filter((m) => m.id !== mId) } : s,
      ),
    );

  const updateModuleTitle = (sId: string, mId: string, title: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sId
          ? { ...s, modules: s.modules.map((m) => m.id === mId ? { ...m, title } : m) }
          : s,
      ),
    );

  // ── Lesson helpers ──
  const addLesson = (sId: string, mId: string, title: string, type: LessonType, duration: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sId
          ? {
              ...s,
              modules: s.modules.map((m) =>
                m.id === mId
                  ? { ...m, lessons: [...m.lessons, { id: uid(), title, type, duration }] }
                  : m,
              ),
            }
          : s,
      ),
    );

  const removeLesson = (sId: string, mId: string, lId: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sId
          ? {
              ...s,
              modules: s.modules.map((m) =>
                m.id === mId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lId) } : m,
              ),
            }
          : s,
      ),
    );

  const updateLessonTitle = (sId: string, mId: string, lId: string, title: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sId
          ? {
              ...s,
              modules: s.modules.map((m) =>
                m.id === mId
                  ? { ...m, lessons: m.lessons.map((l) => l.id === lId ? { ...l, title } : l) }
                  : m,
              ),
            }
          : s,
      ),
    );

  // ── Stats ──
  const totalLessons = sections.reduce(
    (a, s) => a + s.modules.reduce((b, m) => b + m.lessons.length, 0), 0,
  );
  const totalModules = sections.reduce((a, s) => a + s.modules.length, 0);

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5">
        <span><strong className="text-gray-800 dark:text-gray-200">{sections.length}</strong> sections</span>
        <span className="text-gray-300 dark:text-gray-600">•</span>
        <span><strong className="text-gray-800 dark:text-gray-200">{totalModules}</strong> modules</span>
        <span className="text-gray-300 dark:text-gray-600">•</span>
        <span><strong className="text-gray-800 dark:text-gray-200">{totalLessons}</strong> lessons</span>
      </div>

      {/* Sections */}
      {sections.map((section, si) => (
        <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          {/* Section header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/60">
            <GripVertical size={16} className="text-gray-300 dark:text-gray-600 shrink-0 cursor-grab" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
              S{si + 1}
            </span>
            <div className="flex-1 min-w-0 group">
              <InlineEdit
                value={section.title}
                onSave={(v) => updateSectionTitle(section.id, v)}
                textClass="text-sm font-semibold text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xs text-gray-400 mr-1">
                {section.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
              </span>
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {section.collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Section body */}
          {!section.collapsed && (
            <div className="p-4 space-y-3">
              {section.modules.map((mod, mi) => (
                <div key={mod.id} className="border border-gray-100 dark:border-gray-700/60 rounded-xl overflow-hidden">
                  {/* Module header */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900">
                    <GripVertical size={14} className="text-gray-200 dark:text-gray-700 shrink-0 cursor-grab" />
                    <span className="text-[10px] font-bold text-purple-500 shrink-0">
                      M{si + 1}.{mi + 1}
                    </span>
                    <div className="flex-1 min-w-0 group">
                      <InlineEdit
                        value={mod.title}
                        onSave={(v) => updateModuleTitle(section.id, mod.id, v)}
                        textClass="text-sm font-medium text-gray-700 dark:text-gray-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeModule(section.id, mod.id)}
                      className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Lessons */}
                  <div className="px-4 pb-3 space-y-2">
                    {mod.lessons.map((lesson) => (
                      <div key={lesson.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-900 group"
                      >
                        <div className={`w-7 h-7 rounded-lg ${LESSON_BG[lesson.type]} flex items-center justify-center shrink-0`}>
                          {LESSON_ICON[lesson.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <InlineEdit
                            value={lesson.title}
                            onSave={(v) => updateLessonTitle(section.id, mod.id, lesson.id, v)}
                            textClass="text-sm text-gray-700 dark:text-gray-300"
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0 hidden group-hover:inline">
                          {LESSON_TYPE_LABEL[lesson.type]}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0">{lesson.duration}</span>
                        <button
                          type="button"
                          onClick={() => removeLesson(section.id, mod.id, lesson.id)}
                          className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    <AddLessonRow
                      onAdd={(title, type, duration) =>
                        addLesson(section.id, mod.id, title, type, duration)
                      }
                    />
                  </div>
                </div>
              ))}

              {/* Add module */}
              <button
                type="button"
                onClick={() => addModule(section.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-xs text-gray-400 hover:text-purple-600 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all"
              >
                <Plus size={13} /> Add Module
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Add section */}
      <button
        type="button"
        onClick={addSection}
        className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Plus size={18} />
        </div>
        <span className="text-sm font-medium">Add New Section</span>
      </button>
    </div>
  );
}


