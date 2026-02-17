"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockContact — Styled contact form with name, email, message, and CTA.
 * Content shape: { heading, subtitle, ctaText, email, showPhone, fields }
 */
interface BlockContactProps {
  content: {
    heading?: string;
    subtitle?: string;
    ctaText?: string;
    email?: string;
    showPhone?: boolean;
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockContact: React.FC<BlockContactProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Get In Touch",
    subtitle = "Have a project in mind? Let's work together.",
    ctaText = "Send Message",
    email = "hello@example.com",
    showPhone = true,
  } = content || {};

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Info side */}
          <motion.div
            className="flex-1"
            initial={isEditor ? false : { opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {heading}
            </h2>
            <p className="text-neutral-400 text-base leading-relaxed mb-8">
              {subtitle}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-neutral-300 text-sm">{email}</span>
              </div>

              {showPhone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <span className="text-neutral-300 text-sm">
                    +1 (555) 123-4567
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="flex-1"
            initial={isEditor ? false : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-[#111] rounded-2xl p-8 border border-white/5 space-y-5"
            >
              <div>
                <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  disabled={isEditor}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  disabled={isEditor}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Tell me about your project..."
                  rows={4}
                  disabled={isEditor}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isEditor}
                className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-60"
              >
                {ctaText}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
