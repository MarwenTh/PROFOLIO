"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

/**
 * BlockStats — Animated counter row (e.g., "50+ Projects", "10 Years", "200 Clients").
 * Content shape: { stats[] }
 */
interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

interface BlockStatsProps {
  content: {
    stats?: Stat[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

/** Simple animated counter hook */
const useCounter = (
  target: number,
  duration: number = 2000,
  start: boolean = true,
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, start]);

  return count;
};

/** Individual stat counter component */
const StatItem: React.FC<{ stat: Stat; delay: number; isEditor: boolean }> = ({
  stat,
  delay,
  isEditor,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCounter(stat.value, 2000, isEditor || isInView);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center px-6 py-4"
      initial={isEditor ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <span className="text-4xl md:text-5xl font-black text-white mb-2">
        {stat.prefix || ""}
        {count}
        {stat.suffix || ""}
      </span>
      <span className="text-neutral-500 text-sm font-semibold uppercase tracking-wider">
        {stat.label}
      </span>
    </motion.div>
  );
};

export const BlockStats: React.FC<BlockStatsProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    stats = [
      { label: "Projects", value: 50, suffix: "+" },
      { label: "Years Experience", value: 8 },
      { label: "Happy Clients", value: 200, suffix: "+" },
      { label: "Awards", value: 12 },
    ],
  } = content || {};

  return (
    <div
      className="w-full py-12 md:py-16 px-8"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, transparent 50%)",
        ...styles,
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center divide-x divide-white/10">
        {stats.map((stat, i) => (
          <StatItem key={i} stat={stat} delay={i * 0.1} isEditor={isEditor} />
        ))}
      </div>
    </div>
  );
};
