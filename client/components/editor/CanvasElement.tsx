"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { EditorComponent } from "@/lib/editor-types";
import { cn } from "@/lib/utils";
import { useEditor } from "@/context/EditorContext";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";
import { Trash2, Move } from "lucide-react";
import { toast } from "sonner";
import { ShinyText } from "../reactbits/ShinyText";
import { SplitText } from "../reactbits/SplitText";
import { Aurora } from "../reactbits/Aurora";
import { ShinyButton } from "../reactbits/ShinyButton";
import { BlurText } from "../reactbits/BlurText";
import { GradientText } from "../reactbits/GradientText";
import { CountUp } from "../reactbits/CountUp";
import { Squares } from "../reactbits/Squares";
import { Hyperspeed } from "../reactbits/Hyperspeed";
import { Waves } from "../reactbits/Waves";
import { SpotlightCard } from "../reactbits/SpotlightCard";
import { TiltedCard } from "../reactbits/TiltedCard";
import { LiquidChrome } from "../reactbits/LiquidChrome";
import { GlitchText } from "../reactbits/GlitchText";
import {
  BlockHero,
  BlockAbout,
  BlockSkills,
  BlockProjects,
  BlockExperience,
  BlockTestimonials,
  BlockContact,
  BlockStats,
  BlockCTA,
  BlockSocialBar,
  BlockFooter,
  BlockPricing,
  BlockBlog,
  BlockResume,
  BlockGallery,
  BlockFAQ,
  BlockServices,
  BlockTeam,
  BlockAwards,
  BlockEducation,
} from "./blocks";

interface CanvasElementProps {
  component: EditorComponent;
}

export const CanvasElement = ({ component }: CanvasElementProps) => {
  const {
    selectedId,
    selectComponent,
    updateComponent,
    removeComponent,
    scale,
    device,
    openContextMenu,
  } = useEditor();
  const isSelected = selectedId === component.id;
  const elementRef = useRef<HTMLDivElement>(null);

  const dragControls = useDragControls();
  const [isResizing, setIsResizing] = useState(false);
  const activeLayout = useRef({
    width: component.width,
    height: component.height,
    x: component.x,
    y: component.y,
  });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const [size, setSize] = useState({
    width: component.width,
    height: component.height,
  });
  const [pos, setPos] = useState({ x: component.x, y: component.y });

  const gsapRef = useGSAPAnimation(component.animation);

  const displayData =
    device !== "desktop" && component.responsive?.[device]
      ? { ...component, ...component.responsive[device] }
      : component;

  // Sync internal size/pos when component props change
  useEffect(() => {
    if (isResizing) return;

    setSize({ width: displayData.width, height: displayData.height });
    setPos({ x: displayData.x, y: displayData.y });
    activeLayout.current = {
      width: displayData.width,
      height: displayData.height,
      x: displayData.x,
      y: displayData.y,
    };
  }, [
    displayData.width,
    displayData.height,
    displayData.x,
    displayData.y,
    isResizing,
  ]);

  const handleResize = (e: any, direction: string) => {
    const currentX =
      (e as any).touches && (e as any).touches.length > 0
        ? (e as any).touches[0].clientX
        : (e as any).clientX;
    const currentY =
      (e as any).touches && (e as any).touches.length > 0
        ? (e as any).touches[0].clientY
        : (e as any).clientY;

    const dx = (currentX - dragStartPos.current.x) / scale;
    const dy = (currentY - dragStartPos.current.y) / scale;

    let newWidth = initialSize.current.width;
    let newHeight = initialSize.current.height;
    let newX = initialPos.current.x;
    let newY = initialPos.current.y;

    if (direction.includes("e")) {
      newWidth = Math.max(30, initialSize.current.width + dx);
    }
    if (direction.includes("w")) {
      const delta = Math.min(dx, initialSize.current.width - 30);
      newWidth = initialSize.current.width - delta;
      newX = initialPos.current.x + delta;
    }
    if (direction.includes("s")) {
      newHeight = Math.max(30, initialSize.current.height + dy);
    }
    if (direction.includes("n")) {
      const delta = Math.min(dy, initialSize.current.height - 30);
      newHeight = initialSize.current.height - delta;
      newY = initialPos.current.y + delta;
    }

    activeLayout.current = {
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY,
    };
    setSize({ width: newWidth, height: newHeight });
    setPos({ x: newX, y: newY });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    updateComponent(component.id, {
      width: activeLayout.current.width,
      height: activeLayout.current.height,
      x: activeLayout.current.x,
      y: activeLayout.current.y,
    });
  };

  const handleDragEnd = (event: any, info: any) => {
    const newX = displayData.x + info.offset.x;
    const newY = displayData.y + info.offset.y;
    setPos({ x: newX, y: newY });
    updateComponent(component.id, { x: newX, y: newY });
  };

  const [isDragOver, setIsDragOver] = useState(false);

  const animationVariants: Record<string, any> = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "slide-up": {
      initial: { y: 50, opacity: 0 },
      animate: { y: pos.y, opacity: 1 },
    },
    "slide-down": {
      initial: { y: -50, opacity: 0 },
      animate: { y: pos.y, opacity: 1 },
    },
    "slide-left": {
      initial: { x: 50, opacity: 0 },
      animate: { x: pos.x, opacity: 1 },
    },
    "slide-right": {
      initial: { x: -50, opacity: 0 },
      animate: { x: pos.x, opacity: 1 },
    },
    "scale-up": {
      initial: { scale: 0.5, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
    },
    bounce: {
      initial: { y: -20, opacity: 0 },
      animate: {
        y: pos.y,
        opacity: 1,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      },
    },
    rotate: {
      initial: { rotate: -180, opacity: 0 },
      animate: { rotate: 0, opacity: 1 },
    },
  };

  const currentAnim =
    component.animation && component.animation.engine !== "gsap"
      ? animationVariants[component.animation.type]
      : null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "animation") {
        updateComponent(component.id, { animation: data.animation });
        toast.success(`Animation "${data.animation.type}" applied!`);
      }
    } catch (err) {
      console.error("Failed to parse animation data", err);
    }
  };

  const resizeHandles = [
    { dir: "nw", class: "top-0 left-0 cursor-nwse-resize" },
    { dir: "n", class: "top-0 left-1/2 cursor-ns-resize" },
    { dir: "ne", class: "top-0 left-full cursor-nesw-resize" },
    { dir: "e", class: "top-1/2 left-full cursor-ew-resize" },
    { dir: "se", class: "top-full left-full cursor-nwse-resize" },
    { dir: "s", class: "top-full left-1/2 cursor-ns-resize" },
    { dir: "sw", class: "top-full left-0 cursor-nesw-resize" },
    { dir: "w", class: "top-1/2 left-0 cursor-ew-resize" },
  ];

  return (
    <motion.div
      ref={(el) => {
        // @ts-ignore
        elementRef.current = el;
        gsapRef.current = el;
      }}
      drag={
        isSelected && !isResizing && !component.styles?.isBackground
          ? true
          : false
      }
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onPointerDown={(e) => {
        if (isSelected && !isResizing) {
          dragControls.start(e);
        }
      }}
      onDragStart={() => selectComponent(component.id)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onContextMenu={(e) => {
        if (!isSelected) return;
        e.preventDefault();
        e.stopPropagation();
        openContextMenu(e.clientX, e.clientY, component.id, null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
      initial={
        currentAnim
          ? currentAnim.initial
          : { x: pos.x, y: pos.y, opacity: 0, scale: 0.9 }
      }
      style={{
        position: "absolute",
        ...component.styles,
      }}
      animate={{
        x: component.styles?.isBackground ? 0 : pos.x,
        y: component.styles?.isBackground ? 0 : pos.y,
        width: isResizing
          ? size.width
          : component.styles?.isBackground
            ? "100%"
            : size.width,
        height: isResizing
          ? size.height
          : component.styles?.isBackground
            ? "100%"
            : size.height,
        opacity: 1,
        scale: 1,
        rotate: 0,
        zIndex: isSelected
          ? component.styles?.isBackground
            ? (component.zIndex ?? 0)
            : 1000
          : (component.zIndex ?? 1),
        ...(currentAnim ? currentAnim.animate : {}),
      }}
      transition={
        isResizing
          ? { type: "tween", duration: 0 }
          : {
              type: "spring",
              bounce: 0,
              duration: component.animation?.duration || 0.4,
              delay: component.animation?.delay || 0,
              ...(currentAnim?.animate?.transition || {}),
            }
      }
      className={cn(
        "group cursor-pointer select-none transition-shadow",
        isSelected
          ? "ring-2 ring-indigo-500 z-50"
          : "hover:ring-1 hover:ring-indigo-500/50",
        isDragOver && "ring-4 ring-orange-500 bg-orange-500/10",
      )}
    >
      {/* Render Content Based on Type */}
      <div className="w-full h-full overflow-hidden relative pointer-events-none">
        {renderContent(component)}
      </div>

      {/* Selection/Hover Controls */}
      {isSelected && (
        <>
          {/* Resize Handles */}
          {!component.styles?.isBackground &&
            resizeHandles.map((h) => (
              <motion.div
                key={h.dir}
                onPanStart={(e) => {
                  // @ts-ignore - Some browsers pass event in different ways
                  if (e && e.stopPropagation) e.stopPropagation();

                  const clientX =
                    (e as any).touches && (e as any).touches.length > 0
                      ? (e as any).touches[0].clientX
                      : (e as any).clientX;
                  const clientY =
                    (e as any).touches && (e as any).touches.length > 0
                      ? (e as any).touches[0].clientY
                      : (e as any).clientY;
                  dragStartPos.current = { x: clientX, y: clientY };

                  setIsResizing(true);
                  initialSize.current = {
                    width: size.width,
                    height: size.height,
                  };
                  initialPos.current = { x: pos.x, y: pos.y };
                }}
                onPan={(e, info) => {
                  // @ts-ignore
                  if (e && e.stopPropagation) e.stopPropagation();
                  handleResize(e, h.dir);
                }}
                onPanEnd={(e) => {
                  // @ts-ignore
                  if (e && e.stopPropagation) e.stopPropagation();
                  handleResizeEnd();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className={cn(
                  "absolute w-6 h-6 flex items-center justify-center z-[60] -translate-x-1/2 -translate-y-1/2",
                  h.class,
                  // Hide middle handles if element is too small
                  (h.dir === "n" || h.dir === "s") &&
                    size.width < 40 &&
                    "hidden",
                  (h.dir === "e" || h.dir === "w") &&
                    size.height < 40 &&
                    "hidden",
                )}
              >
                <div className="w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow-sm" />
              </motion.div>
            ))}

          {/* Quick Actions - Added a wrapper with padding to bridge the hover gap */}
          <div className="absolute -top-12 right-0 h-12 flex items-end pb-2 group/toolbar z-[70]">
            <div className="flex items-center gap-1 bg-indigo-500 text-white rounded px-2 py-1 shadow-lg transform scale-0 group-hover:scale-100 transition-transform origin-bottom">
              <Move className="w-3 h-3" />
              <div className="w-px h-3 bg-white/20 mx-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeComponent(component.id);
                }}
                className="hover:text-red-200 transition-colors"
                title="Delete element"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
const renderContent = (component: EditorComponent) => {
  switch (component.type) {
    case "text":
      return (
        <p style={{ fontSize: "inherit", color: "inherit" }}>
          {component.content || "Double click to edit"}
        </p>
      );
    case "split-text":
      return <SplitText text={component.content || "Splitting Text"} />;
    case "shiny-text":
      return <ShinyText text={component.content || "Metallic Shine"} />;
    case "blur-text":
      return <BlurText text={component.content || "Blurry Reveal"} />;
    case "gradient-text":
      return <GradientText text={component.content || "Color Flow"} />;
    case "glitch-text":
      return <GlitchText text={component.content || "System Glitch"} />;
    case "count-up":
      return <CountUp to={parseInt(component.content) || 100} />;
    case "aurora-bg":
      return <Aurora />;
    case "squares-bg":
      return <Squares />;
    case "hyperspeed-bg":
      return <Hyperspeed />;
    case "waves-bg":
      return <Waves />;
    case "liquid-chrome":
      return <LiquidChrome />;
    case "shiny-button":
      return <ShinyButton text={component.content || "Shiny Button"} />;
    case "spotlight-card":
      return (
        <SpotlightCard>{component.content || "Spotlight Card"}</SpotlightCard>
      );
    case "tilted-card":
      return <TiltedCard>{component.content || "3D Tilted Card"}</TiltedCard>;
    case "button":
      return (
        <button className="w-full h-full px-4 py-2 bg-indigo-500 text-white rounded shadow-sm flex items-center justify-center">
          {component.content || "Button"}
        </button>
      );
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={component.content || "https://via.placeholder.com/150"}
          alt="placeholder"
          className="w-full h-full object-cover pointer-events-none"
        />
      );
    case "container":
    case "row":
    case "column":
      return (
        <div className="w-full h-full border border-dashed border-neutral-700 bg-neutral-900/50" />
      );
    // Core Blocks
    case "block-hero":
      return (
        <BlockHero
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-about":
      return (
        <BlockAbout
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-skills":
      return (
        <BlockSkills
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-projects":
      return (
        <BlockProjects
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-experience":
      return (
        <BlockExperience
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-testimonials":
      return (
        <BlockTestimonials
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-contact":
      return (
        <BlockContact
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-stats":
      return (
        <BlockStats
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-cta":
      return (
        <BlockCTA
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-social-bar":
      return (
        <BlockSocialBar
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-footer":
      return (
        <BlockFooter
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    // Extended Blocks
    case "block-pricing":
      return (
        <BlockPricing
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-blog":
      return (
        <BlockBlog
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-resume":
      return (
        <BlockResume
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-gallery":
      return (
        <BlockGallery
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-faq":
      return (
        <BlockFAQ
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-services":
      return (
        <BlockServices
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-team":
      return (
        <BlockTeam
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-awards":
      return (
        <BlockAwards
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    case "block-education":
      return (
        <BlockEducation
          content={component.content}
          styles={component.styles}
          isEditor={true}
        />
      );
    // Button Variants
    case "btn-primary":
      return (
        <button className="w-full h-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl">
          {component.content || "Primary"}
        </button>
      );
    case "btn-outline":
      return (
        <button className="w-full h-full px-6 py-3 border-2 border-indigo-500 text-indigo-400 font-bold rounded-xl bg-transparent">
          {component.content || "Outline"}
        </button>
      );
    case "btn-ghost":
      return (
        <button className="w-full h-full px-6 py-3 text-white font-bold rounded-xl bg-white/5 hover:bg-white/10">
          {component.content || "Ghost"}
        </button>
      );
    case "btn-pill":
      return (
        <button className="w-full h-full px-8 py-3 bg-indigo-500 text-white font-bold rounded-full">
          {component.content || "Pill"}
        </button>
      );
    case "btn-glow":
      return (
        <button className="w-full h-full px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/50">
          {component.content || "Glow"}
        </button>
      );
    case "bg-gradient": {
      const isFullCss = component.content?.includes(";");
      const styles: any = {};

      if (isFullCss) {
        const parts = component.content.split(";");
        parts.forEach((part: string) => {
          const colonIndex = part.indexOf(":");
          if (colonIndex > -1) {
            const prop = part.substring(0, colonIndex).trim();
            const val = part.substring(colonIndex + 1).trim();
            const camelProp = prop.replace(/-([a-z])/g, (g) =>
              g[1].toUpperCase(),
            );
            styles[camelProp] = val;
          }
        });
      } else {
        styles.background = component.content;
      }

      return <div className="w-full h-full" style={styles} />;
    }
    case "profolio-branding":
      return (
        <div className="w-full h-full flex items-center justify-center bg-white/5 dark:bg-black/20 rounded-xl border border-dashed border-white/10 group/branding">
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-white/10 border border-neutral-200 dark:border-white/10 flex items-center gap-2 shadow-sm group-hover/branding:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Built with PROFOLIO
            </span>
          </div>
        </div>
      );
    case "iconify-icon":
      return (
        <div
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{
            __html:
              component.content?.svg ||
              '<svg viewBox="0 0 24 24" class="w-full h-full"><circle cx="12" cy="12" r="10" fill="#6366f1"/></svg>',
          }}
        />
      );
    default:
      return (
        <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-500">
          {component.type}
        </div>
      );
  }
};
