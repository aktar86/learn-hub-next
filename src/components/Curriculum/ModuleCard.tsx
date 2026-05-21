"use client";
import { useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { ModuleDoc, LessonType } from "@/src/models/Curriculum";
import { useCurriculumStore } from "@/src/store/curriculumStore";
import LessonCard from "./LessonCard";
import ConfirmModal from "./ConfirmModal";
import InlineEdit from "@/src/components/Curriculum/InlineEdit";

interface Props {
  sId: string;
  module: ModuleDoc;
}

const LESSON_TYPES: { value: LessonType; label: string; emoji: string }[] = [
  { value: "video", label: "Video", emoji: "🎬" },
  { value: "pdf", label: "PDF", emoji: "📄" },
  { value: "text", label: "Text", emoji: "📝" },
  { value: "assignment", label: "Assignment", emoji: "📋" },
];

export default function ModuleCard({ sId, module }: Props) {
  const { updateModuleTitle, removeModule, duplicateModule, addLesson, reorderLessons } =
    useCurriculumStore();

  const [collapsed, setCollapsed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonType, setNewLessonType] = useState<LessonType>("video");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: module._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = module.lessons.findIndex((l) => l._id === active.id);
    const newIdx = module.lessons.findIndex((l) => l._id === over.id);
    reorderLessons(sId, module._id, arrayMove(module.lessons, oldIdx, newIdx));
  };

  const submitNewLesson = () => {
    if (!newLessonTitle.trim()) return;
    addLesson(sId, module._id, { title: newLessonTitle.trim(), type: newLessonType });
    setNewLessonTitle("");
    setNewLessonType("video");
    setAddingLesson(false);
  };

  const totalDuration = module.lessons
    .filter((l) => l.duration && l.type === "video")
    .reduce((acc, l) => {
      const [m = 0, s = 0] = l.duration.split(":").map(Number);
      return acc + m * 60 + s;
    }, 0);

  const durationLabel =
    totalDuration > 0
      ? `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`
      : null;

  return (
    <>
      <div ref={setNodeRef} style={style} className="border border-gray-100 dark:border-gray-700/60 rounded-xl overflow-hidden">
        {/* Module header */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 group">
          <button
            {...attributes}
            {...listeners}
            className="shrink-0 text-gray-200 dark:text-gray-700 hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical size={14} />
          </button>

          <span className="text-[10px] font-bold text-purple-500 shrink-0 uppercase tracking-wider">
            Module
          </span>

          <div className="flex-1 min-w-0">
            <InlineEdit
              value={module.title}
              onSave={(v: string) => updateModuleTitle(sId, module._id, v)}
              textClass="text-sm font-medium text-gray-700 dark:text-gray-300"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {durationLabel && (
              <span className="text-[10px] text-gray-400 mr-1">{durationLabel}</span>
            )}
            <span className="text-[10px] text-gray-400 mr-2">
              {module.lessons.length} lesson{module.lessons.length !== 1 ? "s" : ""}
            </span>

            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            </button>
            <button
              type="button"
              onClick={() => duplicateModule(sId, module._id)}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Copy size={12} />
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Lessons */}
        {!collapsed && (
          <div className="px-4 pb-3 space-y-2 bg-gray-50/50 dark:bg-gray-800/20">
            {module.lessons.length === 0 && !addingLesson && (
              <p className="text-xs text-gray-400 text-center py-3">No lessons yet</p>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLessonDragEnd}>
              <SortableContext items={module.lessons.map((l) => l._id)} strategy={verticalListSortingStrategy}>
                {module.lessons.map((lesson) => (
                  <LessonCard key={lesson._id} sId={sId} mId={module._id} lesson={lesson} />
                ))}
              </SortableContext>
            </DndContext>

            {/* Add lesson inline form */}
            {addingLesson ? (
              <div className="border border-blue-200 dark:border-blue-800 rounded-xl p-3 bg-blue-50/40 dark:bg-blue-900/10 space-y-2">
                <input
                  autoFocus
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitNewLesson();
                    if (e.key === "Escape") setAddingLesson(false);
                  }}
                  placeholder="Lesson title…"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
                />
                <div className="grid grid-cols-4 gap-1.5">
                  {LESSON_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setNewLessonType(t.value)}
                      className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg border text-[10px] font-medium transition-all ${
                        newLessonType === t.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                          : "border-gray-200 dark:border-gray-700 text-gray-500"
                      }`}
                    >
                      <span>{t.emoji}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={submitNewLesson}
                    className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingLesson(false)}
                    className="flex-1 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingLesson(true)}
                className="w-full flex items-center justify-center gap-1.5 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-2 text-xs text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
              >
                <Plus size={12} /> Add Lesson
              </button>
            )}
          </div>
        )}
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Delete Module"
          message={`"${module.title}" and all its lessons will be permanently deleted.`}
          onConfirm={() => { removeModule(sId, module._id); setConfirmOpen(false); }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}
