"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MoveLeft, Loader2 } from "lucide-react";
import { AuthCarousel } from "@/components/AuthCarousel";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Left Side - Visual */}
      <div className="hidden bg-neutral-100 dark:bg-neutral-900 lg:block relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 dark:bg-teal-600/10 rounded-full blur-[100px]" />
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

        <div className="mx-auto w-full max-w-[400px] flex justify-center scale-95 md:scale-100">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-none bg-transparent",
                headerTitle:
                  "text-2xl font-bold text-neutral-900 dark:text-white",
                headerSubtitle:
                  "text-sm text-neutral-500 dark:text-neutral-400",
                formButtonPrimary:
                  "bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity",
                footerActionLink: "text-emerald-500 hover:text-emerald-600",
                identityPreviewText: "dark:text-white",
                identityPreviewEditButtonIcon: "dark:text-white",
                formFieldLabel: "dark:text-neutral-300",
                formFieldInput:
                  "dark:bg-neutral-900 dark:border-neutral-800 dark:text-white",
                dividerLine: "dark:bg-neutral-800",
                dividerText: "dark:text-neutral-500",
                socialButtonsBlockButton:
                  "dark:bg-neutral-900 dark:border-neutral-800 dark:text-white hover:dark:bg-neutral-800",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
