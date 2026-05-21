"use client";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, Pencil, Trash2, Eye, EyeOff, Globe, Lock,
  PlayCircle, FileText, File, ClipboardList,
} from "lucide-react";
import { LessonDoc, LessonType } from "@/src/models/Curriculum";
import { useCurriculumStore } from "@/src/store/curriculumStore";
import LessonModal from "./LessonModal";
import ConfirmModal from "./ConfirmModal";

const TYPE_ICON: Record<LessonType, React.ReactNode> = {
  video: <PlayCircle size={14} className="text-blue-500" />,
  pdf: <FileText size={14} className="text-red-500" />,
  text: <File size={14} className="text-green-500" />,
  assignment: <ClipboardList size={14} className="text-orange-500" />,
};

const TYPE_BG: Record<LessonType, string> = {
  video: "bg-blue-50 dark:bg-blue-900/20",
  pdf: "bg-red-50 dark:bg-red-900/20",
  text: "bg-green-50 dark:bg-green-900/20",
  assignment: "bg-orange-50 dark:bg-orange-900/20",
};

interface Props {
  sId: string;
  mId: string;
  lesson: LessonDoc;
}

export default function LessonCard({ sId, mId, lesson }: Props) {
  const { removeLesson, toggleLessonPublish, toggleLessonPreview } = useCurriculumStore();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-900 group hover:border-gray-200 dark:hover:border-gray-600 transition-all"
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="shrink-0 text-gray-200 dark:text-gray-700 hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag lesson"
        >
          <GripVertical size={14} />
        </button>

        {/* Type icon */}
        <div className={`w-7 h-7 rounded-lg ${TYPE_BG[lesson.type]} flex items-center justify-center shrink-0`}>
          {TYPE_ICON[lesson.type]}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 dark:text-gray-200 truncate font-medium">
            {lesson.title}
          </p>
          {lesson.duration && (
            <p className="text-[10px] text-gray-400">{lesson.duration}</p>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          {lesson.isPreviewFree && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              Free
            </span>
          )}
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
            lesson.isPublished
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400"
          }`}>
            {lesson.isPublished ? "Live" : "Draft"}
          </span>
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => toggleLessonPreview(sId, mId, lesson._id)}
            title={lesson.isPreviewFree ? "Remove free preview" : "Set as free preview"}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            {lesson.isPreviewFree ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
          <button
            type="button"
            onClick={() => toggleLessonPublish(sId, mId, lesson._id)}
            title={lesson.isPublished ? "Unpublish" : "Publish"}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            {lesson.isPublished ? <Lock size={12} /> : <Globe size={12} />}
          </button>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Pencil size={12} />
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {editOpen && (
        <LessonModal sId={sId} mId={mId} lesson={lesson} onClose={() => setEditOpen(false)} />
      )}

      {confirmOpen && (
        <ConfirmModal
          title="Delete Lesson"
          message={`"${lesson.title}" will be permanently deleted.`}
          onConfirm={() => { removeLesson(sId, mId, lesson._id); setConfirmOpen(false); }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}
