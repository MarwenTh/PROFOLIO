import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

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

export const useLibrary = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [unsplashResults, setUnsplashResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchMedia = useCallback(async (folder?: string) => {
    try {
      setLoading(true);
      const res = await api.get('/library', {
        params: { folder }
      });
      if (res.data.success) {
        setMedia(res.data.media);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCollections = useCallback(async () => {
    try {
      const res = await api.get('/library/collections');
      if (res.data.success) {
        setCollections(res.data.collections);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  }, []);

  const searchUnsplash = useCallback(async (query: string, page = 1) => {
    if (!query.trim()) return;
    try {
      setIsSearching(true);
      const res = await api.get('/library/unsplash/search', {
        params: { query, page }
      });
      if (res.data.success) {
        setUnsplashResults(prev => page === 1 ? res.data.results : [...prev, ...res.data.results]);
        return res.data;
      }
    } catch (error) {
      console.error('Error searching Unsplash:', error);
      toast.error('Failed to search Unsplash');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const saveUnsplashPhoto = useCallback(async (photo: any) => {
    try {
      const res = await api.post('/library', {
        filename: photo.alt_description || photo.id,
        originalName: photo.slug || photo.id,
        fileType: 'image/jpeg',
        fileSize: 0, 
        url: photo.urls.regular,
        width: photo.width,
        height: photo.height,
        blur_hash: photo.blur_hash,
        unsplash_id: photo.id
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Photo saved to library');
        fetchMedia(); // Refresh library
      }
    } catch (error) {
      console.error('Error saving photo:', error);
      toast.error('Failed to save photo');
    }
  }, [fetchMedia]);

  const createCollection = useCallback(async (name: string, description?: string) => {
    try {
      const res = await api.post('/library/collections', {
        name, description
      });
      if (res.data.success) {
        toast.success('Collection created');
        fetchCollections();
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    }
  }, [fetchCollections]);

  return {
    media,
    collections,
    loading,
    unsplashResults,
    setUnsplashResults,
    isSearching,
    fetchMedia,
    fetchCollections,
    searchUnsplash,
    saveUnsplashPhoto,
    createCollection
  };
};
