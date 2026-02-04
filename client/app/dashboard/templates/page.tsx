"use client";
import React from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { Layers, Plus } from "lucide-react";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Templates" 
        description="Choose from our curated collection of premium high-performance layouts."
        action={{
            label: "Import Custom",
            icon: Plus,
            onClick: () => {}
        }}
      />
      
      <EmptyState 
        title="Template Store coming soon"
        description="We are currently crafting beautiful, conversion-optimized layouts for your portfolio. Stay tuned!"
        icon={Layers}
      />
      
      {/* Grid of Dummy Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="group rounded-[2.5rem] overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 shadow-xl hover:border-indigo-500/30 transition-all">
            <div className="aspect-[4/3] bg-neutral-100 dark:bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">Modern Minimalist v0{i}</h3>
                    <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black rounded-full uppercase">Premium</span>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">Optimized for rapid site speed and pixel-perfect aesthetics.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
