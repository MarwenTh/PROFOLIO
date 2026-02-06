import { useState } from "react";
import api from "@/lib/api";
import { signOut } from "next-auth/react";

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

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Always sign out from NextAuth
      signOut({ callbackUrl: "/login" });
    }
  };

  return {
    signup,
    login,
    logout,
    loading,
    error,
    setError
  };
};
