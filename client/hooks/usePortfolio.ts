import { useState, useCallback } from "react";
import api from "@/lib/api";

export const usePortfolio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserPortfolios = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/portfolios?userId=${userId}`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "An error occurred fetching portfolios";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createPortfolio = async (portfolioData: { userId: string; title: string; slug: string; description?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/portfolios/create", portfolioData);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "An error occurred creating portfolio";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const getPortfolioById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/portfolios/${id}`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "An error occurred fetching portfolio";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePortfolio = async (id: string, data: { title?: string; description?: string; content?: any; status?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/portfolios/${id}`, data);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "An error occurred updating portfolio";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return {
    getUserPortfolios,
    createPortfolio,
    getPortfolioById,
    updatePortfolio,
    loading,
    error
  };
};
