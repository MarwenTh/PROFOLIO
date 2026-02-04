"use client";
import React from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Globe, ExternalLink, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: {
    label: string;
    icon: any;
    onClick: () => void;
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500">
          {title}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1 font-medium italic">
          {description}
        </p>
      </motion.div>

      {action && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={action.onClick}
          className="relative inline-flex h-12 overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-indigo-400/50 shadow-xl shadow-indigo-500/10 active:scale-95 transition-transform shrink-0"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#6366f1_0%,#312e81_50%,#6366f1_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-black px-6 py-1 text-sm font-bold text-white backdrop-blur-3xl transition-colors hover:bg-neutral-900">
            <action.icon className="w-4 h-4 mr-2" />
            {action.label}
          </span>
        </motion.button>
      )}
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon, actionLabel, onAction }: any) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 rounded-[3rem] border border-dashed border-neutral-200 dark:border-white/5 bg-neutral-50/50 dark:bg-white/5">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-neutral-900 shadow-xl flex items-center justify-center text-neutral-400 dark:text-neutral-600 mb-6">
                <Icon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">{title}</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-sm font-medium mb-8 italic">{description}</p>
            {actionLabel && (
                <button 
                  onClick={onAction}
                  className="px-8 py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black font-black active:scale-95 transition-all shadow-2xl"
                >
                  {actionLabel}
                </button>
            )}
        </div>
    );
}
