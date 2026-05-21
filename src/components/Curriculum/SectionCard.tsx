"use client";
import { useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, ChevronDown, ChevronUp, Plus, Trash2, Copy,
} from "lucide-react";
import { SectionDoc } from "@/src/models/Curriculum";
import { useCurriculumStore } from "@/src/store/curriculumStore";
import ModuleCard from "./ModuleCard";
import ConfirmModal from "./ConfirmModal";
import InlineEdit from "./InlineEdit";

interface Props {
  section: SectionDoc;
  index: number;
}

export default function SectionCard({ section, index }: Props) {
  const {
    updateSectionTitle, removeSection, toggleSection,
    duplicateSection, addModule, reorderModules,
  } = useCurriculumStore();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleModuleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = section.modules.findIndex((m) => m._id === active.id);
    const newIdx = section.modules.findIndex((m) => m._id === over.id);
    reorderModules(section._id, arrayMove(section.modules, oldIdx, newIdx));
  };

  // Stats
  const totalLessons = section.modules.reduce((a, m) => a + m.lessons.length, 0);
  const totalSecs = section.modules.reduce((a, m) =>
    a + m.lessons.filter((l) => l.type === "video" && l.duration).reduce((b, l) => {
      const [min = 0, sec = 0] = l.duration.split(":").map(Number);
      return b + min * 60 + sec;
    }, 0), 0);
  const durationLabel = totalSecs > 0
    ? `${Math.floor(totalSecs / 60)}m ${totalSecs % 60}s`
    : null;

  return (
    <>
      <div ref={setNodeRef} style={style} className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        {/* Section header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/60 group">
          <button
            {...attributes}
            {...listeners}
            className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none"
            aria-label="Drag section"
          >
            <GripVertical size={16} />
          </button>

          <span className="text-xs font-black text-blue-600 dark:text-blue-400 shrink-0 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
            S{index + 1}
          </span>

          <div className="flex-1 min-w-0">
            <InlineEdit
              value={section.title}
              onSave={(v) => updateSectionTitle(section._id, v)}
              textClass="text-sm font-semibold text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 shrink-0">
            <span>{section.modules.length} module{section.modules.length !== 1 ? "s" : ""}</span>
            <span className="text-gray-200 dark:text-gray-700">•</span>
            <span>{totalLessons} lesson{totalLessons !== 1 ? "s" : ""}</span>
            {durationLabel && (
              <>
                <span className="text-gray-200 dark:text-gray-700">•</span>
                <span>{durationLabel}</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => toggleSection(section._id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {section.collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
            </button>
            <button
              type="button"
              onClick={() => duplicateSection(section._id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors opacity-0 group-hover:opacity-100"
              title="Duplicate section"
            >
              <Copy size={14} />
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete section"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Section body */}
        {!section.collapsed && (
          <div className="p-4 space-y-3">
            {section.modules.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No modules yet. Add one below.</p>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleModuleDragEnd}>
              <SortableContext items={section.modules.map((m) => m._id)} strategy={verticalListSortingStrategy}>
                {section.modules.map((mod) => (
                  <ModuleCard key={mod._id} sId={section._id} module={mod} />
                ))}
              </SortableContext>
            </DndContext>

            <button
              type="button"
              onClick={() => addModule(section._id)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-xs text-gray-400 hover:text-purple-600 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all"
            >
              <Plus size={13} /> Add Module
            </button>
          </div>
        )}
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Delete Section"
          message={`"${section.title}" and all its modules and lessons will be permanently deleted.`}
          onConfirm={() => { removeSection(section._id); setConfirmOpen(false); }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}
