"use client";
import { useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus, Save, Clock, BookOpen, Layers } from "lucide-react";
import { useCurriculumStore } from "@/src/store/curriculumStore";
import { SectionDoc } from "@/src/models/Curriculum";
import SectionCard from "./SectionCard";
import Toast from "./Toast";

interface Props {
  courseId: string;
  /** Pass initial data fetched server-side */
  initialSections?: SectionDoc[];
}

export default function CurriculumBuilder({ courseId, initialSections = [] }: Props) {
  const {
    sections,
    saving,
    lastSaved,
    init,
    addSection,
    reorderSections,
    saveCurriculum,
  } = useCurriculumStore();

  // Initialise store once on mount
  const initialised = useRef(false);
  useEffect(() => {
    if (!initialised.current) {
      init(courseId, initialSections);
      initialised.current = true;
    }
  }, [courseId, initialSections, init]);

  // Auto-save draft every 60 s
  useEffect(() => {
    const id = setInterval(() => {
      if (sections.length > 0) saveCurriculum();
    }, 60_000);
    return () => clearInterval(id);
  }, [sections, saveCurriculum]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = sections.findIndex((s) => s._id === active.id);
    const newIdx = sections.findIndex((s) => s._id === over.id);
    reorderSections(arrayMove(sections, oldIdx, newIdx));
  };

  // ── Aggregate stats ────────────────────────────────────────────────────────
  const totalModules = sections.reduce((a, s) => a + s.modules.length, 0);
  const totalLessons = sections.reduce(
    (a, s) => a + s.modules.reduce((b, m) => b + m.lessons.length, 0),
    0,
  );
  const totalSecs = sections.reduce(
    (a, s) =>
      a +
      s.modules.reduce(
        (b, m) =>
          b +
          m.lessons
            .filter((l) => l.type === "video" && l.duration)
            .reduce((c, l) => {
              const [min = 0, sec = 0] = l.duration.split(":").map(Number);
              return c + min * 60 + sec;
            }, 0),
        0,
      ),
    0,
  );
  const totalDuration =
    totalSecs > 0
      ? `${Math.floor(totalSecs / 3600)}h ${Math.floor((totalSecs % 3600) / 60)}m`
      : null;

  return (
    <div className="space-y-5">
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <Layers size={14} className="text-blue-500" />
            <strong className="text-gray-800 dark:text-gray-200">{sections.length}</strong> sections
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-purple-500" />
            <strong className="text-gray-800 dark:text-gray-200">{totalModules}</strong> modules
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-green-500" />
            <strong className="text-gray-800 dark:text-gray-200">{totalLessons}</strong> lessons
          </span>
          {totalDuration && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-orange-500" />
              <strong className="text-gray-800 dark:text-gray-200">{totalDuration}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-xs text-gray-400">Saved {lastSaved}</span>
          )}
          <button
            type="button"
            onClick={saveCurriculum}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition-all"
          >
            <Save size={14} />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* ── Empty state ──────────────────────────────────────────────────────── */}
      {sections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
            <Layers size={28} className="text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
            No sections yet
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            Start building your curriculum by adding your first section.
          </p>
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
          >
            <Plus size={15} /> Add First Section
          </button>
        </div>
      )}

      {/* ── Section list with drag-and-drop ──────────────────────────────────── */}
      {sections.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sections.map((section, i) => (
                <SectionCard key={section._id} section={section} index={i} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* ── Add section button ────────────────────────────────────────────────── */}
      {sections.length > 0 && (
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
      )}

      {/* ── Toast notifications ───────────────────────────────────────────────── */}
      <Toast />
    </div>
  );
}
