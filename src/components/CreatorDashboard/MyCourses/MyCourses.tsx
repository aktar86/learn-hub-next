"use client";
import { useState } from "react";
import Link from "next/link";
import {
  BookOpen, Clock, Edit2, Eye, Globe, Lock,
  MoreVertical, Plus, Search, Trash2, Users,
} from "lucide-react";

export interface CourseItem {
  _id: string;
  title: string;
  subtitle: string;
  category: string;
  level: string;
  price: number;
  thumbnailUrl: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  // optional enriched fields
  totalLessons?: number;
  totalStudents?: number;
}

interface Props {
  initialCourses: CourseItem[];
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
      <Globe size={9} /> Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
      <Lock size={9} /> Draft
    </span>
  );
}

// ── Dropdown menu ─────────────────────────────────────────────────────────────
function CourseMenu({
  course,
  onDelete,
  onToggleStatus,
}: {
  course: CourseItem;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, current: "draft" | "published") => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <Link
              href={`/dashboard/createcourse?edit=${course._id}`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setOpen(false)}
            >
              <Edit2 size={13} /> Edit Course
            </Link>
            <button
              type="button"
              onClick={() => { onToggleStatus(course._id, course.status); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {course.status === "published" ? (
                <><Lock size={13} /> Unpublish</>
              ) : (
                <><Globe size={13} /> Publish</>
              )}
            </button>
            <div className="border-t border-gray-100 dark:border-gray-800" />
            <button
              type="button"
              onClick={() => { onDelete(course._id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Confirm delete modal ──────────────────────────────────────────────────────
function DeleteModal({
  title,
  onConfirm,
  onCancel,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Delete Course</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          &ldquo;{title}&rdquo; will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MyCourses({ initialCourses }: Props) {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [deleteTarget, setDeleteTarget] = useState<CourseItem | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Filter + search ─────────────────────────────────────────────────────────
  const visible = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  // ── Delete ──────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/courses/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCourses((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      showToast("Course deleted");
    } catch {
      showToast("Failed to delete course", false);
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Toggle publish status ───────────────────────────────────────────────────
  const toggleStatus = async (id: string, current: "draft" | "published") => {
    const next = current === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      setCourses((prev) =>
        prev.map((c) => c._id === id ? { ...c, status: next } : c),
      );
      showToast(`Course ${next === "published" ? "published" : "unpublished"}`);
    } catch {
      showToast("Failed to update status", false);
    }
  };

  // ── Stats ───────────────────────────────────────────────────────────────────
  const totalPublished = courses.filter((c) => c.status === "published").length;
  const totalDraft = courses.filter((c) => c.status === "draft").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and track all your courses
          </p>
        </div>
        <Link
          href="/dashboard/createcourse"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
        >
          <Plus size={15} /> New Course
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Courses", value: courses.length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Published",     value: totalPublished, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Drafts",        value: totalDraft,     color: "text-gray-500",  bg: "bg-gray-100 dark:bg-gray-800" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition-all"
          />
        </div>
        <div className="flex gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
            <BookOpen size={28} className="text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {search || filter !== "all" ? "No courses match your search" : "No courses yet"}
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            {search || filter !== "all"
              ? "Try a different search or filter."
              : "Create your first course to get started."}
          </p>
          {!search && filter === "all" && (
            <Link
              href="/dashboard/createcourse"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
            >
              <Plus size={15} /> Create Course
            </Link>
          )}
        </div>
      )}

      {/* Course grid */}
      {visible.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail — clicking navigates to detail page */}
              <Link href={`/dashboard/mycourse/${course._id}`} className="block relative h-44 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 overflow-hidden">
                {course.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={40} className="text-blue-300 dark:text-blue-700" />
                  </div>
                )}
                {/* Status badge overlay */}
                <div className="absolute top-3 left-3">
                  <StatusBadge status={course.status} />
                </div>
                {/* Category badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300">
                    {course.category}
                  </span>
                </div>
              </Link>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 flex-1">
                    {course.title}
                  </h3>
                  <CourseMenu
                    course={course}
                    onDelete={(id) => setDeleteTarget(courses.find((c) => c._id === id) ?? null)}
                    onToggleStatus={toggleStatus}
                  />
                </div>

                {course.subtitle && (
                  <p className="text-xs text-gray-400 line-clamp-1 mb-3">{course.subtitle}</p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  {course.level && (
                    <span className="flex items-center gap-1">
                      <Eye size={11} /> {course.level}
                    </span>
                  )}
                  {course.totalLessons !== undefined && (
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} /> {course.totalLessons} lessons
                    </span>
                  )}
                  {course.totalStudents !== undefined && (
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {course.totalStudents}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-lg font-black text-gray-900 dark:text-white">
                    {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <Clock size={10} />
                    {new Date(course.updatedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-medium transition-all ${
          toast.ok
            ? "bg-white dark:bg-gray-900 border-green-200 dark:border-green-800 text-gray-800 dark:text-gray-200"
            : "bg-white dark:bg-gray-900 border-red-200 dark:border-red-800 text-gray-800 dark:text-gray-200"
        }`}>
          <span>{toast.ok ? "✅" : "❌"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
