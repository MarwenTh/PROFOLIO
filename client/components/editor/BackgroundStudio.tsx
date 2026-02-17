"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Palette,
  Grid,
  Waves,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * BackgroundStudio — A full modal for creating and selecting backgrounds.
 * Includes gradient builder, mesh gradients, patterns, and preset gallery.
 */
interface BackgroundStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (background: string) => void;
}

type Tab = "presets" | "gradient" | "mesh" | "pattern";

/** Curated gradient presets */
const GRADIENT_PRESETS = [
  {
    name: "Midnight",
    css: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  },
  { name: "Ocean", css: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Sunset", css: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Forest", css: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
  { name: "Fire", css: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
  { name: "Royal", css: "linear-gradient(135deg, #141E30 0%, #243B55 100%)" },
  { name: "Neon", css: "linear-gradient(135deg, #00f260 0%, #0575e6 100%)" },
  { name: "Aurora", css: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  {
    name: "Deep Space",
    css: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
  },
  { name: "Peach", css: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { name: "Cyber", css: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)" },
  { name: "Coral", css: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)" },
];

/** Mesh gradient presets */
const MESH_PRESETS = [
  {
    name: "Prismatic",
    css: "radial-gradient(at 40% 20%, #4f46e5 0px, transparent 50%), radial-gradient(at 80% 0%, #e879f9 0px, transparent 50%), radial-gradient(at 0% 50%, #3b82f6 0px, transparent 50%), radial-gradient(at 80% 100%, #f472b6 0px, transparent 50%), radial-gradient(at 0% 100%, #06b6d4 0px, transparent 50%)",
  },
  {
    name: "Nebula",
    css: "radial-gradient(at 0% 0%, #7c3aed 0px, transparent 50%), radial-gradient(at 100% 0%, #db2777 0px, transparent 50%), radial-gradient(at 100% 100%, #f59e0b 0px, transparent 50%), radial-gradient(at 0% 100%, #10b981 0px, transparent 50%)",
  },
  {
    name: "Soft",
    css: "radial-gradient(at 40% 20%, #ddd6fe 0px, transparent 50%), radial-gradient(at 80% 0%, #fce7f3 0px, transparent 50%), radial-gradient(at 0% 50%, #dbeafe 0px, transparent 50%), radial-gradient(at 80% 50%, #fef3c7 0px, transparent 50%)",
  },
  {
    name: "Night Sky",
    css: "radial-gradient(at 20% 20%, #312e81 0px, transparent 50%), radial-gradient(at 80% 10%, #1e1b4b 0px, transparent 50%), radial-gradient(at 50% 80%, #4c1d95 0px, transparent 50%), radial-gradient(at 0% 100%, #0f172a 0px, transparent 50%)",
  },
  {
    name: "Arctic",
    css: "radial-gradient(at 0% 0%, #67e8f9 0px, transparent 50%), radial-gradient(at 100% 0%, #a5f3fc 0px, transparent 50%), radial-gradient(at 100% 100%, #818cf8 0px, transparent 50%), radial-gradient(at 0% 100%, #c4b5fd 0px, transparent 50%)",
  },
  {
    name: "Warm",
    css: "radial-gradient(at 30% 20%, #f97316 0px, transparent 50%), radial-gradient(at 80% 10%, #ef4444 0px, transparent 50%), radial-gradient(at 50% 80%, #eab308 0px, transparent 50%), radial-gradient(at 10% 90%, #f97316 0px, transparent 50%)",
  },
];

/** Pattern presets */
const PATTERN_PRESETS = [
  {
    name: "Dots",
    css: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
    size: "20px 20px",
    bg: "#0a0a0a",
  },
  {
    name: "Grid",
    css: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
    size: "40px 40px",
    bg: "#0a0a0a",
  },
  {
    name: "Diagonal",
    css: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)",
    size: "",
    bg: "#0a0a0a",
  },
  {
    name: "Crosses",
    css: "radial-gradient(circle, transparent 20%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.05) 25%, transparent 25%)",
    size: "30px 30px",
    bg: "#0a0a0a",
  },
  {
    name: "Zigzag",
    css: "linear-gradient(135deg, rgba(99,102,241,0.1) 25%, transparent 25%) -10px 0, linear-gradient(225deg, rgba(99,102,241,0.1) 25%, transparent 25%) -10px 0, linear-gradient(315deg, rgba(99,102,241,0.1) 25%, transparent 25%), linear-gradient(45deg, rgba(99,102,241,0.1) 25%, transparent 25%)",
    size: "20px 20px",
    bg: "#0a0a0a",
  },
  {
    name: "Hexagon",
    css: "radial-gradient(circle farthest-side at 0% 50%, rgba(99,102,241,0.1) 23.5%, transparent 0) 21px 30px, radial-gradient(circle farthest-side at 0% 50%, rgba(99,102,241,0.05) 24%, transparent 0) 19px 30px",
    size: "40px 60px",
    bg: "#0a0a0a",
  },
];

export const BackgroundStudio: React.FC<BackgroundStudioProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [tab, setTab] = useState<Tab>("presets");
  const [copied, setCopied] = useState(false);

  // Gradient builder state
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#a855f7");
  const [angle, setAngle] = useState(135);
  const [gradientType, setGradientType] = useState<
    "linear" | "radial" | "conic"
  >("linear");

  const buildGradient = useCallback(() => {
    if (gradientType === "radial")
      return `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`;
    if (gradientType === "conic")
      return `conic-gradient(from ${angle}deg, ${color1}, ${color2}, ${color1})`;
    return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
  }, [color1, color2, angle, gradientType]);

  const handleCopy = (css: string) => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const tabs = [
    { id: "presets" as Tab, icon: Sparkles, label: "Presets" },
    { id: "gradient" as Tab, icon: Palette, label: "Gradient" },
    { id: "mesh" as Tab, icon: Waves, label: "Mesh" },
    { id: "pattern" as Tab, icon: Grid, label: "Pattern" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="studio-backdrop"
            className="fixed inset-0 bg-black/60 z-[150]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            key="studio-modal"
            className="fixed inset-4 md:inset-12 lg:inset-20 z-[151] bg-[#141414] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-white font-bold text-base">
                Background Studio
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    tab === t.id
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "text-neutral-500 hover:text-white hover:bg-white/5",
                  )}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {/* Presets Tab */}
              {tab === "presets" && (
                <div>
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-4">
                    Gradient Presets
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                    {GRADIENT_PRESETS.map((g, i) => (
                      <button
                        key={i}
                        className="group aspect-video rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all relative"
                        onClick={() => onApply(g.css)}
                      >
                        <div
                          className="absolute inset-0"
                          style={{ background: g.css }}
                        />
                        <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-[10px] font-bold">
                            {g.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-4">
                    Mesh Gradients
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {MESH_PRESETS.map((m, i) => (
                      <button
                        key={i}
                        className="group aspect-video rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all relative"
                        onClick={() =>
                          onApply(
                            `background-color:#0a0a0a;background-image:${m.css}`,
                          )
                        }
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundColor: "#0a0a0a",
                            backgroundImage: m.css,
                          }}
                        />
                        <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-[10px] font-bold">
                            {m.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-4">
                    Patterns
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PATTERN_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        className="group aspect-video rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all relative"
                        onClick={() =>
                          onApply(
                            `background-color:${p.bg};background-image:${p.css}${p.size ? `;background-size:${p.size}` : ""}`,
                          )
                        }
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundColor: p.bg,
                            backgroundImage: p.css,
                            ...(p.size ? { backgroundSize: p.size } : {}),
                          }}
                        />
                        <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-[10px] font-bold">
                            {p.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gradient Builder Tab */}
              {tab === "gradient" && (
                <div className="max-w-2xl mx-auto">
                  {/* Live Preview */}
                  <div
                    className="aspect-video rounded-xl mb-6 border border-white/10"
                    style={{ background: buildGradient() }}
                  />

                  {/* Controls */}
                  <div className="space-y-5 bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
                    {/* Type selector */}
                    <div>
                      <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                        Type
                      </label>
                      <div className="flex gap-2">
                        {(["linear", "radial", "conic"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setGradientType(t)}
                            className={cn(
                              "px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all",
                              gradientType === t
                                ? "bg-indigo-500 text-white"
                                : "bg-white/5 text-neutral-400 hover:text-white",
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                          Color 1
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={color1}
                            onChange={(e) => setColor1(e.target.value)}
                            className="w-10 h-10 rounded-lg border-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color1}
                            onChange={(e) => setColor1(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                          Color 2
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={color2}
                            onChange={(e) => setColor2(e.target.value)}
                            className="w-10 h-10 rounded-lg border-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color2}
                            onChange={(e) => setColor2(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Angle */}
                    {gradientType !== "radial" && (
                      <div>
                        <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                          Angle: {angle}°
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={angle}
                          onChange={(e) => setAngle(Number(e.target.value))}
                          className="w-full accent-indigo-500"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => onApply(buildGradient())}
                        className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-sm transition-all"
                      >
                        Apply to Section
                      </button>
                      <button
                        onClick={() => handleCopy(buildGradient())}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-all border border-white/10"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setColor1("#6366f1");
                          setColor2("#a855f7");
                          setAngle(135);
                          setGradientType("linear");
                        }}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-all border border-white/10"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mesh Tab */}
              {tab === "mesh" && (
                <div>
                  <p className="text-neutral-400 text-sm mb-6">
                    Click any mesh gradient to apply it to the selected section.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {MESH_PRESETS.map((m, i) => (
                      <button
                        key={i}
                        className="group aspect-video rounded-xl border border-white/5 hover:border-indigo-500/50 transition-all relative overflow-hidden"
                        onClick={() =>
                          onApply(
                            `background-color:#0a0a0a;background-image:${m.css}`,
                          )
                        }
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundColor: "#0a0a0a",
                            backgroundImage: m.css,
                          }}
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-lg">
                          <span className="text-white text-xs font-bold">
                            {m.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pattern Tab */}
              {tab === "pattern" && (
                <div>
                  <p className="text-neutral-400 text-sm mb-6">
                    Click any pattern to apply it as a background.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {PATTERN_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        className="group aspect-video rounded-xl border border-white/5 hover:border-indigo-500/50 transition-all relative overflow-hidden"
                        onClick={() =>
                          onApply(
                            `background-color:${p.bg};background-image:${p.css}${p.size ? `;background-size:${p.size}` : ""}`,
                          )
                        }
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundColor: p.bg,
                            backgroundImage: p.css,
                            ...(p.size ? { backgroundSize: p.size } : {}),
                          }}
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-lg">
                          <span className="text-white text-xs font-bold">
                            {p.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
