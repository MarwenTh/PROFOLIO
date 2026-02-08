import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface SeoSettings {
  portfolio_id: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots?: string;
  twitter_card?: string;
  updated_at?: string;
}

export const useSeo = (portfolioId: number | string | null) => {
  const [seo, setSeo] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSeo = useCallback(async () => {
    if (!portfolioId) return;
    try {
      setLoading(true);
      const res = await api.get(`/seo/${portfolioId}`);
      if (res.data.success) {
        setSeo(res.data.seo);
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
      // Don't toast on 404 (just means no settings yet)
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  useEffect(() => {
    fetchSeo();
  }, [fetchSeo]);

  const updateSeo = async (data: Partial<SeoSettings>) => {
    if (!portfolioId) return;
    try {
      const res = await api.put(`/seo/${portfolioId}`, data);
      if (res.data.success) {
        setSeo(res.data.seo);
        toast.success('SEO settings updated');
      }
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      toast.error('Failed to update SEO settings');
      throw error;
    }
  };

  return {
    seo,
    loading,
    updateSeo,
    fetchSeo
  };
};
