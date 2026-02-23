"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Layout,
  Type,
  Image as ImageIcon,
  Smartphone,
  Layers,
  Sparkles,
  Grid,
  Shapes,
  Upload,
  Plus,
  Play,
  Blocks,
  Palette,
  Smile,
  MousePointer2,
  Clock,
  Store,
} from "lucide-react";
import { useEditor } from "@/context/EditorContext";
import { cn } from "@/lib/utils";
import { useLibrary } from "@/hooks/useLibrary";
import { BackgroundStudio } from "./BackgroundStudio";
import { IconPicker } from "./IconPicker";
import { usePurchases } from "@/hooks/useMarketplace";
import { toast } from "sonner";

type Category =
  | "elements"
  | "blocks"
  | "magic"
  | "animations"
  | "templates"
  | "backgrounds"
  | "icons"
  | "uploads"
  | "store";

export const ComponentsLibrary = () => {
  const {
    activeTool,
    setActiveTool,
    addComponent,
    addSectionWithTemplate,
    sections,
    selectedSectionId,
    setMediaModalOpen,
  } = useEditor();
  const { recentlyUsed, fetchRecentlyUsed, deleteRecentlyUsed } = useLibrary();
  const { purchases, loading: loadingPurchases } = usePurchases();
  const [category, setCategory] = useState<Category>("elements");

  React.useEffect(() => {
    if (category === "backgrounds") fetchRecentlyUsed("background");
    if (category === "icons") fetchRecentlyUsed("icon");
    if (category === "uploads") fetchRecentlyUsed("upload");
  }, [category, fetchRecentlyUsed]);

  const [searchQuery, setSearchQuery] = useState("");

  const isOpen = activeTool === "components";

  const handleAddElement = (
    type: any,
    content: any,
    size: { w: number; h: number; [key: string]: any },
  ) => {
    const targetSectionId = selectedSectionId || sections[0]?.id;
    if (!targetSectionId) return;

    addComponent(targetSectionId, {
      type,
      content,
      styles: size.styles || {},
      width: size.w,
      height: size.h,
      x: 100,
      y: 100,
    });
  };

  const [bgStudioOpen, setBgStudioOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const categories = [
    { id: "elements", icon: Shapes, label: "Elements" },
    { id: "blocks", icon: Blocks, label: "Blocks" },
    { id: "magic", icon: Sparkles, label: "Magic" },
    { id: "animations", icon: Play, label: "Animate" },
    { id: "templates", icon: Layout, label: "Templates" },
    { id: "backgrounds", icon: Palette, label: "BG Studio" },
    { id: "icons", icon: Smile, label: "Icons" },
    { id: "uploads", icon: Upload, label: "Uploads" },
    { id: "store", icon: Store, label: "Purchases" },
  ];

  const basicElements = [
    {
      icon: Type,
      name: "Text",
      type: "text",
      content: "New Text",
      size: { w: 200, h: 50 },
    },
    {
      icon: ImageIcon,
      name: "Image",
      type: "image",
      content: "",
      size: { w: 400, h: 300 },
    },
    {
      icon: Smartphone,
      name: "Button",
      type: "button",
      content: "Button",
      size: { w: 120, h: 40 },
    },
    {
      icon: Layers,
      name: "Container",
      type: "container",
      content: "",
      size: { w: 200, h: 200 },
    },
    {
      icon: MousePointer2,
      name: "Primary Btn",
      type: "btn-primary",
      content: "Get Started",
      size: { w: 160, h: 48 },
    },
    {
      icon: MousePointer2,
      name: "Outline Btn",
      type: "btn-outline",
      content: "Learn More",
      size: { w: 160, h: 48 },
    },
    {
      icon: MousePointer2,
      name: "Ghost Btn",
      type: "btn-ghost",
      content: "Read More",
      size: { w: 160, h: 48 },
    },
    {
      icon: MousePointer2,
      name: "Pill Btn",
      type: "btn-pill",
      content: "Sign Up",
      size: { w: 160, h: 48 },
    },
    {
      icon: MousePointer2,
      name: "Glow Btn",
      type: "btn-glow",
      content: "Buy Now",
      size: { w: 160, h: 48 },
    },
  ];

  const coreBlocks = [
    {
      name: "Hero",
      type: "block-hero",
      desc: "Headline + CTA",
      size: { w: 800, h: 500 },
    },
    {
      name: "About",
      type: "block-about",
      desc: "Photo + Bio",
      size: { w: 800, h: 500 },
    },
    {
      name: "Skills",
      type: "block-skills",
      desc: "Skill bars/tags",
      size: { w: 800, h: 450 },
    },
    {
      name: "Projects",
      type: "block-projects",
      desc: "Project cards",
      size: { w: 900, h: 600 },
    },
    {
      name: "Experience",
      type: "block-experience",
      desc: "Timeline",
      size: { w: 800, h: 550 },
    },
    {
      name: "Testimonials",
      type: "block-testimonials",
      desc: "Quote cards",
      size: { w: 900, h: 500 },
    },
    {
      name: "Contact",
      type: "block-contact",
      desc: "Contact form",
      size: { w: 800, h: 550 },
    },
    {
      name: "Stats",
      type: "block-stats",
      desc: "Counter row",
      size: { w: 800, h: 200 },
    },
    {
      name: "CTA",
      type: "block-cta",
      desc: "Call-to-action",
      size: { w: 800, h: 300 },
    },
    {
      name: "Social Bar",
      type: "block-social-bar",
      desc: "Social icons",
      size: { w: 600, h: 200 },
    },
    {
      name: "Footer",
      type: "block-footer",
      desc: "Page footer",
      size: { w: 800, h: 150 },
    },
  ];

  const extendedBlocks = [
    {
      name: "Pricing",
      type: "block-pricing",
      desc: "Pricing tiers",
      size: { w: 900, h: 600 },
    },
    {
      name: "Blog",
      type: "block-blog",
      desc: "Article previews",
      size: { w: 900, h: 500 },
    },
    {
      name: "Resume",
      type: "block-resume",
      desc: "Download CV",
      size: { w: 800, h: 400 },
    },
    {
      name: "Gallery",
      type: "block-gallery",
      desc: "Masonry gallery",
      size: { w: 900, h: 600 },
    },
    {
      name: "FAQ",
      type: "block-faq",
      desc: "Accordion Q&A",
      size: { w: 800, h: 500 },
    },
    {
      name: "Services",
      type: "block-services",
      desc: "Service cards",
      size: { w: 900, h: 500 },
    },
    {
      name: "Team",
      type: "block-team",
      desc: "Team members",
      size: { w: 900, h: 450 },
    },
    {
      name: "Awards",
      type: "block-awards",
      desc: "Awards/certs",
      size: { w: 800, h: 450 },
    },
    {
      name: "Education",
      type: "block-education",
      desc: "Education timeline",
      size: { w: 800, h: 400 },
    },
  ];

  const magicElements = [
    {
      icon: Sparkles,
      name: "Split Text",
      type: "split-text",
      content: "Splitting News",
      size: { w: 400, h: 60 },
    },
    {
      icon: Sparkles,
      name: "Blur Text",
      type: "blur-text",
      content: "Blurry Reveal",
      size: { w: 400, h: 60 },
    },
    {
      icon: Sparkles,
      name: "Shiny Text",
      type: "shiny-text",
      content: "Metallic Shine",
      size: { w: 400, h: 60 },
    },
    {
      icon: Sparkles,
      name: "Gradient Text",
      type: "gradient-text",
      content: "Color Flow",
      size: { w: 400, h: 60 },
    },
    {
      icon: Sparkles,
      name: "Glitch Text",
      type: "glitch-text",
      content: "System Glitch",
      size: { w: 400, h: 70 },
    },
    {
      icon: Sparkles,
      name: "Count Up",
      type: "count-up",
      content: "100",
      size: { w: 150, h: 80 },
    },
    {
      icon: Sparkles,
      name: "Aurora BG",
      type: "aurora-bg",
      content: "",
      size: { w: 600, h: 400 },
    },
    {
      icon: Sparkles,
      name: "Squares BG",
      type: "squares-bg",
      content: "",
      size: { w: 600, h: 400 },
    },
    {
      icon: Sparkles,
      name: "Hyperspeed BG",
      type: "hyperspeed-bg",
      content: "",
      size: { w: 600, h: 400 },
    },
    {
      icon: Sparkles,
      name: "Waves BG",
      type: "waves-bg",
      content: "",
      size: { w: 600, h: 400 },
    },
    {
      icon: Sparkles,
      name: "Liquid Chrome",
      type: "liquid-chrome",
      content: "",
      size: { w: 600, h: 400 },
    },
    {
      icon: Sparkles,
      name: "Shiny Button",
      type: "shiny-button",
      content: "Click Me!",
      size: { w: 160, h: 50 },
    },
    {
      icon: Sparkles,
      name: "Spotlight Card",
      type: "spotlight-card",
      content: "Spotlight Content",
      size: { w: 300, h: 200 },
    },
    {
      icon: Sparkles,
      name: "Tilted Card",
      type: "tilted-card",
      content: "3D Card Content",
      size: { w: 300, h: 200 },
    },
  ];

  const animations = [
    {
      name: "Fade In",
      type: "fade",
      engine: "framer",
      description: "Framer: Smooth entrance",
    },
    {
      name: "Slide Up",
      type: "slide-up",
      engine: "framer",
      description: "Framer: Moves from bottom",
    },
    {
      name: "Scale Up",
      type: "scale-up",
      engine: "framer",
      description: "Framer: Grows into place",
    },
    {
      name: "Bounce",
      type: "bounce",
      engine: "framer",
      description: "Framer: Playful jump",
    },
    {
      name: "Rotate",
      type: "rotate",
      engine: "framer",
      description: "Framer: Full spin",
    },
    {
      name: "GSAP Pulse",
      type: "pulse",
      engine: "gsap",
      description: "GSAP: Heartbeat loop",
    },
    {
      name: "GSAP Float",
      type: "float",
      engine: "gsap",
      description: "GSAP: Floating air",
    },
    {
      name: "GSAP Wiggle",
      type: "wiggle",
      engine: "gsap",
      description: "GSAP: Playful shake",
    },
    {
      name: "GSAP Spin",
      type: "spin-loop",
      engine: "gsap",
      description: "GSAP: Continuous spin",
    },
  ];

  const templates = [
    {
      id: "hero-minimal",
      name: "Minimal Hero",
      preview:
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80",
      description: "Simple clean header",
    },
    {
      id: "feature-grid",
      name: "Feature Grid",
      preview:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
      description: "Three columns grid",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="library-panel"
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute left-2 top-0 bottom-0 w-[420px] bg-[#1e1e1e] border border-white/10 rounded-r-2xl z-[90] flex overflow-hidden shadow-2xl"
        >
          {/* Left Mini-Sidebar Categories */}
          <div className="w-[72px] bg-[#1a1a1b] border-r border-white/5 flex flex-col py-4 px-1 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id as Category)}
                className={cn(
                  "flex flex-col items-center justify-center py-3 rounded-lg transition-all group",
                  category === cat.id
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-neutral-500 hover:text-white hover:bg-white/5",
                )}
              >
                <cat.icon
                  className={cn(
                    "w-5 h-5 mb-1",
                    category === cat.id
                      ? "text-indigo-400"
                      : "text-neutral-500 group-hover:text-white",
                  )}
                />
                <span className="text-[9px] font-medium">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <span className="text-white font-bold text-sm tracking-tight">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              <button
                onClick={() => setActiveTool("select")}
                className="p-1 hover:bg-white/5 rounded-md text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${category}...`}
                  className="w-full bg-[#141415] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Category Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                {category === "elements" && (
                  <motion.div
                    key="elements"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {basicElements.map((el) => (
                      <button
                        key={el.name}
                        onClick={() =>
                          handleAddElement(el.type, el.content, el.size)
                        }
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#2a2a2b] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/[0.03] transition-all group relative overflow-hidden active:scale-95"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                          <el.icon className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-[10px] text-neutral-400 group-hover:text-white font-semibold">
                          {el.name}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {category === "magic" && (
                  <motion.div
                    key="magic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-1 gap-3"
                  >
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-2">
                      <p className="text-[10px] text-indigo-300 font-medium">
                        ✨ Powered by ReactBits
                      </p>
                    </div>
                    {magicElements.map((el) => (
                      <button
                        key={el.name}
                        onClick={() =>
                          handleAddElement(el.type, el.content, el.size)
                        }
                        className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#2a2a2b] to-[#252526] border border-white/5 hover:border-indigo-500/50 hover:from-indigo-500/10 transition-all active:scale-[0.98]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-orange-400" />
                        </div>
                        <div className="text-left">
                          <span className="text-[11px] text-white font-bold block">
                            {el.name}
                          </span>
                          <span className="text-[9px] text-neutral-500 uppercase tracking-tight">
                            Animated Effect
                          </span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {category === "animations" && (
                  <motion.div
                    key="animations"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {animations.map((anim) => (
                      <div
                        key={anim.name}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData(
                            "application/json",
                            JSON.stringify({
                              type: "animation",
                              animation: {
                                type: anim.type,
                                engine: anim.engine,
                                duration: anim.engine === "gsap" ? 1.5 : 0.8,
                                delay: 0,
                              },
                            }),
                          );
                        }}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#2a2a2b] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/[0.03] transition-all group cursor-grab active:cursor-grabbing"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
                          <Play className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-[10px] text-neutral-400 group-hover:text-white font-semibold">
                          {anim.name}
                        </span>
                        <span className="text-[8px] text-neutral-600 mt-1 uppercase">
                          {anim.description}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {category === "templates" && (
                  <motion.div
                    key="templates"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    {templates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className="group relative rounded-2xl overflow-hidden border border-white/5 cursor-pointer bg-[#2a2a2b] shadow-lg active:scale-[0.99] transition-transform"
                        onClick={() => addSectionWithTemplate(tpl.name)}
                      >
                        <div className="aspect-video w-full bg-neutral-800 relative">
                          <img
                            src={tpl.preview}
                            alt={tpl.name}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <Plus className="w-8 h-8 text-white transform scale-50 group-hover:scale-100 transition-transform" />
                          </div>
                        </div>
                        <div className="p-3 border-t border-white/5">
                          <p className="text-white text-[11px] font-bold">
                            {tpl.name}
                          </p>
                          <p className="text-neutral-500 text-[9px] mt-0.5">
                            {tpl.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {category === "blocks" && (
                  <motion.div
                    key="blocks"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    {/* Core Blocks */}
                    <div>
                      <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-widest mb-3">
                        Core Blocks
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {coreBlocks
                          .filter(
                            (b) =>
                              !searchQuery ||
                              b.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()),
                          )
                          .map((block) => (
                            <button
                              key={block.type}
                              onClick={() =>
                                handleAddElement(block.type, {}, block.size)
                              }
                              className="flex flex-col items-start p-3 rounded-xl bg-[#2a2a2b] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/[0.03] transition-all text-left active:scale-95"
                            >
                              <span className="text-[11px] text-white font-bold">
                                {block.name}
                              </span>
                              <span className="text-[9px] text-neutral-500 mt-0.5">
                                {block.desc}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Extended Blocks */}
                    <div>
                      <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-widest mb-3">
                        Extended Blocks
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {extendedBlocks
                          .filter(
                            (b) =>
                              !searchQuery ||
                              b.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()),
                          )
                          .map((block) => (
                            <button
                              key={block.type}
                              onClick={() =>
                                handleAddElement(block.type, {}, block.size)
                              }
                              className="flex flex-col items-start p-3 rounded-xl bg-[#2a2a2b] border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/[0.03] transition-all text-left active:scale-95"
                            >
                              <span className="text-[11px] text-white font-bold">
                                {block.name}
                              </span>
                              <span className="text-[9px] text-neutral-500 mt-0.5">
                                {block.desc}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {category === "backgrounds" && (
                  <motion.div
                    key="backgrounds"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "flex flex-col gap-4",
                      recentlyUsed.background.length === 0 &&
                        "items-center justify-center py-10 text-center",
                    )}
                  >
                    {recentlyUsed.background.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-neutral-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Recently Used
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {recentlyUsed.background
                            .slice(0, 4)
                            .map((item, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  handleAddElement(
                                    "bg-gradient",
                                    item.content.css,
                                    { w: 800, h: 400 },
                                  )
                                }
                                className="group aspect-video rounded-xl border border-white/5 hover:border-indigo-500/50 transition-all relative overflow-hidden bg-[#2a2a2b]"
                              >
                                <div
                                  className="absolute inset-0"
                                  style={(() => {
                                    const content = item.content.css;
                                    const isFullCss = content?.includes(";");
                                    if (!isFullCss)
                                      return { background: content };

                                    const styles: any = {};
                                    content
                                      .split(";")
                                      .forEach((part: string) => {
                                        const colonIndex = part.indexOf(":");
                                        if (colonIndex > -1) {
                                          const prop = part
                                            .substring(0, colonIndex)
                                            .trim();
                                          const val = part
                                            .substring(colonIndex + 1)
                                            .trim();
                                          const camelProp = prop.replace(
                                            /-([a-z])/g,
                                            (g) => g[1].toUpperCase(),
                                          );
                                          styles[camelProp] = val;
                                        }
                                      });
                                    return styles;
                                  })()}
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteRecentlyUsed(item.id, "background");
                                  }}
                                  className="absolute top-1 right-1 p-1 rounded-md bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                >
                                  <X className="w-2 h-2" />
                                </button>
                              </button>
                            ))}
                        </div>
                        <div className="h-px bg-white/5 my-4" />
                      </div>
                    )}

                    <div
                      className={cn(
                        recentlyUsed.background.length > 0 &&
                          "flex items-center justify-between p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10",
                      )}
                    >
                      {recentlyUsed.background.length === 0 && (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 mx-auto">
                          <Palette className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          recentlyUsed.background.length > 0
                            ? "text-left"
                            : "mb-4",
                        )}
                      >
                        <p className="text-[11px] text-white font-bold">
                          Background Studio
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-1 max-w-[200px]">
                          Create custom gradients, mesh backgrounds, and
                          patterns
                        </p>
                      </div>
                      <button
                        onClick={() => setBgStudioOpen(true)}
                        className={cn(
                          "bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-xl",
                          recentlyUsed.background.length > 0
                            ? "px-4 py-2"
                            : "px-6 py-2",
                        )}
                      >
                        {recentlyUsed.background.length > 0
                          ? "Studio"
                          : "Open Studio"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {category === "icons" && (
                  <motion.div
                    key="icons"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "flex flex-col gap-4",
                      recentlyUsed.icon.length === 0 &&
                        "items-center justify-center py-10 text-center",
                    )}
                  >
                    {recentlyUsed.icon.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-neutral-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Recently Used
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {recentlyUsed.icon.slice(0, 8).map((item, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                handleAddElement("iconify-icon", item.content, {
                                  w: 100,
                                  h: 100,
                                })
                              }
                              className="aspect-square flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all p-2 group"
                              title={item.content.name}
                            >
                              {item.content.type === "iconify" ? (
                                <img
                                  src={`https://api.iconify.design/${item.content.name.split(":")[0]}/${item.content.name.split(":")[1]}.svg?color=%23f97316&height=24`}
                                  className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
                                  alt=""
                                />
                              ) : (
                                <div
                                  className="w-6 h-6 text-orange-500 opacity-70 group-hover:opacity-100 transition-opacity"
                                  dangerouslySetInnerHTML={{
                                    __html: item.content.svg,
                                  }}
                                />
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteRecentlyUsed(item.id, "icon");
                                }}
                                className="absolute top-1 right-1 p-1 rounded-md bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </button>
                          ))}
                        </div>
                        <div className="h-px bg-white/5 my-4" />
                      </div>
                    )}

                    <div
                      className={cn(
                        recentlyUsed.icon.length > 0 &&
                          "flex items-center justify-between p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10",
                      )}
                    >
                      {recentlyUsed.icon.length === 0 && (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-4 mx-auto">
                          <Smile className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          recentlyUsed.icon.length > 0 ? "text-left" : "mb-4",
                        )}
                      >
                        <p className="text-[11px] text-white font-bold">
                          Icon Library
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-1 max-w-[180px]">
                          275,000+ icons powered by Iconify
                        </p>
                      </div>
                      <button
                        onClick={() => setIconPickerOpen(true)}
                        className={cn(
                          "bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-xl",
                          recentlyUsed.icon.length > 0
                            ? "px-4 py-2"
                            : "px-6 py-2",
                        )}
                      >
                        {recentlyUsed.icon.length > 0
                          ? "Library"
                          : "Browse Icons"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {category === "uploads" && (
                  <motion.div
                    key="uploads"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "flex flex-col gap-4",
                      recentlyUsed.upload.length === 0 &&
                        "items-center justify-center py-10 text-center border-2 border-dashed border-white/5 rounded-2xl px-4",
                    )}
                  >
                    {recentlyUsed.upload.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-neutral-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Recently Used
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {recentlyUsed.upload.slice(0, 4).map((item, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                handleAddElement("image", item.content.url, {
                                  w: 400,
                                  h: 400,
                                })
                              }
                              className="group aspect-square rounded-xl border border-white/5 hover:border-indigo-500/50 transition-all relative overflow-hidden bg-neutral-900"
                            >
                              <img
                                src={item.content.url}
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                alt=""
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteRecentlyUsed(item.id, "upload");
                                }}
                                className="absolute top-1 right-1 p-1 rounded-md bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </button>
                          ))}
                        </div>
                        <div className="h-px bg-white/5 my-4" />
                      </div>
                    )}

                    <div
                      className={cn(
                        recentlyUsed.upload.length > 0 &&
                          "flex items-center justify-between p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10",
                      )}
                    >
                      {recentlyUsed.upload.length === 0 && (
                        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4 mx-auto">
                          <Upload className="w-8 h-8 text-neutral-500" />
                        </div>
                      )}
                      <div
                        className={cn(
                          recentlyUsed.upload.length > 0 ? "text-left" : "mb-4",
                        )}
                      >
                        <p className="text-[11px] text-white font-bold">
                          Uploads
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-1 max-w-[200px]">
                          Images, videos, or icons
                        </p>
                      </div>
                      <button
                        onClick={() => setMediaModalOpen(true)}
                        className={cn(
                          "bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-xl",
                          recentlyUsed.upload.length > 0
                            ? "px-4 py-2"
                            : "px-6 py-2",
                        )}
                      >
                        {recentlyUsed.upload.length > 0
                          ? "Library"
                          : "Open Library"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {category === "store" && (
                  <motion.div
                    key="store"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "flex flex-col gap-4",
                      purchases.length === 0 &&
                        "items-center justify-center py-10 text-center border-2 border-dashed border-white/5 rounded-2xl px-4",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-white font-bold">
                        Your Marketplace Items
                      </p>
                      <span className="text-[9px] text-neutral-500 bg-white/5 px-2 py-1 rounded-md">
                        {purchases.length} Items
                      </span>
                    </div>

                    {loadingPurchases ? (
                      <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : purchases.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {purchases.map((purchase) => {
                          const isComponent = purchase.type === "component";
                          const isAnimation = purchase.type === "animation";
                          const isTheme = purchase.type === "theme";

                          return (
                            <button
                              key={purchase.id}
                              onClick={() => {
                                // Handle addition based on type
                                if (isComponent && purchase.content) {
                                  // Make sure type/content exists in the db
                                  handleAddElement(
                                    purchase.content.type || "container",
                                    purchase.content.content || "",
                                    {
                                      w: purchase.content.width || 300,
                                      h: purchase.content.height || 200,
                                      styles: purchase.content.styles || {},
                                    },
                                  );
                                } else if (isAnimation && purchase.content) {
                                  // Provide a visually noticeable container pre-equipped with the animation
                                  handleAddElement("container", "", {
                                    w: 200,
                                    h: 200,
                                    styles: {
                                      backgroundColor: "#4f46e5",
                                      borderRadius: "16px",
                                    },
                                  });
                                  // TODO: Actually attach the animation properly.
                                  toast.success("Animation component added");
                                } else if (isTheme) {
                                  toast.info(
                                    "Theme support coming soon in Editor.",
                                  );
                                }
                              }}
                              className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-[#2a2a2b] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/[0.03] transition-all relative overflow-hidden active:scale-95 text-center"
                            >
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                                {isComponent ? (
                                  <Blocks className="w-5 h-5 text-indigo-400" />
                                ) : isAnimation ? (
                                  <Play className="w-5 h-5 text-indigo-400" />
                                ) : (
                                  <Palette className="w-5 h-5 text-indigo-400" />
                                )}
                              </div>
                              <span className="text-[10px] text-neutral-400 group-hover:text-white font-semibold line-clamp-1 w-full px-2">
                                {purchase.title || "Marketplace Item"}
                              </span>
                              <span className="text-[8px] text-neutral-600 mt-1 uppercase">
                                {purchase.type || "Component"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4 mx-auto">
                          <Store className="w-8 h-8 text-neutral-500" />
                        </div>
                        <p className="text-[11px] text-white font-bold">
                          No purchases yet
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-1 max-w-[200px]">
                          Visit the Marketplace to buy components, themes, and
                          animations.
                        </p>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}

      {/* Background Studio Modal */}
      <BackgroundStudio
        key="bg-studio"
        isOpen={bgStudioOpen}
        onClose={() => setBgStudioOpen(false)}
        onApply={(bg) => {
          const targetSectionId = selectedSectionId || sections[0]?.id;
          if (targetSectionId) {
            handleAddElement("bg-gradient", bg, { w: 800, h: 400 });
          }
          setBgStudioOpen(false);
        }}
      />

      {/* Icon Picker Modal */}
      <IconPicker
        key="icon-picker"
        isOpen={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onSelect={(iconData) => {
          handleAddElement("iconify-icon", iconData, { w: 60, h: 60 });
          setIconPickerOpen(false);
        }}
      />
    </AnimatePresence>
  );
};
