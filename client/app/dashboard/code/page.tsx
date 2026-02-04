"use client";
import React from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { Code, Terminal, Plus, ShieldCheck } from "lucide-react";

export default function CustomCodePage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="Custom Code" 
        description="Inject global scripts, CSS, and tracking pixels into your portfolio."
        action={{
            label: "Add Preset",
            icon: Plus,
            onClick: () => {}
        }}
      />
      
      <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 mb-8">
        <ShieldCheck className="w-6 h-6 shrink-0" />
        <p className="text-sm font-bold italic">Warning: Custom scripts can break your layout. Always test in the editor first.</p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <div className="p-10 rounded-[3rem] bg-neutral-900 border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-xl font-black text-white">Global Header Script</h3>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/10 text-[10px] text-white font-black rounded-full uppercase">Google Analytics</span>
                    <span className="px-3 py-1 bg-white/10 text-[10px] text-white font-black rounded-full uppercase">Meta Pixel</span>
                </div>
            </div>
            <div className="bg-black/50 rounded-2xl p-6 border border-white/5 font-mono text-sm text-neutral-400 min-h-[300px]">
                <p className="text-indigo-400">{"<script>"}</p>
                <p className="pl-4">{"window.dataLayer = window.dataLayer || [];"}</p>
                <p className="pl-4">{"function gtag(){dataLayer.push(arguments);}"}</p>
                <p className="pl-4">{"gtag('js', new Date());"}</p>
                <p className="pl-4">{"gtag('config', 'G-XXXXXXXXX');"}</p>
                <p className="text-indigo-400">{"</script>"}</p>
            </div>
            <div className="mt-8 flex justify-end">
                <button className="px-10 py-4 bg-white text-black font-black rounded-2xl active:scale-95 transition-all">Save Config</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 shadow-xl">
                <h4 className="font-black mb-4">Global CSS</h4>
                <p className="text-xs text-neutral-500 font-medium mb-6 italic">Override default styles and add your custom typography classes.</p>
                <button className="w-full py-4 rounded-xl bg-neutral-100 dark:bg-white/5 font-bold text-sm">Open CSS Editor &rarr;</button>
             </div>
             <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 shadow-xl">
                <h4 className="font-black mb-4">Body Footer Script</h4>
                <p className="text-xs text-neutral-500 font-medium mb-6 italic">Inject scripts right before the closing body tag for better performance.</p>
                <button className="w-full py-4 rounded-xl bg-neutral-100 dark:bg-white/5 font-bold text-sm">Open Footer Editor &rarr;</button>
             </div>
        </div>
      </div>
    </div>
  );
}
