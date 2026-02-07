"use client";
import React, { useState, useEffect } from "react";
import { PageHeader, DashboardCard, DashboardInput, DashboardButton, DashboardSection, EmptyState } from "@/components/dashboard/Shared";
import { Search, Globe, Share2, Save } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useSeo } from "@/hooks/useLibrary";
import { useSession } from "next-auth/react";
import { PageLoader } from "@/components/ui/Loader";

export default function SEOPage() {
  const { data: session } = useSession();
  const { getUserPortfolios } = usePortfolio();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const { seo, loading, updateSeo } = useSeo(selectedPortfolio?.id);
  const [formData, setFormData] = useState({
    metaTitle: "", metaDescription: "", metaKeywords: "",
    ogTitle: "", ogDescription: "", ogImage: "",
    canonicalUrl: "", robots: "index, follow"
  });

  useEffect(() => {
    if (session?.user?.id) {
      getUserPortfolios(session.user.id).then(res => {
        if (res.success && res.portfolios.length > 0) {
          setPortfolios(res.portfolios);
          setSelectedPortfolio(res.portfolios[0]);
        }
      });
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (seo) {
      setFormData({
        metaTitle: seo.meta_title || "",
        metaDescription: seo.meta_description || "",
        metaKeywords: seo.meta_keywords || "",
        ogTitle: seo.og_title || "",
        ogDescription: seo.og_description || "",
        ogImage: seo.og_image || "",
        canonicalUrl: seo.canonical_url || "",
        robots: seo.robots || "index, follow"
      });
    }
  }, [seo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSeo(formData);
    } catch (err) {
      console.error('Failed to update SEO:', err);
    }
  };

  if (!selectedPortfolio) {
    return <EmptyState title="No portfolios found" description="Create a portfolio first to manage SEO settings." icon={Globe} />;
  }

  if (loading && !seo) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-10">
      <PageHeader title="SEO & Social" description={`Optimize ${selectedPortfolio.title} for search engines and social media.`} />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <DashboardSection title="Search Engine Optimization" description="Control how your portfolio appears in Google search results.">
          <DashboardCard>
            <div className="space-y-6">
              <DashboardInput label="Meta Title" value={formData.metaTitle} onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))} placeholder="Your Name • Your Title" hint="Recommended: 50-60 characters" />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Meta Description</label>
                <textarea rows={3} value={formData.metaDescription} onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))} className="w-full p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none font-bold resize-none transition-all" placeholder="Brief description of your portfolio..." />
                <p className="text-xs text-neutral-500 font-medium italic px-1">Recommended: 150-160 characters</p>
              </div>
              <DashboardInput label="Keywords" value={formData.metaKeywords} onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))} placeholder="designer, developer, portfolio" hint="Comma-separated keywords" />
              <DashboardInput label="Canonical URL" value={formData.canonicalUrl} onChange={(e) => setFormData(prev => ({ ...prev, canonicalUrl: e.target.value }))} placeholder="https://yoursite.com" hint="Preferred URL for this portfolio" />
            </div>
          </DashboardCard>
        </DashboardSection>

        <DashboardSection title="Social Media (Open Graph)" description="Control how your portfolio appears when shared on social platforms.">
          <DashboardCard>
            <div className="space-y-6">
              <DashboardInput label="OG Title" value={formData.ogTitle} onChange={(e) => setFormData(prev => ({ ...prev, ogTitle: e.target.value }))} placeholder="Title for social shares" />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">OG Description</label>
                <textarea rows={2} value={formData.ogDescription} onChange={(e) => setFormData(prev => ({ ...prev, ogDescription: e.target.value }))} className="w-full p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none font-bold resize-none transition-all" placeholder="Description for social shares..." />
              </div>
              <DashboardInput label="OG Image URL" value={formData.ogImage} onChange={(e) => setFormData(prev => ({ ...prev, ogImage: e.target.value }))} placeholder="https://example.com/image.jpg" hint="Recommended: 1200x630px" />
            </div>
          </DashboardCard>
        </DashboardSection>

        <div className="flex justify-end">
          <DashboardButton type="submit" variant="primary" icon={Save} className="h-14 px-12">Save SEO Settings</DashboardButton>
        </div>
      </form>
    </div>
  );
}
