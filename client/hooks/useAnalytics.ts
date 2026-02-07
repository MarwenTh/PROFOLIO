import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface AnalyticsOverview {
  totalViews: number;
  uniqueVisitors: number;
  totalPortfolios: number;
  viewsTrend: Array<{
    date: string;
    views: number;
  }>;
}

export interface PortfolioAnalytics {
  viewsOverTime: Array<{
    date: string;
    views: number;
    unique_visitors: number;
  }>;
  topReferrers: Array<{
    source: string;
    visits: number;
  }>;
  geoData: Array<{
    country: string;
    visits: number;
  }>;
  totalViews: number;
  uniqueVisitors: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
}

export const useAnalyticsOverview = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/analytics/overview');
      
      if (data.success) {
        setOverview(data.overview);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch analytics';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return {
    overview,
    loading,
    error,
    refetch: fetchOverview
  };
};

export const usePortfolioAnalytics = (portfolioId: number, range: number = 30) => {
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/analytics/portfolio/${portfolioId}`, {
        params: { range }
      });
      
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch analytics';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (portfolioId) {
      fetchAnalytics();
    }
  }, [portfolioId, range]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};

export const useTrafficSources = (range: number = 30) => {
  const [sources, setSources] = useState<TrafficSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/analytics/traffic-sources', {
        params: { range }
      });
      
      if (data.success) {
        setSources(data.sources);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch traffic sources';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [range]);

  return {
    sources,
    loading,
    error,
    refetch: fetchSources
  };
};

/**
 * Track a portfolio view (call this from public portfolio pages)
 */
export const trackPortfolioView = async (portfolioId: number, referrer?: string) => {
  try {
    await api.post('/analytics/track', {
      portfolioId,
      referrer: referrer || document.referrer
    });
  } catch (err) {
    // Silently fail - don't disrupt user experience
    console.error('Failed to track view:', err);
  }
};
