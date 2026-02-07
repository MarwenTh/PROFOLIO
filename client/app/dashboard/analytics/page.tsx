"use client";
import React, { useState } from "react";
import { 
    BarChart3, 
    Users, 
    Eye, 
    TrendingUp,
    Globe, 
    ExternalLink,
    Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { useAnalyticsOverview, useTrafficSources } from "@/hooks/useAnalytics";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardBadge,
    DashboardSection 
} from "@/components/dashboard/Shared";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState(30);
  const { overview, loading } = useAnalyticsOverview();
  const { sources, loading: sourcesLoading } = useTrafficSources(dateRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Views", 
      value: overview?.totalViews.toLocaleString() || "0", 
      icon: Eye,
      color: "indigo"
    },
    { 
      label: "Unique Visitors", 
      value: overview?.uniqueVisitors.toLocaleString() || "0", 
      icon: Users,
      color: "emerald"
    },
    { 
      label: "Portfolios", 
      value: overview?.totalPortfolios.toString() || "0", 
      icon: Globe,
      color: "purple"
    },
    { 
      label: "Avg. Views/Day", 
      value: overview?.viewsTrend.length 
        ? Math.round(overview.totalViews / 30).toString()
        : "0", 
      icon: TrendingUp,
      color: "amber"
    },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-purple-500/10 text-purple-500",
    amber: "bg-amber-500/10 text-amber-500"
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <PageHeader 
          title="Analytics" 
          description="Track your portfolio performance and visitor insights."
        />

        {/* Date Range Selector */}
        <div className="flex gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setDateRange(days)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                dateRange === days
                  ? 'bg-indigo-500 text-white'
                  : 'bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <DashboardCard padding="small" className="relative group overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${colorMap[stat.color]} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                {stat.label}
              </p>
              <h4 className="text-3xl font-black tracking-tight italic">
                {stat.value}
              </h4>
            </DashboardCard>
          </motion.div>
        ))}
      </div>

      {/* Views Trend */}
      {overview?.viewsTrend && overview.viewsTrend.length > 0 && (
        <DashboardSection 
          title="Views Trend" 
          description="Daily views over the last 7 days"
        >
          <DashboardCard>
            <div className="space-y-4">
              {overview.viewsTrend.map((day, index) => {
                const maxViews = Math.max(...overview.viewsTrend.map(d => d.views));
                const percentage = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-neutral-600 dark:text-neutral-400">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="font-black text-neutral-900 dark:text-white">
                        {day.views} views
                      </span>
                    </div>
                    <div className="w-full h-3 bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        </DashboardSection>
      )}

      {/* Traffic Sources */}
      {!sourcesLoading && sources.length > 0 && (
        <DashboardSection 
          title="Traffic Sources" 
          description="Where your visitors are coming from"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sources List */}
            <DashboardCard>
              <div className="space-y-3">
                {sources.map((source, index) => {
                  const totalVisits = sources.reduce((sum, s) => sum + s.visits, 0);
                  const percentage = totalVisits > 0 
                    ? ((source.visits / totalVisits) * 100).toFixed(1)
                    : '0';
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-sm">{source.source}</p>
                          <p className="text-xs text-neutral-500 font-bold">
                            {source.visits} visits
                          </p>
                        </div>
                      </div>
                      <DashboardBadge variant="default">
                        {percentage}%
                      </DashboardBadge>
                    </div>
                  );
                })}
              </div>
            </DashboardCard>

            {/* Pie Chart Visualization */}
            <DashboardCard className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                {sources.map((source, index) => {
                  const totalVisits = sources.reduce((sum, s) => sum + s.visits, 0);
                  const percentage = (source.visits / totalVisits) * 100;
                  
                  return (
                    <div key={index} className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="w-full h-full rounded-full border-8 border-indigo-500/20"
                        style={{
                          transform: `rotate(${index * 45}deg)`,
                          opacity: 0.1 + (percentage / 100)
                        }}
                      />
                    </div>
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-indigo-500 mx-auto mb-2" />
                    <p className="text-2xl font-black">
                      {sources.reduce((sum, s) => sum + s.visits, 0)}
                    </p>
                    <p className="text-xs text-neutral-500 font-bold">Total Visits</p>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </DashboardSection>
      )}

      {/* Empty State */}
      {overview?.totalViews === 0 && (
        <DashboardCard className="text-center py-16">
          <BarChart3 className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <h3 className="text-lg font-black italic mb-2">No Analytics Data Yet</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium italic max-w-md mx-auto">
            Start sharing your portfolios to see visitor analytics and insights here.
          </p>
        </DashboardCard>
      )}
    </div>
  );
}
