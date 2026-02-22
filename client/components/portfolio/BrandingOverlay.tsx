"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BrandingOverlayProps {
  onClick?: () => void;
  className?: string;
  isPro?: boolean;
  href?: string;
}

export const BrandingOverlay = ({
  onClick,
  className,
  isPro = false,
  href,
}: BrandingOverlayProps) => {
  if (isPro) return null;

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={href ? undefined : onClick}
      className={cn(
        "absolute top-6 left-6 z-[200] cursor-pointer group select-none",
        className,
      )}
    >
      <div className="px-3 py-1.5 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 flex items-center gap-2.5 shadow-2xl hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300">
        <div className="relative">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping opacity-40" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 dark:text-white/50 group-hover:text-white transition-colors">
          Built with PROFOLIO
        </span>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} target="_blank" className="contents">
        {content}
      </Link>
    );
  }

  return content;
};
