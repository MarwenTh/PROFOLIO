"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Hyperspeed = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-full h-full bg-black overflow-hidden", className)}>
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: "50%", 
            y: "50%", 
            scale: 0, 
            opacity: 0,
            rotate: Math.random() * 360 
          }}
          animate={{ 
            scale: 2, 
            opacity: [0, 1, 0],
            x: `${50 + (Math.random() - 0.5) * 200}%`,
            y: `${50 + (Math.random() - 0.5) * 200}%`
          }}
          transition={{
            duration: Math.random() * 1 + 0.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeIn"
          }}
          className="absolute w-[2px] h-[100px] bg-gradient-to-t from-transparent via-indigo-500 to-white rounded-full origin-bottom"
        />
      ))}
    </div>
  );
};
