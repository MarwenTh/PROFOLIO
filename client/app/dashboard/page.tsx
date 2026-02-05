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
  Rocket,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PageHeader, 
  DashboardCard, 
  DashboardButton, 
  DashboardModal, 
  DashboardInput,
  DashboardBadge,
  EmptyState
} from "@/components/dashboard/Shared";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { getUserPortfolios, createPortfolio, loading } = usePortfolio();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: "", slug: "", description: "" });
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
  }, [session?.user?.id, status, router]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setCreateError("");
    const result = await createPortfolio({
      userId: session.user.id,
      title: newPortfolio.title,
      slug: newPortfolio.slug.toLowerCase().replace(/\s+/g, '-'),
      description: newPortfolio.description
    });

    if (result.success) {
      setIsCreateModalOpen(false);
      setNewPortfolio({ title: "", slug: "", description: "" });
      handleFetchPortfolios();
    } else {
      setCreateError(result.message);
    }
  };

  if (status === "loading" || loading && portfolios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-sm text-neutral-500 animate-pulse font-medium italic">Syncing your workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Workspace" 
        description={`Welcome back, ${session?.user?.name || 'User'}`}
        action={{
          label: "Create Portfolio",
          icon: Plus,
          onClick: () => setIsCreateModalOpen(true)
        }}
      />

      <DashboardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Craft Discovery"
        description="Give your masterpiece a name and a unique digital address."
        icon={Rocket}
      >
        <form onSubmit={handleCreateSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardInput 
              label="Portfolio Identity"
              placeholder="Ex. Creative Portfolio 2024"
              required
              value={newPortfolio.title}
              onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
            />
            <DashboardInput 
              label="Digital Link"
              placeholder="my-port"
              prefixText="/"
              required
              maxLength={15}
              value={newPortfolio.slug}
              hint={`${newPortfolio.slug.length}/15 chars`}
              onChange={(e) => setNewPortfolio({ ...newPortfolio, slug: e.target.value.slice(0, 15).replace(/\s+/g, '-') })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Description</label>
            <textarea
              placeholder="A brief introduction for your portfolio..."
              className="w-full min-h-[100px] bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none resize-none"
              value={newPortfolio.description}
              onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
            />
          </div>

          {createError && (
            <p className="text-xs font-bold text-red-500 bg-red-500/5 p-3 rounded-xl border border-red-500/10 text-center uppercase tracking-tighter">
              {createError}
            </p>
          )}

          <div className="flex items-center gap-4 pt-2">
            <DashboardButton variant="secondary" className="flex-1" onClick={() => setIsCreateModalOpen(false)} type="button">
              Cancel
            </DashboardButton>
            <DashboardButton 
              variant="primary" 
              className="flex-[2]" 
              type="submit" 
              loading={loading}
              icon={Rocket}
              iconPosition="right"
            >
              Initialize Site
            </DashboardButton>
          </div>
        </form>
      </DashboardModal>

      {portfolios.length === 0 ? (
        <EmptyState 
          title="Your Workspace is Empty"
          description="You need to create a portfolio in order to access your data here. Let's launch your first project!"
          icon={Globe}
          actionLabel="Get Started"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text"
                placeholder="Search portfolios..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios
              .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((portfolio, index) => (
                <Link key={portfolio.id} href={`/dashboard/edit/${portfolio.id}`}>
                  <DashboardCard className="group cursor-pointer">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                        <Globe className="w-6 h-6" /> 
                      </div>
                      <div className="flex items-center gap-2">
                        <DashboardBadge variant={portfolio.status === 'published' ? 'success' : 'neutral'}>
                          {portfolio.status}
                        </DashboardBadge>
                        {portfolio.status === 'published' && (
                          <Link 
                            href={`/p/${portfolio.slug}`} 
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-neutral-50 dark:bg-white/5 text-neutral-400 hover:text-indigo-500 transition-colors border border-transparent hover:border-indigo-500/20"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-indigo-500 transition-colors tracking-tight italic">
                        {portfolio.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">profolio.pro/</span>
                        <span className="text-xs font-bold font-mono text-indigo-500">{portfolio.slug}</span>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
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
                  </DashboardCard>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
