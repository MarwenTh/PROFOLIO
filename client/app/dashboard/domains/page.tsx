"use client";
import React, { useState } from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { Globe, Plus, Link2, Info, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DomainsPage() {
  const [slug, setSlug] = useState("marwen-portfolio");
  const [isEditingSlug, setIsEditingSlug] = useState(false);

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Domain & Slug" 
        description="Manage your portfolio's public address and custom vanity URLs."
        action={{
            label: "Connect Domain",
            icon: Plus,
            onClick: () => {}
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Slug Management Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[2.5rem] bg-card shadow-xl border border-border flex flex-col"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Link2 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-xl font-black italic">Portfolio Slug</h3>
                    <p className="text-xs text-neutral-500 font-medium italic">Your secondary domain on our platform.</p>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm select-none">
                        profolio.pro/
                    </div>
                    <input 
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full h-16 pl-[100px] pr-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none transition-all font-black text-indigo-500"
                        placeholder="your-slug"
                    />
                </div>

                {/* Limitation Notice */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-tighter">Usage Notice</p>
                        <p className="text-xs text-amber-700/70 dark:text-amber-500/70 font-medium italic leading-tight">
                            You have only <span className="font-black underline">1 free change</span> of your slug. 
                            Further modifications require a <span className="font-black">Pro version</span>.
                        </p>
                    </div>
                </div>
            </div>

            <button className="mt-8 w-full h-14 rounded-2xl bg-foreground text-background font-black active:scale-95 transition-all shadow-xl">
                Update Slug
            </button>
        </motion.div>

        {/* Custom Domain Section (Empty State Integration) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
        >
            <div className="h-full p-8 rounded-[2.5rem] bg-indigo-500 shadow-2xl shadow-indigo-500/20 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Globe className="w-48 h-48 rotate-12" />
                </div>
                
                <div className="relative z-10 text-white">
                    <h3 className="text-3xl font-black italic tracking-tighter mb-4">Custom Domain</h3>
                    <p className="text-indigo-100 font-medium mb-8 max-w-sm italic">
                        Free users are limited to .profolio subdomains. Upgrade to Pro to connect your own high-conversion domain.
                    </p>
                    <button className="px-8 h-14 rounded-2xl bg-white text-indigo-500 font-black active:scale-95 transition-all shadow-2xl">
                        Upgrade To Pro
                    </button>
                </div>
            </div>
        </motion.div>
      </div>

      <div className="p-8 rounded-[2.5rem] border border-dashed border-border bg-card flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-background shadow-lg flex items-center justify-center text-neutral-400">
              <Info className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-black tracking-tight">Need help with DNS?</h4>
              <p className="text-sm text-neutral-500 font-medium italic">Our documentation guide covers everything from A records to CNAME setups for all major providers.</p>
          </div>
          <button className="px-6 h-12 rounded-xl border border-border font-bold text-sm hover:bg-background transition-all">
              Read Docs
          </button>
      </div>
    </div>
  );
}
