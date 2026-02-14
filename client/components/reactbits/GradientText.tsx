"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  text: string;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
}

export const GradientText = ({ 
  text, 
  className, 
  colors = ["#4f46e5", "#9333ea", "#ec4899", "#4f46e5"],
  animationSpeed = 8
}: GradientTextProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      <motion.span
        animate={{
          backgroundPosition: ["0% center", "200% center"],
        }}
        transition={{
          duration: animationSpeed,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        className="font-bold underline cursor-default"
      >
        {text}
      </motion.span>
    </div>
  );
};
