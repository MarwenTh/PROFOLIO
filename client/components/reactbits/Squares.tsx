"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Squares = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-neutral-950", className)}>
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 flex flex-wrap gap-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{
              duration: Math.random() * 5 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="w-[40px] h-[40px] bg-indigo-500/20"
          />
        ))}
      </div>
    </div>
  );
};
