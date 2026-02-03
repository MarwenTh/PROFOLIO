"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const testimonials = [
  {
    quote: "The best portfolio builder I've ever used. Period.",
    name: "Sarah Jenkins",
    role: "Senior Designer @ Google",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
  },
  {
    quote: "I doubled my freelance leads in one month.",
    name: "Michael Chen",
    role: "Full Stack Developer",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote: "Simply stunning templates. Highly recommended.",
    name: "Emily Davis",
    role: "Art Director",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote: "Finally, a builder that understands modern design.",
    name: "James Wilson",
    role: "UX Researcher",
    src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=3560&auto=format&fit=crop",
  },
    {
    quote: "The analytics feature is a game changer for me.",
    name: "Lisa Park",
    role: "Product Manager",
    src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=3560&auto=format&fit=crop",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-950 overflow-hidden relative transition-colors duration-300">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                Loved by thousands
            </h2>
        </div>

      <div className="relative flex animate-scroll-left w-max hover:[animation-play-state:paused]">
        {[...testimonials, ...testimonials].map((t, idx) => (
             <div key={idx} className="w-[400px] shrink-0 mx-4 p-8 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none hover:shadow-md dark:hover:bg-white/10 transition-all">
                <p className="text-lg text-neutral-700 dark:text-neutral-300 italic mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                     <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image src={t.src} alt={t.name} fill className="object-cover" />
                     </div>
                     <div>
                         <h4 className="text-neutral-900 dark:text-white font-bold">{t.name}</h4>
                         <p className="text-sm text-neutral-500">{t.role}</p>
                     </div>
                </div>
             </div>
        ))}
      </div>
      
       {/* Fade Edges */}
       <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-50 dark:from-neutral-950 to-transparent z-10 pointer-events-none transition-colors duration-300" />
       <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-50 dark:from-neutral-950 to-transparent z-10 pointer-events-none transition-colors duration-300" />
    </section>
  );
};
