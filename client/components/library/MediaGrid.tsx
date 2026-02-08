import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, FolderPlus, ImageIcon } from 'lucide-react';
import { MediaItem } from '@/hooks/useLibrary';
import { EmptyState, DashboardButton, DashboardCard } from '@/components/dashboard/Shared';
import { ImagePreviewModal } from './ImagePreviewModal';

interface MediaGridProps {
  media: MediaItem[];
  loading: boolean;
  onDelete?: (id: number) => void;
  onAddToCollection?: (mediaId: number) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({ media, loading, onDelete, onAddToCollection }) => {
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded-[2.5rem] bg-neutral-100 dark:bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <EmptyState
        title="No Media Found"
        description="Your library is empty. Upload items or search Unsplash to get started."
        icon={ImageIcon}
      />
    );
  }

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-6 space-y-6">
        {media.map((item, index) => (
          <DashboardCard
            key={item.id}
            className="group relative mb-6 break-inside-avoid p-0 overflow-hidden cursor-zoom-in"
            onClick={() => setPreviewItem(item)}
            padding="none"
            hoverable={true}
          >
            <div className="relative w-full">
              <Image
                src={item.url}
                alt={item.filename}
                width={0}
                height={0}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                style={{ width: '100%', height: 'auto' }}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            
            {/* Action Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
              {onAddToCollection && (
                  <DashboardButton
                    variant="secondary"
                    className="w-10 h-10 p-0 rounded-full bg-white text-black hover:bg-neutral-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCollection(item.id);
                    }}
                    title="Add to Collection"
                  >
                    <FolderPlus className="w-5 h-5" />
                  </DashboardButton>
              )}
              {onDelete && (
                  <DashboardButton
                    variant="danger"
                    className="w-10 h-10 p-0 rounded-full border-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </DashboardButton>
              )}
            </div>
            
            {/* Folder badge if exists */}
            {item.folder && item.folder !== 'root' && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                    {item.folder}
                </div>
            )}
          </DashboardCard>
        ))}
      </div>

       {/* Preview Modal for Media Items */}
       <ImagePreviewModal 
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        imageUrl={previewItem?.url || null}
        altText={previewItem?.filename}
        actions={
            <>
                {onAddToCollection && previewItem && (
                    <DashboardButton 
                        variant="secondary" 
                        onClick={() => {
                            onAddToCollection(previewItem.id);
                            setPreviewItem(null);
                        }} 
                        icon={FolderPlus}
                    >
                        Add to Collection
                    </DashboardButton>
                )}
                {onDelete && previewItem && (
                    <DashboardButton 
                        variant="danger" 
                        onClick={() => {
                            onDelete(previewItem.id);
                            setPreviewItem(null);
                        }} 
                        icon={Trash2}
                    >
                        Delete
                    </DashboardButton>
                )}
            </>
        }
      />
    </>
  );
};
