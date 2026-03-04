"use client";
import React from "react";
import { SignIn } from "@clerk/nextjs";
import { AuthCarousel } from "@/components/AuthCarousel";
import { motion } from "framer-motion";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Left Side - Visual (Carousel) */}
      <div className="hidden bg-neutral-100 dark:bg-neutral-900 lg:block relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <AuthCarousel />
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-300 relative">
        <Link
          href="/"
          className="absolute top-8 right-8 md:top-12 md:right-12 flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors group z-20"
        >
          Back to Home{" "}
          <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" />
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10"
        >
          <SignIn
            routing="hash"
            signUpUrl="/signup"
            fallbackRedirectUrl="/dashboard"
          />
        </motion.div>
      </div>
    </div>
  );
}
