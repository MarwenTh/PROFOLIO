import { useState } from "react";
import api from "@/lib/api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/signup", userData);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "An error occurred during signup";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "An error occurred during login";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    login,
    loading,
    error,
    setError
  };
};
