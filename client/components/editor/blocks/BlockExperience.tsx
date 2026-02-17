"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockExperience — Vertical timeline with role, company, date, and description.
 * Content shape: { heading, subtitle, experiences[] }
 */
interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  current?: boolean;
}

interface BlockExperienceProps {
  content: {
    heading?: string;
    subtitle?: string;
    experiences?: Experience[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockExperience: React.FC<BlockExperienceProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Experience",
    subtitle = "My professional journey",
    experiences = [
      {
        role: "Senior Frontend Developer",
        company: "TechCorp",
        period: "2023 — Present",
        description:
          "Leading the frontend team in building scalable web applications using React and Next.js.",
        current: true,
      },
      {
        role: "Full-Stack Developer",
        company: "StartupXYZ",
        period: "2021 — 2023",
        description:
          "Built and maintained a SaaS platform serving 10,000+ users. Worked with Node.js, PostgreSQL, and React.",
      },
      {
        role: "Junior Developer",
        company: "DigitalAgency",
        period: "2019 — 2021",
        description:
          "Developed responsive websites and web apps for various clients across different industries.",
      },
    ],
  } = content || {};

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                className="relative flex gap-6 md:gap-8"
                initial={isEditor ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                {/* Dot */}
                <div className="relative z-10 shrink-0 mt-1.5">
                  <div
                    className={`w-3 h-3 rounded-full ring-4 ring-[#0a0a0a] ${
                      exp.current
                        ? "bg-indigo-500 shadow-lg shadow-indigo-500/50"
                        : "bg-neutral-600"
                    }`}
                    style={{ marginLeft: "10px" }}
                  />
                </div>

                {/* Card */}
                <div className="flex-1 bg-[#111] rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-white font-bold text-base">
                        {exp.role}
                      </h3>
                      <p className="text-indigo-400 text-sm font-semibold">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-neutral-600 text-xs font-bold uppercase tracking-wider shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
