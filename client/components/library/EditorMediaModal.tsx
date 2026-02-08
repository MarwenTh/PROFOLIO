"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ImageIcon, 
  FolderOpen, 
  Search, 
  Plus, 
  Check, 
  X,
  Grid,
  List,
  ChevronRight,
  ChevronLeft,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  DashboardModal, 
  DashboardCard, 
  DashboardButton, 
  EmptyState,
  DashboardBadge,
  DeleteConfirmationModal
} from "@/components/dashboard/Shared";
import { useLibrary, MediaItem, Collection } from "@/hooks/useLibrary";
import { UnsplashSearch } from "./UnsplashSearch";
import { MediaGrid } from "./MediaGrid";
import { CollectionsList } from "./CollectionsList";
import { AddToCollectionModal } from "./AddToCollectionModal";
import { PageLoader } from "@/components/ui/Loader";
import { toast } from "sonner";
import api from "@/lib/api";

interface EditorMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  onImportCollection: (images: string[]) => void;
}

export function EditorMediaModal({ isOpen, onClose, onSelectImage, onImportCollection }: EditorMediaModalProps) {
  const { 
    media, 
    collections, 
    loading, 
    unsplashResults, 
    isSearching,
    searchHistory,
    fetchMedia, 
    fetchCollections, 
    fetchSearchHistory,
    searchUnsplash, 
    saveUnsplashPhoto,
    createCollection,
    updateCollection,
    deleteCollection
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<"library" | "collections" | "unsplash">("library");
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionItems, setCollectionItems] = useState<MediaItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  
  const [addToCollectionModal, setAddToCollectionModal] = useState<{ isOpen: boolean; mediaId: number | null }>({
    isOpen: false,
    mediaId: null
  });

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean; mediaId: number | null }>({
    isOpen: false,
    mediaId: null
  });

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      fetchCollections();
      fetchSearchHistory();
    }
  }, [isOpen, fetchMedia, fetchCollections, fetchSearchHistory]);

  const handleSelectCollection = async (collection: Collection) => {
    setSelectedCollection(collection);
    setLoadingItems(true);
    try {
      const res = await api.get(`/library/collections/${collection.id}`);
      if (res.data.success) {
        setCollectionItems(res.data.items);
      }
    } catch (error) {
      console.error("Error fetching collection items", error);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
      setActiveTab(tab);
      if (tab !== "collections") setSelectedCollection(null);
  };

  const handleDeleteMedia = async () => {
      if(!deleteConfirmModal.mediaId) return;
      try {
          await api.delete(`/library/${deleteConfirmModal.mediaId}`);
          toast.success("Media deleted");
          fetchMedia();
          fetchCollections();
          if(selectedCollection) handleSelectCollection(selectedCollection);
          setDeleteConfirmModal({ isOpen: false, mediaId: null });
      } catch(err) {
          toast.error("Failed to delete media");
      }
  };

  return (
    <DashboardModal
      isOpen={isOpen}
      onClose={onClose}
      title="Media Library"
      description="Add saved assets or search Unsplash for new inspiration."
      maxWidth="max-w-[1000px]"
    >
      <div className="flex flex-col h-[70vh]">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 shrink-0 overflow-x-auto pb-2 custom-scrollbar">
          <TabButton 
            active={activeTab === "library"} 
            onClick={() => handleTabChange("library")} 
            icon={ImageIcon} 
            label="My Library" 
          />
          <TabButton 
            active={activeTab === "collections"} 
            onClick={() => handleTabChange("collections")} 
            icon={FolderOpen} 
            label="Collections" 
          />
          <TabButton 
            active={activeTab === "unsplash"} 
            onClick={() => handleTabChange("unsplash")} 
            icon={Search} 
            label="Unsplash" 
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence mode="wait">
                {activeTab === "library" && (
                    <motion.div
                        key="library"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {loading && media.length === 0 ? (
                            <PageLoader />
                        ) : (
                            <MediaGrid 
                                media={media} 
                                loading={loading}
                                onSelect={(url) => { onSelectImage(url); onClose(); }}
                                onAddToCollection={(id) => setAddToCollectionModal({ isOpen: true, mediaId: id })}
                                onDelete={(id) => setDeleteConfirmModal({ isOpen: true, mediaId: id })}
                            />
                        )}
                        {media.length === 0 && !loading && (
                            <EmptyState 
                                title="No uploads" 
                                description="Start by searching Unsplash or uploading photos." 
                                icon={ImageIcon} 
                            />
                        )}
                    </motion.div>
                )}

                {activeTab === "collections" && (
                    <motion.div
                        key="collections"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {!selectedCollection ? (
                            <CollectionsList 
                                collections={collections}
                                onCreateCollection={createCollection}
                                onUpdateCollection={updateCollection}
                                onDeleteCollection={deleteCollection}
                                onSelectCollection={handleSelectCollection}
                            />
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-4 rounded-3xl sticky top-0 z-20 border border-neutral-100 dark:border-white/5 mb-6">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => setSelectedCollection(null)}
                                            className="p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <div>
                                            <h3 className="font-black italic text-xl">{selectedCollection.name}</h3>
                                            <p className="text-xs text-neutral-500 font-medium">{selectedCollection.item_count} items</p>
                                        </div>
                                    </div>
                                    <DashboardButton 
                                        variant="primary" 
                                        className="h-10 px-4 rounded-xl text-xs"
                                        onClick={() => {
                                            onImportCollection(collectionItems.map(i => i.url));
                                            onClose();
                                        }}
                                        disabled={collectionItems.length === 0}
                                    >
                                        Import Collection
                                    </DashboardButton>
                                </div>

                                <MediaGrid 
                                    media={collectionItems}
                                    loading={loadingItems}
                                    onSelect={(url) => { onSelectImage(url); onClose(); }}
                                    onDelete={async (id) => {
                                        try {
                                            await api.delete(`/library/collections/${selectedCollection.id}/items/${id}`);
                                            toast.success("Removed from collection");
                                            handleSelectCollection(selectedCollection);
                                            fetchCollections();
                                        } catch(err) {
                                            toast.error("Failed to remove item");
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === "unsplash" && (
                    <motion.div
                        key="unsplash"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <UnsplashSearch 
                            onSearch={searchUnsplash}
                            onSave={saveUnsplashPhoto}
                            onSelect={(url) => { onSelectImage(url); onClose(); }}
                            results={unsplashResults || []}
                            loading={isSearching}
                            media={media}
                            history={searchHistory}
                            onFetchHistory={fetchSearchHistory}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Internal Modals */}
      <AddToCollectionModal 
        isOpen={addToCollectionModal.isOpen}
        onClose={() => setAddToCollectionModal({ isOpen: false, mediaId: null })}
        mediaId={addToCollectionModal.mediaId}
        collections={collections}
        onSuccess={fetchCollections}
      />

      <DeleteConfirmationModal 
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => setDeleteConfirmModal({ isOpen: false, mediaId: null })}
        onConfirm={handleDeleteMedia}
        title="Delete Media"
        description="Are you sure you want to permanentely delete this item from your library?"
      />
    </DashboardModal>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 outline-none whitespace-nowrap",
          active 
            ? "text-white dark:text-black" 
            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-white/5"
        )}
      >
        {active && (
          <motion.div
            layoutId="activeTabModal"
            className="absolute inset-0 bg-neutral-900 dark:bg-white rounded-xl shadow-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {label}
        </span>
      </button>
    );
}
