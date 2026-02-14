"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const BlurText = ({ text, className, delay = 0.05 }: BlurTextProps) => {
  const words = text.split(" ");

  return (
    <div className={cn("flex flex-wrap text-white", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: i * delay,
            ease: "easeOut",
          }}
          className="mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};
