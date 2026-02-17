"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockAbout — Split layout with avatar/photo, bio text, and optional social links.
 * Content shape: { name, title, bio, avatarUrl, socialLinks[] }
 */
interface BlockAboutProps {
  content: {
    name?: string;
    title?: string;
    bio?: string;
    avatarUrl?: string;
    socialLinks?: { platform: string; url: string }[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockAbout: React.FC<BlockAboutProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    name = "John Doe",
    title = "Full-Stack Developer",
    bio = "I'm a passionate developer with a love for clean code and beautiful interfaces. With over 5 years of experience, I specialize in building modern web applications that make a difference.",
    avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    socialLinks = [
      { platform: "github", url: "#" },
      { platform: "linkedin", url: "#" },
      { platform: "twitter", url: "#" },
    ],
  } = content || {};

  /** Simple social icon SVGs */
  const socialIcons: Record<string, React.ReactNode> = {
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
  };

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
        {/* Avatar */}
        <motion.div
          className="shrink-0"
          initial={isEditor ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden ring-4 ring-white/10 shadow-2xl">
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={isEditor ? false : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            {name}
          </h2>
          <p className="text-indigo-400 font-semibold text-lg mb-6">{title}</p>
          <p className="text-neutral-400 text-base leading-relaxed mb-8 max-w-lg">
            {bio}
          </p>

          {/* Social Links */}
          <div className="flex gap-4 justify-center md:justify-start">
            {socialLinks.map((link, i) => (
              <motion.a
                key={i}
                href={isEditor ? undefined : link.url}
                onClick={(e) => isEditor && e.preventDefault()}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/50 flex items-center justify-center text-neutral-400 hover:text-indigo-400 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {socialIcons[link.platform] || (
                  <span className="text-xs font-bold uppercase">
                    {link.platform.charAt(0)}
                  </span>
                )}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
