"use client";
import React from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { AuthCarousel } from "@/components/AuthCarousel";
import { motion } from "framer-motion";

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
        <Link href="/" className="absolute top-8 right-8 md:top-12 md:right-12 flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors group z-20">
             Back to Home <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" /> 
        </Link>
        
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto grid w-[350px] gap-8 relative z-10"
        >
          <div className="grid gap-2 text-center">
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight"
            >
                Create an account
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-sm text-neutral-500 dark:text-neutral-400"
            >
               Enter your details below to create your account
            </motion.p>
          </div>
          <div className="grid gap-4">
             <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              type="button"
              className="group relative inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-700 disabled:pointer-events-none disabled:opacity-50 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-300 h-11 px-4 py-2 w-full hover:shadow-sm"
            >
               <svg className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Sign up with Google
            </motion.button>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative"
            >
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-black px-2 text-neutral-500">Or continue with</span>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="grid gap-4"
            >
                <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label htmlFor="first-name" className="text-sm font-medium text-neutral-900 dark:text-neutral-300">First name</label>
                    <input
                    id="first-name"
                    placeholder="Max"
                    required
                    className="flex h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700"
                    />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="last-name" className="text-sm font-medium text-neutral-900 dark:text-neutral-300">Last name</label>
                    <input
                    id="last-name"
                    placeholder="Robinson"
                    required
                    className="flex h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700"
                    />
                </div>
                </div>
                <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium text-neutral-900 dark:text-neutral-300">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="flex h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700"
                />
                </div>
                <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium text-neutral-900 dark:text-neutral-300">Password</label>
                <input
                    id="password"
                    type="password"
                    className="flex h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700"
                />
                </div>
                <button
                type="submit"
                className="group relative inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 h-11 px-4 py-2 w-full hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-emerald-500/20 dark:hover:shadow-white/20"
                >
                Get Started
                <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-active:ring-white/0 transition-all" />
                </button>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center text-sm text-neutral-500"
          >
            Already have an account?{" "}
            <Link href="/login" className="text-neutral-900 dark:text-white hover:underline underline-offset-4 font-medium">
              Sign in
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
