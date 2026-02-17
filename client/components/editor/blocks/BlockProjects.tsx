"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockProjects — Responsive project cards grid with image, title, description, and link.
 * Content shape: { heading, subtitle, projects[], columns }
 */
interface Project {
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  tags?: string[];
}

interface BlockProjectsProps {
  content: {
    heading?: string;
    subtitle?: string;
    projects?: Project[];
    columns?: 2 | 3;
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockProjects: React.FC<BlockProjectsProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Featured Projects",
    subtitle = "A selection of my recent work",
    projects = [
      {
        title: "E-Commerce Platform",
        description:
          "A modern shopping experience built with Next.js and Stripe.",
        imageUrl:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
        link: "#",
        tags: ["Next.js", "Stripe", "Tailwind"],
      },
      {
        title: "AI Dashboard",
        description:
          "Real-time analytics dashboard powered by machine learning.",
        imageUrl:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
        link: "#",
        tags: ["Python", "React", "TensorFlow"],
      },
      {
        title: "Social App",
        description: "Mobile-first social platform with real-time chat.",
        imageUrl:
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80",
        link: "#",
        tags: ["React Native", "Firebase", "Node.js"],
      },
    ],
    columns = 3,
  } = content || {};

  const gridCols =
    columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-6xl mx-auto">
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

        {/* Grid */}
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {projects.map((project, i) => (
            <motion.div
              key={i}
              className="group bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all"
              initial={isEditor ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-white font-bold text-lg mb-2">
                  {project.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Link */}
                {project.link && (
                  <a
                    href={isEditor ? undefined : project.link}
                    onClick={(e) => isEditor && e.preventDefault()}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View Project
                    <svg
                      className="w-3.5 h-3.5"
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
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
