import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  File,
  FolderOpen,
  Folder,
  Plus,
  Layers,
  Eye,
  EyeOff,
  FilePlus,
  FolderPlus,
  Trash2,
  X,
  Check,
} from "lucide-react";

interface FileTreeProps {
  /** The virtual file system: { "/path/file.tsx": "code..." } */
  files: Record<string, string>;
  /** Currently active file path */
  activeFile: string;
  /** Called when user clicks a file to open it */
  onFileSelect: (path: string) => void;
  /** Open the "Add from Registry" modal */
  onAddFromRegistry: () => void;
  /** Called when files structure changes */
  onFilesUpdate: (files: Record<string, string>) => void;
}

type TreeNode = {
  name: string;
  path: string;
  isDir: boolean;
  children: TreeNode[];
};

/**
 * Builds a nested tree from flat file paths like "/src/components/ui/component.tsx".
 */
function buildTree(files: Record<string, string>): TreeNode[] {
  const root: TreeNode[] = [];

  Object.keys(files).forEach((filePath) => {
    const parts = filePath.replace(/^\//, "").split("/");
    let nodes = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const fullPath = "/" + parts.slice(0, index + 1).join("/");
      let existing = nodes.find((n) => n.name === part);

      if (!existing) {
        existing = { name: part, path: fullPath, isDir: !isLast, children: [] };
        nodes.push(existing);
      }

      if (!isLast) {
        nodes = existing.children;
      }
    });
  });

  return root;
}

/**
 * Renders a single tree node (file or folder) recursively.
 */
function TreeNode({
  node,
  depth,
  activeFile,
  onFileSelect,
  expandedPaths,
  onToggleExpand,
  onDelete,
}: {
  node: TreeNode;
  depth: number;
  activeFile: string;
  onFileSelect: (path: string) => void;
  expandedPaths: Set<string>;
  onToggleExpand: (path: string) => void;
  onDelete: (path: string) => void;
}) {
  const isExpanded = expandedPaths.has(node.path);
  const isActive = node.path === activeFile;

  const getFileIcon = (name: string) => {
    if (name.endsWith(".tsx") || name.endsWith(".ts")) return "text-blue-400";
    if (name.endsWith(".css")) return "text-pink-400";
    if (name.endsWith(".json")) return "text-yellow-400";
    return "text-neutral-400";
  };

  return (
    <div>
      <div
        className={`flex items-center group w-full text-left rounded-md text-[11px] font-medium transition-colors relative
          ${
            isActive
              ? "bg-indigo-500/15 text-indigo-400"
              : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
          }`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        <button
          onClick={() => {
            if (node.isDir) {
              onToggleExpand(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
          className="flex-1 flex items-center gap-1.5 py-0.5 truncate"
        >
          {node.isDir ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 shrink-0 text-neutral-400" />
              ) : (
                <ChevronRight className="w-3 h-3 shrink-0 text-neutral-400" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              ) : (
                <Folder className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              )}
            </>
          ) : (
            <>
              <span className="w-3 h-3 shrink-0" />
              <File
                className={`w-3.5 h-3.5 shrink-0 ${getFileIcon(node.name)}`}
              />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </button>

        {/* Delete button shown only on hover */}
        {!isActive &&
          !["/App.tsx", "/component.tsx", "/utils.ts", "/styles.css"].includes(
            node.path,
          ) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.path);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all absolute right-1"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
      </div>

      <AnimatePresence initial={false}>
        {node.isDir && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                onFileSelect={onFileSelect}
                expandedPaths={expandedPaths}
                onToggleExpand={onToggleExpand}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Left panel file tree for the Sandbox IDE.
 * Displays a navigable, collapsible file tree from the virtual file system.
 */
export function FileTree({
  files,
  activeFile,
  onFileSelect,
  onAddFromRegistry,
  onFilesUpdate,
}: FileTreeProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(["/src", "/src/components", "/src/components/ui", "/src/demos"]),
  );

  // Creation state
  const [isCreating, setIsCreating] = useState<"file" | "folder" | null>(null);
  const [newName, setNewName] = useState("");

  const onToggleExpand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  }, []);

  const handleCreate = () => {
    if (!newName) {
      setIsCreating(null);
      return;
    }

    let path = newName.startsWith("/") ? newName : `/${newName}`;

    if (isCreating === "file") {
      // Add a default extension if missing
      if (!path.includes(".")) path += ".tsx";

      const nextFiles = {
        ...files,
        [path]:
          "export default function " +
          (newName.split(".")[0] || "NewComponent") +
          "() {\n  return <div>New File</div>;\n}\n",
      };
      onFilesUpdate(nextFiles);
      onFileSelect(path);
    } else {
      // For folders, we add a dummy .gitkeep file so the tree can "see" it
      const dummyPath = path.endsWith("/")
        ? `${path}.gitkeep`
        : `${path}/.gitkeep`;
      const nextFiles = { ...files, [dummyPath]: "" };
      onFilesUpdate(nextFiles);
    }

    setNewName("");
    setIsCreating(null);
  };

  const handleDelete = (path: string) => {
    const nextFiles = { ...files };

    // If it's a file, just delete it
    // If it's a folder, delete everything nested inside it
    Object.keys(nextFiles).forEach((p) => {
      if (p === path || p.startsWith(path + "/")) {
        delete nextFiles[p];
      }
    });

    onFilesUpdate(nextFiles);
  };

  // Filter to only show "user-facing" files unless "show all" is toggled
  const visibleFiles = showAll
    ? files
    : Object.fromEntries(
        Object.entries(files).filter(
          ([path]) =>
            !path.includes("package.json") &&
            !path.includes("app.tsx") &&
            !path.includes("vite.config") &&
            !path.includes(".gitkeep"),
        ),
      );

  const tree = buildTree(visibleFiles);

  return (
    <aside className="flex flex-col w-52 shrink-0 border-r border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Files
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreating("file")}
            className="p-1 text-neutral-400 hover:text-indigo-400 hover:bg-indigo-500/5 rounded transition-colors"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsCreating("folder")}
            className="p-1 text-neutral-400 hover:text-indigo-400 hover:bg-indigo-500/5 rounded transition-colors"
            title="New Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Creation Input */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-2 py-2 border-b border-neutral-200 dark:border-white/5"
          >
            <div className="flex items-center gap-1 bg-white dark:bg-neutral-800 border border-indigo-500/30 rounded px-1.5 py-1">
              {isCreating === "file" ? (
                <File className="w-3 h-3 text-indigo-400" />
              ) : (
                <Folder className="w-3 h-3 text-indigo-400" />
              )}
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") {
                    setIsCreating(null);
                    setNewName("");
                  }
                }}
                placeholder={isCreating === "file" ? "file.tsx" : "folder name"}
                className="bg-transparent outline-none text-[11px] w-full"
              />
              <button onClick={handleCreate}>
                <Check className="w-3 h-3 text-green-500 hover:text-green-400" />
              </button>
              <button onClick={() => setIsCreating(null)}>
                <X className="w-3 h-3 text-red-500 hover:text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tree */}
      <div className="flex-1 py-2 px-1 space-y-0.5 overflow-y-auto">
        {tree.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            depth={0}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            expandedPaths={expandedPaths}
            onToggleExpand={onToggleExpand}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Bottom actions */}
      <div className="shrink-0 border-t border-neutral-200 dark:border-white/5">
        <button
          onClick={onAddFromRegistry}
          className="flex items-center gap-2 w-full px-3 py-2 text-[11px] font-bold text-neutral-500 hover:text-indigo-500 hover:bg-indigo-500/5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add from Registry
        </button>
        <button
          onClick={() => setShowAll((v) => !v)}
          className="flex items-center gap-2 w-full px-3 py-2 text-[11px] font-bold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
        >
          {showAll ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
          {showAll ? "Hide system files" : "Show all files"}
        </button>
      </div>
    </aside>
  );
}
