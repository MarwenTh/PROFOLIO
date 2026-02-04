"use client";
import React from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { Zap, Plus, Github, Twitter, Instagram, Mail } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    { name: "GitHub", icon: Github, status: "Connected", desc: "Sync your project repositories." },
    { name: "Twitter", icon: Twitter, status: "Pending", desc: "Automate your social feeds." },
    { name: "Instagram", icon: Instagram, status: "Coming Soon", desc: "Showcase your visual work." },
    { name: "Mailchimp", icon: Mail, status: "Connected", desc: "Connect your subscriber base." },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Integrations" 
        description="Supercharge your portfolio with third-party tools and automations."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {integrations.map((item) => (
          <div key={item.name} className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 shadow-xl hover:translate-y-[-5px] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-500 mb-6 group-hover:text-indigo-500">
                <item.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black mb-1 tracking-tight">{item.name}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 font-medium leading-relaxed">{item.desc}</p>
            <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Connected' ? 'text-emerald-500' : 'text-neutral-400'}`}>
                    {item.status}
                </span>
                <button className="text-sm font-bold text-indigo-500 hover:underline">
                    Manage &rarr;
                </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-12 border-t border-neutral-200 dark:border-white/5">
        <EmptyState 
            title="Need a custom integration?"
            description="Our developer API is launching soon. Build your own connectors for any service."
            icon={Zap}
        />
      </div>
    </div>
  );
}
