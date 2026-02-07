"use client";
import React, { useState } from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardSection 
} from "@/components/dashboard/Shared";
import { 
    TrendingUp, 
    DollarSign, 
    Download, 
    ShoppingBag, 
    Eye,
    Star,
    Users,
    Calendar,
    Clock,
    Wallet
} from "lucide-react";
import { useMyCreations } from "@/hooks/useMarketplace";
import { Loader } from "@/components/ui/Loader";

export default function MarketplaceAnalyticsPage() {
  const { items, loading } = useMyCreations();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Calculate analytics from items
  const totalRevenue = items.reduce((acc, item) => acc + Number(item.total_revenue || 0), 0);
  const totalDownloads = items.reduce((acc, item) => acc + (item.downloads || 0), 0);
  const totalListings = items.length;
  const activeListings = items.filter(item => item.status === 'published').length;
  const avgRating = items.length > 0 
    ? items.reduce((acc, item) => acc + Number(item.rating || 0), 0) / items.length 
    : 0;

  // Get top performing items
  const topByRevenue = [...items]
    .sort((a, b) => Number(b.total_revenue || 0) - Number(a.total_revenue || 0))
    .slice(0, 5);

  const topByDownloads = [...items]
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 5);

  // Calculate growth (mock data for now - would come from backend)
  const revenueGrowth = 12.5;
  const downloadsGrowth = 8.3;

  const stats = [
    { 
      label: "Total Earnings", 
      value: `$${totalRevenue.toFixed(2)}`, 
      icon: Wallet, 
      color: "emerald",
      trend: revenueGrowth
    },
    { 
      label: "Total Sales", 
      value: totalDownloads.toString(), 
      icon: ShoppingBag, 
      color: "indigo",
      trend: downloadsGrowth
    },
    { 
      label: "Active Listings", 
      value: `${activeListings}/${totalListings}`, 
      icon: Download, 
      color: "purple",
      trend: null
    },
    { 
      label: "Avg Rating", 
      value: avgRating.toFixed(1), 
      icon: Star, 
      color: "amber",
      trend: null
    },
  ];

  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-500" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-500" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-500" },
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
      <PageHeader 
        title="Store Stats" 
        description="Real-time monitoring of your design sales and marketplace performance."
      />

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[
          { value: '7d', label: 'Last 7 Days' },
          { value: '30d', label: 'Last 30 Days' },
          { value: '90d', label: 'Last 90 Days' },
          { value: 'all', label: 'All Time' },
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value as any)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              timeRange === range.value
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <DashboardCard key={stat.label}>
            <div className={`w-14 h-14 rounded-2xl ${colorMap[stat.color].bg} ${colorMap[stat.color].text} flex items-center justify-center mb-6 shadow-xl`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">
                  {stat.label}
                </p>
                <h4 className="text-3xl font-black italic tracking-tighter">{stat.value}</h4>
              </div>
              {stat.trend !== null && (
                <div className="flex items-center gap-0.5 text-emerald-500 font-bold text-xs mb-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                  <TrendingUp className="w-3 h-3" />
                  +{stat.trend}%
                </div>
              )}
            </div>
          </DashboardCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <DashboardSection title="Recent Sales" description="Your store's latest transactions." className="lg:col-span-2">
          <DashboardCard padding="none">
            <div className="w-full overflow-hidden">
              {items.slice(0, 5).length === 0 ? (
                <div className="p-12 text-center text-neutral-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No sales yet</p>
                </div>
              ) : (
                items.slice(0, 5).map((item, i) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-6 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors ${
                      i !== 4 && "border-b border-neutral-100 dark:border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black italic text-xs">
                        {item.type[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black italic leading-none mb-1">{item.title}</p>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                          {item.downloads || 0} downloads
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-500 mb-1">${Number(item.price).toFixed(2)}</p>
                      <div className="flex items-center gap-1 text-[9px] text-neutral-400 font-bold">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 5 && (
              <div className="p-4 bg-neutral-50 dark:bg-white/5 text-center">
                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:underline">
                  View All Sales History &rarr;
                </button>
              </div>
            )}
          </DashboardCard>
        </DashboardSection>

        {/* Earning Breakdown */}
        <DashboardSection title="Earning Sources" description="Where your profit is coming from.">
          <DashboardCard className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              {['template', 'component', 'theme'].map((type) => {
                const typeItems = items.filter(item => item.type === type);
                const typeRevenue = typeItems.reduce((acc, item) => acc + Number(item.total_revenue || 0), 0);
                const percentage = totalRevenue > 0 ? (typeRevenue / totalRevenue) * 100 : 0;
                
                const colorMap: Record<string, string> = {
                  template: 'bg-indigo-500',
                  component: 'bg-purple-500',
                  theme: 'bg-emerald-500',
                };

                return (
                  <div key={type}>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span>{type}s</span>
                      <span className="text-neutral-400">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${colorMap[type]}`} 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-white/5">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/20">
                <TrendingUp className="w-5 h-5" />
                <p className="text-xs font-black italic">
                  Total Revenue <br /> 
                  <span className="text-[10px] opacity-80 uppercase tracking-widest not-italic">
                    ${totalRevenue.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </DashboardCard>
        </DashboardSection>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardSection title="Top by Revenue" description="Best selling items">
          {topByRevenue.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No sales data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topByRevenue.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{item.title}</h4>
                    <p className="text-xs text-neutral-500">{item.downloads || 0} downloads</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-500">${Number(item.total_revenue || 0).toFixed(0)}</p>
                    <p className="text-xs text-neutral-500">${Number(item.price).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection title="Top by Downloads" description="Most popular items">
          {topByDownloads.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <Download className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No download data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topByDownloads.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-black">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{item.title}</h4>
                    <p className="text-xs text-neutral-500">⭐ {Number(item.rating).toFixed(1)} rating</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-indigo-500">{item.downloads || 0}</p>
                    <p className="text-xs text-neutral-500">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>
      </div>
    </div>
  );
}
