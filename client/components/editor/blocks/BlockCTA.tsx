"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockCTA — Bold call-to-action banner with gradient background.
 * Content shape: { headline, subtitle, ctaText, ctaLink, gradient }
 */
interface BlockCTAProps {
  content: {
    headline?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    gradient?: string;
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockCTA: React.FC<BlockCTAProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    headline = "Ready to Start Your Project?",
    subtitle = "Let's build something amazing together. Get in touch today.",
    ctaText = "Let's Talk",
    ctaLink = "#",
    gradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
  } = content || {};

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16 relative overflow-hidden"
      style={{ background: gradient, ...styles }}
    >
      {/* Subtle overlay pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        initial={isEditor ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          {headline}
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          {subtitle}
        </p>

        <motion.a
          href={isEditor ? undefined : ctaLink}
          onClick={(e) => isEditor && e.preventDefault()}
          className="inline-flex items-center gap-2 px-10 py-4 bg-white text-neutral-900 font-black rounded-xl text-base hover:bg-neutral-100 transition-all shadow-2xl hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
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
              strokeWidth={2.5}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </motion.a>
      </motion.div>
    </div>
  );
};
