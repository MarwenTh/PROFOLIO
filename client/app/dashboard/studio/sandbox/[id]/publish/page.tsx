"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Save, Check } from "lucide-react";
import { useSandbox, SandboxComponent } from "@/hooks/useSandbox";
import { Loader } from "@/components/ui/Loader";
import Link from "next/link";

const CATEGORIES = ["UI", "Layout", "Animation", "Form", "Navigation", "Other"];

/**
 * Publish wizard page — fills in metadata and submits the component
 * for review or sets it to draft for future publishing.
 */
export default function PublishPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const sandboxId = params.id as string;

  const { getSandbox, publishSandbox, loading } = useSandbox();

  const [component, setComponent] = useState<SandboxComponent | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "UI",
    visibility: "private" as "public" | "private",
  });
  const [error, setError] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    (async () => {
      const result = await getSandbox(sandboxId);
      if (result.success && result.component) {
        const c = result.component;
        setComponent(c);
        setForm({
          title: c.title === "Untitled" ? "" : c.title,
          slug: c.slug ?? "",
          description: c.description ?? "",
          category: c.category ?? "UI",
          visibility: c.visibility ?? "private",
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandboxId, status]);

  const handleSlugFromTitle = (title: string) =>
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 50);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || handleSlugFromTitle(title),
    }));
  };

  const handleSubmit = async (submitStatus: "draft" | "review") => {
    setError("");
    if (!form.title.trim() || !form.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }

    const result = await publishSandbox(sandboxId, {
      ...form,
      status: submitStatus,
    });

    if (result.success) {
      setPublished(true);
      setTimeout(() => router.push("/dashboard/studio"), 1500);
    } else {
      setError(result.message ?? "Failed to publish");
    }
  };

  if (status === "loading" || !component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (published) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/25"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <p className="text-lg font-black text-neutral-900 dark:text-white">
          Component submitted!
        </p>
        <p className="text-sm text-neutral-500">Redirecting to Studio…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Back link */}
        <Link
          href={`/dashboard/studio/sandbox/${sandboxId}`}
          className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-indigo-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Editor
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight italic">
            Publish Component
          </h1>
          <p className="text-neutral-500 mt-2 text-sm">
            Fill in the details below. You can save as a draft or submit for
            review.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-white/5 p-8 space-y-6 shadow-sm">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Component Name *
            </label>
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Animated Card"
              maxLength={60}
              className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none text-sm font-bold placeholder:text-neutral-400 transition-all"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Slug *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400 font-mono">/</span>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  }))
                }
                placeholder="animated-card"
                maxLength={50}
                className="flex-1 px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none text-sm font-mono font-bold placeholder:text-neutral-400 transition-all"
              />
            </div>
            <p className="text-[11px] text-neutral-400">
              {form.slug.length}/50 chars
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="A brief description of what this component does…"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none text-sm font-medium placeholder:text-neutral-400 resize-none transition-all"
            />
          </div>

          {/* Category + Visibility */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Visibility
              </label>
              <div className="flex gap-2">
                {(["private", "public"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, visibility: v }))
                    }
                    className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold capitalize transition-all ${
                      form.visibility === v
                        ? "bg-indigo-600 text-white"
                        : "bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs font-bold text-red-500 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 text-center">
              {error}
            </p>
          )}

          {/* Submit buttons */}
          <div className="flex gap-3 pt-2">
            <motion.button
              onClick={() => handleSubmit("draft")}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center gap-2 flex-1 justify-center py-3 rounded-2xl bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 text-sm font-bold hover:bg-neutral-200 dark:hover:bg-white/10 transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </motion.button>

            <motion.button
              onClick={() => handleSubmit("review")}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center gap-2 flex-[2] justify-center py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit for Review
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
