"use client";
import React from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardInput, 
    DashboardButton, 
    DashboardBadge,
    DashboardSection 
} from "@/components/dashboard/Shared";
import { Wand2, Sparkles, Plus, Send, Zap, History, ExternalLink } from "lucide-react";

export default function AIAssistantPage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="AI Assistant" 
        description="Leverage large language models to craft high-conversion copy for your brand."
        action={{
            label: "New Generation",
            icon: Plus,
            onClick: () => {}
        }}
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
            <DashboardSection title="Generate Content" description="Select a content type to start the creative process.">
                <DashboardCard>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "Professional Bio", desc: "Short & punchy intros." },
                            { title: "Project Case Study", desc: "Detailed work stories." },
                            { title: "Experience List", desc: "Optimized job history." },
                            { title: "Social Teasers", desc: "Viral-ready hooks." },
                        ].map(type => (
                            <button key={type.title} className="p-6 rounded-3xl bg-neutral-50 dark:bg-white/5 border border-transparent hover:border-indigo-500/20 hover:bg-white dark:hover:bg-neutral-800 transition-all text-left group">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-black italic tracking-tight text-neutral-900 dark:text-white">{type.title}</p>
                                    <Zap className="w-3 h-3 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-[10px] text-neutral-500 font-medium italic">{type.desc}</p>
                            </button>
                        ))}
                    </div>
                </DashboardCard>
            </DashboardSection>

            <DashboardSection title="Magic Sync" description="Auto-generate your entire site from social profiles.">
                <DashboardCard className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-transparent">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Wand2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-black italic tracking-tighter">Magic Import</h3>
                        </div>
                        <p className="text-indigo-100 font-medium mb-10 max-w-sm italic">
                            Input your LinkedIn URL and we'll analyze your career to build your portfolio structure in seconds.
                        </p>
                        <div className="flex flex-col md:flex-row gap-3">
                            <input 
                                type="text" 
                                placeholder="linkedin.com/in/username" 
                                className="flex-1 h-16 bg-white/20 rounded-2xl px-6 border border-transparent focus:border-white/40 outline-none placeholder:text-white/40 font-bold text-white transition-all shadow-inner" 
                            />
                            <DashboardButton variant="secondary" className="bg-white text-indigo-500 hover:bg-neutral-100 h-16 px-10">
                                Run Magic Sync
                            </DashboardButton>
                        </div>
                    </div>
                    <Sparkles className="absolute top-0 right-0 p-8 w-64 h-64 opacity-10 rotate-12 pointer-events-none" />
                </DashboardCard>
            </DashboardSection>
        </div>

        <DashboardSection title="Activity" description="Your recent AI creations.">
            <DashboardCard className="h-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-neutral-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">History</span>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:underline">Clear</button>
                </div>
                
                <div className="space-y-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="group p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent hover:border-neutral-200 dark:hover:border-white/10 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black uppercase text-indigo-500">Bio</span>
                                <ExternalLink className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-sm font-bold line-clamp-2 italic text-neutral-900 dark:text-neutral-100 mb-2 leading-relaxed">
                                "Crafting digital experiences that bridge the gap between human..."
                            </p>
                            <p className="text-[9px] text-neutral-500 font-medium italic">Generated 2h ago</p>
                        </div>
                    ))}
                </div>
                
                <DashboardButton variant="ghost" className="w-full mt-6 h-10 text-xs">
                    View All History
                </DashboardButton>
            </DashboardCard>
        </DashboardSection>
      </div>
    </div>
  );
}
