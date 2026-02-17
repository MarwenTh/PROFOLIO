"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockBlog — Blog post preview cards with date, excerpt, and read more link.
 * Content shape: { heading, subtitle, posts[] }
 */
interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
  link?: string;
  tag?: string;
}

interface BlockBlogProps {
  content: {
    heading?: string;
    subtitle?: string;
    posts?: BlogPost[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockBlog: React.FC<BlockBlogProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Latest Articles",
    subtitle = "Thoughts, tutorials, and insights",
    posts = [
      {
        title: "Building Scalable React Apps",
        excerpt:
          "Learn the patterns and practices that make React applications maintainable at scale.",
        date: "Feb 2025",
        imageUrl:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
        tag: "React",
      },
      {
        title: "The Future of Web Development",
        excerpt:
          "Exploring emerging trends and technologies shaping the future of the web.",
        date: "Jan 2025",
        imageUrl:
          "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80",
        tag: "Web Dev",
      },
      {
        title: "Design System Best Practices",
        excerpt:
          "How to create a design system that scales with your team and product.",
        date: "Dec 2024",
        imageUrl:
          "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&q=80",
        tag: "Design",
      },
    ],
  } = content || {};

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={i}
              className="group bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all"
              initial={isEditor ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {post.imageUrl && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  {post.tag && (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-400">
                      {post.tag}
                    </span>
                  )}
                  <span className="text-neutral-600 text-xs">{post.date}</span>
                </div>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};
