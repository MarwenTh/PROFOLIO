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
import { Layers, Plus, ExternalLink, Sparkles } from "lucide-react";

export default function TemplatesPage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="Templates" 
        description="Choose from our curated collection of premium high-performance layouts."
        action={{
            label: "Import Custom",
            icon: Plus,
            onClick: () => {}
        }}
      />
      
      <DashboardSection title="Premium Library" description="Conversion-optimized layouts ready for your content.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
            <DashboardCard key={i} padding="none" className="group">
                <div className="aspect-[4/3] bg-neutral-100 dark:bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent group-hover:scale-110 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                        <DashboardButton variant="secondary" icon={ExternalLink} className="bg-white/90 backdrop-blur-md text-black">
                            Preview
                        </DashboardButton>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-black italic tracking-tight text-lg">Modern Minimal v.0{i}</h3>
                        <DashboardBadge variant="info">Premium</DashboardBadge>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 italic font-medium leading-relaxed">
                        Precision-engineered for load speeds under 1s and perfect typography.
                    </p>
                    <DashboardButton variant="primary" className="w-full mt-6 h-11 text-xs">
                        Install Template
                    </DashboardButton>
                </div>
            </DashboardCard>
            ))}
        </div>
      </DashboardSection>

      <div className="pt-10">
        <EmptyState 
            title="Marketplace coming soon"
            description="Our community creators are building the next generation of professional templates."
            icon={Sparkles}
            actionLabel="Notify Me"
            onAction={() => {}}
        />
      </div>
    </div>
  );
}
