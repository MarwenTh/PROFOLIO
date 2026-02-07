"use client";
import React from "react";
import { PageHeader, DashboardCard, DashboardSection, EmptyState } from "@/components/dashboard/Shared";
import { Users, Gift, DollarSign, TrendingUp } from "lucide-react";

export default function ReferralsPage() {
  const stats = [
    { label: "Total Referrals", value: "0", icon: Users, color: "indigo" },
    { label: "Earnings", value: "$0", icon: DollarSign, color: "emerald" },
    { label: "Conversion Rate", value: "0%", icon: TrendingUp, color: "purple" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="space-y-10">
      <PageHeader title="Referrals" description="Earn rewards by referring new users to PROFOLIO." />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <DashboardCard key={stat.label} padding="small">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${colorMap[stat.color]} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black tracking-tight italic">{stat.value}</h4>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black italic">Your Referral Link</h3>
              <p className="text-sm text-neutral-500 font-medium">Share this link to earn rewards</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input 
              type="text" 
              value="https://profolio.com/ref/your-code" 
              readOnly 
              className="flex-1 h-12 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-mono text-sm"
            />
            <button className="h-12 px-6 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors">
              Copy
            </button>
          </div>
        </div>
      </DashboardCard>

      <DashboardSection title="Referral History" description="Track your successful referrals">
        <EmptyState 
          title="No referrals yet" 
          description="Share your referral link with friends and colleagues to start earning rewards."
          icon={Users}
        />
      </DashboardSection>
    </div>
  );
}
