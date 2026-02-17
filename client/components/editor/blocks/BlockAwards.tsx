"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockAwards — Awards, certifications, and achievements display.
 * Content shape: { heading, subtitle, awards[] }
 */
interface Award {
  title: string;
  issuer: string;
  year: string;
  description?: string;
}

interface BlockAwardsProps {
  content: {
    heading?: string;
    subtitle?: string;
    awards?: Award[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockAwards: React.FC<BlockAwardsProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Awards & Certifications",
    subtitle = "Recognition for excellence",
    awards = [
      {
        title: "Best Web Design 2024",
        issuer: "Awwwards",
        year: "2024",
        description: "Honored for exceptional web design and development.",
      },
      {
        title: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        year: "2023",
        description: "Professional certification for cloud architecture.",
      },
      {
        title: "Top Developer",
        issuer: "GitHub",
        year: "2023",
        description:
          "Recognized as a top contributor in the open-source community.",
      },
      {
        title: "Design Excellence",
        issuer: "Dribbble",
        year: "2022",
        description: "Featured for outstanding visual design work.",
      },
    ],
  } = content || {};

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-4xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {awards.map((a, i) => (
            <motion.div
              key={i}
              className="flex gap-4 bg-[#111] rounded-xl p-6 border border-white/5 hover:border-yellow-500/20 transition-all group"
              initial={isEditor ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Trophy icon */}
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 group-hover:bg-yellow-500/20 flex items-center justify-center shrink-0 transition-colors">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.016 6.016 0 01-3.77 1.397 6.016 6.016 0 01-3.77-1.397"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-bold text-sm">{a.title}</h3>
                  <span className="text-neutral-600 text-xs font-bold">
                    {a.year}
                  </span>
                </div>
                <p className="text-indigo-400 text-xs font-semibold mb-2">
                  {a.issuer}
                </p>
                {a.description && (
                  <p className="text-neutral-500 text-xs leading-relaxed">
                    {a.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
