"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
}

export const CountUp = ({ to, from = 0, duration = 2, className }: CountUpProps) => {
  const spring = useSpring(from, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));
  
  const [value, setValue] = useState(from);

  useEffect(() => {
    spring.set(to);
  }, [to, spring]);

  useEffect(() => {
    return display.onChange((v) => setValue(v));
  }, [display]);

  return (
    <motion.span className={className}>
      {value}
    </motion.span>
  );
};
