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

  const [isResizing, setIsResizing] = useState(false);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [size, setSize] = useState({
    width: component.width,
    height: component.height,
  });

  const gsapRef = useGSAPAnimation(component.animation);

  const displayData =
    device !== "desktop" && component.responsive?.[device]
      ? { ...component, ...component.responsive[device] }
      : component;

  // Sync internal size when component props change
  useEffect(() => {
    if (!isResizing) {
      setSize({ width: displayData.width, height: displayData.height });
    }
  }, [displayData.width, displayData.height, isResizing]);

  const handleResize = (event: any, info: any) => {
    const newWidth = Math.max(50, initialSize.width + info.offset.x / scale);
    const newHeight = Math.max(20, initialSize.height + info.offset.y / scale);
    setSize({ width: newWidth, height: newHeight });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    updateComponent(component.id, { width: size.width, height: size.height });
  };

  const handleDragEnd = (event: any, info: any) => {
    const newX = displayData.x + info.offset.x;
    const newY = displayData.y + info.offset.y;
    updateComponent(component.id, { x: newX, y: newY });
  };

  const [isDragOver, setIsDragOver] = useState(false);

  const animationVariants: Record<string, any> = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "slide-up": {
      initial: { y: 50, opacity: 0 },
      animate: { y: displayData.y, opacity: 1 },
    },
    "slide-down": {
      initial: { y: -50, opacity: 0 },
      animate: { y: displayData.y, opacity: 1 },
    },
    "slide-left": {
      initial: { x: 50, opacity: 0 },
      animate: { x: displayData.x, opacity: 1 },
    },
    "slide-right": {
      initial: { x: -50, opacity: 0 },
      animate: { x: displayData.x, opacity: 1 },
    },
    "scale-up": {
      initial: { scale: 0.5, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
    },
    bounce: {
      initial: { y: -20, opacity: 0 },
      animate: {
        y: displayData.y,
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

  return (
    <motion.div
      ref={(el) => {
        // @ts-ignore
        elementRef.current = el;
        gsapRef.current = el;
      }}
      drag={isResizing ? false : isSelected ? true : false}
      dragMomentum={false}
      dragElastic={0}
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
          : { x: displayData.x, y: displayData.y, opacity: 0, scale: 0.9 }
      }
      animate={{
        x: component.styles?.isBackground ? 0 : displayData.x,
        y: component.styles?.isBackground ? 0 : displayData.y,
        width: isResizing
          ? size.width
          : component.styles?.isBackground
            ? device === "mobile"
              ? 375
              : device === "tablet"
                ? 768
                : device === "wide"
                  ? 1920
                  : 1280
            : displayData.width,
        height: isResizing ? size.height : displayData.height,
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
          ? { duration: 0 }
          : {
              type: "spring",
              bounce: 0,
              duration: component.animation?.duration || 0.4,
              delay: component.animation?.delay || 0,
              ...(currentAnim?.animate?.transition || {}),
            }
      }
      style={{
        position: "absolute",
        ...component.styles,
      }}
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
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-indigo-500 rounded-full" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-indigo-500 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-indigo-500 rounded-full" />

          {/* Active Resize Handle (Bottom Right) */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setInitialSize({ width: size.width, height: size.height });
            }}
            onDrag={handleResize}
            onDragEnd={(e) => {
              e.stopPropagation();
              handleResizeEnd();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-nwse-resize z-[60]"
          />

          {/* Quick Actions */}
          <div className="absolute -top-8 right-0 flex items-center gap-1 bg-indigo-500 text-white rounded px-2 py-1 shadow-lg transform scale-0 group-hover:scale-100 transition-transform origin-bottom">
            <Move className="w-3 h-3" />
            <div className="w-px h-3 bg-white/20 mx-1" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeComponent(component.id);
              }}
              className="hover:text-red-200"
            >
              <Trash2 className="w-3 h-3" />
            </button>
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
    // Iconify Icon
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
