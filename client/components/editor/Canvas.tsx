"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useEditor } from "@/context/EditorContext";
import { Section } from "./Section";
import { ContextMenu } from "./ContextMenu";
import { Maximize } from "lucide-react";

export const Canvas = () => {
  const {
    sections,
    scale,
    setScale,
    selectSection,
    selectComponent,
    selectedId,
    removeComponent,
    device,
  } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);

  // Device dimensions
  const deviceWidths: Record<string, number> = {
    mobile: 375,
    tablet: 768,
    desktop: 1280,
    wide: 1920,
  };

  const currentWidth = deviceWidths[device] || deviceWidths.desktop;

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        // Use a ref for scale to avoid closure issues if needed,
        // but since we are in a functional component with state,
        // we should use the functional update pattern or ensure scale is in deps.
        // However, setScale is stable.
        setScale((s: number) => {
          const newScale = Math.min(Math.max(s - e.deltaY * 0.01, 0.1), 5);
          return newScale;
        });
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [setScale]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't delete if we're typing in an input
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement as any)?.isContentEditable;

      if (isInput) return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        removeComponent(selectedId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, removeComponent]);

  const fitToScreen = React.useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 100; // Padding
    const targetWidth = deviceWidths[device] || 1920;
    const newScale = Math.min(containerWidth / targetWidth, 1);
    setScale(newScale);
  }, [device, setScale]);

  React.useEffect(() => {
    fitToScreen();
    window.addEventListener("resize", fitToScreen);
    return () => window.removeEventListener("resize", fitToScreen);
  }, [device, fitToScreen]);

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full h-full bg-[#1e1e1e] overflow-y-auto relative custom-scrollbar"
      onClick={() => {
        selectSection(null);
        selectComponent(null);
      }}
    >
      <div className="min-h-full w-full py-20 flex flex-col items-center">
        <motion.div
          className="bg-white shadow-2xl relative"
          animate={{
            width: currentWidth,
            scale: scale,
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          style={{
            transformOrigin: "top center",
          }}
        >
          {sections.map((section, index) => (
            <Section key={section.id} section={section} index={index} />
          ))}
        </motion.div>
      </div>

      {/* HUD */}
      <div className="fixed bottom-4 right-[340px] flex items-center gap-2 bg-neutral-800 text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 z-50 shadow-lg">
        <span>{Math.round(scale * 100)}%</span>
        <span className="text-neutral-500">|</span>
        <span>{device === "desktop" ? "1920x1080" : device.toUpperCase()}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            fitToScreen();
          }}
          className="ml-1 p-0.5 hover:bg-white/10 rounded transition-colors"
          title="Fit to screen"
        >
          <Maximize className="w-3 h-3" />
        </button>
      </div>

      <ContextMenu />
    </div>
  );
};
