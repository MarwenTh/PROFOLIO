"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export interface MediaItem {
  id: number;
  url: string;
  filename: string;
  width?: number;
  height?: number;
  unsplash_id?: string;
  folder?: string;
  file_type?: string;
  created_at?: string;
}

export interface Collection {
  id: number;
  name: string;
  description?: string;
  item_count: number;
  preview_image?: string;
}

interface LibraryContextType {
  media: MediaItem[];
  collections: Collection[];
  loading: boolean;
  unsplashResults: any[];
  setUnsplashResults: React.Dispatch<React.SetStateAction<any[]>>;
  isSearching: boolean;
  searchHistory: string[];
  recentlyUsed: Record<string, any[]>;
  fetchMedia: (folder?: string) => Promise<void>;
  fetchCollections: () => Promise<void>;
  fetchSearchHistory: () => Promise<void>;
  fetchRecentlyUsed: (type: "background" | "icon" | "upload") => Promise<void>;
  searchUnsplash: (query: string, page?: number) => Promise<any>;
  saveUnsplashPhoto: (photo: any) => Promise<void>;
  createCollection: (name: string, description?: string) => Promise<void>;
  updateCollection: (
    id: number,
    name: string,
    description?: string,
  ) => Promise<void>;
  deleteCollection: (id: number) => Promise<void>;
  uploadMedia: (file: File) => Promise<any>;
  recordUsage: (
    type: "background" | "icon" | "upload",
    content: any,
  ) => Promise<void>;
  deleteRecentlyUsed: (
    id: number,
    type: "background" | "icon" | "upload",
  ) => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [unsplashResults, setUnsplashResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<Record<string, any[]>>({
    background: [],
    icon: [],
    upload: [],
  });

  const fetchMedia = useCallback(async (folder?: string) => {
    try {
      setLoading(true);
      const res = await api.get("/library", { params: { folder } });
      if (res.data.success) {
        setMedia(res.data.media);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to load media library");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCollections = useCallback(async () => {
    try {
      const res = await api.get("/library/collections");
      if (res.data.success) {
        setCollections(res.data.collections);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }, []);

  const fetchSearchHistory = useCallback(async () => {
    try {
      const res = await api.get("/library/search-history");
      if (res.data.success) {
        setSearchHistory(res.data.history);
      }
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  }, []);

  const fetchRecentlyUsed = useCallback(
    async (type: "background" | "icon" | "upload") => {
      try {
        const res = await api.get("/library/recently-used", {
          params: { type },
        });
        if (res.data.success) {
          setRecentlyUsed((prev) => ({ ...prev, [type]: res.data.items }));
        }
      } catch (error) {
        console.error(`Error fetching recently used ${type}:`, error);
      }
    },
    [],
  );

  const saveSearchQuery = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      try {
        await api.post("/library/search-history", { query });
        fetchSearchHistory();
      } catch (error) {
        console.error("Error saving search history:", error);
      }
    },
    [fetchSearchHistory],
  );

  const recordUsage = useCallback(
    async (type: "background" | "icon" | "upload", content: any) => {
      // Optimistic Update
      setRecentlyUsed((prev) => {
        const currentList = prev[type] || [];
        const filtered = currentList.filter(
          (item) => JSON.stringify(item.content) !== JSON.stringify(content),
        );
        const newItem = { content, used_at: new Date().toISOString() };
        return {
          ...prev,
          [type]: [newItem, ...filtered].slice(0, 10),
        };
      });

      try {
        const res = await api.post("/library/recently-used", { type, content });
        if (res.data.success) {
          fetchRecentlyUsed(type);
        }
      } catch (error) {
        console.error(`Error recording usage for ${type}:`, error);
      }
    },
    [fetchRecentlyUsed],
  );

  const deleteRecentlyUsed = useCallback(
    async (id: number, type: "background" | "icon" | "upload") => {
      // Optimistic Update
      setRecentlyUsed((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item.id !== id),
      }));

      try {
        await api.delete(`/library/recently-used/${id}`);
      } catch (error) {
        console.error("Error deleting recently used item:", error);
        toast.error("Failed to delete item from history");
      }
    },
    [],
  );

  const searchUnsplash = useCallback(
    async (query: string, page = 1) => {
      if (!query.trim()) return;
      try {
        setIsSearching(true);
        const res = await api.get("/library/unsplash/search", {
          params: { query, page },
        });
        if (res.data.success) {
          setUnsplashResults((prev) =>
            page === 1 ? res.data.results : [...prev, ...res.data.results],
          );
          if (page === 1) saveSearchQuery(query);
          return res.data;
        }
      } catch (error) {
        console.error("Error searching Unsplash:", error);
        toast.error("Failed to search Unsplash");
      } finally {
        setIsSearching(false);
      }
    },
    [saveSearchQuery],
  );

  const saveUnsplashPhoto = useCallback(
    async (photo: any) => {
      try {
        const res = await api.post("/library", {
          filename: photo.alt_description || photo.id,
          originalName: photo.slug || photo.id,
          fileType: "image/jpeg",
          fileSize: 0,
          url: photo.urls.regular,
          width: photo.width,
          height: photo.height,
          blur_hash: photo.blur_hash,
          unsplash_id: photo.id,
        });

        if (res.data.success) {
          toast.success(res.data.message || "Photo saved to library");
          fetchMedia();
        }
      } catch (error) {
        console.error("Error saving photo:", error);
        toast.error("Failed to save photo");
      }
    },
    [fetchMedia],
  );

  const createCollection = useCallback(
    async (name: string, description?: string) => {
      try {
        const res = await api.post("/library/collections", {
          name,
          description,
        });
        if (res.data.success) {
          toast.success("Collection created");
          fetchCollections();
        }
      } catch (error) {
        console.error("Error creating collection:", error);
        toast.error("Failed to create collection");
      }
    },
    [fetchCollections],
  );

  const updateCollection = useCallback(
    async (id: number, name: string, description?: string) => {
      try {
        const res = await api.patch(`/library/collections/${id}`, {
          name,
          description,
        });
        if (res.data.success) {
          toast.success("Collection updated");
          fetchCollections();
        }
      } catch (error) {
        console.error("Error updating collection:", error);
        toast.error("Failed to update collection");
      }
    },
    [fetchCollections],
  );

  const deleteCollection = useCallback(
    async (id: number) => {
      try {
        const res = await api.delete(`/library/collections/${id}`);
        if (res.data.success) {
          toast.success("Collection deleted");
          fetchCollections();
        }
      } catch (error) {
        console.error("Error deleting collection:", error);
        toast.error("Failed to delete collection");
      }
    },
    [fetchCollections],
  );

  const uploadMedia = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      try {
        setLoading(true);
        const res = await api.post("/library/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          toast.success(res.data.message || "File uploaded successfully");
          fetchMedia();
          return res.data.media;
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to upload media";
        toast.error(message);
        console.error("Upload error:", error);
      } finally {
        setLoading(false);
      }
      return null;
    },
    [fetchMedia],
  );

  return (
    <LibraryContext.Provider
      value={{
        media,
        collections,
        loading,
        unsplashResults,
        setUnsplashResults,
        isSearching,
        searchHistory,
        recentlyUsed,
        fetchMedia,
        fetchCollections,
        fetchSearchHistory,
        fetchRecentlyUsed,
        searchUnsplash,
        saveUnsplashPhoto,
        createCollection,
        updateCollection,
        deleteCollection,
        uploadMedia,
        recordUsage,
        deleteRecentlyUsed,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context)
    throw new Error("useLibrary must be used within a LibraryProvider");
  return context;
};
