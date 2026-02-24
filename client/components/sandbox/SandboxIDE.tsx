"use client";

import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackLayout,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Panel, Group, Separator } from "react-resizable-panels";
import { FileTree } from "./FileTree";

// ─── Constants ─────────────────────────────────────────────────────────────

const DEFAULT_DEPENDENCIES = {
  "framer-motion": "latest",
  "motion-dom": "latest",
  "motion-utils": "latest",
  "@emotion/is-prop-valid": "latest",
  "lucide-react": "latest",
  clsx: "latest",
  "tailwind-merge": "latest",
  "class-variance-authority": "latest",
  react: "latest",
  "react-dom": "latest",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Basic regex to find package imports like:
 * import { x } from "package-name"
 */
function detectDependencies(files: Record<string, string>) {
  const deps = { ...DEFAULT_DEPENDENCIES };
  const importRegex =
    /from\s+['"]([^'.\/][^'"]+)['"]|import\s+['"]([^'.\/][^'"]+)['"]/g;

  Object.values(files).forEach((code) => {
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      const pkg = match[1] || match[2];
      if (pkg && !pkg.startsWith(".") && !pkg.startsWith("/")) {
        const pkgName = pkg.startsWith("@")
          ? pkg.split("/").slice(0, 2).join("/")
          : pkg.split("/")[0];

        if (!deps[pkgName as keyof typeof deps]) {
          (deps as any)[pkgName] = "latest";
        }
      }
    }
  });
  return deps;
}

// ─── Preview toolbar ───────────────────────────────────────────────────────

function PreviewToolbar() {
  const { dispatch } = useSandpack();

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800 bg-neutral-950 shrink-0 h-9">
      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
        Preview
      </span>
      <div className="flex items-center gap-1">
        <motion.button
          onClick={() => dispatch({ type: "refresh" })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-100 hover:bg-white/10 transition-colors"
          title="Reload preview"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface SandboxIDEProps {
  files: Record<string, string>;
  activeFile: string;
  onFilesChange: (updatedFiles: Record<string, string>) => void;
  onAddFromRegistry: () => void;
}

// ─── FileSyncListener ───────────────────────────────────────────────────────

function FileSyncListener({
  onFilesChange,
  initialFiles,
}: {
  onFilesChange: (files: Record<string, string>) => void;
  initialFiles: Record<string, string>;
}) {
  const { sandpack } = useSandpack();
  const lastSyncedRef = useRef<string>(JSON.stringify(initialFiles));
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentStr = JSON.stringify(initialFiles);
    if (currentStr !== lastSyncedRef.current) {
      lastSyncedRef.current = currentStr;
    }
  }, [initialFiles]);

  useEffect(() => {
    if (!sandpack.files) return;

    const currentFiles = Object.fromEntries(
      Object.entries(sandpack.files).map(([path, file]) => [path, file.code]),
    );
    const currentStr = JSON.stringify(currentFiles);

    if (currentStr === lastSyncedRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      lastSyncedRef.current = currentStr;
      onFilesChange(currentFiles);
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [sandpack.files, onFilesChange]);

  return null;
}

// ─── InnerFileTree (Helper) ─────────────────────────────────────────────────

function InnerFileTree({
  onFilesChange,
  onAddFromRegistry,
}: {
  onFilesChange: (files: Record<string, string>) => void;
  onAddFromRegistry: () => void;
}) {
  const { sandpack } = useSandpack();

  return (
    <FileTree
      files={sandpack.files as any}
      activeFile={sandpack.activeFile}
      onFileSelect={(path) => sandpack.setActiveFile(path)}
      onAddFromRegistry={onAddFromRegistry}
      onFilesUpdate={(nextFiles) => {
        onFilesChange(nextFiles);
      }}
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function SandboxIDE({
  files,
  activeFile,
  onFilesChange,
  onAddFromRegistry,
}: SandboxIDEProps) {
  const initialFilesRef = useRef(files);
  const [dependencies, setDependencies] = useState(() =>
    detectDependencies(files),
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newDeps = detectDependencies(files);
      if (JSON.stringify(newDeps) !== JSON.stringify(dependencies)) {
        setDependencies(newDeps);
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [files, dependencies]);

  const sandpackFiles = useMemo(() => {
    return Object.fromEntries(
      Object.entries(initialFilesRef.current).map(([path, code]) => [
        path,
        { code, active: path === activeFile },
      ]),
    );
  }, [activeFile]);

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 overflow-hidden">
      <SandpackProvider
        template="react-ts"
        files={sandpackFiles}
        options={{
          activeFile,
          visibleFiles: Object.keys(files),
          recompileMode: "delayed",
          recompileDelay: 500,
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
        customSetup={{
          dependencies,
        }}
        theme="dark"
      >
        <FileSyncListener onFilesChange={onFilesChange} initialFiles={files} />

        <div className="flex-1 flex min-h-0 overflow-hidden [&_.sp-wrapper]:h-full [&_.sp-wrapper]:flex [&_.sp-wrapper]:flex-col [&_.sp-layout]:flex-1 [&_.sp-layout]:min-h-0 [&_.sp-layout]:overflow-hidden [&_.sp-stack]:flex-1 [&_.sp-stack]:min-h-0 [&_.sp-stack]:overflow-hidden">
          <InnerFileTree
            onFilesChange={onFilesChange}
            onAddFromRegistry={onAddFromRegistry}
          />

          <SandpackLayout
            className="flex-1 min-h-0 overflow-hidden"
            style={{
              border: "none",
              borderRadius: 0,
              height: "100%",
              background: "transparent",
            }}
          >
            <Group
              orientation="horizontal"
              className="h-full w-full min-h-0 overflow-hidden"
            >
              <Panel
                defaultSize={60}
                minSize={30}
                className="flex flex-col min-h-0 overflow-hidden"
              >
                <SandpackCodeEditor
                  showTabs
                  showLineNumbers
                  showInlineErrors
                  wrapContent={false}
                  closableTabs={false}
                  style={{
                    height: "100%",
                    fontSize: 13,
                  }}
                />
              </Panel>

              <Separator className="w-1 bg-neutral-900 hover:bg-indigo-500/50 transition-colors" />

              <Panel
                defaultSize={40}
                minSize={20}
                className="flex flex-col min-h-0 overflow-hidden bg-[#0a0a0a]"
              >
                <PreviewToolbar />
                <div className="flex-1 min-h-0 flex flex-col">
                  <SandpackPreview
                    showRefreshButton={false}
                    showOpenInCodeSandbox={false}
                    style={{
                      flex: 1,
                      height: "100%",
                      border: "none",
                    }}
                  />
                </div>
              </Panel>
            </Group>
          </SandpackLayout>
        </div>
      </SandpackProvider>
    </div>
  );
}
