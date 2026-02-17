"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * BlockGallery — Masonry-style photo/work gallery with lightbox preview.
 * Content shape: { heading, subtitle, images[] }
 */
interface GalleryImage {
  url: string;
  caption?: string;
}

interface BlockGalleryProps {
  content: {
    heading?: string;
    subtitle?: string;
    images?: GalleryImage[];
    columns?: 2 | 3 | 4;
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockGallery: React.FC<BlockGalleryProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Gallery",
    subtitle = "A showcase of my creative work",
    images = [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
        caption: "Brand Identity",
      },
      {
        url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&q=80",
        caption: "Web Design",
      },
      {
        url: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600&q=80",
        caption: "Mobile App",
      },
      {
        url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&q=80",
        caption: "Photography",
      },
      {
        url: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&q=80",
        caption: "Dashboard",
      },
      {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80",
        caption: "Landing Page",
      },
    ],
    columns = 3,
  } = content || {};

  const [lightbox, setLightbox] = useState<number | null>(null);
  const colClass =
    columns === 2
      ? "md:columns-2"
      : columns === 4
        ? "md:columns-3 lg:columns-4"
        : "md:columns-2 lg:columns-3";

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-6xl mx-auto">
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

        {/* Masonry Grid */}
        <div className={`columns-1 ${colClass} gap-4`}>
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="break-inside-avoid mb-4 group cursor-pointer relative rounded-xl overflow-hidden"
              initial={isEditor ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => !isEditor && setLightbox(i)}
            >
              <img
                src={img.url}
                alt={img.caption || `Gallery ${i + 1}`}
                className="w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end p-4">
                {img.caption && (
                  <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    {img.caption}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
            >
              <motion.img
                src={images[lightbox].url}
                alt={images[lightbox].caption || ""}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              />
              <button
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                onClick={() => setLightbox(null)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
