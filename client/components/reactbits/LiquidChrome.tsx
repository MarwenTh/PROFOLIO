"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LiquidChrome = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-full h-full bg-black overflow-hidden", className)}>
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
          filter: ["contrast(20) brightness(1)", "contrast(30) brightness(1.2)", "contrast(20) brightness(1)"]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: "radial-gradient(circle at 50% 50%, #fff, #000 70%)",
          backgroundSize: "200% 200%",
          mixBlendMode: "difference"
        }}
        className="absolute inset-0 opacity-40 blur-[40px]"
      />
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[20px]" />
    </div>
  );
};
