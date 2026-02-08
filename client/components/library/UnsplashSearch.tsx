import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, Plus, ZoomIn, Loader2, Check, Clock, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EmptyState, DashboardButton, DashboardCard } from '@/components/dashboard/Shared';
import { Loader } from '@/components/ui/Loader';
import { ImagePreviewModal } from './ImagePreviewModal';
import { VanishInput } from '@/components/ui/VanishInput';
import { MediaItem } from '@/hooks/useLibrary';
import { toast } from 'sonner';

interface UnsplashSearchProps {
  onSearch: (query: string, page?: number) => Promise<any>;
  onSave: (photo: any) => Promise<void>;
  results: any[];
  loading: boolean;
  media: MediaItem[];
  history: string[];
  onFetchHistory: () => void;
  onSelect?: (url: string) => void;
  currentAssets?: string[];
}

const SUGGESTIONS = [
  "Minimalist Architecture",
  "Product Design",
  "Abstract Texture",
  "Technology",
  "Nature Landscapes",
  "Street Photography"
];

export const UnsplashSearch: React.FC<UnsplashSearchProps> = ({ 
  onSearch, 
  onSave, 
  results, 
  loading, 
  media,
  history,
  onFetchHistory,
  onSelect,
  currentAssets
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [previewPhoto, setPreviewPhoto] = useState<any | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "Search minimalist...",
    "Neon city...",
    "Abstract 3D...",
    "Nature...",
    "Tech startup..."
  ];

  useEffect(() => {
    onFetchHistory();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onFetchHistory]);

  const handleSearch = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (query.trim()) {
          setPage(1);
          onSearch(query, 1);
          setShowDropdown(false);
      }
  };

  const handleSuggestionClick = (suggestion: string) => {
      setQuery(suggestion);
      setPage(1);
      onSearch(suggestion, 1);
      setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      if (!showDropdown) setShowDropdown(true);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if(query.trim()) {
          setDebouncedQuery(query);
      }
    }, 1200); // Slightly longer for the history/suggestions flow

    return () => clearTimeout(timer);
  }, [query]);

  const getIdentifier = (url: string) => url.split('?')[0].trim();
  const assetIdentifiers = (currentAssets || []).map(getIdentifier);

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
    onSearch(debouncedQuery || query || "random", nextPage);
  };

  const isSaved = (unsplashId: string) => {
      return media.some(item => item.unsplash_id === unsplashId);
  };

  const isAddedToAssets = (url: string) => {
      return assetIdentifiers.includes(getIdentifier(url));
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

  const filteredHistory = query.trim() 
    ? history.filter(h => h.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : history.slice(0, 5);

  const filteredSuggestions = query.trim()
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : SUGGESTIONS;

  const hasMatches = filteredHistory.length > 0 || filteredSuggestions.length > 0;

  const handleSaveAndSelect = async (photo: any) => {
      // Start saving if not already saved
      if (!isSaved(photo.id)) {
          handleSave(photo); // Start save process
      }
      // Import immediately for better UX
      if (onSelect) {
          onSelect(photo.urls.regular);
      }
  };

  return (
    <div className="space-y-12 pb-10">
      <div className="flex justify-start pt-4 relative z-[60] w-full" ref={dropdownRef}>
        <div className="w-full relative">
            <VanishInput 
                placeholders={placeholders}
                onChange={handleInputChange}
                onSubmit={handleSearch}
                value={query}
                onFocus={() => setShowDropdown(true)}
            />

            <AnimatePresence>
                {showDropdown && hasMatches && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
                        {filteredHistory.length > 0 && (
                            <div className="pb-2">
                                <div className="px-4 py-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                    <Clock className="w-3 h-3" />
                                    {query.trim() ? "Matching Searches" : "Recent Searches"}
                                </div>
                                <div className="space-y-1">
                                    {filteredHistory.map((h, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSuggestionClick(h)}
                                            className="w-full text-left px-4 py-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/5 text-sm font-bold transition-colors flex items-center justify-between group"
                                        >
                                            {h}
                                            <Search className="w-3 h-3 opacity-0 group-hover:opacity-40" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredSuggestions.length > 0 && (
                            <div className={cn("pt-2", filteredHistory.length > 0 && "border-t border-neutral-100 dark:border-white/5")}>
                                <div className="px-4 py-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                    <Sparkles className="w-3 h-3" />
                                    Suggestions
                                </div>
                                <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto">
                                    {filteredSuggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSuggestionClick(s)}
                                            className="w-full text-left px-4 py-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/5 text-sm font-bold transition-colors flex items-center justify-between group"
                                        >
                                            {s}
                                            <Plus className="w-3 h-3 opacity-0 group-hover:opacity-40" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {loading && results.length === 0 && (
           <div className="flex justify-center py-20">
               <Loader size="lg" />
           </div>
      )}

      {results.length > 0 ? (
        <>
            <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 2xl:columns-4 gap-6 space-y-6">
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
                                    <div className="flex items-center justify-end">
                                        {onSelect ? (
                                            (() => {
                                                const isAdded = isAddedToAssets(photo.urls.regular);
                                                return (
                                                    <DashboardButton
                                                        variant={isAdded ? "success" : "indigo"}
                                                        disabled={isAdded}
                                                        className={cn(
                                                          "w-10 h-10 p-0 rounded-full shadow-lg transition-all",
                                                          isAdded && "scale-110 opacity-100 cursor-default"
                                                        )}
                                                        onClick={(e) => {
                                                          if (isAdded) return;
                                                          e.stopPropagation();
                                                          onSelect(photo.urls.regular);
                                                        }}
                                                        title={isAdded ? "Already in Assets" : "Add to Assets"}
                                                      >
                                                        {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                      </DashboardButton>
                                                );
                                            })()
                                        ) : (
                                            saved ? (
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
                                            )
                                        )}
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
        onSelect={onSelect && previewPhoto ? () => handleSaveAndSelect(previewPhoto) : undefined}
        photographer={previewPhoto?.user?.name}
      />
    </div>
  );
};
