"use client";

import { useEffect, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Save,
  Code2,
  FileCode2,
  Terminal,
  Plus,
  Loader2,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Panel, Group, Separator } from "react-resizable-panels";
import LivePreview from "./LivePreview";
import { PublishModal, PublishData } from "./PublishModal";
import { toast } from "sonner";

interface SimpleIDEProps {
  onClose: () => void;
  initialId?: string;
}

const defaultCode = `import React from 'react';

export default function MyComponent() {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-neutral-100">
      <h2 className="text-xl font-bold text-neutral-800">Hello World</h2>
      <p className="text-neutral-500 mt-2">Start building your component here.</p>
    </div>
  );
}
`;

const defaultUtilsCode = `import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

export default function SimpleIDE({ onClose, initialId }: SimpleIDEProps) {
  const { data: session } = useSession();
  const [id, setId] = useState<string | undefined>(initialId);
  const [title, setTitle] = useState("Untitled Component");
  const [loading, setLoading] = useState(!!initialId);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [files, setFiles] = useState([
    {
      name: `component.tsx`,
      language: "typescript",
      value: defaultCode,
    },
    {
      name: "utils.ts",
      language: "typescript",
      value: defaultUtilsCode,
    },
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const activeFile = files[activeFileIndex];

  useEffect(() => {
    if (initialId && session?.user?.id) {
      loadComponent();
    }
  }, [initialId, session?.user?.id]);

  const loadComponent = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api"}/sandbox/${initialId}`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.user?.accessToken || ""}`,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        if (data.files && typeof data.files === "object") {
          // Convert stored JSON files to array if needed, or if it's already an array
          setFiles(
            Array.isArray(data.files) ? data.files : Object.values(data.files),
          );
        }
      }
    } catch (error) {
      console.error("Error loading component:", error);
    } finally {
      setLoading(false);
    }
  };

  const setCode = (val: string) => {
    const newFiles = [...files];
    newFiles[activeFileIndex].value = val;
    setFiles(newFiles);
  };

  // Auto-save effect
  useEffect(() => {
    if (!id || loading) return;

    const timer = setTimeout(() => {
      handleSave("draft", true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [files, title, id, loading]);

  const handleSave = async (
    status: string = "draft",
    isAutoSave: boolean = false,
  ) => {
    if (saving || publishing) return;
    if (!isAutoSave) setSaving(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api"}/sandbox/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any)?.user?.accessToken || ""}`,
          },
          body: JSON.stringify({
            id,
            title,
            files,
            status,
          }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        if (!id) setId(data.id);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Error saving component:", error);
    } finally {
      if (!isAutoSave) setSaving(false);
    }
  };

  const handlePublish = () => {
    setIsPublishModalOpen(true);
  };

  const performPublish = async (publishData: PublishData) => {
    setPublishing(true);
    try {
      // First, ensure current changes are saved as draft
      await handleSave("draft", true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api"}/sandbox/${id}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any)?.user?.accessToken || ""}`,
          },
          body: JSON.stringify(publishData),
        },
      );

      if (res.ok) {
        toast.success("Published to marketplace successfully!");
      } else {
        const error = await res.json();
        throw new Error(error.message || "Failed to publish");
      }
    } catch (error: any) {
      console.error("Publishing error:", error);
      toast.error(error.message || "Failed to publish to marketplace");
      throw error;
    } finally {
      setPublishing(false);
    }
  };

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: "React.createElement",
      reactNamespace: "React",
      allowNonTsExtensions: true,
      allowJs: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      target: monaco.languages.typescript.ScriptTarget.Latest,
    });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module "react" {
         export = React;
         export as namespace React;
         namespace React {
           export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
           export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
           export function useRef<T>(initialValue: T | null): { current: T | null };
           export type ReactNode = any;
           export type ReactElement = any;
           export type FC<P = {}> = (props: P) => ReactElement | null;
           export type RefObject<T> = { readonly current: T | null };
           export type MouseEvent<T = Element> = any;
           export type KeyboardEvent<T = Element> = any;
           export type ChangeEvent<T = Element> = any;
           export type FormEvent<T = Element> = any;
           export type Dispatch<A> = (value: A) => void;
           export type SetStateAction<S> = S | ((prevState: S) => S);
         }
       }
       declare namespace JSX {
         interface IntrinsicElements {
           [elemName: string]: any;
         }
         interface ElementChildrenAttribute {
           children: {};
         }
       }`,
      "file:///node_modules/@types/react/index.d.ts",
    );
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module "clsx" {
        export type ClassValue = any;
        export function clsx(...inputs: ClassValue[]): string;
      }
      declare module "tailwind-merge" {
        export function twMerge(...inputs: string[]): string;
      }
      declare module "framer-motion";
      declare module "motion/react";
      declare module "lucide-react";
      declare module "@tabler/icons-react";`,
      "file:///node_modules/@types/utils.d.ts",
    );

    // Add the utils file to Monaco so it can be imported
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      defaultUtilsCode,
      "file:///utils.ts", // Match the import path
    );
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    // Ensure all file models exist so cross-file imports work immediately
    files.forEach((file) => {
      const uri = monaco.Uri.parse(`file:///${file.name}`);
      if (!monaco.editor.getModel(uri)) {
        monaco.editor.createModel(file.value, file.language, uri);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full bg-white dark:bg-neutral-900 overflow-hidden"
    >
      {/* IDE Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-indigo-500" />
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-0 w-48"
            placeholder="Component Name..."
          />
        </div>

        <div className="flex items-center gap-4">
          {lastSaved && (
            <div className="hidden md:flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Autosaved</span>
            </div>
          )}
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
          >
            {publishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            {publishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* IDE Body */}
      <div className="flex-1 w-full bg-[#1e1e1e] overflow-hidden">
        <Group orientation="horizontal">
          {/* File Explorer Sidebar */}
          <Panel
            defaultSize={15}
            minSize={10}
            className="bg-[#181818] border-r border-[#2d2d2d] flex flex-col"
          >
            <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              <span>Explorer</span>
              <button
                onClick={() => {
                  const name = prompt(
                    "File name (e.g., components/Button.tsx):",
                  );
                  if (name && !files.find((f) => f.name === name)) {
                    let baseName =
                      name.split("/").pop()?.split(".")[0] || "NewComponent";
                    baseName = baseName.replace(/[^a-zA-Z0-9]/g, "");
                    if (baseName)
                      baseName =
                        baseName.charAt(0).toUpperCase() + baseName.slice(1);
                    setFiles([
                      ...files,
                      {
                        name,
                        language: name.endsWith(".ts")
                          ? "typescript"
                          : "typescript",
                        value: `import React from 'react';\n\nexport default function ${baseName}() {\n  return <div>New Component</div>;\n}\n`,
                      },
                    ]);
                    setActiveFileIndex(files.length);
                  }
                }}
                className="hover:text-white transition-colors"
                title="New File"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
              {files.map((file, i) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFileIndex(i)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-left transition-colors ${
                    activeFileIndex === i
                      ? "bg-[#2d2d2d] text-white"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
                  }`}
                >
                  <FileCode2 className="w-4 h-4 shrink-0 transition-colors" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Separator className="w-1 bg-[#2d2d2d] hover:bg-indigo-500 transition-colors cursor-col-resize" />

          {/* Editor Panel */}
          <Panel
            defaultSize={50}
            minSize={30}
            className="bg-[#1e1e1e] flex flex-col relative"
          >
            <div className="flex-none h-10 border-b border-[#2d2d2d] bg-[#1e1e1e] flex items-center px-4">
              <span className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-neutral-500" />
                {activeFile.name}
              </span>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={activeFile.language}
                path={activeFile.name}
                theme="vs-dark"
                value={activeFile.value}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 16, bottom: 16 },
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  formatOnPaste: true,
                  wordWrap: "on",
                }}
              />
            </div>
          </Panel>

          <Separator className="w-1 bg-[#2d2d2d] hover:bg-indigo-500 transition-colors cursor-col-resize" />

          {/* Preview Panel */}
          <Panel
            defaultSize={35}
            minSize={20}
            className="bg-white dark:bg-neutral-900"
          >
            {/* Find the component codebase to render */}
            <LivePreview files={files} />
          </Panel>
        </Group>
      </div>
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={performPublish}
        initialData={{ title }}
      />
    </motion.div>
  );
}
