"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Package, ArrowRight } from "lucide-react";

/** A registry entry that can be imported into the sandbox */
export interface RegistryEntry {
  name: string;
  description: string;
  category: string;
  code: Record<string, string>; // files to inject
}

interface RegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user selects a registry entry to inject */
  onImport: (entry: RegistryEntry) => void;
}

/** Curated set of importable components from the PROFOLIO library */
const REGISTRY: RegistryEntry[] = [
  {
    name: "Button",
    description: "Animated button with multiple variants",
    category: "UI",
    code: {
      "/components/Button.tsx": `import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = ({ variant = "primary", className, children, ...props }: ButtonProps) => {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500",
    secondary: "bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white",
    ghost: "hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400",
  };
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      className={cn(base, variants[variant], className)} {...props}>
      {children}
    </motion.button>
  );
};`,
    },
  },
  {
    name: "Badge",
    description: "Status badge with color variants",
    category: "UI",
    code: {
      "/components/Badge.tsx": `import { cn } from "@/lib/utils";

interface BadgeProps { variant?: "success" | "warning" | "error" | "neutral"; children: React.ReactNode; }

export const Badge = ({ variant = "neutral", children }: BadgeProps) => {
  const variants = {
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    error: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    neutral: "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-400",
  };
  return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold", variants[variant])}>{children}</span>;
};`,
    },
  },
  {
    name: "Card",
    description: "Glassmorphism card container with hover effect",
    category: "Layout",
    code: {
      "/components/Card.tsx": `import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps { children: React.ReactNode; className?: string; }

export const Card = ({ children, className }: CardProps) => (
  <motion.div whileHover={{ y: -4 }}
    className={cn("relative rounded-3xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-neutral-900/80 backdrop-blur-sm p-6 shadow-xl shadow-black/5", className)}>
    {children}
  </motion.div>
);`,
    },
  },
  {
    name: "AnimatedCounter",
    description: "Number counter with smooth animation",
    category: "Animation",
    code: {
      "/components/AnimatedCounter.tsx": `import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps { target: number; duration?: number; }

export const AnimatedCounter = ({ target, duration = 1500 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <span>{count.toLocaleString()}</span>;
};`,
    },
  },
];

const CATEGORIES = [
  "All",
  ...Array.from(new Set(REGISTRY.map((r) => r.category))),
];

/**
 * "Add from Registry" modal — lets users search and import pre-built
 * PROFOLIO components directly into their sandbox file system.
 */
export function RegistryModal({
  isOpen,
  onClose,
  onImport,
}: RegistryModalProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = REGISTRY.filter((entry) => {
    const matchesSearch =
      !search ||
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || entry.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-200 dark:border-white/5">
                <Package className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="text-sm font-black text-neutral-900 dark:text-white">
                  Add from Registry
                </span>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search components…"
                    className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-white/5 rounded-xl text-xs font-medium outline-none border border-transparent focus:border-indigo-500/50 placeholder:text-neutral-400"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-2 px-5 py-2 border-b border-neutral-200 dark:border-white/5 overflow-x-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? "bg-indigo-600 text-white"
                        : "bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Component list */}
              <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-white/5">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
                    <Package className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-sm font-medium">No components found</p>
                  </div>
                ) : (
                  filtered.map((entry) => (
                    <button
                      key={entry.name}
                      onClick={() => {
                        onImport(entry);
                        onClose();
                      }}
                      className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">
                            {entry.name}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">
                            {entry.category}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">
                          {entry.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-700 group-hover:text-indigo-500 transition-colors shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
