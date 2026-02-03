"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ModeToggle } from "@/components/ModeToggle";

export const Navbar = () => {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (typeof latest === "number") {
             setScrolled(latest > 50);
        }
    });

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-[50000] w-full transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled 
            ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-200 dark:border-white/10" 
            : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                 <Image 
                    src="/assets/logo2.png" 
                    alt="PROFOLIO Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                 />
                 PROFOLIO
            </Link>
            <nav className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                    Features
                </Link>
                <Link href="#templates" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                    Templates
                </Link>
            </nav>
        </div>
        
        <div className="flex items-center gap-4">
             <ModeToggle />
            <Link href="/login" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
                Log in
            </Link>
            <Link 
                href="/signup" 
                className="text-sm font-medium px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity shadow-sm"
            >
                Start for free
            </Link>
        </div>
      </div>
    </header>
  );
};
