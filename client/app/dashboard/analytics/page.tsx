"use client";
import React from "react";
import { BarChart3, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Globe, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const { getUserPortfolios, loading } = usePortfolio();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      getUserPortfolios(session.user.id).then(res => {
        if (res.success && res.portfolios.length > 0) {
          setPortfolios(res.portfolios);
          setSelectedPortfolio(res.portfolios[0]);
        }
      });
    }
  }, [session?.user?.id, getUserPortfolios]);

  if (loading && portfolios.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Analytics</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Performance for <span className="text-indigo-500 font-bold">{selectedPortfolio?.title || "all projects"}</span>
          </p>
        </div>

        {/* Portfolio Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-xl shadow-black/5 dark:shadow-white/5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Select Portfolio</p>
              <p className="text-sm font-bold truncate max-w-[150px]">{selectedPortfolio?.title || "Choose one..."}</p>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", isDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl"
              >
                {portfolios.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPortfolio(p);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                      selectedPortfolio?.id === p.id 
                        ? "bg-indigo-500/10 text-indigo-500" 
                        : "hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    )}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-bold truncate">{p.title}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Views", value: "24,512", trend: "+12.5%", positive: true, icon: BarChart3 },
          { label: "Unique Visitors", value: "11,203", trend: "+8.2%", positive: true, icon: Users },
          { label: "Avg. Duration", value: "2m 45s", trend: "-2.1%", positive: false, icon: TrendingUp },
          { label: "Conversion Rate", value: "4.8%", trend: "+1.2%", positive: true, icon: Globe },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] border border-neutral-200/50 dark:border-white/5 bg-white dark:bg-neutral-900 overflow-hidden relative group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-0.5 text-[10px] font-black px-2 py-1 rounded-lg",
                stat.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{stat.label}</p>
            <h4 className="text-2xl font-black tracking-tight">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-96 rounded-[2.5rem] border border-neutral-200/50 dark:border-white/5 bg-white dark:bg-neutral-900/40 backdrop-blur-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#6366f1_0%,transparent_50%)]" />
            <p className="text-sm font-bold text-neutral-400">Traffic Distribution Chart (Frontend Only)</p>
        </div>
        <div className="h-96 rounded-[2.5rem] border border-neutral-200/50 dark:border-white/5 bg-white dark:bg-neutral-900/40 backdrop-blur-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#10b981_0%,transparent_50%)]" />
            <p className="text-sm font-bold text-neutral-400">Visitor Geography Map (Frontend Only)</p>
        </div>
      </div>
    </div>
  );
}
