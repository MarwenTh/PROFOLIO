import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface CodeSnippet {
  id: number;
  user_id: number;
  portfolio_id?: number;
  title?: string;
  language: string;
  code: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  author_name?: string;
}

export function useCodeSnippets(portfolioId?: number) {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const params = portfolioId ? `?portfolioId=${portfolioId}` : '';
      const response = await api.get(`/code${params}`);
      if (response.data.success) {
        setSnippets(response.data.snippets);
      }
    } catch (error: any) {
      console.error('Error fetching code snippets:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch code snippets');
    } finally {
      setLoading(false);
    }
  };

  const createSnippet = async (data: Partial<CodeSnippet>) => {
    try {
      const response = await api.post('/code', data);
      if (response.data.success) {
        toast.success('Code snippet saved successfully');
        fetchSnippets();
        return response.data.snippet;
      }
    } catch (error: any) {
      console.error('Error creating snippet:', error);
      toast.error(error.response?.data?.message || 'Failed to save snippet');
      throw error;
    }
  };

  const updateSnippet = async (id: number, data: Partial<CodeSnippet>) => {
    try {
      const response = await api.put(`/code/${id}`, data);
      if (response.data.success) {
        toast.success('Code snippet updated successfully');
        fetchSnippets();
        return response.data.snippet;
      }
    } catch (error: any) {
      console.error('Error updating snippet:', error);
      toast.error(error.response?.data?.message || 'Failed to update snippet');
      throw error;
    }
  };

  const deleteSnippet = async (id: number) => {
    try {
      const response = await api.delete(`/code/${id}`);
      if (response.data.success) {
        toast.success('Code snippet deleted successfully');
        fetchSnippets();
      }
    } catch (error: any) {
      console.error('Error deleting snippet:', error);
      toast.error(error.response?.data?.message || 'Failed to delete snippet');
      throw error;
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [portfolioId]);

  return { snippets, loading, createSnippet, updateSnippet, deleteSnippet, refetch: fetchSnippets };
}

// Get public snippets
export function usePublicSnippets() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicSnippets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/code/public');
      if (response.data.success) {
        setSnippets(response.data.snippets);
      }
    } catch (error: any) {
      console.error('Error fetching public snippets:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch public snippets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicSnippets();
  }, []);

  return { snippets, loading, refetch: fetchPublicSnippets };
}
