"use client";
import React from "react";
import { PageHeader, DashboardCard, DashboardSection, EmptyState } from "@/components/dashboard/Shared";
import { ShoppingCart, Download, ExternalLink } from "lucide-react";
import { usePurchases } from "@/hooks/useMarketplace";
import { Loader } from "@/components/ui/Loader";

export default function PurchasesPage() {
  const { purchases, loading } = usePurchases();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader title="Purchases" description="View and manage your purchased items." />
      
      <DashboardSection title="Recent Purchases" description="Items you've bought from the marketplace">
        {purchases.length === 0 ? (
          <EmptyState 
            title="No purchases yet" 
            description="Browse the marketplace to discover templates, themes, and digital products."
            icon={ShoppingCart}
            actionLabel="Browse Marketplace"
            onAction={() => window.location.href = '/dashboard/marketplace'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <DashboardCard key={purchase.id}>
                {purchase.preview_images && purchase.preview_images.length > 0 && (
                  <div className="w-full h-48 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-4 overflow-hidden">
                    <img 
                      src={purchase.preview_images[0]} 
                      alt={purchase.title || 'Purchase'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-lg font-black italic mb-2">{purchase.title || 'Untitled'}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                  {purchase.description || 'No description'}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    purchase.payment_status === 'completed' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : purchase.payment_status === 'pending'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {purchase.payment_status}
                  </span>
                  <span className="text-lg font-bold">${purchase.amount.toFixed(2)}</span>
                </div>
                <div className="text-xs text-neutral-500 mb-4">
                  Purchased {new Date(purchase.purchased_at).toLocaleDateString()}
                </div>
                {purchase.payment_status === 'completed' && (
                  <button className="w-full h-10 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
              </DashboardCard>
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
