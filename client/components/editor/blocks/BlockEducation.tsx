"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockEducation — Education timeline with degree, school, and year.
 * Content shape: { heading, subtitle, entries[] }
 */
interface EducationEntry {
  degree: string;
  school: string;
  period: string;
  description?: string;
}

interface BlockEducationProps {
  content: {
    heading?: string;
    subtitle?: string;
    entries?: EducationEntry[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockEducation: React.FC<BlockEducationProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Education",
    subtitle = "My academic background",
    entries = [
      {
        degree: "M.Sc. Computer Science",
        school: "MIT",
        period: "2017 — 2019",
        description:
          "Specialized in artificial intelligence and machine learning.",
      },
      {
        degree: "B.Sc. Software Engineering",
        school: "Stanford University",
        period: "2013 — 2017",
        description: "Focused on distributed systems and web technologies.",
      },
    ],
  } = content || {};

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={isEditor ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            {heading}
          </h2>
          <p className="text-neutral-500 text-base">{subtitle}</p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-8">
            {entries.map((entry, i) => (
              <motion.div
                key={i}
                className="relative flex gap-6 md:gap-8"
                initial={isEditor ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Dot */}
                <div className="relative z-10 shrink-0 mt-1.5">
                  <div
                    className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-[#0a0a0a] shadow-lg shadow-indigo-500/30"
                    style={{ marginLeft: "10px" }}
                  />
                </div>

                {/* Card */}
                <div className="flex-1 bg-[#111] rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-white font-bold text-base">
                        {entry.degree}
                      </h3>
                      <p className="text-indigo-400 text-sm font-semibold">
                        {entry.school}
                      </p>
                    </div>
                    <span className="text-neutral-600 text-xs font-bold uppercase tracking-wider shrink-0">
                      {entry.period}
                    </span>
                  </div>
                  {entry.description && (
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {entry.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
