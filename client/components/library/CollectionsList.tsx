import React, { useState } from 'react';
import { Plus, Loader2, MoreVertical, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { DashboardCard, DashboardBadge, DeleteConfirmationModal, DashboardButton, DashboardModal, DashboardInput } from '@/components/dashboard/Shared';
import { Collection } from '@/hooks/useLibrary';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CollectionsListProps {
  collections: Collection[];
  onCreateCollection: (name: string, description?: string) => Promise<void>;
  onUpdateCollection: (id: number, name: string, description?: string) => Promise<void>;
  onDeleteCollection: (id: number) => Promise<void>;
  onSelectCollection: (collection: Collection) => void;
}

export const CollectionsList: React.FC<CollectionsListProps> = ({ 
    collections, 
    onCreateCollection, 
    onUpdateCollection,
    onDeleteCollection,
    onSelectCollection 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<Collection | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      setIsSubmitting(true);
      try {
        await onCreateCollection(newName, newDesc);
        setNewName('');
        setNewDesc('');
        setIsCreating(false);
      } catch (error) {
        // Error handled in hook
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && newName.trim()) {
        setIsSubmitting(true);
        try {
            await onUpdateCollection(isEditing.id, newName, newDesc);
            setIsEditing(null);
            setNewName('');
            setNewDesc('');
        } catch(err) {
            // Error handled in hook
        } finally {
            setIsSubmitting(false);
        }
    }
  };

  const openCreate = () => {
      setNewName('');
      setNewDesc('');
      setIsCreating(true);
  };

  const openEdit = (collection: Collection) => {
      setNewName(collection.name);
      setNewDesc(collection.description || '');
      setIsEditing(collection);
  };

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {/* Create New Card (Simplified) */}
      <DashboardCard
        className="group relative mb-6 break-inside-avoid border-2 border-dashed border-neutral-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer flex items-center justify-center min-h-[240px]"
        onClick={openCreate}
        hoverable
      >
        <div className="flex flex-col items-center gap-4 transition-transform duration-500 group-hover:scale-110">
          <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
            <Plus className="w-8 h-8 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
          </div>
        </div>
      </DashboardCard>

      {/* Collection Cards */}
      {collections.map((collection) => (
        <DashboardCard 
          key={collection.id} 
          className="group relative mb-6 break-inside-avoid overflow-hidden cursor-pointer p-0"
          padding="none"
          hoverable
          onClick={() => onSelectCollection(collection)}
        >
          <div className="aspect-[4/5] relative w-full bg-neutral-100 dark:bg-white/5">
            {collection.preview_image ? (
              <img 
                src={collection.preview_image} 
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-neutral-300 dark:text-neutral-700" />
                </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button 
                    onClick={(e) => { e.stopPropagation(); openEdit(collection); }}
                    className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/40 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all text-white"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsDeletingId(collection.id); }}
                    className="w-10 h-10 rounded-2xl bg-red-500/20 hover:bg-red-500/40 border border-red-500/20 backdrop-blur-md flex items-center justify-center transition-all text-red-100"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                    <DashboardBadge variant="info" className="bg-indigo-500/20 border-indigo-500/30 text-indigo-400">
                        {collection.item_count} items
                    </DashboardBadge>
                </div>
                <h3 className="text-xl font-black italic text-white tracking-tight leading-tight transform group-hover:translate-x-1 transition-transform">
                    {collection.name}
                </h3>
            </div>
          </div>
        </DashboardCard>
      ))}

      {/* Create Modal */}
      <DashboardModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create New Collection"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <DashboardInput
            label="Collection Name"
            placeholder="e.g., Summer Trip, Wedding 2024..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            autoFocus
          />
          <DashboardInput
            label="Description (Optional)"
            placeholder="A short description of this collection"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div className="flex justify-end pt-4">
            <DashboardButton 
              type="submit" 
              disabled={!newName.trim() || isSubmitting}
              loading={isSubmitting}
              className="px-8 h-12"
            >
              Create Collection
            </DashboardButton>
          </div>
        </form>
      </DashboardModal>

      {/* Edit Modal */}
      <DashboardModal
        isOpen={!!isEditing}
        onClose={() => setIsEditing(null)}
        title="Edit Collection"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          <DashboardInput
            label="Collection Name"
            placeholder="e.g., Summer Trip..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            autoFocus
          />
          <DashboardInput
            label="Description (Optional)"
            placeholder="A short description..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div className="flex justify-end pt-4">
            <DashboardButton 
              type="submit" 
              disabled={!newName.trim() || isSubmitting}
              loading={isSubmitting}
              className="px-8 h-12"
            >
              Save Changes
            </DashboardButton>
          </div>
        </form>
      </DashboardModal>

      <DeleteConfirmationModal 
        isOpen={!!isDeletingId}
        onClose={() => setIsDeletingId(null)}
        onConfirm={() => isDeletingId && onDeleteCollection(isDeletingId).then(() => setIsDeletingId(null))}
        title="Delete Collection"
        description="Are you sure you want to delete this collection? The images within will not be deleted, only the collection structure."
      />
    </div>
  );
};
