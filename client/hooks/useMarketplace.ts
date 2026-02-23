import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export interface MarketplaceItem {
  id: number;
  seller_id: number;
  seller_name?: string;
  portfolio_id?: number;
  type: "template" | "component" | "theme" | "portfolio" | "animation";
  title: string;
  description?: string;
  price: number;
  preview_images?: string[];
  content?: any;
  status: "draft" | "published" | "suspended";
  downloads: number;
  rating: number;
  created_at: string;
  updated_at: string;
  total_purchases?: number;
  total_sales?: number;
  total_revenue?: number;
}

export interface Purchase {
  id: number;
  buyer_id: number;
  item_id: number;
  amount: number;
  payment_status: "pending" | "completed" | "failed" | "refunded";
  purchased_at: string;
  title?: string;
  description?: string;
  type?: string;
  preview_images?: string[];
  content?: any;
  seller_name?: string;
}

// Browse marketplace items
export function useMarketplace(filters?: {
  type?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.type) params.append("type", filters.type);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.minPrice !== undefined)
        params.append("minPrice", filters.minPrice.toString());
      if (filters?.maxPrice !== undefined)
        params.append("maxPrice", filters.maxPrice.toString());

      const response = await api.get(`/marketplace/items?${params.toString()}`);
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error: any) {
      console.error("Error fetching marketplace items:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch marketplace items",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters?.type, filters?.search, filters?.minPrice, filters?.maxPrice]);

  return { items, loading, refetch: fetchItems };
}

// Get seller's creations
export function useMyCreations() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCreations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/marketplace/my-creations");
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error: any) {
      console.error("Error fetching creations:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch your creations",
      );
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: Partial<MarketplaceItem>) => {
    try {
      const response = await api.post("/marketplace/items", itemData);
      if (response.data.success) {
        toast.success("Item created successfully");
        fetchCreations();
        return response.data.item;
      }
    } catch (error: any) {
      console.error("Error creating item:", error);
      toast.error(error.response?.data?.message || "Failed to create item");
      throw error;
    }
  };

  const updateItem = async (id: number, itemData: Partial<MarketplaceItem>) => {
    try {
      const response = await api.put(`/marketplace/items/${id}`, itemData);
      if (response.data.success) {
        toast.success("Item updated successfully");
        fetchCreations();
        return response.data.item;
      }
    } catch (error: any) {
      console.error("Error updating item:", error);
      toast.error(error.response?.data?.message || "Failed to update item");
      throw error;
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const response = await api.delete(`/marketplace/items/${id}`);
      if (response.data.success) {
        toast.success("Item deleted successfully");
        fetchCreations();
      }
    } catch (error: any) {
      console.error("Error deleting item:", error);
      toast.error(error.response?.data?.message || "Failed to delete item");
      throw error;
    }
  };

  useEffect(() => {
    fetchCreations();
  }, []);

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchCreations,
  };
}

// Purchase functionality
export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await api.get("/marketplace/purchases");
      if (response.data.success) {
        setPurchases(response.data.purchases);
      }
    } catch (error: any) {
      console.error("Error fetching purchases:", error);
      toast.error(error.response?.data?.message || "Failed to fetch purchases");
    } finally {
      setLoading(false);
    }
  };

  const purchaseItem = async (itemId: number) => {
    try {
      // Optimistic update
      setPurchases((prev) => [
        ...prev,
        { item_id: itemId, payment_status: "completed" } as any,
      ]);

      const response = await api.post(`/marketplace/purchase/${itemId}`);
      if (response.data.success) {
        fetchPurchases();
        return response.data.purchase;
      }
    } catch (error: any) {
      // Revert on error
      fetchPurchases();
      console.error("Error purchasing item:", error);
      throw error;
    }
  };

  const integrateItem = async (itemId: number) => {
    try {
      // Optimistic update for components
      setPurchases((prev) => {
        if (!prev.some((p) => p.item_id === itemId)) {
          return [
            ...prev,
            { item_id: itemId, payment_status: "completed" } as any,
          ];
        }
        return prev;
      });

      const response = await api.post(`/marketplace/${itemId}/integrate`);
      if (response.data.success) {
        return response.data;
      }
    } catch (error: any) {
      // Revert on error
      fetchPurchases();
      console.error("Error integrating item:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return {
    purchases,
    loading,
    purchaseItem,
    integrateItem,
    refetch: fetchPurchases,
  };
}

// Saved items functionality
export function useSavedItems() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/marketplace/saved");
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error: any) {
      console.error("Error fetching saved items:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch saved items",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (itemId: number) => {
    try {
      const response = await api.post(`/marketplace/save/${itemId}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSavedItems();
        return response.data.saved;
      }
    } catch (error: any) {
      console.error("Error toggling save:", error);
      toast.error(error.response?.data?.message || "Failed to save item");
      throw error;
    }
  };

  useEffect(() => {
    fetchSavedItems();
  }, []);

  return { items, loading, toggleSave, refetch: fetchSavedItems };
}
