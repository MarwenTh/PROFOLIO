"use client";

import {
  SandpackProvider,
  SandpackPreview as SandpackPreviewComponent,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import { useMemo, useState } from "react";
import { Moon, Sun, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";

interface SandboxPreviewProps {
  /** Virtual file system: path → code string */
  files: Record<string, string>;
  /** The file to use as the entry point for the preview */
  entryFile?: string;
  /** Whether the preview panel is currently hidden */
  hidden?: boolean;
}

/**
 * Live preview pane using Sandpack's in-browser bundler (iframe + WebWorker).
 * Renders the component defined in entryFile in real time as the user types.
 * Users can toggle light/dark theme, reload the preview, and fullscreen it.
 */
export function SandboxPreview({
  files,
  entryFile = "/demos/default.tsx",
  hidden = false,
}: SandboxPreviewProps) {
  const [isDark, setIsDark] = useState(true);
  const [key, setKey] = useState(0); // increment to force re-mount (hard reset)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sandpackFiles = useMemo(() => {
    return Object.fromEntries(
      Object.entries(files).map(([path, code]) => [path, { code }]),
    );
  }, [files]);

  if (hidden) return null;

  return (
    <div
      className={`flex flex-col h-full ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-white dark:bg-neutral-950"
          : "relative"
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-200 dark:border-white/5 bg-white dark:bg-neutral-950 shrink-0">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          Preview
        </span>
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <motion.button
            onClick={() => setIsDark((v) => !v)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
            title="Toggle preview theme"
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
          </motion.button>

          {/* Reload (hard reset) */}
          <motion.button
            onClick={() => setKey((k) => k + 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
            title="Reset preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>

          {/* Fullscreen */}
          <motion.button
            onClick={() => setIsFullscreen((v) => !v)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
            title="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Sandpack preview iframe */}
      <div key={key} className="flex-1 overflow-hidden">
        <SandpackProvider
          key={key}
          template="react-ts"
          files={sandpackFiles}
          options={{
            activeFile: entryFile,
            externalResources: ["https://cdn.tailwindcss.com"],
            recompileMode: "delayed",
            recompileDelay: 400,
          }}
          customSetup={{
            dependencies: {
              "framer-motion": "latest",
              "lucide-react": "latest",
              clsx: "latest",
              "tailwind-merge": "latest",
            },
          }}
          theme={isDark ? "dark" : "light"}
        >
          <SandpackLayout style={{ height: "100%", border: "none" }}>
            <SandpackPreviewComponent
              style={{ height: "100%", flex: 1 }}
              showRefreshButton={false}
              showOpenInCodeSandbox={false}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}
