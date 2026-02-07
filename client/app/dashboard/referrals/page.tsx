"use client";
import React, { useState } from "react";
import { PageHeader, DashboardCard, DashboardSection, EmptyState } from "@/components/dashboard/Shared";
import { Users, Gift, DollarSign, TrendingUp, Copy, Check } from "lucide-react";
import { useReferrals } from "@/hooks/useReferrals";
import { Loader } from "@/components/ui/Loader";
import { toast } from "sonner";

export default function ReferralsPage() {
  const { referrals, stats, referralCode, loading } = useReferrals();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://profolio.com/ref/${referralCode}`;
  
  const conversionRate = stats 
    ? stats.total_referrals > 0 
      ? ((stats.completed_referrals / stats.total_referrals) * 100).toFixed(1) 
      : "0"
    : "0";

  const statsData = [
    { label: "Total Referrals", value: stats?.total_referrals.toString() || "0", icon: Users, color: "indigo" },
    { label: "Earnings", value: `$${stats?.total_rewards.toFixed(2) || "0.00"}`, icon: DollarSign, color: "emerald" },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "purple" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader title="Referrals" description="Earn rewards by referring new users to PROFOLIO." />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat) => (
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
              <p className="text-sm text-neutral-500 font-medium">Share this link to earn $10 per referral</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={referralLink} 
              readOnly 
              className="flex-1 h-12 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-mono text-sm"
            />
            <button 
              onClick={handleCopy}
              className="h-12 px-6 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </DashboardCard>

      <DashboardSection title="Referral History" description="Track your successful referrals">
        {referrals.length === 0 ? (
          <EmptyState 
            title="No referrals yet" 
            description="Share your referral link with friends and colleagues to start earning rewards."
            icon={Users}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-widest text-neutral-400">Email</th>
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-widest text-neutral-400">Status</th>
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-widest text-neutral-400">Reward</th>
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-widest text-neutral-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                    <td className="py-4 px-4 font-medium">
                      {referral.referred_user_email || referral.referred_email || '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        referral.status === 'completed' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : referral.status === 'rewarded'
                          ? 'bg-indigo-500/10 text-indigo-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-500">
                      ${referral.reward_amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
