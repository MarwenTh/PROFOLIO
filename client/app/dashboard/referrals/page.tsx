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
import { Gift, Wallet, Share2, Users, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReferralsPage() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("PRO-MARWEN-2024");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Refer & Earn" 
        description="Share the love for Profolio and earn free premium months for every successful referral."
      />
      
      <DashboardCard className="bg-neutral-900 text-white border-transparent overflow-hidden" padding="none">
        <div className="p-16 relative z-10">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
                <Gift className="w-72 h-72" />
            </div>
            
            <DashboardBadge variant="success" className="mb-6 bg-emerald-500/20 text-emerald-400 border-transparent">Reward Program</DashboardBadge>
            <h3 className="text-6xl font-black italic tracking-tighter mb-6">GET 1 MONTH FREE</h3>
            <p className="text-neutral-400 font-medium mb-12 max-w-lg text-lg leading-relaxed italic">
                Invite a friend to Profolio. When they publish their first portfolio, you both get <span className="text-white font-black underline decoration-indigo-500 underline-offset-4">1 Month of Pro for Free</span>.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
                <div className="flex-1 h-16 bg-white/5 rounded-2xl px-6 flex items-center justify-between border border-white/10 group hover:border-white/20 transition-all">
                    <span className="font-mono text-indigo-400 font-black tracking-widest italic">PRO-MARWEN-2024</span>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-[10px] font-black uppercase bg-white text-black px-4 py-2 rounded-xl active:scale-95 transition-all"
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
                <DashboardButton variant="primary" className="h-16 px-10" icon={Share2}>
                    Share Referral Link
                </DashboardButton>
            </div>
        </div>
      </DashboardCard>

      <DashboardSection title="Earning Stats" description="Track your successful referrals and rewards balance.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { label: "Active Referrals", value: "12", icon: Users, color: "text-indigo-500" },
                { label: "Months Earned", value: "3", icon: Gift, color: "text-emerald-500" },
                { label: "Payout Balance", value: "$45.00", icon: Wallet, color: "text-amber-500" },
            ].map(stat => (
                <DashboardCard key={stat.label} className="text-center flex flex-col items-center">
                    <div className={cn("w-16 h-16 rounded-[2rem] bg-neutral-100 dark:bg-white/5 flex items-center justify-center mb-6", stat.color)}>
                        <stat.icon className="w-8 h-8" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">{stat.label}</p>
                    <h4 className="text-4xl font-black italic tracking-tighter">{stat.value}</h4>
                </DashboardCard>
            ))}
        </div>
      </DashboardSection>
    </div>
  );
}
