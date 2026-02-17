"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockTeam — Team member cards with photo, name, and role.
 * Content shape: { heading, subtitle, members[] }
 */
interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
  bio?: string;
}

interface BlockTeamProps {
  content: {
    heading?: string;
    subtitle?: string;
    members?: TeamMember[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockTeam: React.FC<BlockTeamProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Meet The Team",
    subtitle = "The people behind the work",
    members = [
      {
        name: "Alex Rivera",
        role: "Lead Designer",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
        bio: "Creating beautiful experiences.",
      },
      {
        name: "Jordan Lee",
        role: "Developer",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
        bio: "Building scalable solutions.",
      },
      {
        name: "Sam Taylor",
        role: "Product Manager",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
        bio: "Shipping great products.",
      },
      {
        name: "Chris Park",
        role: "Backend Engineer",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
        bio: "Architecting robust systems.",
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m, i) => (
            <motion.div
              key={i}
              className="group text-center bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-indigo-500/20 transition-all"
              initial={isEditor ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 ring-2 ring-white/10 group-hover:ring-indigo-500/30 transition-all">
                <img
                  src={m.avatarUrl}
                  alt={m.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{m.name}</h3>
              <p className="text-indigo-400 text-xs font-semibold mb-2">
                {m.role}
              </p>
              {m.bio && <p className="text-neutral-500 text-xs">{m.bio}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
