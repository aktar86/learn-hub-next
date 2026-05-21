"use client";
import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useCurriculumStore } from "@/src/store/curriculumStore";

export default function Toast() {
  const { toast, clearToast } = useCurriculumStore();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3500);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-medium transition-all animate-in slide-in-from-bottom-4 duration-300 ${
        isSuccess
          ? "bg-white dark:bg-gray-900 border-green-200 dark:border-green-800 text-gray-800 dark:text-gray-200"
          : "bg-white dark:bg-gray-900 border-red-200 dark:border-red-800 text-gray-800 dark:text-gray-200"
      }`}
    >
      {isSuccess ? (
        <CheckCircle size={18} className="text-green-500 shrink-0" />
      ) : (
        <XCircle size={18} className="text-red-500 shrink-0" />
      )}
      <span>{toast.message}</span>
      <button
        onClick={clearToast}
        className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
