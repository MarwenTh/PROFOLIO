"use client";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const templates = [
  "https://images.unsplash.com/photo-1481487484168-9b930d5b7960?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2555&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop", // Computer
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2672&auto=format&fit=crop", // Coding
];

export const TemplatesShowcase = () => {
  return (
    <section className="py-24 bg-white dark:bg-neutral-950 overflow-hidden transition-colors duration-300" id="templates">
         <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                Stunning Templates
            </h2>
             <p className="text-neutral-600 dark:text-neutral-400">
                Choose from our gallery of award-winning designs.
            </p>
        </div>

      <div className="relative flex flex-col gap-8">
        {/* Row 1: Left to Right */}
        <div className="flex gap-8 animate-scroll-left w-max hover:[animation-play-state:paused]">
             {[...templates, ...templates].map((img, idx) => (
                 <TemplateCard key={`row1-${idx}`} src={img} />
             ))}
        </div>
        
        {/* Row 2: Right to Left */}
         <div className="flex gap-8 animate-scroll-right w-max hover:[animation-play-state:paused]">
             {[...templates, ...templates].map((img, idx) => (
                 <TemplateCard key={`row2-${idx}`} src={img} />
             ))}
        </div>

        {/* Fade Edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none transition-colors duration-300" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none transition-colors duration-300" />
      </div>
    </section>
  );
};

const TemplateCard = ({ src }: { src: string }) => {
    return (
         <div className="relative w-[400px] h-[300px] rounded-2xl overflow-hidden cursor-pointer group border border-neutral-200 dark:border-white/10 shrink-0">
            <Image 
                src={src} 
                alt="Template" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Preview Theme
                </button>
            </div>
        </div>
    )
}
