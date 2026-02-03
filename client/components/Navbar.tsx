"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ModeToggle } from "@/components/ModeToggle";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Loader2, LayoutDashboard } from "lucide-react";

export const Navbar = () => {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const { data: session, status } = useSession();

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
             {status === "loading" ? (
                <div className="w-8 h-8 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                </div>
             ) : session ? (
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
                            {session.user?.image ? (
                                <Image 
                                    src={session.user.image} 
                                    alt={session.user.name || "User"} 
                                    width={36} 
                                    height={36} 
                                    className="object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-neutral-500" />
                            )}
                        </div>
                        {/* Dropdown/Tooltop placeholder or simple logout for now */}
                        <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                            <div className="px-4 py-2 border-b border-neutral-200 dark:border-white/10">
                                <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                                <p className="text-xs text-neutral-500 truncate">{session.user?.email}</p>
                            </div>
                            <Link 
                                href="/dashboard"
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <button 
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
             ) : (
                <>
                    <Link href="/login" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
                        Log in
                    </Link>
                    <Link 
                        href="/login" 
                        className="text-sm font-medium px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity shadow-sm"
                    >
                        Start for free
                    </Link>
                </>
             )}
        </div>
      </div>
    </header>
  );
};
