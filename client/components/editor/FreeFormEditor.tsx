"use client";

import React from "react";
import { EditorProvider, useEditor } from "@/context/EditorContext";
import { Canvas } from "./Canvas";
import { EditorTools } from "./EditorTools";
import { PropertiesPanel } from "./PropertiesPanel";
import { ProModal } from "./ProModal";
import { usePortfolio } from "@/hooks/usePortfolio"; // Hook for saving?

import { EditorMediaModal } from "../library/EditorMediaModal";
import {
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Eye,
  ChevronLeft,
  Tv,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { LibraryProvider } from "@/context/LibraryContext";
import { toast } from "sonner";

// Inner component to consume context
const EditorLayout = () => {
  // ... rest of destructuring ...
  const {
    selectedId,
    selectedSectionId,
    sections,
    updateComponent,
    removeComponent,
    updateSection,
    removeSection,
    device,
    setDevice,
    isMediaModalOpen,
    setMediaModalOpen,
    addComponent,
  } = useEditor();

  const { updatePortfolio, getPortfolioById } = usePortfolio();
  const params = useParams();
  const id = params.id as string;

  const selectedComponent = sections
    .flatMap((s) => s.components)
    .find((c) => c.id === selectedId);
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const [portfolioData, setPortfolioData] = React.useState<any>(null);

  React.useEffect(() => {
    if (id) {
      getPortfolioById(id).then((res) => {
        if (res.success) setPortfolioData(res.portfolio);
      });
    }
  }, [id, getPortfolioById]);

  const handleSave = async () => {
    const res = await updatePortfolio(id, { content: sections });
    if (res.success) {
      toast.success("Portfolio saved successfully!", {
        description: "Your changes are now live.",
      });
    } else {
      toast.error("Failed to save portfolio");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#121212]">
      {/* Top Bar */}
      <div className="h-14 border-b border-white/5 bg-[#121212] flex items-center justify-between px-4 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-white text-sm">Portfolio Editor</span>
        </div>

        {/* Device Toggles */}
        <div className="flex items-center bg-[#1e1e1e] rounded-lg p-1 border border-white/5">
          <button
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded-md transition-all ${device === "mobile" ? "bg-indigo-500 text-white" : "text-neutral-500 hover:text-white"}`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`p-1.5 rounded-md transition-all ${device === "tablet" ? "bg-indigo-500 text-white" : "text-neutral-500 hover:text-white"}`}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded-md transition-all ${device === "desktop" ? "bg-indigo-500 text-white" : "text-neutral-500 hover:text-white"}`}
            title="Desktop (1280px)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice("wide")}
            className={`p-1.5 rounded-md transition-all ${device === "wide" ? "bg-indigo-500 text-white" : "text-neutral-500 hover:text-white"}`}
            title="Wide PC (1920x1080)"
          >
            <Tv className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={portfolioData?.slug ? `/p/${portfolioData.slug}` : `/p/${id}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-all"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Toolbar */}
        <EditorTools />

        {/* Main Canvas Area */}
        <div className="flex-1 relative flex flex-col">
          <Canvas />
        </div>

        {/* Properties Panel (Right Sidebar) - Now Absolute Overlay */}
        {(selectedComponent || selectedSection) && (
          <div className="absolute top-0 right-0 w-[320px] h-full border-l border-white/5 z-40 bg-[#0F0F10] overflow-y-auto custom-scrollbar shadow-2xl">
            <PropertiesPanel
              component={(selectedComponent || selectedSection) as any}
              onUpdate={
                (selectedComponent ? updateComponent : updateSection) as any
              }
              onDelete={
                (selectedComponent ? removeComponent : removeSection) as any
              }
            />
          </div>
        )}
      </div>

      <EditorMediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectImage={(url) => {
          const targetSectionId = selectedSectionId || sections[0]?.id;
          if (!targetSectionId) {
            toast.error("Add a section first!", {
              description: "You need at least one section to add images.",
            });
            return;
          }

          addComponent(targetSectionId, {
            type: "image",
            content: url,
            styles: {},
            width: 400,
            height: 300,
            x: 50,
            y: 50,
          });
          setMediaModalOpen(false);
        }}
        onImportCollection={() => {}}
        currentAssets={[]}
      />
      <ProModal />
    </div>
  );
};

export const FreeFormEditor = ({
  initialSections = [],
}: {
  initialSections?: any[];
}) => {
  return (
    <LibraryProvider>
      <EditorProvider initialSections={initialSections}>
        <EditorLayout />
      </EditorProvider>
    </LibraryProvider>
  );
};
