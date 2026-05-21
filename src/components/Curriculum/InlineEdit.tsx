"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";

interface Props {
  value: string;
  onSave: (v: string) => void;
  textClass?: string;
  placeholder?: string;
}

export default function InlineEdit({ value, onSave, textClass = "", placeholder = "Click to edit" }: Props) {
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
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); commit(); }}
          className="shrink-0 w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
        >
          <Check size={11} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); setDraft(value); setEditing(false); }}
          className="shrink-0 w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <X size={11} />
        </button>
      </div>
    );
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      title={placeholder}
      className={`cursor-pointer hover:underline decoration-dashed underline-offset-2 ${textClass}`}
    >
      {value}
    </span>
  );
}
