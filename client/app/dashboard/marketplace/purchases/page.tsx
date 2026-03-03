"use client";
import React from "react";
import {
  PageHeader,
  DashboardCard,
  DashboardBadge,
  DashboardButton,
} from "@/components/dashboard/Shared";
import {
  Layers,
  ShoppingBag,
  Download,
  ExternalLink,
  Calendar,
  Loader2,
} from "lucide-react";
import { usePurchases } from "@/hooks/useMarketplace";
import { format } from "date-fns";

export default function PurchasesPage() {
  const { purchases, loading } = usePurchases();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="My Purchases"
        description="Download and manage the premium web assets you've acquired."
      />

      {purchases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {purchases.map((item) => (
            <DashboardCard key={item.item_id} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                  <Layers className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-black italic tracking-tighter">
                      {item.title}
                    </h3>
                    {item.is_owner && (
                      <DashboardBadge
                        variant="info"
                        className="text-[8px] uppercase"
                      >
                        Owner
                      </DashboardBadge>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 font-medium italic">
                    by {item.is_owner ? "You" : item.seller_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-8 px-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    {item.purchased_at
                      ? format(new Date(item.purchased_at), "MMM dd, yyyy")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DashboardBadge
                    variant="neutral"
                    className="text-[8px] uppercase"
                  >
                    {item.type}
                  </DashboardBadge>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-neutral-100 dark:border-white/5">
                <DashboardButton
                  variant="primary"
                  className="flex-1 h-11 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  icon={Download}
                  onClick={() => {
                    // In a real app, this might trigger a download or open the asset
                  }}
                >
                  {item.type === "portfolio"
                    ? "Open Portfolio"
                    : "Download Asset"}
                </DashboardButton>
                <button className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400 hover:text-indigo-500 transition-all border border-neutral-200 dark:border-white/10">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </DashboardCard>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-xl font-bold">No purchases yet</h3>
          <p className="text-neutral-500 mt-2">
            Explore the marketplace to find premium components and themes.
          </p>
        </div>
      )}
    </div>
  );
}
