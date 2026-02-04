"use client";
import React from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { Gift, Wallet, Share2, Users } from "lucide-react";

export default function ReferralsPage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="Refer & Earn" 
        description="Share the love for Profolio and earn free premium months."
      />
      
      <div className="p-16 rounded-[4rem] bg-neutral-900 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
            <Gift className="w-64 h-64" />
        </div>
        <div className="relative z-10">
            <h3 className="text-5xl font-black italic tracking-tighter mb-6">GET 1 MONTH FREE</h3>
            <p className="text-neutral-400 font-medium mb-12 max-w-lg text-lg leading-relaxed">
                Invite a friend to Profolio. When they publish their first portfolio, you both get **1 Month of Pro for Free**.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 h-16 bg-white/10 rounded-2xl px-6 flex items-center justify-between border border-white/10">
                    <span className="font-mono text-indigo-400 font-bold tracking-wider">PRO-MARWEN-2024</span>
                    <button className="text-[10px] font-black uppercase bg-white text-black px-3 py-1 rounded-full">Copy</button>
                </div>
                <button className="h-16 px-10 bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-3">
                    <Share2 className="w-5 h-5" /> Share Link
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
            { label: "Active Referrals", value: "12", icon: Users },
            { label: "Free Months Earned", value: "3", icon: Gift },
            { label: "Payout Balance", value: "$45.00", icon: Wallet },
        ].map(stat => (
            <div key={stat.label} className="p-8 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 shadow-xl flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-indigo-500 mb-6 font-bold">
                    <stat.icon className="w-7 h-7" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{stat.label}</p>
                <h4 className="text-3xl font-black">{stat.value}</h4>
            </div>
        ))}
      </div>
    </div>
  );
}
