"use client";
import React from "react";
import { PageHeader, DashboardCard, DashboardSection, EmptyState } from "@/components/dashboard/Shared";
import { Bookmark, Heart, ShoppingCart, X } from "lucide-react";
import { useSavedItems } from "@/hooks/useMarketplace";
import { Loader } from "@/components/ui/Loader";

export default function SavedPage() {
  const { items, loading, toggleSave } = useSavedItems();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader title="Saved Items" description="Your bookmarked templates and favorites." />
      
      <DashboardSection title="Favorites" description="Templates and items you've saved for later">
        {items.length === 0 ? (
          <EmptyState 
            title="No saved items" 
            description="Save templates and products you like to access them quickly later."
            icon={Bookmark}
            actionLabel="Browse Templates"
            onAction={() => window.location.href = '/dashboard/templates'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <DashboardCard key={item.id} className="relative">
                <button
                  onClick={() => toggleSave(item.id)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-neutral-900 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors z-10"
                  title="Remove from saved"
                >
                  <X className="w-4 h-4" />
                </button>
                
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
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500">
                    {item.type}
                  </span>
                  <span className="text-lg font-bold">${Number(item.price).toFixed(2)}</span>
                </div>
                <h3 className="text-lg font-black italic mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                  {item.description || 'No description'}
                </p>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                  <span>⭐ {Number(item.rating).toFixed(1)}</span>
                  <span>•</span>
                  <span>{item.downloads} downloads</span>
                </div>
                <button className="w-full h-10 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Purchase
                </button>
              </DashboardCard>
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
