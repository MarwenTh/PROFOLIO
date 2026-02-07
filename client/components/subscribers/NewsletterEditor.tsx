"use client";
import React, { useState } from "react";
import { X, Send, Eye, Users, Mail } from "lucide-react";
import { DashboardButton, DashboardInput } from "@/components/dashboard/Shared";
import { useNewsletters } from "@/hooks/useSubscribers";
import { toast } from "sonner";

interface NewsletterEditorProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId?: number;
  subscriberCount: number;
}

export function NewsletterEditor({ isOpen, onClose, portfolioId, subscriberCount }: NewsletterEditorProps) {
  const { createNewsletter, sendNewsletter } = useNewsletters(portfolioId);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    preview_text: '',
    content: '',
  });

  const handleSend = async () => {
    if (!portfolioId) {
      toast.error('Please select a portfolio first');
      return;
    }

    if (!formData.subject || !formData.content) {
      toast.error('Subject and content are required');
      return;
    }

    setLoading(true);
    try {
      const newsletter = await createNewsletter({
        ...formData,
        portfolioId: portfolioId,
      });
      
      if (newsletter?.id) {
        await sendNewsletter(newsletter.id);
        toast.success(`Newsletter sent to ${subscriberCount} subscribers!`);
        onClose();
        setFormData({ subject: '', preview_text: '', content: '' });
      }
    } catch (error) {
      toast.error('Failed to send newsletter');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter mb-1">Create Newsletter</h2>
            <p className="text-sm text-neutral-500 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Sending to {subscriberCount} subscribers
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors ${
                showPreview
                  ? 'bg-indigo-500/20 text-indigo-500'
                  : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {showPreview ? (
            // Preview Mode
            <div className="p-8 bg-neutral-50 dark:bg-neutral-950">
              <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-indigo-500 p-6 text-white">
                  <Mail className="w-12 h-12 mb-4" />
                  <h1 className="text-2xl font-black italic">{formData.subject || 'Newsletter Subject'}</h1>
                  {formData.preview_text && (
                    <p className="text-indigo-100 mt-2">{formData.preview_text}</p>
                  )}
                </div>
                <div className="p-8">
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br />') }}
                  />
                </div>
                <div className="p-6 bg-neutral-50 dark:bg-neutral-800 text-center text-sm text-neutral-500">
                  <p>You're receiving this because you subscribed to our newsletter.</p>
                  <button className="text-indigo-500 hover:underline mt-2">Unsubscribe</button>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="p-6 space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-bold mb-2">Subject Line *</label>
                <DashboardInput
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., New Features & Updates"
                  required
                />
              </div>

              {/* Preview Text */}
              <div>
                <label className="block text-sm font-bold mb-2">Preview Text</label>
                <DashboardInput
                  value={formData.preview_text}
                  onChange={(e) => setFormData({ ...formData, preview_text: e.target.value })}
                  placeholder="Short preview shown in email clients..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-bold mb-2">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your newsletter content here..."
                  rows={12}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:border-indigo-500 focus:outline-none transition-colors resize-none font-sans"
                />
                <p className="text-xs text-neutral-500 mt-2">
                  Tip: Use line breaks for paragraphs. HTML is supported.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !formData.subject || !formData.content}
            className="flex-1 h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Sending...' : `Send to ${subscriberCount} Subscribers`}
          </button>
        </div>
      </div>
    </div>
  );
}
