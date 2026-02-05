"use client";
import React, { useState } from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardInput, 
    DashboardButton,
    DashboardSection,
    DashboardBadge 
} from "@/components/dashboard/Shared";
import { Globe, Plus, Link2, AlertCircle, Info } from "lucide-react";

export default function DomainsPage() {
  const [slug, setSlug] = useState("marwen-portfolio");

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Domain & Slug" 
        description="Connect and manage your professional vanity URLs for your portfolio brand."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardSection 
            title="Portfolio Slug" 
            description="Your direct path on Profolio. Changing this might break existing links."
        >
            <DashboardCard>
                <div className="space-y-6">
                    <DashboardInput 
                        label="Active URL Slug"
                        prefixText="profolio.pro/p/"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        hint="You have 1 free change remaining. Pro members get unlimited changes."
                    />
                    <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <DashboardBadge variant="warning">
                             1 Change Remaining
                        </DashboardBadge>
                        <DashboardButton variant="primary" icon={Link2}>
                            Update Slug
                        </DashboardButton>
                    </div>
                </div>
            </DashboardCard>
        </DashboardSection>

        <DashboardSection 
            title="Custom Domain" 
            description="Connect your own domain name (e.g., yourname.com) to your portfolio."
        >
            <DashboardCard className="h-full bg-indigo-500 text-white border-transparent">
                <div className="relative z-10 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-2xl font-black italic tracking-tighter">Premium Domain</h4>
                    </div>
                    <p className="text-indigo-100 font-medium mb-8 max-w-sm italic">
                        Free users are limited to .profolio subdomains. Upgrade to Pro to connect your own high-conversion domain.
                    </p>
                    <div className="flex justify-start">
                        <DashboardButton variant="secondary" icon={Plus} className="bg-white text-indigo-500 hover:bg-neutral-100">
                            Upgrade & Connect
                        </DashboardButton>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Globe className="w-48 h-48 rotate-12" />
                </div>
            </DashboardCard>
        </DashboardSection>
      </div>

      <DashboardCard padding="small" className="bg-neutral-50 dark:bg-white/5 border-dashed">
          <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-900 shadow-lg flex items-center justify-center text-neutral-400">
                  <Info className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center md:text-left">
                  <h4 className="text-lg font-black tracking-tight">Need help with DNS?</h4>
                  <p className="text-sm text-neutral-500 font-medium italic">Our documentation guide covers everything from A records to CNAME setups for all major providers.</p>
              </div>
              <DashboardButton variant="outline" className="h-11 px-8">
                  Read Docs
              </DashboardButton>
          </div>
      </DashboardCard>
    </div>
  );
}
