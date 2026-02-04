"use client";
import React, { useEffect, useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useSession } from "next-auth/react";
import { Loader2, Globe, Plus, Search, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PortfoliosPage() {
  const { data: session } = useSession();
  const { getUserPortfolios, loading } = usePortfolio();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      getUserPortfolios(session.user.id).then(res => {
        if (res.success) setPortfolios(res.portfolios);
      });
    }
  }, [session?.user?.id, getUserPortfolios]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">My Portfolios</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage all your live and draft designs.</p>
        </div>
        <button 
          onClick={() => router.push("/dashboard/create")}
          className="px-6 py-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-black/5 dark:shadow-white/5"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input 
          type="text"
          placeholder="Filter by name..."
          className="w-full pl-12 pr-4 py-4 bg-neutral-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-2xl outline-none transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios
            .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
            .map((p, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={p.id}
              className="group p-6 rounded-[2.5rem] bg-white dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-white/5 hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                {p.status === 'published' && (
                  <Link href={`/p/${p.slug}`} target="_blank" className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:text-indigo-500 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">{p.title}</h3>
              <p className="text-xs text-neutral-500 mb-6 font-mono">profolio.com/p/{p.slug}</p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-neutral-100 dark:border-white/5">
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  p.status === 'published' ? "bg-emerald-500/10 text-emerald-500" : "bg-neutral-100 dark:bg-white/5 text-neutral-400"
                )}>
                  {p.status}
                </div>
                <button 
                  onClick={() => router.push(`/dashboard/edit/${p.id}`)}
                  className="text-xs font-bold text-indigo-500 hover:underline"
                >
                  Edit Design &rarr;
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
