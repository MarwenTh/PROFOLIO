"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const GlitchText = ({ text, className }: { text: string, className?: string }) => {
  return (
    <div className={cn("relative inline-block font-black text-white", className)}>
      <span className="relative z-10">{text}</span>
      <motion.span
        animate={{
          x: [-2, 2, -1, 3, 0],
          y: [1, -1, 2, 0],
          opacity: [0.5, 0.8, 0.4, 0.7, 0]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "mirror"
        }}
        className="absolute inset-0 z-0 text-red-500 translate-x-1"
      >
        {text}
      </motion.span>
      <motion.span
        animate={{
          x: [2, -2, 1, -3, 0],
          y: [-1, 1, -2, 0],
          opacity: [0.5, 0.8, 0.4, 0.7, 0]
        }}
        transition={{
          duration: 0.25,
          repeat: Infinity,
          repeatType: "mirror"
        }}
        className="absolute inset-0 z-0 text-cyan-500 -translate-x-1"
      >
        {text}
      </motion.span>
    </div>
  );
};
