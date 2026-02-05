"use client";
import React, { useEffect, useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useSession } from "next-auth/react";
import { Loader2, Globe, Plus, Search, ExternalLink, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardBadge, 
    DashboardButton, 
    DashboardInput 
} from "@/components/dashboard/Shared";
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
      <PageHeader 
        title="My Portfolios" 
        description="Manage and optimize your live and draft design projects."
        action={{
          label: "Create New",
          icon: Plus,
          onClick: () => router.push("/dashboard/create")
        }}
      />

      <div className="max-w-md">
        <DashboardInput 
          icon={Search}
          placeholder="Filter by title..."
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
            <DashboardCard key={p.id} className="group">
              <div className="flex items-center justify-between mb-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                {p.status === 'published' && (
                  <Link href={`/p/${p.slug}`} target="_blank">
                    <DashboardButton variant="ghost" className="h-10 w-10 p-0 rounded-xl" icon={ExternalLink} />
                  </Link>
                )}
              </div>
              <h3 className="text-xl font-black italic tracking-tighter mb-1">{p.title}</h3>
              <p className="text-xs text-neutral-500 mb-8 font-medium italic">profolio.pro/p/{p.slug}</p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-neutral-100 dark:border-white/5">
                <DashboardBadge variant={p.status === 'published' ? 'success' : 'neutral'}>
                  {p.status}
                </DashboardBadge>
                <DashboardButton 
                  variant="ghost" 
                  className="text-indigo-500 text-xs font-black italic p-0 h-auto hover:bg-transparent hover:underline"
                  onClick={() => router.push(`/dashboard/edit/${p.id}`)}
                >
                  Edit Project <ArrowRight className="w-3 h-3 ml-1" />
                </DashboardButton>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
