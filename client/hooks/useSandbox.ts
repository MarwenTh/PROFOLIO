import { useState, useCallback } from "react";
import api from "@/lib/api";

/** Shape of a sandbox component returned by the API */
export interface SandboxComponent {
  id: string;
  user_id: number;
  title: string;
  slug: string | null;
  description: string | null;
  category: string;
  status: "draft" | "review" | "published";
  visibility: "public" | "private";
  files: Record<string, string>;
  views: number;
  code_copies: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface SandboxStats {
  published: number;
  drafts: number;
  totalViews: number;
  totalLikes: number;
}

/**
 * Hook for all sandbox component API interactions.
 * Follows the same pattern as usePortfolio — no direct axios calls in components.
 */
export const useSandbox = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── List all sandboxes for a user ───────────────────────────────────────
  const listUserSandboxes = useCallback(
    async (
      userId: string,
    ): Promise<{
      success: boolean;
      components: SandboxComponent[];
      stats: SandboxStats;
      message?: string;
    }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/sandbox?userId=${userId}`);
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch sandbox components";
        setError(message);
        return {
          success: false,
          components: [],
          stats: { published: 0, drafts: 0, totalViews: 0, totalLikes: 0 },
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ─── Get a single sandbox component ──────────────────────────────────────
  const getSandbox = useCallback(
    async (
      id: string,
    ): Promise<{
      success: boolean;
      component?: SandboxComponent;
      message?: string;
    }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/sandbox/${id}`);
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch sandbox";
        setError(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ─── Create a new sandbox ─────────────────────────────────────────────────
  const createSandbox = async (
    userId: string,
  ): Promise<{
    success: boolean;
    component?: SandboxComponent;
    message?: string;
  }> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/sandbox", { userId });
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create sandbox";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ─── Update sandbox (autosave files + metadata) ───────────────────────────
  const updateSandbox = useCallback(
    async (
      id: string,
      data: {
        files?: Record<string, string>;
        title?: string;
        description?: string;
      },
    ): Promise<{
      success: boolean;
      component?: SandboxComponent;
      message?: string;
    }> => {
      setError(null);
      try {
        const response = await api.put(`/sandbox/${id}`, data);
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to save sandbox";
        setError(message);
        return { success: false, message };
      }
    },
    [],
  );

  // ─── Delete a sandbox ────────────────────────────────────────────────────
  const deleteSandbox = async (
    id: string,
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/sandbox/${id}`);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete sandbox";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ─── Publish or submit sandbox for review ────────────────────────────────
  const publishSandbox = async (
    id: string,
    data: {
      title: string;
      slug: string;
      description?: string;
      category?: string;
      visibility?: string;
      status?: string;
    },
  ): Promise<{
    success: boolean;
    component?: SandboxComponent;
    message?: string;
  }> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/sandbox/${id}/publish`, data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to publish sandbox";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ─── Track analytics ─────────────────────────────────────────────────────
  const trackView = useCallback(async (id: string) => {
    try {
      await api.post(`/sandbox/${id}/view`);
    } catch {
      /* silent */
    }
  }, []);

  const trackCopy = useCallback(async (id: string) => {
    try {
      await api.post(`/sandbox/${id}/copy`);
    } catch {
      /* silent */
    }
  }, []);

  return {
    listUserSandboxes,
    getSandbox,
    createSandbox,
    updateSandbox,
    deleteSandbox,
    publishSandbox,
    trackView,
    trackCopy,
    loading,
    error,
  };
};
