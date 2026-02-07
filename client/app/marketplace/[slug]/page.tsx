"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Heart, 
  ShoppingCart,
  Check,
  Globe,
  Share2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { DashboardButton, DashboardCard, DashboardBadge } from "@/components/dashboard/Shared";
import { useMarketplace, useSavedItems, usePurchases } from "@/hooks/useMarketplace";
import { Loader } from "@/components/ui/Loader";
import { toast } from "sonner";

export default function MarketplaceItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = parseInt(params.slug as string);
  
  const { items, loading } = useMarketplace();
  const { items: savedItems, toggleSave } = useSavedItems();
  const { purchases, purchaseItem } = usePurchases();
  const [selectedImage, setSelectedImage] = useState(0);
  const [purchasing, setPurchasing] = useState(false);

  const item = items.find(i => i.id === itemId);
  const isSaved = savedItems.some(saved => saved.id === itemId);
  const isPurchased = purchases.some(purchase => purchase.item_id === itemId);

  const handleSaveToggle = async () => {
    try {
      await toggleSave(itemId);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await purchaseItem(itemId);
      toast.success('Purchase successful!');
    } catch (error) {
      toast.error('Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">Item not found</h2>
          <Link href="/marketplace">
            <DashboardButton>Back to Marketplace</DashboardButton>
          </Link>
        </div>
      </div>
    );
  }

  const images = item.preview_images || [];

  return (
    <div className="min-h-screen bg-[#fbfbfc] dark:bg-neutral-950">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 h-20 border-b border-neutral-200/50 dark:border-white/5 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl z-50 flex items-center justify-between px-8 md:px-16">
        <Link href="/marketplace" className="flex items-center gap-3 group">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back to Marketplace</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
          Dashboard
        </Link>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20 px-8 md:px-16 container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-200 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              {images.length > 0 ? (
                <img 
                  src={images[selectedImage]} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Globe className="w-24 h-24 text-neutral-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-indigo-500 scale-95'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Type Badge */}
            <DashboardBadge variant="info" className="w-fit">
              {item.type.toUpperCase()}
            </DashboardBadge>

            {/* Title */}
            <h1 className="text-5xl font-black italic tracking-tight leading-tight">
              {item.title}
            </h1>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span className="font-bold">{Number(item.rating).toFixed(1)}</span>
                <span className="text-neutral-500">rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-500" />
                <span className="font-bold">{item.downloads || 0}</span>
                <span className="text-neutral-500">downloads</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {item.description}
            </p>

            {/* Price */}
            <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Price</span>
                <span className="text-4xl font-black italic">
                  {Number(item.price) === 0 ? 'FREE' : `$${Number(item.price).toFixed(2)}`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isPurchased ? (
                  <div className="h-14 rounded-xl bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center gap-2 font-bold">
                    <Check className="w-5 h-5" />
                    Already Purchased
                  </div>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full h-14 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {purchasing ? (
                      <>
                        <Loader size="sm" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {item.price === 0 ? 'Get for Free' : 'Purchase Now'}
                      </>
                    )}
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSaveToggle}
                    className={`h-12 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      isSaved
                        ? 'bg-red-500/10 border-2 border-red-500 text-red-500'
                        : 'bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button className="h-12 rounded-xl bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 font-bold transition-all flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <DashboardCard>
              <h3 className="font-black text-sm uppercase tracking-widest text-neutral-500 mb-4">
                What's Included
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Full source code
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Documentation
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Lifetime updates
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Commercial license
                </li>
              </ul>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
