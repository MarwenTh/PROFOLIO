"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  Sparkles,
} from "lucide-react";
import { useEditor } from "@/context/EditorContext";
import { cn } from "@/lib/utils";

export const ContextMenu = () => {
  const {
    contextMenu,
    closeContextMenu,
    setElementAsBackground,
    removeComponent,
    updateComponent,
    sections,
  } = useEditor();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };

    if (contextMenu.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu.isOpen, closeContextMenu]);

  if (!contextMenu.isOpen) return null;

  const targetComponent = sections
    .flatMap((s) => s.components)
    .find((c) => c.id === contextMenu.componentId);
  const isBackground = targetComponent?.styles?.isBackground;

  const menuItems = [
    {
      label: isBackground ? "Release Background" : "Set as Background",
      icon: ImageIcon,
      onClick: () => {
        if (contextMenu.componentId) {
          if (isBackground) {
            updateComponent(contextMenu.componentId, {
              styles: { ...targetComponent.styles, isBackground: false },
            });
            closeContextMenu();
          } else {
            setElementAsBackground(contextMenu.componentId);
          }
        }
      },
      show:
        !!contextMenu.componentId &&
        (targetComponent?.type === "image" ||
          targetComponent?.type === "bg-gradient"),
    },
    {
      label: "Remove Animation",
      icon: Sparkles,
      onClick: () => {
        if (contextMenu.componentId)
          updateComponent(contextMenu.componentId, { animation: undefined });
        closeContextMenu();
      },
      show: !!contextMenu.componentId && !!targetComponent?.animation,
    },
    {
      label: "Bring to Front",
      icon: MoveUp,
      onClick: () => {
        if (contextMenu.componentId)
          updateComponent(contextMenu.componentId, { zIndex: 100 });
        closeContextMenu();
      },
      show: !!contextMenu.componentId,
    },
    {
      label: "Send to Back",
      icon: MoveDown,
      onClick: () => {
        if (contextMenu.componentId)
          updateComponent(contextMenu.componentId, { zIndex: 0 });
        closeContextMenu();
      },
      show: !!contextMenu.componentId,
    },
    {
      label: "Delete",
      icon: Trash2,
      className: "text-red-400 hover:bg-red-500/10",
      onClick: () => {
        if (contextMenu.componentId) removeComponent(contextMenu.componentId);
        closeContextMenu();
      },
      show: !!contextMenu.componentId,
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-[9999] min-w-[180px] bg-[#1e1e1e]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5"
        style={{
          left: contextMenu.x,
          top: contextMenu.y,
        }}
      >
        {menuItems
          .filter((item) => item.show)
          .map((item, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick();
              }}
              className={cn(
                "w-full px-3 py-2 flex items-center gap-3 text-xs font-medium text-neutral-300 hover:bg-white/5 hover:text-white transition-colors",
                item.className,
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
      </motion.div>
    </AnimatePresence>
  );
};
