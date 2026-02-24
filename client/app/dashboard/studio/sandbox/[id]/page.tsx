"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { SandboxHeader } from "@/components/sandbox/SandboxHeader";
import { FileTree } from "@/components/sandbox/FileTree";
import { SandboxIDE } from "@/components/sandbox/SandboxIDE";
import {
  RegistryModal,
  RegistryEntry,
} from "@/components/sandbox/RegistryModal";
import { useSandbox, SandboxComponent } from "@/hooks/useSandbox";
import { Loader } from "@/components/ui/Loader";

/**
 * Sandbox IDE page — full-screen three-panel layout:
 *
 *  ┌──────────────────────────────────────────────────────────┐
 *  │  SandboxHeader (title, save status, Continue button)     │  h-12
 *  ├──────────────┬───────────────────────────────────────────┤
 *  │  FileTree    │  SandboxIDE (unified editor + preview)    │
 *  │  (w-52)      │  Editor (flex-1) | Preview (40%)          │
 *  └──────────────┴───────────────────────────────────────────┘
 *
 * The SandboxIDE wraps BOTH editor and preview inside ONE SandpackProvider
 * so file edits are immediately reflected in the live preview.
 *
 * Autosave fires 1.5 s after the last keystroke.
 */
export default function SandboxPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const sandboxId = params.id as string;

  const { getSandbox, updateSandbox } = useSandbox();

  const [component, setComponent] = useState<SandboxComponent | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState("/component.tsx");
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);

  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

  // ─── Fetch sandbox on mount ──────────────────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    (async () => {
      const result = await getSandbox(sandboxId);
      if (result.success && result.component) {
        setComponent(result.component);
        setFiles(result.component.files ?? {});
      } else {
        setLoadError("Sandbox not found or you don't have access.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandboxId, status]);

  // ─── Autosave on file changes (1.5 s debounce) ──────────────────────
  const handleFilesChange = useCallback(
    (updatedFiles: Record<string, string>) => {
      setFiles(updatedFiles);
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(async () => {
        setSaving(true);
        await updateSandbox(sandboxId, { files: updatedFiles });
        setSaving(false);
      }, 1500);
    },
    [sandboxId, updateSandbox],
  );

  // ─── Title autosave ──────────────────────────────────────────────────
  const handleTitleChange = useCallback(
    async (newTitle: string) => {
      setComponent((prev) => (prev ? { ...prev, title: newTitle } : prev));
      await updateSandbox(sandboxId, { title: newTitle });
    },
    [sandboxId, updateSandbox],
  );

  // ─── Registry import ─────────────────────────────────────────────────
  const handleRegistryImport = useCallback(
    (entry: RegistryEntry) => {
      const updated = { ...files, ...entry.code };
      handleFilesChange(updated);
      const firstFile = Object.keys(entry.code)[0];
      if (firstFile) setActiveFile(firstFile);
    },
    [files, handleFilesChange],
  );

  // ─── Navigate to publish wizard ──────────────────────────────────────
  const handleContinue = () => {
    router.push(`/dashboard/studio/sandbox/${sandboxId}/publish`);
  };

  // ─── Loading / error states ──────────────────────────────────────────
  if (status === "loading" || (!component && !loadError)) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-950">
        <Loader size="lg" />
        <p className="text-sm text-neutral-500 animate-pulse font-medium italic">
          Loading sandbox…
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-950">
        <p className="text-sm font-bold text-red-400">{loadError}</p>
        <button
          onClick={() => router.push("/dashboard/studio")}
          className="text-xs text-indigo-400 underline"
        >
          Back to Studio
        </button>
      </div>
    );
  }

  return (
    /*
     * LAYOUT:
     * The outer div fills the viewport (fixed inset-0).
     * flex-col → header on top, row below.
     * The row (flex-1 flex overflow-hidden) holds FileTree + SandboxIDE.
     * min-h-0 on children is critical: without it flex children don't shrink
     * below their content size, breaking height-100% on grandchildren.
     */
    <div className="fixed inset-0 flex flex-col bg-neutral-950 overflow-hidden">
      {/* ── Header ── */}
      <SandboxHeader
        title={component?.title ?? "Untitled"}
        onTitleChange={handleTitleChange}
        onContinue={handleContinue}
        saving={saving}
      />

      {/* ── Body ── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <SandboxIDE
          files={files}
          activeFile={activeFile}
          onFilesChange={handleFilesChange}
          onAddFromRegistry={() => setIsRegistryOpen(true)}
        />
      </div>

      {/* Registry modal */}
      <RegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        onImport={handleRegistryImport}
      />
    </div>
  );
}
