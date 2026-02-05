"use client";
import React from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardBadge, 
    DashboardButton,
    DashboardSection 
} from "@/components/dashboard/Shared";
import { Code, Terminal, Plus, ShieldCheck, Save, Trash2 } from "lucide-react";

export default function CustomCodePage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="Custom Code" 
        description="Inject global scripts, CSS, and tracking pixels into your portfolio."
        action={{
            label: "Add Snippet",
            icon: Plus,
            onClick: () => {}
        }}
      />
      
      <DashboardCard className="bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-500" padding="small" hoverable={false}>
        <div className="flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 shrink-0" />
            <p className="text-xs font-black italic uppercase tracking-tight">Warning: Custom scripts can break your site frontend. Always validate code before saving.</p>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 gap-10">
        <DashboardSection title="Header Injection" description="Scripts placed in the <head> tag of your portfolio.">
            <DashboardCard className="bg-neutral-900 border-white/5 shadow-2xl overflow-hidden p-0" hoverable={false}>
                <div className="p-8 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-xl font-black text-white italic tracking-tighter">Global Header Script</h3>
                    </div>
                    <div className="flex gap-2">
                        <DashboardBadge variant="neutral" className="bg-white/10 text-white border-transparent">Analytics</DashboardBadge>
                        <DashboardBadge variant="neutral" className="bg-white/10 text-white border-transparent">Pixels</DashboardBadge>
                    </div>
                </div>
                <div className="bg-black/40 p-10 font-mono text-sm text-neutral-400 min-h-[300px] leading-relaxed">
                    <p className="text-indigo-400">{"<script>"}</p>
                    <p className="pl-6">{"window.dataLayer = window.dataLayer || [];"}</p>
                    <p className="pl-6">{"function gtag(){dataLayer.push(arguments);}"}</p>
                    <p className="pl-6">{"gtag('js', new Date());"}</p>
                    <p className="pl-6">{"gtag('config', 'G-XXXXXXXXX');"}</p>
                    <p className="text-indigo-400">{"</script>"}</p>
                </div>
                <div className="p-8 flex justify-end gap-3 bg-white/5">
                    <DashboardButton variant="ghost" className="text-white hover:bg-white/10" icon={Trash2}>Discard</DashboardButton>
                    <DashboardButton variant="secondary" className="bg-white text-black hover:bg-neutral-200" icon={Save}>Save Script</DashboardButton>
                </div>
            </DashboardCard>
        </DashboardSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DashboardSection title="Styling" description="Global CSS overrides for all templates.">
                <DashboardCard>
                    <h4 className="font-black italic text-lg mb-2">Custom CSS</h4>
                    <p className="text-xs text-neutral-500 font-medium mb-8 italic">Override default variables and add your own utility classes.</p>
                    <DashboardButton variant="outline" className="w-full h-12">
                        Open Style Editor &rarr;
                    </DashboardButton>
                </DashboardCard>
            </DashboardSection>
            
            <DashboardSection title="Footer Injection" description="Scripts placed before the </body> closure.">
                <DashboardCard>
                    <h4 className="font-black italic text-lg mb-2">Body Scripts</h4>
                    <p className="text-xs text-neutral-500 font-medium mb-8 italic">Inject tracking pixels or low-priority third party scripts.</p>
                    <DashboardButton variant="outline" className="w-full h-12">
                        Open Script Editor &rarr;
                    </DashboardButton>
                </DashboardCard>
            </DashboardSection>
        </div>
      </div>
    </div>
  );
}
