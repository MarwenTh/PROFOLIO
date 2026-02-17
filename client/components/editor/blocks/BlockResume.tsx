"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockResume — Resume/CV download section with a stylish download button.
 * Content shape: { heading, subtitle, downloadUrl, fileName, highlights[] }
 */
interface BlockResumeProps {
  content: {
    heading?: string;
    subtitle?: string;
    downloadUrl?: string;
    fileName?: string;
    highlights?: { label: string; value: string }[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockResume: React.FC<BlockResumeProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Download My Resume",
    subtitle = "Get a detailed overview of my skills, experience, and education.",
    downloadUrl = "#",
    fileName = "Resume_2025.pdf",
    highlights = [
      { label: "Experience", value: "8+ Years" },
      { label: "Projects", value: "50+" },
      { label: "Technologies", value: "20+" },
    ],
  } = content || {};

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={isEditor ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {heading}
          </h2>
          <p className="text-neutral-400 text-base mb-10 max-w-lg mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <motion.div
            className="flex justify-center gap-8 mb-10 flex-wrap"
            initial={isEditor ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {highlights.map((h, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-white">{h.value}</p>
                <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mt-1">
                  {h.label}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Download Card */}
        <motion.div
          className="inline-flex flex-col items-center bg-[#111] rounded-2xl p-8 border border-white/5"
          initial={isEditor ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* File icon */}
          <div className="w-16 h-16 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-neutral-400 text-sm mb-4">{fileName}</p>
          <a
            href={isEditor ? undefined : downloadUrl}
            onClick={(e) => isEditor && e.preventDefault()}
            download
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/25"
          >
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Resume
          </a>
        </motion.div>
      </div>
    </div>
  );
};
