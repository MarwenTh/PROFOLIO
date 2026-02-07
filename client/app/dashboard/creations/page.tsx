"use client";
import React from "react";
import { PageHeader, DashboardCard, DashboardBadge, DashboardSection, EmptyState } from "@/components/dashboard/Shared";
import { ShoppingBag, TrendingUp, DollarSign, Package } from "lucide-react";

export default function CreationsPage() {
  const stats = [
    { label: "Total Sales", value: "$0", icon: DollarSign, color: "emerald" },
    { label: "Active Listings", value: "0", icon: Package, color: "indigo" },
    { label: "Total Views", value: "0", icon: TrendingUp, color: "purple" },
  ];

  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="space-y-10">
      <PageHeader title="My Creations" description="Manage your marketplace listings and track sales." />
      
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

      <DashboardSection title="Your Listings" description="Products you're selling on the marketplace">
        <EmptyState 
          title="No listings yet" 
          description="Start selling your templates, themes, or digital products on the marketplace."
          icon={ShoppingBag}
          actionLabel="Create Listing"
          onAction={() => {}}
        />
      </DashboardSection>
    </div>
  );
}
