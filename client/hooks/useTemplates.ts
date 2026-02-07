import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Template {
  id: number;
  name: string;
  description?: string;
  category?: string;
  preview_image?: string;
  thumbnail_image?: string;
  structure: any;
  is_premium: boolean;
  price: number;
  downloads: number;
  rating: number;
  created_at: string;
  updated_at: string;
  purchased_at?: string;
}

export interface TemplateFilters {
  category?: string;
  isPremium?: boolean;
}

export const useTemplates = (filters?: TemplateFilters) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/templates', { params: filters });
      
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch templates';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getTemplateById = async (id: number) => {
    try {
      const { data } = await api.get(`/templates/${id}`);
      return data.success ? data.template : null;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch template';
      toast.error(message);
      throw err;
    }
  };

  const useTemplate = async (id: number, portfolioTitle: string) => {
    try {
      const { data } = await api.post(`/templates/${id}/use`, { portfolioTitle });
      
      if (data.success) {
        toast.success('Portfolio created from template!');
        return data.portfolio;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to use template';
      toast.error(message);
      throw err;
    }
  };

  const purchaseTemplate = async (id: number) => {
    try {
      const { data } = await api.post(`/templates/${id}/purchase`);
      
      if (data.success) {
        toast.success('Template purchased successfully!');
        return true;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to purchase template';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [filters?.category, filters?.isPremium]);

  return {
    templates,
    loading,
    error,
    getTemplateById,
    useTemplate,
    purchaseTemplate,
    refetch: fetchTemplates
  };
};

export const useUserTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/templates/user/purchased');
      
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch your templates';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    refetch: fetchUserTemplates
  };
};
