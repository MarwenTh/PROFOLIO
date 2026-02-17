"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockSkills — Animated skill bars or tag cloud.
 * Content shape: { heading, skills[], displayMode: 'bars' | 'tags' }
 */
interface Skill {
  name: string;
  level: number; // 0-100
  color?: string;
}

interface BlockSkillsProps {
  content: {
    heading?: string;
    subtitle?: string;
    skills?: Skill[];
    displayMode?: "bars" | "tags";
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockSkills: React.FC<BlockSkillsProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Skills & Expertise",
    subtitle = "Technologies I work with",
    skills = [
      { name: "React / Next.js", level: 95, color: "#6366f1" },
      { name: "TypeScript", level: 90, color: "#3b82f6" },
      { name: "Node.js", level: 85, color: "#22c55e" },
      { name: "Python", level: 80, color: "#eab308" },
      { name: "UI/UX Design", level: 75, color: "#ec4899" },
      { name: "DevOps", level: 70, color: "#f97316" },
    ],
    displayMode = "bars",
  } = content || {};

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={isEditor ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            {heading}
          </h2>
          <p className="text-neutral-500 text-base">{subtitle}</p>
        </motion.div>

        {/* Skills Display */}
        {displayMode === "bars" ? (
          <div className="space-y-6">
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                initial={isEditor ? false : { opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold text-sm">
                    {skill.name}
                  </span>
                  <span className="text-neutral-500 text-xs font-bold">
                    {skill.level}%
                  </span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${skill.color || "#6366f1"}, ${skill.color || "#6366f1"}88)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{
                      delay: isEditor ? 0 : i * 0.1 + 0.3,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={isEditor ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {skills.map((skill, i) => (
              <motion.span
                key={i}
                className="px-5 py-2.5 rounded-xl text-sm font-bold border transition-all hover:scale-105 cursor-default"
                style={{
                  backgroundColor: `${skill.color || "#6366f1"}15`,
                  borderColor: `${skill.color || "#6366f1"}30`,
                  color: skill.color || "#6366f1",
                }}
                initial={isEditor ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.08 }}
              >
                {skill.name}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
