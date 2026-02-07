"use client";
import React, { useState, useEffect } from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardInput, 
    DashboardButton,
    DashboardSection,
    DashboardBadge,
    DashboardModal,
    EmptyState
} from "@/components/dashboard/Shared";
import { Globe, Plus, Link2, Trash2, CheckCircle, XCircle, Copy, AlertCircle } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useDomains } from "@/hooks/useDomains";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader, PageLoader } from "@/components/ui/Loader";

export default function DomainsPage() {
  const { data: session } = useSession();
  const { getUserPortfolios } = usePortfolio();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const { domains, loading, addDomain, deleteDomain, updateSlug } = useDomains(selectedPortfolio?.id);
  
  const [slug, setSlug] = useState("");
  const [isSlugModalOpen, setIsSlugModalOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [isUpdatingSlug, setIsUpdatingSlug] = useState(false);
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [deletingDomainId, setDeletingDomainId] = useState<number | null>(null);

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
    if (selectedPortfolio) {
      setSlug(selectedPortfolio.slug || "");
    }
  }, [selectedPortfolio]);

  const handleUpdateSlug = async () => {
    setIsUpdatingSlug(true);
    try {
      await updateSlug(slug);
      setIsSlugModalOpen(false);
      // Refresh portfolio data
      const res = await getUserPortfolios(session?.user?.id);
      if (res.success) {
        const updated = res.portfolios.find((p: any) => p.id === selectedPortfolio.id);
        if (updated) setSelectedPortfolio(updated);
      }
    } catch (err) {
      console.error('Failed to update slug:', err);
    } finally {
      setIsUpdatingSlug(false);
    }
  };

  const handleAddDomain = async () => {
    setIsAddingDomain(true);
    try {
      await addDomain(newDomain);
      setIsDomainModalOpen(false);
      setNewDomain("");
    } catch (err) {
      console.error('Failed to add domain:', err);
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleDeleteDomain = async (domainId: number) => {
    setDeletingDomainId(domainId);
    try {
      await deleteDomain(domainId);
    } catch (err) {
      console.error('Failed to delete domain:', err);
    } finally {
      setDeletingDomainId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!selectedPortfolio) {
    return <EmptyState title="No portfolios found" description="Create a portfolio first to manage domains." icon={Globe} />;
  }

  if (loading && !selectedPortfolio) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Domain & Slug" 
        description={`Manage URLs for ${selectedPortfolio.title}`}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Slug Section */}
        <DashboardSection 
          title="Portfolio Slug" 
          description="Your direct path on PROFOLIO"
        >
          <DashboardCard>
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Current URL</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-bold text-indigo-500 break-all">
                    profolio.pro/p/{selectedPortfolio.slug}
                  </p>
                  <button 
                    onClick={() => copyToClipboard(`profolio.pro/p/${selectedPortfolio.slug}`)}
                    className="p-2 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <DashboardButton 
                variant="primary" 
                icon={Link2}
                onClick={() => setIsSlugModalOpen(true)}
                className="w-full"
              >
                Update Slug
              </DashboardButton>
            </div>
          </DashboardCard>
        </DashboardSection>

        {/* Custom Domain Section */}
        <DashboardSection 
          title="Custom Domains" 
          description="Connect your own domain name"
        >
          <DashboardCard>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader size="md" />
                </div>
              ) : domains.length === 0 ? (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                  <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-4">
                    No custom domains yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {domains.map((domain) => (
                    <div key={domain.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {domain.is_verified ? (
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold truncate">{domain.domain}</p>
                          <p className="text-xs text-neutral-500">
                            {domain.is_verified ? 'Verified' : 'Pending verification'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDomain(domain.id)}
                        disabled={deletingDomainId === domain.id}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                      >
                        {deletingDomainId === domain.id ? (
                          <Loader size="sm" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <DashboardButton 
                variant="outline" 
                icon={Plus}
                onClick={() => setIsDomainModalOpen(true)}
                className="w-full"
              >
                Add Custom Domain
              </DashboardButton>
            </div>
          </DashboardCard>
        </DashboardSection>
      </div>

      {/* DNS Instructions */}
      <DashboardCard>
        <div className="space-y-4">
          <h3 className="text-lg font-black italic">How to Connect a Custom Domain</h3>
          <ol className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
            <li className="flex gap-3">
              <span className="font-black text-indigo-500 shrink-0">1.</span>
              <span>Purchase a domain from a registrar (GoDaddy, Namecheap, Cloudflare, etc.)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-black text-indigo-500 shrink-0">2.</span>
              <span>Add your domain using the "Add Custom Domain" button above</span>
            </li>
            <li className="flex gap-3">
              <span className="font-black text-indigo-500 shrink-0">3.</span>
              <span>Add a CNAME record pointing to <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded font-mono text-xs">profolio.pro</code></span>
            </li>
            <li className="flex gap-3">
              <span className="font-black text-indigo-500 shrink-0">4.</span>
              <span>Wait for DNS propagation (usually 24-48 hours)</span>
            </li>
          </ol>
        </div>
      </DashboardCard>

      {/* Update Slug Modal */}
      <DashboardModal
        isOpen={isSlugModalOpen}
        onClose={() => !isUpdatingSlug && setIsSlugModalOpen(false)}
        title="Update Portfolio Slug"
        description="Change your portfolio URL"
        icon={Link2}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateSlug(); }} className="space-y-6">
          <DashboardInput
            label="New Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="my-portfolio"
            prefixText="profolio.pro/p/"
            hint="Only lowercase letters, numbers, and hyphens"
            required
            disabled={isUpdatingSlug}
          />

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              Changing your slug will break existing links to your portfolio. Make sure to update any shared URLs.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <DashboardButton 
              type="submit" 
              variant="primary" 
              className="flex-1 h-14"
              disabled={isUpdatingSlug || slug === selectedPortfolio?.slug}
            >
              {isUpdatingSlug ? (
                <span className="flex items-center gap-2">
                  <Loader size="sm" />
                  Updating...
                </span>
              ) : (
                'Update Slug'
              )}
            </DashboardButton>
            <DashboardButton 
              type="button" 
              variant="secondary" 
              onClick={() => setIsSlugModalOpen(false)} 
              className="h-14 px-8"
              disabled={isUpdatingSlug}
            >
              Cancel
            </DashboardButton>
          </div>
        </form>
      </DashboardModal>

      {/* Add Domain Modal */}
      <DashboardModal
        isOpen={isDomainModalOpen}
        onClose={() => !isAddingDomain && setIsDomainModalOpen(false)}
        title="Add Custom Domain"
        description="Connect your own domain to this portfolio"
        icon={Globe}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAddDomain(); }} className="space-y-6">
          <DashboardInput
            label="Domain Name"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value.toLowerCase())}
            placeholder="example.com"
            hint="Enter your domain without http:// or www"
            required
            disabled={isAddingDomain}
          />

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs font-medium text-blue-700 dark:text-blue-400">
              <p className="font-bold mb-1">After adding your domain:</p>
              <p>Add a CNAME record pointing to <code className="px-1 py-0.5 bg-blue-500/20 rounded">profolio.pro</code> in your DNS settings.</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <DashboardButton 
              type="submit" 
              variant="primary" 
              className="flex-1 h-14"
              disabled={isAddingDomain}
            >
              {isAddingDomain ? (
                <span className="flex items-center gap-2">
                  <Loader size="sm" />
                  Adding...
                </span>
              ) : (
                'Add Domain'
              )}
            </DashboardButton>
            <DashboardButton 
              type="button" 
              variant="secondary" 
              onClick={() => setIsDomainModalOpen(false)} 
              className="h-14 px-8"
              disabled={isAddingDomain}
            >
              Cancel
            </DashboardButton>
          </div>
        </form>
      </DashboardModal>
    </div>
  );
}
