import { useState } from "react";
import { useClerk } from "@clerk/nextjs";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signOut } = useClerk();

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      window.location.href = "/";
    } catch (err: any) {
      console.error("Logout failed:", err);
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    loading,
    error,
    setError,
  };
};
