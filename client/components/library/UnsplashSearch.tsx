import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, ZoomIn, Loader2, Check } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardButton, DashboardCard } from '@/components/dashboard/Shared';
import { Loader } from '@/components/ui/Loader';
import { ImagePreviewModal } from './ImagePreviewModal';
import { VanishInput } from '@/components/ui/VanishInput';
import { MediaItem } from '@/hooks/useLibrary';

interface UnsplashSearchProps {
  onSearch: (query: string, page?: number) => Promise<any>;
  onSave: (photo: any) => Promise<void>;
  results: any[];
  loading: boolean;
  media: MediaItem[];
}

export const UnsplashSearch: React.FC<UnsplashSearchProps> = ({ onSearch, onSave, results, loading, media }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [previewPhoto, setPreviewPhoto] = useState<any | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const placeholders = [
    "Search minimalist...",
    "Neon city...",
    "Abstract 3D...",
    "Nature...",
    "Tech startup..."
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (query.trim()) {
          setPage(1);
          onSearch(query, 1);
      }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if(query.trim()) {
          setDebouncedQuery(query);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setPage(1);
      onSearch(debouncedQuery, 1);
    }
  }, [debouncedQuery]); 

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    onSearch(debouncedQuery || "random", nextPage);
  };

  const isSaved = (unsplashId: string) => {
      return media.some(item => item.unsplash_id === unsplashId);
  };

  const handleSave = async (photo: any) => {
      if (isSaved(photo.id) || savingId === photo.id) return;
      
      setSavingId(photo.id);
      try {
        await onSave(photo);
      } finally {
        setSavingId(null);
      }
  };

  return (
    <div className="space-y-12 pb-10">
      <div className="flex justify-end pt-4">
        <div className="w-full max-w-md">
            <VanishInput 
                placeholders={placeholders}
                onChange={handleInputChange}
                onSubmit={handleSearch}
                value={query}
            />
        </div>
      </div>

      {loading && results.length === 0 && (
           <div className="flex justify-center py-20">
               <Loader size="lg" />
           </div>
      )}

      {results.length > 0 ? (
        <>
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6 space-y-6">
                {results.map((photo, index) => {
                    const saved = isSaved(photo.id);
                    const saving = savingId === photo.id;
                    
                    return (
                        <DashboardCard
                            key={`${photo.id}-${index}`}
                            className="group relative mb-6 break-inside-avoid shadow-xl overflow-hidden p-0 cursor-zoom-in"
                            onClick={() => setPreviewPhoto(photo)}
                            padding="none"
                            hoverable
                        >
                            <div className="relative w-full">
                                <Image
                                src={photo.urls.regular} 
                                alt={photo.alt_description || 'Unsplash photo'}
                                width={photo.width}
                                height={photo.height}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ width: '100%', height: 'auto' }}
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-white font-bold text-sm truncate">
                                            {photo.user.name}
                                        </p>
                                        
                                        {saved ? (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md">
                                                <Check className="w-4 h-4 text-emerald-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">In Library</span>
                                            </div>
                                        ) : (
                                            <button
                                                disabled={saving}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSave(photo);
                                                }}
                                                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
                                                title="Save to Library"
                                            >
                                                {saving ? (
                                                    <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                                                ) : (
                                                    <Download className="w-5 h-5" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DashboardCard>
                    );
                })}
            </div>

            <div className="flex justify-center pt-8 pb-12">
                <DashboardButton 
                    variant="secondary" 
                    onClick={handleLoadMore} 
                    loading={loading}
                    className="h-14 px-8 text-lg hover:shadow-2xl"
                    icon={Plus}
                >
                    Load More Photos
                </DashboardButton>
            </div>
        </>
      ) : (
          !loading && (
            <div className="text-center py-20 opacity-40">
                <p className="text-lg font-medium italic">Start typing to search...</p>
            </div>
          )
      )}

      {/* Preview Modal */}
      <ImagePreviewModal 
        isOpen={!!previewPhoto}
        onClose={() => setPreviewPhoto(null)}
        imageUrl={previewPhoto?.urls?.full || previewPhoto?.urls?.regular}
        altText={previewPhoto?.alt_description}
        onSave={!isSaved(previewPhoto?.id) ? () => handleSave(previewPhoto) : undefined}
      />
    </div>
  );
};
