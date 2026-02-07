"use client";
import React, { useState } from "react";
import { 
    PageHeader, 
    EmptyState, 
    DashboardCard, 
    DashboardBadge, 
    DashboardButton,
    DashboardSection,
    DashboardModal,
    DashboardInput
} from "@/components/dashboard/Shared";
import { Layers, Eye, Download, Crown, Filter, Search, Sparkles } from "lucide-react";
import { useTemplates, useUserTemplates, type Template } from "@/hooks/useTemplates";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [isPremiumFilter, setIsPremiumFilter] = useState<boolean | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState("");

  const { templates, loading, useTemplate, purchaseTemplate } = useTemplates({
    category: selectedCategory,
    isPremium: isPremiumFilter
  });

  const { templates: userTemplates, loading: userLoading } = useUserTemplates();

  const categories = ["Portfolio", "Business", "Creative", "Developer", "Agency"];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseTemplate = async (template: Template) => {
    if (template.is_premium) {
      const isPurchased = userTemplates.some(t => t.id === template.id);
      if (!isPurchased) {
        // Show purchase confirmation
        if (confirm(`This is a premium template ($${template.price}). Purchase now?`)) {
          try {
            await purchaseTemplate(template.id);
            setSelectedTemplate(template);
            setIsUseModalOpen(true);
          } catch (err) {
            console.error('Purchase failed:', err);
          }
        }
        return;
      }
    }
    
    setSelectedTemplate(template);
    setIsUseModalOpen(true);
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate || !portfolioTitle.trim()) return;

    try {
      const portfolio = await useTemplate(selectedTemplate.id, portfolioTitle);
      setIsUseModalOpen(false);
      setPortfolioTitle("");
      router.push(`/dashboard`);
    } catch (err) {
      console.error('Failed to create portfolio:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Templates" 
        description="Professional templates to kickstart your portfolio in minutes."
      />

      {/* Filters Section */}
      <DashboardCard>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full h-14 pl-14 pr-6 rounded-3xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none transition-all font-bold"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                !selectedCategory
                  ? 'bg-indigo-500 text-white'
                  : 'bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-500 text-white'
                    : 'bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Premium Filter */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPremiumFilter(undefined)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                isPremiumFilter === undefined
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10'
              }`}
            >
              All Templates
            </button>
            <button
              onClick={() => setIsPremiumFilter(false)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                isPremiumFilter === false
                  ? 'bg-green-500 text-white'
                  : 'bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setIsPremiumFilter(true)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                isPremiumFilter === true
                  ? 'bg-amber-500 text-white'
                  : 'bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10'
              }`}
            >
              <Crown className="w-4 h-4" />
              Premium
            </button>
          </div>
        </div>
      </DashboardCard>

      {/* Templates Grid */}
      <DashboardSection 
        title="Available Templates" 
        description={`${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''} available`}
      >
        {filteredTemplates.length === 0 ? (
          <EmptyState 
            title="No templates found"
            description="Try adjusting your filters or search query."
            icon={Layers}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <DashboardCard padding="none" className="group h-full flex flex-col">
                    {/* Template Preview */}
                    <div className="aspect-video bg-gradient-to-br from-indigo-500/20 to-purple-500/20 relative overflow-hidden">
                      {template.preview_image ? (
                        <Image 
                          src={template.preview_image} 
                          alt={template.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-16 h-16 text-indigo-500/30" />
                        </div>
                      )}
                      
                      {/* Premium Badge */}
                      {template.is_premium && (
                        <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-black">
                          <Crown className="w-3 h-3 fill-current" />
                          Premium
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <DashboardButton 
                          variant="secondary" 
                          icon={Eye} 
                          className="bg-white text-black h-10 px-6"
                          onClick={() => handleUseTemplate(template)}
                        >
                          Use Template
                        </DashboardButton>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-black italic tracking-tight text-base flex-1">
                          {template.name}
                        </h3>
                        {template.is_premium ? (
                          <p className="text-sm font-black text-amber-500">
                            ${template.price}
                          </p>
                        ) : (
                          <DashboardBadge variant="success" className="text-xs">
                            Free
                          </DashboardBadge>
                        )}
                      </div>

                      {template.description && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium italic mb-3 line-clamp-2">
                          {template.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-auto pt-3 border-t border-neutral-200 dark:border-white/10">
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {template.downloads}
                        </div>
                        {template.category && (
                          <div className="px-2 py-1 bg-neutral-100 dark:bg-white/5 rounded-lg">
                            {template.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </DashboardCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </DashboardSection>

      {/* User's Purchased Templates */}
      {!userLoading && userTemplates.length > 0 && (
        <DashboardSection 
          title="Your Templates" 
          description={`${userTemplates.length} template${userTemplates.length !== 1 ? 's' : ''} in your library`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTemplates.map((template) => (
              <DashboardCard key={template.id} padding="none" className="group">
                <div className="aspect-video bg-gradient-to-br from-green-500/20 to-blue-500/20 relative overflow-hidden">
                  {template.preview_image ? (
                    <Image 
                      src={template.preview_image} 
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Layers className="w-12 h-12 text-green-500/30" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-black italic text-sm mb-2">{template.name}</h4>
                  <DashboardButton
                    variant="primary"
                    className="w-full h-9 text-xs"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </DashboardButton>
                </div>
              </DashboardCard>
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Use Template Modal */}
      <DashboardModal
        isOpen={isUseModalOpen}
        onClose={() => {
          setIsUseModalOpen(false);
          setPortfolioTitle("");
        }}
        title="Create Portfolio from Template"
        description={`Using template: ${selectedTemplate?.name}`}
        icon={Sparkles}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateFromTemplate(); }} className="space-y-6">
          <DashboardInput
            label="Portfolio Title"
            value={portfolioTitle}
            onChange={(e) => setPortfolioTitle(e.target.value)}
            placeholder="My Awesome Portfolio"
            required
            hint="This will be the name of your new portfolio"
          />

          <div className="flex gap-3 pt-4">
            <DashboardButton
              type="submit"
              variant="primary"
              className="flex-1 h-14"
            >
              Create Portfolio
            </DashboardButton>
            <DashboardButton
              type="button"
              variant="secondary"
              onClick={() => setIsUseModalOpen(false)}
              className="h-14 px-8"
            >
              Cancel
            </DashboardButton>
          </div>
        </form>
      </DashboardModal>
    </div>
  );
}
