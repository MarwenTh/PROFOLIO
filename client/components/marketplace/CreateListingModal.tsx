"use client";
import React, { useState } from "react";
import { 
  DashboardCard, 
  DashboardButton, 
  DashboardInput,
  DashboardSection 
} from "@/components/dashboard/Shared";
import { X, Upload, DollarSign, Image as ImageIcon, FileText, Eye } from "lucide-react";
import { useMyCreations } from "@/hooks/useMarketplace";
import { toast } from "sonner";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: any;
}

const ITEM_TYPES = [
  { value: 'template', label: 'Template', desc: 'Full website template' },
  { value: 'component', label: 'Component', desc: 'Reusable UI component' },
  { value: 'theme', label: 'Theme', desc: 'Color scheme & styling' },
];

export function CreateListingModal({ isOpen, onClose, editingItem }: CreateListingModalProps) {
  const { createItem, updateItem } = useMyCreations();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: editingItem?.title || '',
    description: editingItem?.description || '',
    type: editingItem?.type || 'template',
    price: editingItem?.price || 0,
    preview_images: editingItem?.preview_images || [],
    status: editingItem?.status || 'draft',
  });

  const [imageUrl, setImageUrl] = useState('');

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        preview_images: [...formData.preview_images, imageUrl.trim()]
      });
      setImageUrl('');
      toast.success('Image added!');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      preview_images: formData.preview_images.filter((_: any, i: number) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        await updateItem(editingItem.id, formData);
        toast.success('Listing updated!');
      } else {
        await createItem(formData);
        toast.success('Listing created!');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save listing');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-black italic tracking-tighter">
            {editingItem ? 'Edit Listing' : 'Create New Listing'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold mb-2">Title *</label>
            <DashboardInput
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Modern Portfolio Template"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-bold mb-2">Type *</label>
            <div className="grid grid-cols-3 gap-3">
              {ITEM_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.type === type.value
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">{type.label}</div>
                  <div className="text-xs text-neutral-500">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your item..."
              rows={4}
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-bold mb-2">Price (USD) *</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:border-indigo-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Preview Images */}
          <div>
            <label className="block text-sm font-bold mb-2">Preview Images</label>
            <div className="space-y-3">
              {/* Add Image URL */}
              <div className="flex gap-2">
                <DashboardInput
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL..."
                  className="flex-1"
                />
                <DashboardButton
                  type="button"
                  onClick={handleAddImage}
                  variant="secondary"
                  icon={Upload}
                >
                  Add
                </DashboardButton>
              </div>

              {/* Image Grid */}
              {formData.preview_images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {formData.preview_images.map((url: string, index: number) => (
                    <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:border-indigo-500 focus:outline-none transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editingItem ? 'Update Listing' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
