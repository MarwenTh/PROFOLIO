"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
    Search, 
    LayoutDashboard, 
    FolderOpen, 
    Settings, 
    ShoppingBag, 
    Wand2, 
    Globe, 
    Users2, 
    Code, 
    BarChart3,
    Command,
    X,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useSession } from "next-auth/react";

interface SearchItem {
    id: string;
    title: string;
    description: string;
    icon: any;
    href: string;
    category: "Pages" | "Marketplace" | "Shortcuts" | "Portfolios";
}

const SEARCH_ITEMS: SearchItem[] = [
    // Pages
    { id: "overview", title: "Overview", description: "View your workspace dashboard", icon: LayoutDashboard, href: "/dashboard", category: "Pages" },
    { id: "analytics", title: "Analytics", description: "Monitor your performance", icon: BarChart3, href: "/dashboard/analytics", category: "Pages" },
    { id: "ai", title: "AI Assistant", description: "Generate content with AI", icon: Wand2, href: "/dashboard/ai", category: "Pages" },
    { id: "domains", title: "Domain & Slug", description: "Configure your site address", icon: Globe, href: "/dashboard/domains", category: "Pages" },
    { id: "settings", title: "Settings", description: "Account and site preferences", icon: Settings, href: "/dashboard/settings", category: "Pages" },
    
    // Marketplace
    { id: "market", title: "Marketplace", description: "Explore templates and assets", icon: ShoppingBag, href: "/marketplace", category: "Marketplace" },
    { id: "templates", title: "Premium Templates", description: "View conversion-optimized layouts", icon: Sparkles, href: "/dashboard/templates", category: "Marketplace" },
    { id: "creations", title: "My Creations", description: "Manage your listed designs", icon: Code, href: "/dashboard/marketplace/creations", category: "Marketplace" },
    
    // Quick Actions
    { id: "new-portfolio", title: "New Portfolio", description: "Create a new masterpiece", icon: Sparkles, href: "/dashboard", category: "Shortcuts" },
    { id: "refer", title: "Refer & Earn", description: "Invite friends and get rewards", icon: Users2, href: "/dashboard/referrals", category: "Shortcuts" },
];

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter();
    const { data: session } = useSession();
    const { getUserPortfolios } = usePortfolio();
    const [userItems, setUserItems] = useState<SearchItem[]>([]);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchItems = async () => {
            if (session?.user?.id && isOpen) {
                const data = await getUserPortfolios(session.user.id);
                if (data.success) {
                    const portfolios = data.portfolios.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        description: `Edit portfolio: ${p.slug}`,
                        icon: Globe,
                        href: `/dashboard/edit/${p.id}`,
                        category: "Portfolios"
                    }));
                    setUserItems(portfolios);
                }
            }
        };
        fetchItems();
    }, [session?.user?.id, isOpen, getUserPortfolios]);

    const allItems = [...SEARCH_ITEMS, ...userItems];

    const filteredItems = query === "" 
        ? allItems.slice(0, 10)
        : allItems.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredItems.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredItems[selectedIndex]) {
                    router.push(filteredItems[selectedIndex].href);
                    onClose();
                }
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, filteredItems, selectedIndex, router, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:pt-40">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm shadow-2xl"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-3xl overflow-hidden border border-neutral-200 dark:border-white/10"
                    >
                        {/* Search Input Area */}
                        <div className="flex items-center gap-4 px-6 py-5 border-b border-neutral-100 dark:border-white/5">
                            <Search className="w-6 h-6 text-indigo-500" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search everything... (Settings, Templates, AI...)"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                className="flex-1 bg-transparent border-none outline-none text-lg font-black italic tracking-tight placeholder:text-neutral-400 placeholder:not-italic"
                            />
                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[10px] font-black text-neutral-400">
                                ESC
                            </div>
                        </div>

                        {/* Results Area */}
                        <div className="max-h-[450px] overflow-y-auto no-scrollbar py-2">
                            {filteredItems.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-neutral-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-neutral-300" />
                                    </div>
                                    <p className="text-sm font-bold text-neutral-500 italic">No results found for "{query}"</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {["Portfolios", "Pages", "Marketplace", "Shortcuts"].map(category => {
                                        const categoryItems = filteredItems.filter(item => item.category === category);
                                        if (categoryItems.length === 0) return null;

                                        return (
                                            <div key={category} className="px-2">
                                                <div className="px-4 mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                                                        {category}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    {categoryItems.map((item) => {
                                                        const globalIndex = filteredItems.indexOf(item);
                                                        const isActive = selectedIndex === globalIndex;

                                                        return (
                                                            <button
                                                                key={item.id}
                                                                onClick={() => {
                                                                    router.push(item.href);
                                                                    onClose();
                                                                }}
                                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-left group",
                                                                    isActive 
                                                                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                                                                        : "hover:bg-neutral-50 dark:hover:bg-white/5"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                                                    isActive ? "bg-white/20" : "bg-neutral-100 dark:bg-neutral-800"
                                                                )}>
                                                                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-neutral-500")} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={cn("font-black text-sm italic tracking-tight leading-none mb-1", isActive ? "text-white" : "text-neutral-900 dark:text-white")}>
                                                                        {item.title}
                                                                    </p>
                                                                    <p className={cn("text-[10px] font-bold truncate", isActive ? "text-indigo-100" : "text-neutral-500")}>
                                                                        {item.description}
                                                                    </p>
                                                                </div>
                                                                {isActive && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <span className="text-[10px] font-black uppercase tracking-widest italic opacity-60">Go</span>
                                                                        <ArrowRight className="w-4 h-4" />
                                                                    </motion.div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer / Shortcuts Hint */}
                        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 dark:bg-white/[0.02] border-t border-neutral-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="px-1.5 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-[9px] font-black text-neutral-400">↑↓</div>
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Navigate</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="px-1.5 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-[9px] font-black text-neutral-400">ENTER</div>
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Select</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-black text-indigo-500 uppercase tracking-widest italic">
                                <Command className="w-2.5 h-2.5" /> Pulse Search
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
