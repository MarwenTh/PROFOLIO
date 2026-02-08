import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FolderPlus, Plus } from 'lucide-react';
import Image from 'next/image';
import { DashboardButton } from '@/components/dashboard/Shared';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  altText?: string;
  onSave?: () => void;
  onAddToCollection?: () => void;
  onSelect?: () => void;
  photographer?: string;
  actions?: React.ReactNode;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  altText = "Preview", 
  onSave,
  onAddToCollection,
  onSelect,
  photographer,
  actions 
}) => {
  if (!imageUrl) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative w-full aspect-video md:aspect-[16/9] lg:aspect-[3/2] rounded-[2rem] overflow-hidden bg-neutral-900 shadow-2xl">
              <Image
                src={imageUrl}
                alt={altText}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {photographer && (
                <div className="mt-6 text-center">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Photographer</p>
                    <p className="text-white font-black italic text-xl tracking-tight">{photographer}</p>
                </div>
            )}

            <div className="flex items-center gap-4 mt-8">
                {actions}
                {onSave && (
                    <DashboardButton variant="primary" onClick={onSave} icon={Download}>
                        Save to Library
                    </DashboardButton>
                )}
                {onAddToCollection && (
                    <DashboardButton variant="secondary" onClick={onAddToCollection} icon={FolderPlus}>
                        Add to Collection
                    </DashboardButton>
                )}
                {onSelect && (
                    <button
                        onClick={onSelect}
                        className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
