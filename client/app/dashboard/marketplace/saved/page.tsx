"use client";
import React from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardBadge, 
    DashboardButton 
} from "@/components/dashboard/Shared";
import { Heart, ShoppingBag, Eye, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

const DUMMY_SAVED = [
  { id: 1, title: "Cyberpunk 2077 Theme", artist: "NightCityUI", price: "$35", rating: "4.9", category: "Template" },
  { id: 2, title: "Luminescent Icons", artist: "GlowUp", price: "$12", rating: "4.7", category: "Asset" },
  { id: 3, title: "Portfolio for Photographers", artist: "LensKing", price: "$29", rating: "5.0", category: "Template" },
];

export default function SavedPage() {
  const router = useRouter();

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Saved Designs" 
        description="Your curated collection of inspiration and assets for future projects."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DUMMY_SAVED.map(item => (
          <DashboardCard key={item.id} className="group">
            <div className="relative aspect-square rounded-[1.5rem] bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5 mb-6 overflow-hidden flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-neutral-300 dark:text-neutral-700 opacity-20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4">
                    <button className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 shadow-lg text-red-500 hover:scale-110 transition-transform">
                        <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-black italic tracking-tighter mb-1">{item.title}</h3>
            <div className="flex items-center justify-between mb-8">
                <p className="text-xs text-neutral-500 italic">by {item. artist}</p>
                <p className="text-sm font-black text-indigo-500">{item.price}</p>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-neutral-100 dark:border-white/5">
                <DashboardButton 
                    variant="secondary" 
                    className="flex-1 h-11 bg-black dark:bg-white text-white dark:text-black border-none"
                    onClick={() => router.push("/marketplace")}
                >
                    View Details
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
