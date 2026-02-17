"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockTestimonials — Quote cards with avatar, name, and role.
 * Content shape: { heading, subtitle, testimonials[] }
 */
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface BlockTestimonialsProps {
  content: {
    heading?: string;
    subtitle?: string;
    testimonials?: Testimonial[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockTestimonials: React.FC<BlockTestimonialsProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Testimonials",
    subtitle = "What people say about my work",
    testimonials = [
      {
        quote:
          "An incredibly talented developer who delivers exceptional results. The attention to detail is outstanding.",
        name: "Sarah Johnson",
        role: "CEO, TechStart",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      },
      {
        quote:
          "Working with them was a pleasure. They understood our vision and brought it to life beautifully.",
        name: "Mike Chen",
        role: "Product Manager, InnovateCo",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      },
      {
        quote:
          "Professional, creative, and always on time. I couldn't have asked for a better developer for our project.",
        name: "Emily Davis",
        role: "Founder, DesignLab",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      },
    ],
  } = content || {};

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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-[#111] rounded-2xl p-8 border border-white/5 hover:border-indigo-500/20 transition-all relative"
              initial={isEditor ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Quote mark */}
              <div className="text-indigo-500/20 text-6xl font-serif leading-none mb-4">
                "
              </div>

              <p className="text-neutral-300 text-sm leading-relaxed mb-8">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {t.avatarUrl && (
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                  />
                )}
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-neutral-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
