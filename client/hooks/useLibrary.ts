import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface MediaFile {
  id: number;
  user_id: number;
  filename: string;
  original_name?: string;
  file_type?: string;
  file_size?: number;
  url: string;
  folder: string;
  created_at: string;
}

export interface SeoSettings {
  id?: number;
  portfolio_id: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_card?: string;
  canonical_url?: string;
  robots?: string;
  updated_at?: string;
}

export const useLibrary = (folder?: string) => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = folder ? { folder } : {};
      const { data } = await api.get('/library', { params });
      
      if (data.success) {
        setMedia(data.media);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch media';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addMedia = async (mediaData: Partial<MediaFile>) => {
    try {
      const { data } = await api.post('/library', mediaData);
      
      if (data.success) {
        setMedia(prev => [data.media, ...prev]);
        toast.success('Media added successfully!');
        return data.media;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to add media';
      toast.error(message);
      throw err;
    }
  };

  const deleteMedia = async (id: number) => {
    try {
      const { data } = await api.delete(`/library/${id}`);
      
      if (data.success) {
        setMedia(prev => prev.filter(m => m.id !== id));
        toast.success('Media deleted successfully!');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete media';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [folder]);

  return {
    media,
    loading,
    error,
    addMedia,
    deleteMedia,
    refetch: fetchMedia
  };
};

export const useSeo = (portfolioId: number) => {
  const [seo, setSeo] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeo = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/seo/${portfolioId}`);
      
      if (data.success) {
        setSeo(data.seo);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch SEO settings';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateSeo = async (seoData: Partial<SeoSettings>) => {
    try {
      const { data } = await api.put(`/seo/${portfolioId}`, seoData);
      
      if (data.success) {
        setSeo(data.seo);
        toast.success('SEO settings updated successfully!');
        return data.seo;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update SEO settings';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    if (portfolioId) {
      fetchSeo();
    }
  }, [portfolioId]);

  return {
    seo,
    loading,
    error,
    updateSeo,
    refetch: fetchSeo
  };
};
