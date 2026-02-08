import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Folder, ArrowRight } from 'lucide-react';
import { Collection } from '@/hooks/useLibrary';
import { DashboardCard, DashboardButton } from '@/components/dashboard/Shared';
import Image from 'next/image';
import { toast } from 'sonner';

interface CollectionsListProps {
  collections: Collection[];
  onCreateCollection: (name: string, description?: string) => Promise<void>;
  onSelectCollection: (collection: Collection) => void;
}

export const CollectionsList: React.FC<CollectionsListProps> = ({ collections, onCreateCollection, onSelectCollection }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

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
        // Error handling is likely done in hook, but we catch here to stop loading
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6 space-y-6">
        {/* Create New Card */}
        <DashboardCard
          hoverable
          className="group relative flex flex-col items-center justify-center border-dashed border-2 border-neutral-300 dark:border-white/10 bg-transparent hover:bg-neutral-50 dark:hover:bg-white/5 cursor-pointer mb-6 break-inside-avoid min-h-[200px]"
          onClick={() => setIsCreating(true)}
          padding="none"
        >
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-8 h-8 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Create Collection</span>
        </DashboardCard>

        {collections.map((collection) => (
          <DashboardCard
            key={collection.id}
            className="group cursor-pointer relative p-0 overflow-hidden mb-6 break-inside-avoid"
            onClick={() => onSelectCollection(collection)}
            padding="none"
          >
            {collection.preview_image ? (
              <div className="relative w-full">
                <Image
                    src={collection.preview_image}
                    alt={collection.name}
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ) : (
                <div className="w-full h-[200px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Folder className="w-16 h-16 text-neutral-300 dark:text-neutral-700" />
                </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white font-black text-2xl tracking-tight mb-1">{collection.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm font-medium">{collection.item_count} items</span>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-neutral-900 rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-black mb-6">New Collection</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-white/5 outline-none focus:ring-2 ring-indigo-500"
                  placeholder="e.g. Portfolio Assets"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-white/5 outline-none focus:ring-2 ring-indigo-500"
                  placeholder="Optional description"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim() || isSubmitting}
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
