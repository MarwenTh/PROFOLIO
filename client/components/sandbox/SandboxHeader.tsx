"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  ChevronRight,
  BookOpen,
  Flag,
  ArrowRight,
  Check,
  Pencil,
} from "lucide-react";

interface SandboxHeaderProps {
  /** Current component title */
  title: string;
  /** Called when user finishes editing the title inline */
  onTitleChange: (newTitle: string) => void;
  /** Navigate to the publish wizard */
  onContinue: () => void;
  /** Whether save is in progress */
  saving?: boolean;
}

/**
 * Top header bar of the Sandbox IDE.
 * Shows breadcrumb (Studio → title), inline title editing,
 * a saving indicator, and the action buttons (Tutorial, Report, Continue).
 */
export function SandboxHeader({
  title,
  onTitleChange,
  onContinue,
  saving = false,
}: SandboxHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);

  const handleTitleSubmit = () => {
    const trimmed = draftTitle.trim() || "Untitled";
    onTitleChange(trimmed);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleTitleSubmit();
    if (e.key === "Escape") {
      setDraftTitle(title);
      setIsEditingTitle(false);
    }
  };

  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-neutral-200 dark:border-white/5 bg-white dark:bg-neutral-950 shrink-0 z-10">
      {/* ── Left: Breadcrumb + Inline Title ─────────────────────────────── */}
      <div className="flex items-center gap-2 min-w-0">
        <Link
          href="/dashboard/studio"
          className="flex items-center gap-1.5 text-neutral-500 hover:text-indigo-500 transition-colors shrink-0"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">
            Studio
          </span>
        </Link>

        <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 shrink-0" />

        {/* Inline editable title */}
        {isEditingTitle ? (
          <input
            autoFocus
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyDown}
            className="text-xs font-bold bg-transparent border-b border-indigo-500 outline-none text-neutral-900 dark:text-white min-w-0 w-32 sm:w-48"
            maxLength={60}
          />
        ) : (
          <button
            onClick={() => {
              setDraftTitle(title);
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white hover:text-indigo-500 transition-colors group min-w-0"
          >
            <span className="truncate max-w-[120px] sm:max-w-[200px]">
              {title}
            </span>
            <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>
        )}

        {/* Saving indicator */}
        {saving && (
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest animate-pulse hidden sm:block">
            Saving…
          </span>
        )}
      </div>

      {/* ── Right: Action Buttons ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="https://sandpack.codesandbox.io/docs"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 h-7 rounded-lg text-[11px] font-bold text-neutral-500 hover:text-indigo-500 hover:bg-indigo-500/5 transition-all hidden sm:flex"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Tutorial
        </a>

        <button className="flex items-center gap-1.5 px-3 h-7 rounded-lg text-[11px] font-bold text-neutral-500 hover:text-red-500 hover:bg-red-500/5 transition-all hidden sm:flex">
          <Flag className="w-3.5 h-3.5" />
          Report
        </button>

        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-4 h-7 rounded-lg text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20"
        >
          Continue
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </header>
  );
}
