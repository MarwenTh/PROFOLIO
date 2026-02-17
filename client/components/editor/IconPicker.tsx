"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * IconPicker — Search and browse 275,000+ icons via Iconify API.
 * Also supports custom SVG upload.
 */
interface IconPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconData: {
    type: "iconify" | "svg";
    name: string;
    svg: string;
  }) => void;
}

/** Curated icon categories for quick browsing */
const ICON_CATEGORIES = [
  { label: "All", query: "" },
  { label: "Business", query: "briefcase office building chart" },
  { label: "Social", query: "social media share like" },
  { label: "Tech", query: "code terminal server database" },
  { label: "Creative", query: "design palette brush pen" },
  { label: "Arrows", query: "arrow chevron direction" },
  { label: "UI", query: "menu settings user notification" },
  { label: "Communication", query: "mail chat message phone" },
  { label: "Files", query: "file folder document download" },
  { label: "Media", query: "image video camera music" },
];

/** Default popular icons to show before search */
const POPULAR_ICONS = [
  "mdi:github",
  "mdi:linkedin",
  "mdi:twitter",
  "mdi:instagram",
  "mdi:facebook",
  "mdi:youtube",
  "mdi:email",
  "mdi:phone",
  "mdi:web",
  "mdi:code-tags",
  "mdi:palette",
  "mdi:rocket-launch",
  "mdi:briefcase",
  "mdi:school",
  "mdi:trophy",
  "mdi:star",
  "mdi:heart",
  "mdi:lightning-bolt",
  "mdi:map-marker",
  "mdi:calendar",
  "mdi:camera",
  "mdi:music",
  "mdi:gamepad",
  "mdi:coffee",
  "mdi:book-open-variant",
  "mdi:pencil",
  "mdi:account-group",
  "mdi:chart-bar",
  "mdi:shield-check",
  "mdi:lightbulb",
  "mdi:cog",
  "mdi:puzzle",
];

export const IconPicker: React.FC<IconPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [icons, setIcons] = useState<string[]>(POPULAR_ICONS);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const [svgCache, setSvgCache] = useState<Record<string, string>>({});
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Search Iconify API */
  const searchIcons = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setIcons(POPULAR_ICONS);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=64`,
      );
      const data = await res.json();
      setIcons(data.icons || []);
    } catch (err) {
      console.error("Iconify search failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Debounced search */
  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchIcons(value), 400);
  };

  /** Category search */
  const handleCategoryClick = (cat: string, catQuery: string) => {
    setCategory(cat);
    if (!catQuery) {
      setQuery("");
      setIcons(POPULAR_ICONS);
    } else {
      setQuery(catQuery);
      searchIcons(catQuery);
    }
  };

  /** Fetch SVG for a specific icon from Iconify */
  const fetchIconSvg = useCallback(
    async (iconName: string): Promise<string> => {
      if (svgCache[iconName]) return svgCache[iconName];

      const [prefix, name] = iconName.split(":");
      try {
        const res = await fetch(
          `https://api.iconify.design/${prefix}/${name}.svg?height=48`,
        );
        const svg = await res.text();
        setSvgCache((prev) => ({ ...prev, [iconName]: svg }));
        return svg;
      } catch {
        return "";
      }
    },
    [svgCache],
  );

  /** Handle icon click */
  const handleIconClick = async (iconName: string) => {
    const svg = await fetchIconSvg(iconName);
    onSelect({ type: "iconify", name: iconName, svg });
  };

  /** Handle custom SVG upload */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const svg = reader.result as string;
      onSelect({ type: "svg", name: file.name.replace(".svg", ""), svg });
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset file input
  };

  /** Render icon preview — loads from Iconify CDN */
  const IconPreview: React.FC<{ name: string; index: number }> = ({
    name,
    index,
  }) => {
    const [prefix, iconName] = name.split(":");
    const src = `https://api.iconify.design/${prefix}/${iconName}.svg?color=%23a78bfa&height=28`;

    return (
      <motion.button
        className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
        onClick={() => handleIconClick(name)}
        initial={false}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={name}
      >
        <img
          src={src}
          alt={name}
          className="w-7 h-7 mb-2 opacity-70 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
        <span className="text-[8px] text-neutral-600 group-hover:text-neutral-400 truncate w-full text-center transition-colors">
          {iconName || name}
        </span>
      </motion.button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="picker-backdrop"
            className="fixed inset-0 bg-black/60 z-[150]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="picker-modal"
            className="fixed inset-4 md:inset-12 lg:inset-20 z-[151] bg-[#141414] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <h2 className="text-white font-bold text-base">Icon Library</h2>
                <p className="text-neutral-500 text-xs mt-0.5">
                  275,000+ icons powered by Iconify
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-lg text-xs font-bold transition-colors border border-white/10"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload SVG
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-6 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search icons (e.g., rocket, calendar, chart)..."
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                {loading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 animate-spin" />
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="px-6 pt-3 flex gap-2 overflow-x-auto custom-scrollbar pb-1">
              {ICON_CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryClick(cat.label, cat.query)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                    category === cat.label
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "text-neutral-500 hover:text-white bg-white/5",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Icons Grid */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {icons.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                  <Search className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-sm font-semibold">No icons found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {icons.map((icon, i) => (
                    <IconPreview key={icon + i} name={icon} index={i} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
