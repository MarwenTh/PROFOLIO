"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "This platform is a masterpiece. It helped me showcase my work in ways I never imagined.",
    author: "Sofia Davis",
    role: "Senior Product Designer",
  },
  {
    quote: "I landed my dream job at Google thanks to the portfolio I built with PROFOLIO.",
    author: "Alex Chen",
    role: "Frontend Engineer",
  },
  {
    quote: "The templates are simply stunning. It makes me look like a pro without any effort.",
    author: "Emily Watson",
    role: "Digital Artist",
  },
];

export const AuthCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full flex flex-col justify-between p-12 text-neutral-900 dark:text-white z-10 transition-colors duration-300">
       <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black/5 dark:bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                <Quote className="w-4 h-4 text-neutral-900 dark:text-white" />
            </div>
            <span className="font-bold tracking-tight">PROFOLIO</span>
       </div>

      <div className="relative h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <blockquote className="space-y-6">
              <p className="text-3xl font-bold leading-tight">
                "{testimonials[index].quote}"
              </p>
              <footer className="text-base">
                <div className="font-semibold text-neutral-900 dark:text-white">{testimonials[index].author}</div>
                <div className="text-neutral-500 dark:text-neutral-400">{testimonials[index].role}</div>
              </footer>
            </blockquote>
          </motion.div>
        </AnimatePresence>
      </div>

       <div className="flex gap-2">
          {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${idx === index ? "w-8 bg-neutral-900 dark:bg-white" : "w-2 bg-black/10 dark:bg-white/20 hover:bg-black/20 dark:hover:bg-white/40"}`}
              />
          ))}
      </div>
    </div>
  );
};
