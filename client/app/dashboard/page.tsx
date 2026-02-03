"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Loader2, Plus, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { getUserPortfolios, loading } = usePortfolio();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session?.user?.id) {
      getUserPortfolios(session.user.id).then((data) => {
        if (data.success) {
          setPortfolios(data.portfolios);
        }
      });
    }
  }, [session, status, getUserPortfolios, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-sm text-neutral-500 animate-pulse">Loading your portfolios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 min-h-[80vh] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral-900 dark:text-white bg-clip-text">
            Workspace
          </h1>
          <p className="text-xs md:text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">
            Welcome back, <span className="text-neutral-900 dark:text-white font-bold">{session?.user?.name}</span>
          </p>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => router.push("/dashboard/create")}
          className="relative inline-flex h-12 overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-xl shadow-emerald-500/10 active:scale-95 transition-transform"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#064e3b_50%,#10b981_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-black px-6 py-1 text-sm font-bold text-white backdrop-blur-3xl transition-colors hover:bg-neutral-900">
            <Plus className="w-4 h-4 mr-2" />
            Create Portfolio
          </span>
        </motion.button>
      </div>

      {portfolios.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-20 h-20 rounded-3xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center mb-6 border border-neutral-200 dark:border-white/10"
            >
                <Globe className="w-10 h-10 text-neutral-400 dark:text-neutral-600" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-3">
                    Your Workspace is Empty
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                    You need to create a portfolio in order to access your data here. 
                    Let's launch your first project!
                </p>
                <button 
                    onClick={() => router.push("/dashboard/create")}
                    className="mt-8 text-sm font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                    Get Started &rarr;
                </button>
            </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map((portfolio, index) => (
            <Link key={portfolio.id} href={`/dashboard/edit/${portfolio.id}`}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -5 }}
                    className="group relative p-8 rounded-3xl border border-neutral-200/50 dark:border-white/5 bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-white/5 transition-all cursor-pointer overflow-hidden"
                >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                        <Globe className="w-6 h-6" /> 
                    </div>
                    <div className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border",
                        portfolio.status === 'published' 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-transparent"
                    )}>
                        {portfolio.status}
                    </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors tracking-tight">
                            {portfolio.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">profolio.com/</span>
                            <span className="text-xs font-bold font-mono text-emerald-500">{portfolio.slug}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between relative z-10">
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-800" />
                            ))}
                        </div>
                        <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-tighter">
                            Updated 2d ago
                        </div>
                    </div>
                </motion.div>
            </Link>
            ))}
        </div>
      )}
    </div>
  );
}

// Helper function for class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
