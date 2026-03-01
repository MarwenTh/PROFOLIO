"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Plus,
  Search,
  Eye,
  Heart,
  Package,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import {
  PageHeader,
  DashboardBadge,
  EmptyState,
} from "@/components/dashboard/Shared";
import { formatDistanceToNow } from "date-fns";

type StatusFilter = "all" | "published" | "review" | "draft";

const statusColors: Record<string, string> = {
  published: "success",
  review: "warning",
  draft: "neutral",
};

/**
 * Studio Dashboard — lists all user sandbox components with stats,
 * tab filters, search, and a "Create New" button.
 */
export default function StudioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [components, setComponents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    published: 0,
    drafts: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [session?.user?.id, status, router]);

  const handleCreateNew = () => {
    alert("Sandbox feature has been removed.");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Logic for deleting standard components would go here
  };

  const filtered = components.filter((c) => {
    const matchesStatus = activeFilter === "all" || c.status === activeFilter;
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.slug && c.slug.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const tabs: { label: string; value: StatusFilter; count: number }[] = [
    { label: "All", value: "all", count: components.length },
    { label: "Published", value: "published", count: stats.published },
    {
      label: "Review",
      value: "review",
      count: components.filter((c) => c.status === "review").length,
    },
    { label: "Draft", value: "draft", count: stats.drafts },
  ];

  if (status === "loading" || (components.length === 0 && !session)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader size="lg" />
        <p className="text-sm text-neutral-500 animate-pulse font-medium italic">
          Loading studio…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <PageHeader
        title="Studio"
        description="Build, test, and publish reusable components"
      >
        <div className="relative w-full md:w-72 group">
          <div className="absolute inset-0 bg-neutral-100 dark:bg-white/5 rounded-2xl group-hover:bg-neutral-200 dark:group-hover:bg-white/10 transition-colors" />
          <div className="relative flex items-center gap-3 px-4 h-11">
            <Search className="w-4 h-4 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search components…"
              className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-neutral-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>

      {/* ── Stats Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: Package,
            label: "Published",
            value: stats.published,
            color: "text-emerald-500",
          },
          {
            icon: Code2,
            label: "Drafts",
            value: stats.drafts,
            color: "text-indigo-500",
          },
          {
            icon: Eye,
            label: "Total Views",
            value: stats.totalViews,
            color: "text-blue-500",
          },
          {
            icon: Heart,
            label: "Total Likes",
            value: stats.totalLikes,
            color: "text-pink-500",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <motion.div
            key={label}
            whileHover={{ y: -2 }}
            className="relative rounded-3xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-neutral-900/50 p-5 shadow-sm"
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 bg-neutral-100 dark:bg-white/5`}
            >
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {value}
            </div>
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
              {label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Tab Bar + Create New ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-white/5 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab.value
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  activeFilter === tab.value
                    ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                    : "bg-neutral-200 dark:bg-white/10 text-neutral-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="sm:ml-auto">
          <motion.button
            onClick={handleCreateNew}
            disabled={creating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-60"
          >
            {creating ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Create New
          </motion.button>
        </div>
      </div>

      {/* ── Component List ──────────────────────────────────────────────── */}
      {components.length === 0 ? (
        <EmptyState
          title="No components yet"
          description="Click 'Create New' to open the sandbox IDE and build your first reusable component."
          icon={Code2}
          actionLabel="Create New"
          onAction={handleCreateNew}
        />
      ) : (
        <div className="rounded-3xl border border-neutral-200 dark:border-white/5 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_100px_80px_120px_60px_60px_40px] gap-4 px-5 py-3 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-white/5">
            {[
              "Component",
              "Status",
              "Visibility",
              "Created",
              "Views",
              "Likes",
              "",
            ].map((h) => (
              <span
                key={h}
                className="text-[10px] font-black uppercase tracking-widest text-neutral-400"
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <AnimatePresence initial={false}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
                <Search className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm font-medium">
                  No components match your filters
                </p>
              </div>
            ) : (
              filtered.map((component, i) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() =>
                    router.push(`/dashboard/studio/sandbox/${component.id}`)
                  }
                  className="grid grid-cols-[1fr_100px_80px_120px_60px_60px_40px] gap-4 items-center px-5 py-3.5 border-b border-neutral-100 dark:border-white/5 last:border-0 cursor-pointer hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Name */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-neutral-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                          {component.title}
                        </p>
                        {component.slug && (
                          <p className="text-[11px] font-mono text-neutral-400 truncate">
                            /{component.slug}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <DashboardBadge
                      variant={statusColors[component.status] as any}
                    >
                      {component.status}
                    </DashboardBadge>
                  </div>

                  {/* Visibility */}
                  <span className="text-xs font-medium text-neutral-500 capitalize">
                    {component.visibility}
                  </span>

                  {/* Created */}
                  <span className="text-xs text-neutral-400 font-medium">
                    {formatDistanceToNow(new Date(component.created_at), {
                      addSuffix: true,
                    })}
                  </span>

                  {/* Views */}
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs font-bold">{component.views}</span>
                  </div>

                  {/* Likes */}
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Heart className="w-3 h-3" />
                    <span className="text-xs font-bold">{component.likes}</span>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => handleDelete(component.id, e)}
                    className="p-1.5 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
