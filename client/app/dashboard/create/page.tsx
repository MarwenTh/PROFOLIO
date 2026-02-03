"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { motion } from "framer-motion";
import { Loader2, Globe, Rocket } from "lucide-react";

export default function CreatePortfolioPage() {
  const { data: session } = useSession();
  const { createPortfolio, loading } = usePortfolio();
  const [formData, setFormData] = useState({ title: "", slug: "", description: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      setError("You must be logged in to create a portfolio.");
      return;
    }

    setError("");
    const result = await createPortfolio({
      userId: session.user.id,
      title: formData.title,
      slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 md:py-20 relative px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group bg-white/50 dark:bg-neutral-900/40 backdrop-blur-3xl p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-neutral-200/50 dark:border-white/5 relative overflow-hidden transition-all"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />

        <div className="relative z-10">
          <header className="mb-10">
            <div className="inline-flex p-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black mb-5">
                <Rocket className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-neutral-900 dark:text-white mb-2">
               Craft Discovery
            </h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
               Give your masterpiece a name and a unique digital address.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-xs font-bold text-red-500 bg-red-500/5 rounded-xl border border-red-500/10 text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-500 ml-1">Portfolio Identity</label>
              <input
                type="text"
                required
                placeholder="Ex. Creative Portfolio 2024"
                className="w-full h-12 bg-white/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-white/5 rounded-xl px-5 text-sm font-medium focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-neutral-300 dark:placeholder:text-neutral-600 outline-none"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-500 ml-1">Digital Link</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 font-mono text-sm font-bold select-none pointer-events-none">
                    /
                </div>
                <input
                  type="text"
                  required
                  placeholder="my-personal-brand"
                  className="w-full h-12 bg-white/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-white/5 rounded-xl pl-10 pr-5 text-sm font-bold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono placeholder:text-neutral-300 dark:placeholder:text-neutral-600 outline-none"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2 ml-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Live at profolio.com/<span className="text-emerald-500 font-black">{formData.slug || 'slug'}</span>
                  </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-500 ml-1">Description</label>
              <textarea
                placeholder="A brief introduction for your portfolio..."
                className="w-full min-h-[100px] bg-white/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-white/5 rounded-xl px-5 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-neutral-300 dark:placeholder:text-neutral-600 outline-none resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-12 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initialize Site <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
