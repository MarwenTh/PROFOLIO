"use client";
import React from "react";
import { 
    Search, 
    Bell, 
    ShoppingBag, 
    Sparkles,
    Command,
    ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashboardButton } from "./Shared";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function TopNavbar({ onSearchOpen }: { onSearchOpen?: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="h-20 border-b border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-2xl flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-500">
      {/* Glossy Top Edge Glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />

      <div className="flex items-center gap-6 flex-1">
        {/* Global Search Bar - Refined Command Palette Trigger */}
        <div 
            onClick={onSearchOpen}
            className="relative group max-w-md w-full hidden md:block cursor-pointer"
        >
            <div className="absolute inset-0 bg-neutral-100 dark:bg-white/5 rounded-2xl group-hover:bg-neutral-200 dark:group-hover:bg-white/10 transition-colors" />
            <div className="relative flex items-center gap-3 px-4 h-12">
                <Search className="w-5 h-5 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
                <span className="text-sm text-neutral-400 font-medium italic">Search anything...</span>
                <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-xl bg-white/50 dark:bg-black/20 border border-neutral-200 dark:border-white/10 shadow-sm transition-all group-hover:scale-105 group-hover:border-indigo-500/30">
                    <Command className="w-3 h-3 text-neutral-400" />
                    <span className="text-[10px] font-black text-neutral-400">K</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Marketplace Link - Standalone & Glowing */}
        <Link href="/marketplace">
            <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
            >
                {/* Pulsing Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur-md opacity-20 group-hover:opacity-60 animate-pulse transition-opacity" />
                
                <DashboardButton 
                    variant="primary" 
                    className="relative h-12 px-8 bg-black dark:bg-white text-white dark:text-black border-none shadow-2xl overflow-visible group-hover:shadow-indigo-500/20 transition-all"
                    icon={ShoppingBag}
                >
                    <span className="flex items-center gap-2.5">
                        Marketplace
                        <div className="flex items-center gap-1 bg-white/20 dark:bg-black/10 px-2 py-0.5 rounded-lg backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-indigo-400 animate-bounce" />
                            <span className="text-[9px] font-black uppercase tracking-tighter">New Area</span>
                        </div>
                    </span>
                </DashboardButton>
            </motion.div>
        </Link>

        {/* User Quick Actions */}
        <div className="flex items-center gap-3 border-l border-neutral-200 dark:border-white/10 pl-6 h-10">
            <button className="p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:text-indigo-500 transition-all relative group">
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-neutral-900 shadow-lg animate-ping" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-neutral-900 shadow-lg" />
            </button>

            <button className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all text-left group">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    {session?.user?.image ? (
                        <Image src={session.user.image} alt="User" width={36} height={36} className="object-cover" />
                    ) : (
                        <span className="text-sm font-black text-indigo-500 italic">M.</span>
                    )}
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-400 transition-transform group-hover:translate-y-0.5" />
            </button>
        </div>
      </div>
    </header>
  );
}
