"use client";
import React from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardBadge, 
    DashboardButton 
} from "@/components/dashboard/Shared";
import { Layers, ShoppingBag, Download, ExternalLink, Calendar } from "lucide-react";

const DUMMY_PURCHASES = [
  { id: 1, title: "Abstract 3D Backgrounds", artist: "DesignSavant", date: "Feb 12, 2024", type: "Asset Pack", size: "250MB" },
  { id: 2, title: "Founders Portfolio", artist: "PixelPerfect", date: "Jan 28, 2024", type: "Template", size: "12MB" },
];

export default function PurchasesPage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="My Purchases" 
        description="Download and manage the premium web assets you've acquired."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {DUMMY_PURCHASES.map(item => (
          <DashboardCard key={item.id} className="group">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                    <Layers className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-xl font-black italic tracking-tighter mb-1">{item.title}</h3>
                   <p className="text-xs text-neutral-500 font-medium italic">by {item.artist}</p>
                </div>
            </div>

            <div className="flex items-center gap-6 mb-8 px-2">
                <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{item.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DashboardBadge variant="neutral" className="text-[8px]">{item.type}</DashboardBadge>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-neutral-100 dark:border-white/5">
                <DashboardButton 
                    variant="primary" 
                    className="flex-1 h-11 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    icon={Download}
                >
                    Download Asset
                </DashboardButton>
                <button className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400 hover:text-indigo-500 transition-all border border-neutral-200 dark:border-white/10">
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
