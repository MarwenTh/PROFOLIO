"use client";
import React from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { Search, Globe, Eye, Share2 } from "lucide-react";

export default function SEOPage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="SEO & Social" 
        description="Optimize how your portfolio appears in Google, Twitter, and LinkedIn."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="text-xl font-black">Google Preview</h3>
            </div>
            <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-dashed border-neutral-200 dark:border-white/10">
                <p className="text-blue-600 dark:text-blue-400 text-xl font-medium mb-1 hover:underline cursor-pointer">Marwen Th • Product Designer & Developer</p>
                <p className="text-emerald-700 dark:text-emerald-500 text-sm mb-2">profolio.com/p/marwen</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">Marwen is a multi-disciplinary designer specializing in high-performance web applications and brand identities for startups and tech companies.</p>
            </div>
            <div className="mt-8 space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Meta Title</label>
                    <input type="text" defaultValue="Marwen Th • Product Designer & Developer" className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-white/10 border border-transparent focus:border-indigo-500/50 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Meta Description</label>
                    <textarea rows={3} className="w-full p-5 rounded-2xl bg-neutral-50 dark:bg-white/10 border border-transparent focus:border-indigo-500/50 outline-none font-medium resize-none" defaultValue="Marwen is a multi-disciplinary designer specializing in high-performance web applications..." />
                </div>
            </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="text-xl font-black">Social Sharing (OG)</h3>
            </div>
            <div className="aspect-video rounded-2xl bg-neutral-100 dark:bg-white/10 flex flex-col items-center justify-center border border-neutral-200 dark:border-white/5 overflow-hidden group">
                <Eye className="w-12 h-12 text-neutral-300 group-hover:scale-110 transition-transform" />
                <p className="text-neutral-400 font-bold mt-4">Preview Social Image</p>
            </div>
            <div className="mt-8">
                <button className="w-full h-14 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-white/10 text-neutral-500 font-black hover:border-indigo-500 transition-all">
                    Upload Card Image
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
