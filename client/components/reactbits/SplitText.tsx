"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const SplitText = ({ text, className, delay = 0.05 }: SplitTextProps) => {
  const words = text.split(" ");

  return (
    <div className={cn("flex flex-wrap text-white", className)}>
      {words.map((word, i) => (
        <span key={i} className="flex overflow-hidden mr-[0.5em]">
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.5,
                delay: (i * word.length + j) * delay,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  );
};
