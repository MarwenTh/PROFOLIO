"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockHero — Full-width hero section with headline, subtitle, and CTA button.
 * Content shape: { headline, subtitle, ctaText, ctaLink, backgroundImage, overlayOpacity, alignment }
 */
interface BlockHeroProps {
  content: {
    headline?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: string;
    overlayOpacity?: number;
    alignment?: "left" | "center" | "right";
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockHero: React.FC<BlockHeroProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    headline = "Your Name Here",
    subtitle = "Creative Developer & Designer",
    ctaText = "View My Work",
    ctaLink = "#",
    backgroundImage,
    overlayOpacity = 0.6,
    alignment = "center",
  } = content || {};

  const alignClass =
    alignment === "left"
      ? "items-start text-left"
      : alignment === "right"
        ? "items-end text-right"
        : "items-center text-center";

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 500,
        background: backgroundImage
          ? `url(${backgroundImage}) center/cover no-repeat`
          : "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        ...styles,
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
      />

      {/* Content */}
      <motion.div
        className={`relative z-10 flex flex-col ${alignClass} justify-center h-full px-8 py-24 md:px-16 lg:px-24`}
        style={{ minHeight: 500 }}
        initial={isEditor ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 tracking-tight"
          initial={isEditor ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {headline}
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl mb-10 leading-relaxed font-light"
          initial={isEditor ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {subtitle}
        </motion.p>

        <motion.a
          href={isEditor ? undefined : ctaLink}
          className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-base transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
          initial={isEditor ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          onClick={(e) => isEditor && e.preventDefault()}
        >
          {ctaText}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </motion.a>
      </motion.div>
    </div>
  );
};
