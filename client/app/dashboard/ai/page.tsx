"use client";
import React from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { Wand2, Sparkles, Plus } from "lucide-react";

export default function AIAssistantPage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="AI Writing Assistant" 
        description="Let our powerful AI models craft perfect copy for your portfolio."
        action={{
            label: "Create New Bio",
            icon: Plus,
            onClick: () => {}
        }}
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
            <div className="p-10 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="w-32 h-32" />
                </div>
                <h3 className="text-2xl font-black mb-8">What should we write today?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        "Professional Bio",
                        "Project Case Study",
                        "Experience Description",
                        "Client Testimonial Ghostwrite",
                        "Newsletter Welcome Email",
                        "Social Media Teaser"
                    ].map(type => (
                        <button key={type} className="p-6 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent hover:border-indigo-500/30 hover:bg-white dark:hover:bg-neutral-800 transition-all text-left group">
                            <p className="font-bold text-sm tracking-tight">{type}</p>
                            <p className="text-xs text-neutral-500 mt-1">Generate high-converting {type.toLowerCase()}.</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-indigo-500 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-3xl font-black italic tracking-tighter mb-4">MAGIC MODE</h3>
                    <p className="text-indigo-100 font-medium mb-10 max-w-sm">Just paste your LinkedIn URL and we will generate all the content for your portfolio automatically.</p>
                    <div className="flex gap-2">
                        <input type="text" placeholder="https://linkedin.com/in/..." className="flex-1 h-14 bg-white/20 rounded-2xl px-5 border border-transparent focus:border-white/40 outline-none placeholder:text-white/40 font-bold" />
                        <button className="px-8 h-14 bg-white text-indigo-500 font-black rounded-2xl active:scale-95 transition-all">Go</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 shadow-xl">
                <h4 className="text-lg font-black mb-6">Recent Creations</h4>
                <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/10">
                            <p className="text-xs font-black uppercase text-indigo-500 mb-1">Professional Bio</p>
                            <p className="text-sm font-bold line-clamp-2 italic mb-2">"A passionate product designer focused on creating minimal and accessible user interfaces..."</p>
                            <p className="text-[10px] text-neutral-400">2 hours ago</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
