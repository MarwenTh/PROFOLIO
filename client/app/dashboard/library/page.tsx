"use strict";
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, 
  Search, 
  FolderOpen, 
  Upload, 
  Plus, 
  Grid, 
  List,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  PageHeader, 
  DashboardSection, 
  DashboardButton, 
  DashboardInput, 
  EmptyState, 
  DeleteConfirmationModal 
} from "@/components/dashboard/Shared";
import { useLibrary, MediaItem, Collection } from "@/hooks/useLibrary";
import { UnsplashSearch } from "@/components/library/UnsplashSearch";
import { MediaGrid } from "@/components/library/MediaGrid";
import { CollectionsList } from "@/components/library/CollectionsList";
import { AddToCollectionModal } from "@/components/library/AddToCollectionModal";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageLoader } from "@/components/ui/Loader";

export default function LibraryPage() {
  const { 
    media, 
    collections, 
    loading, 
    unsplashResults, 
    isSearching,
    fetchMedia, 
    fetchCollections, 
    searchUnsplash, 
    saveUnsplashPhoto,
    createCollection
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<"library" | "collections" | "unsplash">("library");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addToCollectionModal, setAddToCollectionModal] = useState<{ isOpen: boolean; mediaId: number | null }>({
    isOpen: false,
    mediaId: null
  });
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionItems, setCollectionItems] = useState<MediaItem[]>([]);
  const [loadingCollectionItems, setLoadingCollectionItems] = useState(false);
  
  // Delete confirmation state
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; mediaId: number | null }>({
    isOpen: false,
    mediaId: null
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMedia();
    fetchCollections();
  }, [fetchMedia, fetchCollections]);

  const handleTabChange = (tab: "library" | "collections" | "unsplash") => {
    setActiveTab(tab);
    if (tab === "collections") setSelectedCollection(null);
  };

  const openAddToCollection = (mediaId: number) => {
    setAddToCollectionModal({ isOpen: true, mediaId });
  };

  const handleSelectCollection = async (collection: Collection) => {
    setSelectedCollection(collection);
    setLoadingCollectionItems(true);
    try {
        const res = await api.get(`/library/collections/${collection.id}`);
        if (res.data.success) {
            setCollectionItems(res.data.items);
        }
    } catch (error) {
        console.error("Error fetching collection items", error);
        toast.error("Failed to load collection items");
    } finally {
        setLoadingCollectionItems(false);
    }
  };

  const handleDeleteMedia = (id: number) => {
      setDeleteModal({ isOpen: true, mediaId: id });
  };

  const confirmDeleteMedia = async () => {
      if (!deleteModal.mediaId) return;
      
      setIsDeleting(true);
      try {
        await api.delete(`/library/${deleteModal.mediaId}`);
        toast.success("Media deleted");
        fetchMedia();
        if(selectedCollection) handleSelectCollection(selectedCollection);
        setDeleteModal({ isOpen: false, mediaId: null });
      } catch(err) {
        toast.error("Failed to delete media");
      } finally {
        setIsDeleting(false);
      }
  };

  const handleRemoveFromCollection = async (mediaId: number) => {
      if(!selectedCollection) return;
      try {
        await api.delete(`/library/collections/${selectedCollection.id}/items/${mediaId}`);
        toast.success("Removed from collection");
        handleSelectCollection(selectedCollection); // Refresh
      } catch(err) {
        toast.error("Failed to remove item");
      }
  };

  return (
    <div className="w-full pb-20">
      <PageHeader
        title="Media Library"
        description="Manage your images, assets, and collections."
        action={activeTab === "library" ? {
            label: "Upload",
            icon: Upload,
            onClick: () => toast.info("Drag and drop uploads coming soon!")
        } : undefined}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
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

      <AnimatePresence mode="wait">
        {activeTab === "library" && (
          <motion.div
            key="library"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <DashboardSection title="All Media" description={`${media.length} items in your library`}>
                {loading && media.length === 0 ? (
                    <PageLoader />
                ) : (
                    <MediaGrid 
                        media={media} 
                        loading={loading} 
                        onAddToCollection={openAddToCollection}
                        onDelete={handleDeleteMedia}
                    />
                )}
            </DashboardSection>
          </motion.div>
        )}

        {activeTab === "collections" && (
          <motion.div
            key="collections"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {!selectedCollection ? (
                <CollectionsList 
                    collections={collections}
                    onCreateCollection={createCollection}
                    onSelectCollection={handleSelectCollection}
                />
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <button 
                            onClick={() => setSelectedCollection(null)}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                            <FolderOpen className="w-5 h-5 text-neutral-500" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-black">{selectedCollection.name}</h2>
                            <p className="text-neutral-500">{selectedCollection.description || "No description"}</p>
                        </div>
                    </div>
                    
                    <MediaGrid 
                        media={collectionItems} 
                        loading={loadingCollectionItems}
                        onDelete={(id) => handleRemoveFromCollection(id)} // Reuse delete btn for remove from collection
                    />
                     {collectionItems.length === 0 && !loadingCollectionItems && (
                        <EmptyState 
                            title="Empty Collection" 
                            description="This collection has no items yet. Add items from your library." 
                            icon={FolderOpen} 
                            actionLabel="Go to Library"
                            onAction={() => handleTabChange("library")}
                        />
                    )}
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
            transition={{ duration: 0.2 }}
          >
            <UnsplashSearch 
                onSearch={searchUnsplash} 
                onSave={saveUnsplashPhoto} 
                results={unsplashResults}
                loading={isSearching}
                media={media}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AddToCollectionModal 
        isOpen={addToCollectionModal.isOpen}
        onClose={() => setAddToCollectionModal({ ...addToCollectionModal, isOpen: false })}
        mediaId={addToCollectionModal.mediaId}
        collections={collections}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, mediaId: null })}
        onConfirm={confirmDeleteMedia}
        title="Delete Media"
        description="Are you sure you want to delete this item? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 outline-none selection:bg-transparent",
        active 
          ? "text-white dark:text-black" 
          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-white/5"
      )}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-neutral-900 dark:bg-white rounded-xl shadow-lg shadow-neutral-900/10 dark:shadow-white/5"
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
