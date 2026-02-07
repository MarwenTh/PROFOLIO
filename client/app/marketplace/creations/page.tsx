"use client";
import React from "react";
import { PageHeader, DashboardCard, DashboardBadge, DashboardSection, EmptyState } from "@/components/dashboard/Shared";
import { ShoppingBag, TrendingUp, DollarSign, Package, Edit, Trash2, Eye } from "lucide-react";
import { useMyCreations } from "@/hooks/useMarketplace";
import { Loader } from "@/components/ui/Loader";

export default function CreationsPage() {
  const { items, loading, deleteItem } = useMyCreations();

  // Calculate stats from items
  const totalSales = items.reduce((acc, item) => acc + (item.total_revenue || 0), 0);
  const activeListings = items.filter(item => item.status === 'published').length;
  const totalViews = items.reduce((acc, item) => acc + (item.downloads || 0), 0);

  const stats = [
    { label: "Total Sales", value: `$${totalSales.toFixed(2)}`, icon: DollarSign, color: "emerald" },
    { label: "Active Listings", value: activeListings.toString(), icon: Package, color: "indigo" },
    { label: "Total Downloads", value: totalViews.toString(), icon: TrendingUp, color: "purple" },
  ];

  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
    purple: "bg-purple-500/10 text-purple-500",
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
        title="My Creations" 
        description="Manage your marketplace listings and track sales." 
        action={{
          label: "Create Listing",
          onClick: () => {
            // TODO: Open create listing modal
          }
        }}
      />
      
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
        {items.length === 0 ? (
          <EmptyState 
            title="No listings yet" 
            description="Start selling your templates, themes, or digital products on the marketplace."
            icon={ShoppingBag}
            actionLabel="Create Listing"
            onAction={() => {
              // TODO: Open create listing modal
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <DashboardCard key={item.id}>
                {item.preview_images && item.preview_images.length > 0 && (
                  <div className="w-full h-48 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-4 overflow-hidden">
                    <img 
                      src={item.preview_images[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <DashboardBadge 
                    variant={item.status === 'published' ? 'success' : item.status === 'draft' ? 'neutral' : 'danger'}
                  >
                    {item.status}
                  </DashboardBadge>
                  <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                </div>
                <h3 className="text-lg font-black italic mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                  {item.description || 'No description'}
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-neutral-600 dark:text-neutral-400">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">{item.downloads || 0}</div>
                    <div>Downloads</div>
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">⭐ {item.rating.toFixed(1)}</div>
                    <div>Rating</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-500">${(item.total_revenue || 0).toFixed(0)}</div>
                    <div>Revenue</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="h-10 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </DashboardCard>
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
