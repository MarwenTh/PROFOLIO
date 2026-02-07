import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Subscriber {
  id: number;
  portfolio_id: number;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
  unsubscribed_at?: string;
}

export interface Newsletter {
  id: number;
  user_id: number;
  portfolio_id?: number;
  subject: string;
  content: string;
  sent_to: number;
  opened: number;
  clicked: number;
  status: 'draft' | 'sent' | 'scheduled';
  sent_at?: string;
  created_at: string;
}

// Get subscribers for a portfolio
export function useSubscribers(portfolioId?: number) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    if (!portfolioId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/subscribers?portfolioId=${portfolioId}`);
      if (response.data.success) {
        setSubscribers(response.data.subscribers);
      }
    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const removeSubscriber = async (id: number) => {
    try {
      const response = await api.delete(`/subscribers/${id}`);
      if (response.data.success) {
        toast.success('Subscriber removed successfully');
        fetchSubscribers();
      }
    } catch (error: any) {
      console.error('Error removing subscriber:', error);
      toast.error(error.response?.data?.message || 'Failed to remove subscriber');
      throw error;
    }
  };

  const importSubscribers = async (subscribersData: Array<{ email: string; name?: string }>) => {
    if (!portfolioId) return;

    try {
      const response = await api.post('/subscribers/import', {
        portfolioId,
        subscribers: subscribersData
      });
      if (response.data.success) {
        toast.success(`Imported ${response.data.imported} subscribers (${response.data.skipped} skipped)`);
        fetchSubscribers();
        return response.data;
      }
    } catch (error: any) {
      console.error('Error importing subscribers:', error);
      toast.error(error.response?.data?.message || 'Failed to import subscribers');
      throw error;
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [portfolioId]);

  return { subscribers, loading, removeSubscriber, importSubscribers, refetch: fetchSubscribers };
}

// Newsletter management
export function useNewsletters(portfolioId?: number) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const params = portfolioId ? `?portfolioId=${portfolioId}` : '';
      const response = await api.get(`/subscribers/newsletters${params}`);
      if (response.data.success) {
        setNewsletters(response.data.newsletters);
      }
    } catch (error: any) {
      console.error('Error fetching newsletters:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch newsletters');
    } finally {
      setLoading(false);
    }
  };

  const createNewsletter = async (data: { portfolioId?: number; subject: string; content: string }) => {
    try {
      const response = await api.post('/subscribers/newsletters', data);
      if (response.data.success) {
        toast.success('Newsletter created successfully');
        fetchNewsletters();
        return response.data.newsletter;
      }
    } catch (error: any) {
      console.error('Error creating newsletter:', error);
      toast.error(error.response?.data?.message || 'Failed to create newsletter');
      throw error;
    }
  };

  const sendNewsletter = async (id: number) => {
    try {
      const response = await api.post(`/subscribers/newsletters/${id}/send`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchNewsletters();
        return response.data;
      }
    } catch (error: any) {
      console.error('Error sending newsletter:', error);
      toast.error(error.response?.data?.message || 'Failed to send newsletter');
      throw error;
    }
  };

  const deleteNewsletter = async (id: number) => {
    try {
      const response = await api.delete(`/subscribers/newsletters/${id}`);
      if (response.data.success) {
        toast.success('Newsletter deleted successfully');
        fetchNewsletters();
      }
    } catch (error: any) {
      console.error('Error deleting newsletter:', error);
      toast.error(error.response?.data?.message || 'Failed to delete newsletter');
      throw error;
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, [portfolioId]);

  return { newsletters, loading, createNewsletter, sendNewsletter, deleteNewsletter, refetch: fetchNewsletters };
}

// Public subscribe function (for portfolio visitors)
export async function subscribeToPortfolio(portfolioId: number, email: string, name?: string) {
  try {
    const response = await api.post('/subscribers/subscribe', {
      portfolioId,
      email,
      name
    });
    if (response.data.success) {
      toast.success('Successfully subscribed!');
      return response.data;
    }
  } catch (error: any) {
    console.error('Error subscribing:', error);
    toast.error(error.response?.data?.message || 'Failed to subscribe');
    throw error;
  }
}
