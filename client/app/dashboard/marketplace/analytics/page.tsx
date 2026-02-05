"use client";
import React from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardBadge, 
    DashboardSection 
} from "@/components/dashboard/Shared";
import { 
    LineChart, 
    DollarSign, 
    TrendingUp, 
    Users, 
    Download, 
    ArrowUpRight, 
    Clock, 
    Wallet,
    Calendar,
    ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketplaceAnalyticsPage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="Store Stats" 
        description="Real-time monitoring of your design sales and global marketplace performance."
      />
      
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Total Earnings", value: "$4,250.00", icon: Wallet, color: "text-emerald-500", trend: "+12.5%" },
          { label: "Total Sales", value: "142", icon: ShoppingBag, color: "text-indigo-500", trend: "+8.2%" },
          { label: "Asset Installs", value: "892", icon: Download, color: "text-purple-500", trend: "+15.3%" },
          { label: "Store Views", value: "12.4k", icon: Users, color: "text-amber-500", trend: "+24.1%" },
        ].map(stat => (
          <DashboardCard key={stat.label} className="group overflow-visible">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/5 dark:shadow-white/5", "bg-neutral-100 dark:bg-white/5", stat.color)}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">{stat.label}</p>
                    <h4 className="text-3xl font-black italic tracking-tighter">{stat.value}</h4>
                </div>
                <div className="flex items-center gap-0.5 text-emerald-500 font-bold text-xs mb-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <DashboardSection title="Recent Sales" description="Your store's latest transactions." className="lg:col-span-2">
            <DashboardCard padding="none">
                <div className="w-full overflow-hidden">
                    {[
                        { item: "Minimalist v2", price: "$29", buyer: "josh_dev", time: "2h ago" },
                        { item: "Dark Mode Kit", price: "$19", buyer: "sarah_designer", time: "5h ago" },
                        { item: "Elite Portfolio", price: "$49", buyer: "mark_growth", time: "1d ago" },
                        { item: "Neo-Brutalism UI", price: "$25", buyer: "alex_ui", time: "2d ago" },
                    ].map((tx, i) => (
                        <div key={i} className={cn(
                            "flex items-center justify-between p-6 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors",
                            i !== 3 && "border-b border-neutral-100 dark:border-white/5"
                        )}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black italic text-xs">P</div>
                                <div>
                                    <p className="text-sm font-black italic leading-none mb-1">{tx.item}</p>
                                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{tx.buyer}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-emerald-500 mb-1">{tx.price}</p>
                                <div className="flex items-center gap-1 text-[9px] text-neutral-400 font-bold">
                                    <Clock className="w-2.5 h-2.5" />
                                    {tx.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-white/5 text-center">
                    <button className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:underline">View All Sales History &rarr;</button>
                </div>
            </DashboardCard>
        </DashboardSection>

        {/* Earning Breakdown */}
        <DashboardSection title="Earning Sources" description="Where your profit is coming from.">
            <DashboardCard className="h-full flex flex-col justify-between">
                <div className="space-y-6">
                    {[
                        { label: "Templates", value: 65, color: "bg-indigo-500" },
                        { label: "Assets", value: 20, color: "bg-purple-500" },
                        { label: "Add-ons", value: 15, color: "bg-emerald-500" },
                    ].map(src => (
                        <div key={src.label}>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                <span>{src.label}</span>
                                <span className="text-neutral-400">{src.value}%</span>
                            </div>
                            <div className="h-2 w-full bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all duration-1000", src.color)} style={{ width: `${src.value}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-white/5">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/20">
                        <TrendingUp className="w-5 h-5" />
                        <p className="text-xs font-black italic">Next payout scheduled for <br /> <span className="text-[10px] opacity-80 uppercase tracking-widest not-italic">Feb 28, 2024</span></p>
                    </div>
                </div>
            </DashboardCard>
        </DashboardSection>
      </div>
    </div>
  );
}
