"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { 
  Palette, 
  MousePointer2, 
  Globe2, 
  BarChart, 
  Zap, 
  Layers 
} from "lucide-react";
import { motion } from "framer-motion";

export const Features = () => {
    const features = [
        {
          title: "Drag & Drop",
          description: "An intuitive builder that feels like magic.",
          icon: <MousePointer2 className="w-8 h-8 text-indigo-400" />,
          colSpan: "md:col-span-2",
        },
        {
          title: "Global CDN",
          description: "Lightning fast loads anywhere on Earth.",
          icon: <Globe2 className="w-8 h-8 text-pink-400" />,
          colSpan: "md:col-span-1",
        },
        {
          title: "Analytics",
          description: "Know your audience.",
          icon: <BarChart className="w-8 h-8 text-emerald-400" />,
          colSpan: "md:col-span-1",
        },
        {
          title: "Custom Themes",
          description: "Detailed control over every pixel.",
          icon: <Palette className="w-8 h-8 text-purple-400" />,
          colSpan: "md:col-span-2",
        },
    ];

  return (
    <section className="py-32 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden transition-colors duration-300" id="features">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                    Powerful features, <br />
                    <span className="text-neutral-500 dark:text-neutral-500">packaged beautifully.</span>
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    Everything you need to build a world-class portfolio, without writing a single line of code.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        className={cn(
                            "relative overflow-hidden rounded-3xl p-8 border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md shadow-sm dark:shadow-none hover:shadow-md dark:hover:bg-white/10 transition-all group",
                            feature.colSpan
                        )}
                        whileHover={{ y: -5 }}
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                            <div className="mb-6 p-4 rounded-2xl bg-neutral-100 dark:bg-white/5 w-fit border border-neutral-200 dark:border-white/5">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};
