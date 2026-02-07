"use client";
import React, { useState } from "react";
import { PageHeader, DashboardCard, DashboardButton, DashboardModal, DashboardInput, EmptyState } from "@/components/dashboard/Shared";
import { Image as ImageIcon, Trash2, Plus, ExternalLink } from "lucide-react";
import { useLibrary } from "@/hooks/useLibrary";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PageLoader } from "@/components/ui/Loader";

export default function LibraryPage() {
  const { media, loading, addMedia, deleteMedia } = useLibrary();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ filename: "", url: "", fileType: "image" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMedia(formData);
      setIsModalOpen(false);
      setFormData({ filename: "", url: "", fileType: "image" });
    } catch (err) {
      console.error('Failed to add media:', err);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-10">
      <PageHeader title="Library" description="Manage your media files and assets." action={{ label: "Add Media", icon: Plus, onClick: () => setIsModalOpen(true) }} />
      
      {media.length === 0 ? (
        <EmptyState title="No media files yet" description="Upload images and files to use in your portfolios." icon={ImageIcon} actionLabel="Add Media" onAction={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {media.map((file, index) => (
              <motion.div key={file.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                <DashboardCard padding="none" className="group">
                  <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden">
                    {file.file_type?.startsWith('image') ? (
                      <Image src={file.url} alt={file.filename} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-12 h-12 text-neutral-400" /></div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm font-bold truncate">{file.filename}</p>
                    <div className="flex gap-2">
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex-1 h-9 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                        <ExternalLink className="w-3 h-3" /> View
                      </a>
                      <button onClick={() => deleteMedia(file.id)} className="h-9 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </DashboardCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <DashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Media" description="Add a new file to your library" icon={Plus}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <DashboardInput label="Filename" value={formData.filename} onChange={(e) => setFormData(prev => ({ ...prev, filename: e.target.value }))} placeholder="my-image.jpg" required />
          <DashboardInput label="File URL" value={formData.url} onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))} placeholder="https://example.com/image.jpg" required />
          <div className="flex gap-3 pt-4">
            <DashboardButton type="submit" variant="primary" className="flex-1 h-14">Add Media</DashboardButton>
            <DashboardButton type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="h-14 px-8">Cancel</DashboardButton>
          </div>
        </form>
      </DashboardModal>
    </div>
  );
}
