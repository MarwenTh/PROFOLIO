"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
    ShoppingBag, 
    Sparkles, 
    ArrowRight, 
    Layout, 
    Palette, 
    Zap,
    Search,
    ChevronRight,
    Globe,
    Filter,
    Star,
    Download,
    Heart,
    DollarSign,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { DashboardButton, DashboardCard, DashboardBadge } from "@/components/dashboard/Shared";
import { useMarketplace, useSavedItems } from "@/hooks/useMarketplace";
import { Loader } from "@/components/ui/Loader";
import { toast } from "sonner";

export default function MarketplacePage() {
  const { items, loading } = useMarketplace();
  const { items: savedItems, toggleSave } = useSavedItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price'>('newest');

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || item.type === selectedType;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'free' && item.price === 0) ||
                        (priceRange === 'paid' && item.price > 0);
    return matchesSearch && matchesType && matchesPrice && item.status === 'published';
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'popular') return (b.downloads || 0) - (a.downloads || 0);
    if (sortBy === 'price') return b.price - a.price;
    return 0;
  });

  const handleSaveToggle = async (itemId: number) => {
    try {
      await toggleSave(itemId);
    } catch (error) {
      // Error handled in hook
    }
  };

  const categories = [
    { value: 'template', label: 'Templates', icon: Layout, color: 'indigo', count: items.filter(i => i.type === 'template').length },
    { value: 'component', label: 'Components', icon: Zap, color: 'emerald', count: items.filter(i => i.type === 'component').length },
    { value: 'theme', label: 'Themes', icon: Palette, color: 'amber', count: items.filter(i => i.type === 'theme').length },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfc] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* Marketplace Navbar */}
      <nav className="fixed top-0 inset-x-0 h-20 border-b border-neutral-200/50 dark:border-white/5 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl z-50 flex items-center justify-between px-8 md:px-16 transition-all">
        <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 group-hover:rotate-6 transition-transform">
                <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">PROFOLIO <span className="text-indigo-500">MARKET</span></span>
        </Link>
        <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Dashboard</Link>
            <Link href="/dashboard/creations">
              <DashboardButton variant="primary" className="h-11 px-8 rounded-xl shadow-xl">List Item</DashboardButton>
            </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 text-center max-w-6xl mx-auto z-10">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <DashboardBadge variant="info" className="mb-6 h-8 px-4 flex items-center gap-2 border-indigo-500/20 bg-indigo-500/5 text-indigo-500">
                <Sparkles className="w-3.5 h-3.5" />
                {items.length} Premium Items Available
            </DashboardBadge>
            <h1 className="text-6xl md:text-8xl font-black tracking-[-0.05em] italic mb-8 leading-[0.9]">
                CRAFT YOUR <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400">DIGITAL IDENTITY</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-500 font-medium max-w-2xl mx-auto mb-12 italic">
                The leading marketplace for elite portfolio templates, custom components, and exclusive web assets.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Search for templates, components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl outline-none focus:border-indigo-500/50 transition-all font-bold italic"
                    />
                </div>
            </div>
        </motion.div>
      </section>

      {/* Filters & Categories */}
      <section className="relative z-10 py-12 px-8 md:px-16 container mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Category Filters */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                selectedType === null
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50'
              }`}
            >
              All Items ({items.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedType(cat.value)}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                  selectedType === cat.value
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Price & Sort Filters */}
          <div className="flex gap-3 ml-auto">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-bold text-sm"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-bold text-sm"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price">Highest Price</option>
            </select>
          </div>
        </div>
      </section>

      {/* Marketplace Items Grid */}
      <section className="relative z-10 pb-20 px-8 md:px-16 container mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
            <h3 className="text-2xl font-black italic mb-2">No items found</h3>
            <p className="text-neutral-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item, i) => {
              const isSaved = savedItems.some(saved => saved.id === item.id);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <DashboardCard className="overflow-hidden h-full flex flex-col" padding="none">
                    {/* Item Preview */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden">
                      {item.preview_images && item.preview_images[0] ? (
                        <img 
                          src={item.preview_images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layout className="w-16 h-16 text-neutral-400" />
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleSaveToggle(item.id)}
                          className={`w-12 h-12 rounded-full ${
                            isSaved ? 'bg-red-500' : 'bg-white'
                          } flex items-center justify-center shadow-xl hover:scale-110 transition-transform`}
                        >
                          <Heart className={`w-5 h-5 ${isSaved ? 'text-white fill-white' : 'text-neutral-900'}`} />
                        </button>
                        <Link href={`/marketplace/${item.id}`}>
                          <button className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </Link>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 shadow-xl font-black text-sm">
                          {Number(item.price) === 0 ? 'FREE' : `$${Number(item.price).toFixed(2)}`}
                        </div>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1 rounded-lg bg-indigo-500/90 text-white text-xs font-bold uppercase">
                          {item.type}
                        </div>
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-black italic tracking-tight mb-2 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-500 mb-4 line-clamp-2 flex-1">
                        {item.description || ''}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="font-bold">{Number(item.rating).toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" />
                          <span className="font-bold">{item.downloads || 0}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <Link href={`/marketplace/${item.id}`} className="w-full">
                        <button className="w-full h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-colors flex items-center justify-center gap-2">
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </DashboardCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 py-20 px-8 border-t border-neutral-200 dark:border-white/5 text-center">
        <p className="text-sm font-black tracking-widest uppercase text-neutral-400 italic">PROFOLIO &copy; 2024 &mdash; Crafted for the Digital Elite</p>
      </footer>
    </div>
  );
}
