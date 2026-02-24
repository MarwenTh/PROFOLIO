"use client";

import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import { useMemo } from "react";

interface SandboxEditorProps {
  /** Virtual file system: path → code string */
  files: Record<string, string>;
  /** Currently active file to focus in the editor */
  activeFile: string;
  /** Called when the code content of a file changes */
  onFilesChange: (updatedFiles: Record<string, string>) => void;
}

/**
 * Code editor panel backed by Sandpack's SandpackCodeEditor.
 * Sandpack handles syntax highlighting, linting, and auto-complete
 * out of the box without any additional configuration.
 */
export function SandboxEditor({
  files,
  activeFile,
  onFilesChange,
}: SandboxEditorProps) {
  // Sandpack expects files keyed by path with a { code: string } shape
  const sandpackFiles = useMemo(() => {
    return Object.fromEntries(
      Object.entries(files).map(([path, code]) => [path, { code }]),
    );
  }, [files]);

  return (
    <SandpackProvider
      template="react-ts"
      files={sandpackFiles}
      options={{
        activeFile,
        visibleFiles: Object.keys(files),
        externalResources: ["https://cdn.tailwindcss.com"],
        recompileMode: "delayed",
        recompileDelay: 500,
      }}
      customSetup={{
        dependencies: {
          "framer-motion": "latest",
          "lucide-react": "latest",
          clsx: "latest",
          "tailwind-merge": "latest",
          "class-variance-authority": "latest",
        },
      }}
      theme="dark"
      onFilesChange={onFilesChange}
    >
      <SandpackLayout style={{ height: "100%", border: "none" }}>
        <SandpackCodeEditor
          showTabs
          showLineNumbers
          showInlineErrors
          wrapContent={false}
          style={{ height: "100%", flex: 1 }}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
}
