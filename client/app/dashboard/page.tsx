"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { 
  Loader2, 
  Plus, 
  Globe, 
  ExternalLink, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Search,
  Filter,
  X,
  Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { getUserPortfolios, createPortfolio, loading } = usePortfolio();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: "", slug: "" });
  const [createError, setCreateError] = useState("");
  const router = useRouter();

  const handleFetchPortfolios = async () => {
    if (session?.user?.id) {
      const data = await getUserPortfolios(session.user.id);
      if (data.success) {
        setPortfolios(data.portfolios);
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    handleFetchPortfolios();
  }, [session?.user?.id, status, getUserPortfolios, router]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setCreateError("");
    const result = await createPortfolio({
      userId: session.user.id,
      title: newPortfolio.title,
      slug: newPortfolio.slug.toLowerCase().replace(/\s+/g, '-'),
    });

    if (result.success) {
      setIsCreateModalOpen(false);
      setNewPortfolio({ title: "", slug: "" });
      handleFetchPortfolios();
    } else {
      setCreateError(result.message);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-sm text-neutral-500 animate-pulse">Syncing your workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 min-h-[80vh] flex flex-col relative">
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
          onClick={() => setIsCreateModalOpen(true)}
          className="relative inline-flex h-12 overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-xl shadow-emerald-500/10 active:scale-95 transition-transform"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#064e3b_50%,#10b981_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-black px-6 py-1 text-sm font-bold text-white backdrop-blur-3xl transition-colors hover:bg-neutral-900">
            <Plus className="w-4 h-4 mr-2" />
            Create Portfolio
          </span>
        </motion.button>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white/50 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[32px] border border-neutral-200/50 dark:border-white/5 shadow-2xl p-10 overflow-hidden"
            >
              {/* Glossy Backdrop Pattern from old design */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>

              <div className="relative z-10">
                <header className="mb-10">
                  <div className="inline-flex p-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black mb-5 shadow-lg">
                      <Rocket className="w-6 h-6" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-white mb-2">
                     Craft Discovery
                  </h1>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
                     Give your masterpiece a name and a unique digital address.
                  </p>
                </header>

                <form onSubmit={handleCreateSubmit} className="space-y-6">
                  {createError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 text-xs font-bold text-red-500 bg-red-500/5 rounded-xl border border-red-500/10 text-center"
                    >
                      {createError}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center h-[20px] px-1">
                          <label className="text-sm font-semibold text-neutral-500">Portfolio Identity</label>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Ex. Creative Portfolio 2024"
                          className="w-full h-12 bg-white/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-white/5 rounded-xl px-5 text-sm font-medium focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                          value={newPortfolio.title}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center h-[20px] px-1">
                          <label className="text-sm font-semibold text-neutral-500">Digital Link</label>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            newPortfolio.slug.length >= 15 ? "text-amber-500" : "text-neutral-400"
                          )}>
                            {newPortfolio.slug.length}/15
                          </span>
                        </div>
                        <div className="relative">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 font-mono text-sm font-bold select-none pointer-events-none">
                              /
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={15}
                            placeholder="my-port"
                            className="w-full h-12 bg-white/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-white/5 rounded-xl pl-10 pr-5 text-sm font-bold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono outline-none"
                            value={newPortfolio.slug}
                            onChange={(e) => setNewPortfolio({ ...newPortfolio, slug: e.target.value.slice(0, 15).replace(/\s+/g, '-') })}
                          />
                        </div>
                        <div className="flex items-center gap-1.5 ml-1 mt-2">
                             <Globe className="w-3.5 h-3.5 text-emerald-500" />
                             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                Live at profolio.com/p/<span className="text-emerald-500 font-black">{newPortfolio.slug || 'slug'}</span>
                             </p>
                        </div>
                      </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-500 ml-1">Description</label>
                    <textarea
                      placeholder="A brief introduction for your portfolio..."
                      className="w-full min-h-[100px] bg-white/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-white/5 rounded-xl px-5 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none resize-none"
                      rows={3}
                      value={(newPortfolio as any).description || ""}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, [('description' as string)]: e.target.value } as any)}
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 h-14 rounded-2xl bg-neutral-100 dark:bg-white/5 text-neutral-500 font-bold hover:bg-neutral-200 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-[2] h-14 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-2xl font-black active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-white/10 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initialize Site <Rocket className="w-4 h-4" /></>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            {portfolios
              .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((portfolio, index) => (
            <Link key={portfolio.id} href={`/dashboard/edit/${portfolio.id}`}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -5 }}
                    className="group relative p-8 rounded-[2.5rem] border border-neutral-200/50 dark:border-white/5 bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-white/5 transition-all cursor-pointer overflow-hidden"
                >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                        <Globe className="w-6 h-6" /> 
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border",
                          portfolio.status === 'published' 
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-transparent"
                      )}>
                          {portfolio.status}
                      </div>
                      {portfolio.status === 'published' && (
                        <Link 
                          href={`/p/${portfolio.slug}`} 
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-white dark:bg-neutral-800 text-neutral-400 hover:text-emerald-500 transition-colors shadow-sm border border-neutral-200 dark:border-white/5"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
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
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500">
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black tracking-widest">{Math.floor(Math.random() * 500)}</span>
                            </div>
                            <div className="flex -space-x-1.5">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-800" />
                                ))}
                            </div>
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
