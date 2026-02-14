"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Aurora = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-neutral-950", className)}>
      <div className="absolute inset-0 opacity-50">
        <motion.div
            animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
            }}
            className="absolute inset[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.3),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.3),transparent_50%)] blur-[80px]"
        />
      </div>
      <div className="relative z-10 w-full h-full" />
    </div>
  );
};
