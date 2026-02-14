"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShinyButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

export const ShinyButton = ({ text, onClick, className }: ShinyButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative px-6 py-2 font-medium text-white transition-colors duration-300 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden group",
        className
      )}
    >
      <span className="relative z-10">{text}</span>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
        className="absolute inset-0 z-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
      />
    </motion.button>
  );
};
