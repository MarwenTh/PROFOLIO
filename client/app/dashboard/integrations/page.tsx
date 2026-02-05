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
import { Zap, Plus, Github, Twitter, Instagram, Mail, ExternalLink } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    { name: "GitHub", icon: Github, status: "Connected", desc: "Sync your project repositories." },
    { name: "Twitter", icon: Twitter, status: "Pending", desc: "Automate your social feeds." },
    { name: "Instagram", icon: Instagram, status: "Soon", desc: "Showcase your visual work." },
    { name: "Mailchimp", icon: Mail, status: "Connected", desc: "Connect your subscriber base." },
  ];

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Integrations" 
        description="Supercharge your portfolio with third-party tools and automations."
      />
      
      <DashboardSection title="Connected Services" description="Manage access and data syncing for external platforms.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrations.map((item) => (
            <DashboardCard key={item.name} className="group hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400 mb-6 group-hover:text-indigo-500 group-hover:bg-indigo-500/10 transition-all">
                    <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black mb-1 tracking-tight italic">{item.name}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-medium leading-relaxed italic">{item.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                    <DashboardBadge variant={item.status === 'Connected' ? 'success' : 'neutral'}>
                        {item.status}
                    </DashboardBadge>
                    <button className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:underline flex items-center gap-1">
                        Manage <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
            </DashboardCard>
            ))}
        </div>
      </DashboardSection>

      <div className="pt-10">
        <EmptyState 
            title="Custom API Access"
            description="Our developer webhooks and REST API are launching for Pro members next month."
            icon={Zap}
            actionLabel="Join Waitlist"
            onAction={() => {}}
        />
      </div>
    </div>
  );
}
