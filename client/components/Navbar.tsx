"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ModeToggle } from "@/components/ModeToggle";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { Loader2, LayoutDashboard } from "lucide-react";

export const Navbar = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

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
          : "bg-transparent border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2"
          >
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
            <Link
              href="#features"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#templates"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Templates
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {!isLoaded ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
            </div>
          ) : (
            <>
              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-9 h-9 rounded-full border border-neutral-200 dark:border-white/10",
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
                      Log in
                    </button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity shadow-sm">
                      Start for free
                    </button>
                  </SignInButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
