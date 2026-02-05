"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
    ShoppingBag, 
    Sparkles, 
    ArrowRight, 
    Layout, 
    Palette, 
    Zap,
    Search,
    ChevronRight,
    Globe
} from "lucide-react";
import Link from "next/link";
import { DashboardButton, DashboardCard, DashboardBadge } from "@/components/dashboard/Shared";
import Image from "next/image";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-[#fbfbfc] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* Marketplace Navbar */}
      <nav className="fixed top-0 inset-x-0 h-20 border-b border-neutral-200/50 dark:border-white/5 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl z-50 flex items-center justify-between px-8 md:px-16 transition-all">
        <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 group-hover:rotate-6 transition-transform">
                <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">PROFOLIO <span className="text-indigo-500">MARKET</span></span>
        </Link>
        <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Back to Dashboard</Link>
            <DashboardButton variant="primary" className="h-11 px-8 rounded-xl shadow-xl">List Item</DashboardButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 text-center max-w-6xl mx-auto z-10">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <DashboardBadge variant="info" className="mb-6 h-8 px-4 flex items-center gap-2 border-indigo-500/20 bg-indigo-500/5 text-indigo-500">
                <Sparkles className="w-3.5 h-3.5" />
                The Future of Personal Branding
            </DashboardBadge>
            <h1 className="text-6xl md:text-8xl font-black tracking-[ -0.05em] italic mb-8 leading-[0.9]">
                CRAFT YOUR <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400">DIGITAL IDENTITY</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-500 font-medium max-w-2xl mx-auto mb-12 italic">
                The leading marketplace for elite portfolio templates, custom components, and exclusive web assets.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Search for templates, fonts, assets..."
                        className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl outline-none focus:border-indigo-500/50 transition-all font-bold italic"
                    />
                </div>
                <DashboardButton variant="secondary" className="h-16 px-10 rounded-[2rem] bg-indigo-500 hover:bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20">
                    Explore All <ArrowRight className="w-5 h-5 ml-2" />
                </DashboardButton>
            </div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="relative z-10 py-20 px-8 md:px-16 container mx-auto">
        <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black italic tracking-tighter">Bento Categories</h2>
            <button className="flex items-center gap-2 text-sm font-black uppercase text-indigo-500 hover:underline">View All &rarr;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
                { title: "Premium Templates", desc: "Elite-grade website designs", icon: Layout, color: "bg-indigo-500/10 text-indigo-500", count: "128 Items" },
                { title: "Custom Components", desc: "Interactive UI modules", icon: Zap, color: "bg-emerald-500/10 text-emerald-500", count: "450 Items" },
                { title: "Brand Assets", desc: "Logos, fonts, and colors", icon: Palette, color: "bg-amber-500/10 text-amber-500", count: "89 Items" },
                { title: "Magic Add-ons", desc: "AI-powered web extensions", icon: Sparkles, color: "bg-purple-500/10 text-purple-500", count: "32 Items" }
            ].map((cat, i) => (
                <motion.div
                    key={cat.title}
                    whileHover={{ y: -8 }}
                    className="p-8 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 shadow-xl group cursor-pointer"
                >
                    <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3", cat.color)}>
                        <cat.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter mb-2 leading-none">{cat.title}</h3>
                    <p className="text-sm text-neutral-500 font-medium mb-6 italic">{cat.desc}</p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{cat.count}</span>
                        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Promoted Section */}
      <section className="relative z-10 py-20 px-8 md:px-16 container mx-auto mb-40">
        <DashboardCard className="bg-neutral-900 dark:bg-white text-white dark:text-black border-none overflow-hidden" padding="none">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-16 md:p-24 flex flex-col justify-center">
                    <DashboardBadge variant="success" className="mb-8 w-fit border-emerald-500/20 bg-emerald-500/10 text-emerald-500">Weekly Top Feature</DashboardBadge>
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-[ -0.05em] mb-8 leading-[0.9]">
                        LUXURY PORTFOLIO <br /> <span className="opacity-40">EDITION 2024</span>
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-400 dark:text-neutral-500 font-medium mb-12 italic max-w-sm">
                        Experience the most advanced personal branding template ever built. Fully optimized for dark mode & SEO.
                    </p>
                    <div className="flex gap-4">
                        <DashboardButton variant="secondary" className="bg-indigo-500 text-white h-14 px-10 rounded-2xl">Own Now</DashboardButton>
                        <DashboardButton variant="ghost" className="h-14 px-10 text-white dark:text-black hover:bg-white/10 dark:hover:bg-black/5">Demo Live</DashboardButton>
                    </div>
                </div>
                <div className="relative min-h-[400px] bg-neutral-800 dark:bg-neutral-100 p-8 flex items-center justify-center">
                    {/* Placeholder for a cool asset preview */}
                    <div className="w-[80%] aspect-[4/3] rounded-3xl bg-neutral-700 dark:bg-neutral-200 shadow-3xl animate-pulse flex items-center justify-center overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                         <Globe className="w-32 h-32 opacity-10" />
                    </div>
                </div>
            </div>
        </DashboardCard>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 py-20 px-8 border-t border-neutral-200 dark:border-white/5 text-center">
        <p className="text-sm font-black tracking-widest uppercase text-neutral-400 italic">PROFOLIO &copy; 2024 &mdash; Crafted for the Digital Elite</p>
      </footer>
    </div>
  );
}
