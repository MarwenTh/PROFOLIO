import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Domain {
  id: number;
  portfolio_id: number;
  domain: string;
  is_primary: boolean;
  is_verified: boolean;
  verification_code?: string;
  created_at: string;
  verified_at?: string;
}

export const useDomains = (portfolioId: number) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = async () => {
    if (!portfolioId) return;
    
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/domains/${portfolioId}`);
      
      if (data.success) {
        setDomains(data.domains);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch domains';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addDomain = async (domain: string) => {
    try {
      const { data } = await api.post(`/domains/${portfolioId}`, { domain });
      
      if (data.success) {
        setDomains(prev => [data.domain, ...prev]);
        toast.success('Domain added successfully!');
        return data.domain;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to add domain';
      toast.error(message);
      throw err;
    }
  };

  const deleteDomain = async (domainId: number) => {
    try {
      const { data } = await api.delete(`/domains/${domainId}`);
      
      if (data.success) {
        setDomains(prev => prev.filter(d => d.id !== domainId));
        toast.success('Domain deleted successfully!');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete domain';
      toast.error(message);
      throw err;
    }
  };

  const updateSlug = async (slug: string) => {
    try {
      const { data } = await api.put(`/domains/slug/${portfolioId}`, { slug });
      
      if (data.success) {
        toast.success('Slug updated successfully!');
        return data.portfolio;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update slug';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchDomains();
  }, [portfolioId]);

  return {
    domains,
    loading,
    error,
    addDomain,
    deleteDomain,
    updateSlug,
    refetch: fetchDomains
  };
};
