"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Send,
  Loader2,
  Sparkles,
  DollarSign,
  Tag,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (data: PublishData) => Promise<void>;
  initialData?: {
    title?: string;
    description?: string;
  };
}

export interface PublishData {
  title: string;
  description: string;
  type: string;
  price: number;
}

export const PublishModal = ({
  isOpen,
  onClose,
  onPublish,
  initialData,
}: PublishModalProps) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState<PublishData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: "component",
    price: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    try {
      await onPublish(formData);
      onClose();
    } catch (error) {
      console.error("Publishing failed:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Publish to Marketplace
                </h3>
                <p className="text-neutral-500 text-xs">
                  Share your creation with the world
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 text-neutral-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-8"
          >
            {/* Cover Image Placeholder */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                Cover Image <span className="text-rose-500">*</span>
              </label>
              <div className="aspect-[12/9] w-full rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all cursor-not-allowed opacity-80">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-neutral-500" />
                </div>
                <div className="text-center">
                  <p className="text-neutral-300 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-neutral-500 text-xs mt-1">
                    PNG, JPEG (max. 5MB)
                  </p>
                </div>
                <div className="mt-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <p className="text-[10px] text-neutral-500 font-mono italic">
                    Image implementation coming soon...
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-neutral-500">
                A preview image that represents your component (1200×900
                recommended)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-400" />
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Modern Glass Navbar"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Category
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="component" className="bg-[#1a1a1a]">
                    Component
                  </option>
                  <option value="animation" className="bg-[#1a1a1a]">
                    Animation
                  </option>
                  <option value="theme" className="bg-[#1a1a1a]">
                    Theme
                  </option>
                  <option value="template" className="bg-[#1a1a1a]">
                    Template
                  </option>
                  <option value="portfolio" className="bg-[#1a1a1a]">
                    Portfolio
                  </option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your component, its features, and how to use it..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-400" />
                Price (USD)
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-indigo-400 transition-colors">
                  $
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <p className="text-[11px] text-neutral-500 italic">
                Set to 0.00 to offer it for free
              </p>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPublishing}
              className="flex-1 px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPublishing}
              className="flex-[2] px-4 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publish to Marketplace
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
