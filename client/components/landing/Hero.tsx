"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

export const Hero = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });
    
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const position = useTransform(scrollYProgress, (pos) => {
        return pos === 1 ? "relative" : "fixed";
    });

  return (
    <section ref={targetRef} className="h-screen w-full bg-white dark:bg-neutral-950 relative flex flex-col items-center justify-center overflow-hidden antialiased transition-colors duration-300">
         {/* Aurora Background */}
        <div className="absolute inset-0 z-0">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-aurora-spin opacity-50">
                 <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse" />
                 <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse delay-1000" />
                 <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-blue-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse delay-2000" />
             </div>
             <div className="absolute inset-0 bg-white/90 dark:bg-neutral-950/90" /> {/* Dimmer */}
        </div>

        <motion.div 
            style={{ opacity, scale }}
            className="relative z-10 p-4 max-w-7xl mx-auto flex flex-col items-center text-center"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 p-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            >
                <div className="bg-black text-white text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     v2.0 is now live
                </div>
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-8xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6 drop-shadow-2xl"
            >
                Craft Your Identity. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300">
                    Build Your Future.
                </span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mb-10"
            >
                The ultimate portfolio builder for modern creatives. 
                Stand out with stunning, motion-rich templates designed to convert.
            </motion.p>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-4"
            >
                <button className="px-8 py-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                    Start Building Free
                </button>
                <button className="px-8 py-4 rounded-full border border-neutral-200 dark:border-white/20 text-neutral-900 dark:text-white font-medium text-lg hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors backdrop-blur-sm">
                    View Demo
                </button>
            </motion.div>
        </motion.div>
    </section>
  );
};
