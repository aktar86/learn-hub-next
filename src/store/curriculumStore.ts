/**
 * Zustand store for curriculum state.
 * All mutations happen here — components just call actions.
 */
"use client";
import { create } from "zustand";
import { SectionDoc, ModuleDoc, LessonDoc, LessonType } from "@/src/models/Curriculum";

const uid = () => Math.random().toString(36).slice(2, 9);

interface CurriculumState {
  courseId: string;
  sections: SectionDoc[];
  saving: boolean;
  lastSaved: string | null;
  toast: { message: string; type: "success" | "error" } | null;

  // init
  init: (courseId: string, sections: SectionDoc[]) => void;

  // toast
  showToast: (message: string, type?: "success" | "error") => void;
  clearToast: () => void;

  // sections
  addSection: () => void;
  updateSectionTitle: (sId: string, title: string) => void;
  removeSection: (sId: string) => void;
  toggleSection: (sId: string) => void;
  duplicateSection: (sId: string) => void;
  reorderSections: (sections: SectionDoc[]) => void;

  // modules
  addModule: (sId: string) => void;
  updateModuleTitle: (sId: string, mId: string, title: string) => void;
  removeModule: (sId: string, mId: string) => void;
  duplicateModule: (sId: string, mId: string) => void;
  reorderModules: (sId: string, modules: ModuleDoc[]) => void;

  // lessons
  addLesson: (sId: string, mId: string, lesson: Partial<LessonDoc>) => void;
  updateLesson: (sId: string, mId: string, lId: string, data: Partial<LessonDoc>) => void;
  removeLesson: (sId: string, mId: string, lId: string) => void;
  toggleLessonPublish: (sId: string, mId: string, lId: string) => void;
  toggleLessonPreview: (sId: string, mId: string, lId: string) => void;
  reorderLessons: (sId: string, mId: string, lessons: LessonDoc[]) => void;

  // persistence
  saveCurriculum: () => Promise<void>;
}

export const useCurriculumStore = create<CurriculumState>((set, get) => ({
  courseId: "",
  sections: [],
  saving: false,
  lastSaved: null,
  toast: null,

  init: (courseId, sections) => set({ courseId, sections }),

  showToast: (message, type = "success") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3500);
  },
  clearToast: () => set({ toast: null }),

  // ── Sections ──────────────────────────────────────────────────────────────
  addSection: () =>
    set((s) => ({
      sections: [
        ...s.sections,
        {
          _id: uid(),
          title: `Section ${s.sections.length + 1}`,
          order: s.sections.length,
          collapsed: false,
          modules: [],
        },
      ],
    })),

  updateSectionTitle: (sId, title) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId ? { ...sec, title } : sec,
      ),
    })),

  removeSection: (sId) =>
    set((s) => ({ sections: s.sections.filter((sec) => sec._id !== sId) })),

  toggleSection: (sId) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId ? { ...sec, collapsed: !sec.collapsed } : sec,
      ),
    })),

  duplicateSection: (sId) =>
    set((s) => {
      const idx = s.sections.findIndex((sec) => sec._id === sId);
      if (idx === -1) return s;
      const original = s.sections[idx];
      const clone: SectionDoc = {
        ...original,
        _id: uid(),
        title: `${original.title} (Copy)`,
        order: s.sections.length,
        modules: original.modules.map((m) => ({
          ...m,
          _id: uid(),
          lessons: m.lessons.map((l) => ({ ...l, _id: uid() })),
        })),
      };
      const next = [...s.sections];
      next.splice(idx + 1, 0, clone);
      return { sections: next };
    }),

  reorderSections: (sections) => set({ sections }),

  // ── Modules ───────────────────────────────────────────────────────────────
  addModule: (sId) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId
          ? {
              ...sec,
              modules: [
                ...sec.modules,
                {
                  _id: uid(),
                  title: `Module ${sec.modules.length + 1}`,
                  order: sec.modules.length,
                  lessons: [],
                },
              ],
            }
          : sec,
      ),
    })),

  updateModuleTitle: (sId, mId, title) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId
          ? {
              ...sec,
              modules: sec.modules.map((m) =>
                m._id === mId ? { ...m, title } : m,
              ),
            }
          : sec,
      ),
    })),

  removeModule: (sId, mId) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId
          ? { ...sec, modules: sec.modules.filter((m) => m._id !== mId) }
          : sec,
      ),
    })),

  duplicateModule: (sId, mId) =>
    set((s) => ({
      sections: s.sections.map((sec) => {
        if (sec._id !== sId) return sec;
        const idx = sec.modules.findIndex((m) => m._id === mId);
        if (idx === -1) return sec;
        const orig = sec.modules[idx];
        const clone: ModuleDoc = {
          ...orig,
          _id: uid(),
          title: `${orig.title} (Copy)`,
          order: sec.modules.length,
          lessons: orig.lessons.map((l) => ({ ...l, _id: uid() })),
        };
        const next = [...sec.modules];
        next.splice(idx + 1, 0, clone);
        return { ...sec, modules: next };
      }),
    })),

  reorderModules: (sId, modules) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId ? { ...sec, modules } : sec,
      ),
    })),

  // ── Lessons ───────────────────────────────────────────────────────────────
  addLesson: (sId, mId, lesson) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId
          ? {
              ...sec,
              modules: sec.modules.map((m) =>
                m._id === mId
                  ? {
                      ...m,
                      lessons: [
                        ...m.lessons,
                        {
                          _id: uid(),
                          title: "New Lesson",
                          type: "video" as LessonType,
                          description: "",
                          duration: "",
                          cloudinaryUrl: "",
                          publicId: "",
                          fileType: "",
                          fileSize: 0,
                          isPreviewFree: false,
                          isPublished: false,
                          order: m.lessons.length,
                          ...lesson,
                        },
                      ],
                    }
                  : m,
              ),
            }
          : sec,
      ),
    })),

  updateLesson: (sId, mId, lId, data) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId
          ? {
              ...sec,
              modules: sec.modules.map((m) =>
                m._id === mId
                  ? {
                      ...m,
                      lessons: m.lessons.map((l) =>
                        l._id === lId ? { ...l, ...data } : l,
                      ),
                    }
                  : m,
              ),
            }
          : sec,
      ),
    })),

  removeLesson: (sId, mId, lId) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId
          ? {
              ...sec,
              modules: sec.modules.map((m) =>
                m._id === mId
                  ? { ...m, lessons: m.lessons.filter((l) => l._id !== lId) }
                  : m,
              ),
            }
          : sec,
      ),
    })),

  toggleLessonPublish: (sId, mId, lId) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId
          ? {
              ...sec,
              modules: sec.modules.map((m) =>
                m._id === mId
                  ? {
                      ...m,
                      lessons: m.lessons.map((l) =>
                        l._id === lId ? { ...l, isPublished: !l.isPublished } : l,
                      ),
                    }
                  : m,
              ),
            }
          : sec,
      ),
    })),

  toggleLessonPreview: (sId, mId, lId) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId
          ? {
              ...sec,
              modules: sec.modules.map((m) =>
                m._id === mId
                  ? {
                      ...m,
                      lessons: m.lessons.map((l) =>
                        l._id === lId
                          ? { ...l, isPreviewFree: !l.isPreviewFree }
                          : l,
                      ),
                    }
                  : m,
              ),
            }
          : sec,
      ),
    })),

  reorderLessons: (sId, mId, lessons) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sId
          ? {
              ...sec,
              modules: sec.modules.map((m) =>
                m._id === mId ? { ...m, lessons } : m,
              ),
            }
          : sec,
      ),
    })),

  // ── Persistence ───────────────────────────────────────────────────────────
  saveCurriculum: async () => {
    const { courseId, sections, showToast } = get();
    set({ saving: true });
    try {
      const res = await fetch(`/api/curriculum/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      if (!res.ok) throw new Error("Save failed");
      set({ lastSaved: new Date().toLocaleTimeString() });
      showToast("Curriculum saved successfully!");
    } catch {
      showToast("Failed to save curriculum", "error");
    } finally {
      set({ saving: false });
    }
  },
}));
