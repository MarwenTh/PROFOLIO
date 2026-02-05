"use client";
import React from "react";
import { 
    PageHeader, 
    EmptyState, 
    DashboardCard, 
    DashboardBadge, 
    DashboardButton,
    DashboardSection 
} from "@/components/dashboard/Shared";
import { Layers, Plus, ExternalLink, Sparkles, Eye, ArrowRight, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Store Templates" 
        description="Premium, conversion-optimized layouts for your digital identity."
        action={{
            label: "Explore Market",
            icon: ShoppingBag,
            onClick: () => router.push("/marketplace")
        }}
      />
      
      <DashboardSection 
        title="Trending Designs" 
        description="The most popular layouts in the Profolio ecosystem right now."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
            <DashboardCard key={i} padding="none" className="group">
                <div className="aspect-video bg-neutral-100 dark:bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                        <DashboardButton variant="secondary" icon={Eye} className="bg-white/90 backdrop-blur-md text-black h-9 px-4 text-[10px]">
                            Preview
                        </DashboardButton>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-black italic tracking-tight text-sm">Elite Theme v.0{i}</h3>
                        <DashboardBadge variant="success" className="text-[8px] px-2 py-0.5">Hot</DashboardBadge>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">by PixelStudio</p>
                        <p className="text-xs font-black text-indigo-500">$29</p>
                    </div>
                    <DashboardButton variant="primary" className="w-full mt-5 h-9 text-[10px] bg-neutral-900 dark:bg-white text-white dark:text-black border-none">
                        Get Template
                    </DashboardButton>
                </div>
            </DashboardCard>
            ))}
        </div>

        <div className="mt-12 flex justify-center">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <DashboardButton 
                    variant="secondary" 
                    className="h-14 px-12 rounded-2xl bg-indigo-500 text-white shadow-2xl shadow-indigo-500/20 group"
                    onClick={() => router.push("/marketplace")}
                >
                    <span className="flex items-center gap-2">
                        View All Trending Templates
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </DashboardButton>
            </motion.div>
        </div>
      </DashboardSection>

      <DashboardSection title="Installation History" description="Manage the templates you've previously installed.">
        <EmptyState 
            title="No templates installed yet"
            description="Your installed templates will appear here for easy management and switching."
            icon={Layers}
            actionLabel="Browse Marketplace"
            onAction={() => router.push("/marketplace")}
        />
      </DashboardSection>
    </div>
  );
}
