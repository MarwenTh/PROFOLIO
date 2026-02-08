import React, { useState } from 'react';
import { DashboardModal } from '@/components/dashboard/Shared';
import { Collection } from '@/hooks/useLibrary';
import { FolderPlus, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: number | null;
  collections: Collection[];
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ isOpen, onClose, mediaId, collections }) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleAddToCollection = async (collectionId: number) => {
    if (!mediaId) return;
    setLoadingId(collectionId);
    try {
      await api.post(`/library/collections/${collectionId}/items`, {
        mediaId
      });
      toast.success('Added to collection');
      onClose();
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast.error('Failed to add to collection');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <DashboardModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Collection"
      description="Select a collection to add this item to."
      icon={FolderPlus}
      maxWidth="max-w-md"
    >
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => handleAddToCollection(collection.id)}
            disabled={loadingId !== null}
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                <FolderPlus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-black text-neutral-900 dark:text-white text-lg">{collection.name}</p>
                <p className="text-xs font-bold text-neutral-500">{collection.item_count} items</p>
              </div>
            </div>
            {loadingId === collection.id && (
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
            )}
          </button>
        ))}
        {collections.length === 0 && (
            <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <FolderPlus className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-neutral-500 font-bold">No collections found.</p>
                <p className="text-xs text-neutral-400 mt-1">Create a collection to get started.</p>
            </div>
        )}
      </div>
    </DashboardModal>
  );
};
