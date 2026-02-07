"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  Globe, 
  Users2, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Layers,
  Image as ImageIcon,
  Zap,
  HelpCircle,
  FolderOpen,
  Wand2,
  Code,
  Gift,
  Search,
  Palette,
  ShoppingBag,
  Heart,
  LineChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { ModeToggle } from "@/components/ModeToggle";
import { useTheme } from "next-themes";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true, category: "Main" },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, category: "Main" },
  { name: "AI Assistant", href: "/dashboard/ai", icon: Wand2, category: "Main" },
  
  { name: "Store Templates", href: "/dashboard/templates", icon: ShoppingBag, category: "Marketplace" },
  { name: "My Creations", href: "/dashboard/marketplace/creations", icon: Palette, category: "Marketplace" },
  { name: "Purchases", href: "/dashboard/marketplace/purchases", icon: Layers, category: "Marketplace" },
  { name: "Saved", href: "/dashboard/marketplace/saved", icon: Heart, category: "Marketplace" },
  { name: "Store Stats", href: "/dashboard/marketplace/analytics", icon: LineChart, category: "Marketplace" },

  { name: "Portfolios", href: "/dashboard/projects", icon: FolderOpen, category: "Manage" },
  { name: "Domain & Slug", href: "/dashboard/domains", icon: Globe, category: "Manage" },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Users2, category: "Manage" },
  { name: "SEO & Social", href: "/dashboard/seo", icon: Search, category: "Manage" },
  
  { name: "Media Library", href: "/dashboard/library", icon: ImageIcon, category: "Tools" },
  { name: "Integrations", href: "/dashboard/integrations", icon: Zap, category: "Tools" },
  { name: "Custom Code", href: "/dashboard/code", icon: Code, category: "Tools" },
  
  { name: "Settings", href: "/dashboard/settings", icon: Settings, category: "System" },
  { name: "Refer & Earn", href: "/dashboard/referrals", icon: Gift, category: "System" },
  { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle, category: "System" },
];

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = React.useState<{ name: string; top: number } | null>(null);

  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({
    "Main": true,
    "Marketplace": true,
    "Manage": true,
    "Tools": true,
    "System": true
  });

  const toggleCategory = (category: string) => {
    if (category === "Main") return; // Keep Main always expanded
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const groupedLinks = sidebarLinks.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, typeof sidebarLinks>);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 100 : 300 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-white/5 z-50 flex flex-col shadow-2xl"
    >
      {/* Glossy Aura */}
      <div className="absolute top-0 left-0 w-full h-32 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[60px] pointer-events-none" />

      {/* Header & Toggle Section */}
      <div className="p-8 flex flex-col items-center justify-center shrink-0">
        <div className={cn(
          "flex items-center w-full transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <span className="text-white font-black text-2xl italic tracking-tighter">P.</span>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -10, width: 0 }}
                  className="font-black text-2xl tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900 dark:from-white dark:via-neutral-400 dark:to-white whitespace-nowrap overflow-hidden"
                >
                  Profolio
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all active:scale-90 border border-transparent hover:border-neutral-200 dark:hover:border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <motion.button
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsCollapsed(false)}
            className="mt-6 w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all active:scale-90 border border-transparent hover:border-neutral-200 dark:hover:border-white/10 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-8 py-4">
        {Object.entries(groupedLinks).map(([category, links]) => (
          <div key={category} className="space-y-3">
            <button 
              onClick={() => toggleCategory(category)}
              disabled={category === "Main"}
              className={cn(
                "w-full flex items-center group/cat text-[10px] font-black uppercase tracking-[0.3em] mb-2 transition-all",
                expandedCategories[category] ? "text-neutral-400" : "text-neutral-500 hover:text-indigo-500",
                isCollapsed ? "justify-center px-0" : "justify-between px-4",
                category === "Main" ? "cursor-default" : "cursor-pointer"
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors shrink-0",
                  expandedCategories[category] ? "bg-indigo-500" : "bg-neutral-300 dark:bg-neutral-700",
                  category === "Main" && "bg-indigo-500"
                )} />
                {!isCollapsed && (
                  <span className="flex items-center gap-1.5">
                    {category}
                    {category !== "Main" && !expandedCategories[category] && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[8px] font-bold text-indigo-500 normal-case tracking-normal opacity-0 group-hover/cat:opacity-100 transition-opacity"
                      >
                        (Click to see)
                      </motion.span>
                    )}
                  </span>
                )}
              </div>
              {!isCollapsed && category !== "Main" && (
                <motion.div
                  animate={{ rotate: expandedCategories[category] ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft className="w-3 h-3" />
                </motion.div>
              )}
            </button>
            
            <AnimatePresence initial={false}>
              {expandedCategories[category] && (
                <motion.div 
                  initial={isCollapsed ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-1.5 overflow-hidden"
                >
                  {links.map((link) => {
                    const isActive = link.exact 
                      ? pathname === link.href 
                      : pathname.startsWith(link.href);
                    
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onMouseEnter={(e) => {
                          if (isCollapsed) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredItem({ name: link.name, top: rect.top + (rect.height / 2) - 16 }); // Center tooltip (approx 32px height)
                          }
                        }}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={cn(
                          "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                          isActive 
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-black shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] dark:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)]" 
                            : "text-neutral-500 hover:bg-white dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white hover:shadow-md",
                          isCollapsed && "justify-center px-0"
                        )}
                      >
                        <link.icon className={cn(
                            "w-5 h-5 shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", 
                            isActive ? "animate-pulse" : "opacity-70 group-hover:opacity-100"
                        )} />
                        {!isCollapsed && (
                          <motion.span 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-bold text-sm tracking-tight truncate leading-none whitespace-nowrap"
                          >
                            {link.name}
                          </motion.span>
                        )}
                        {isActive && !isCollapsed && (
                          <motion.div 
                            layoutId="sidebar-active-indicator"
                            className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)]" 
                          />
                        )}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* User Actions / Footer */}
      <div className="p-6 border-t border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900/50 backdrop-blur-md shrink-0 space-y-4">
        <div className={cn(
          "flex items-center gap-4",
          isCollapsed ? "flex-col" : "flex-row"
        )}>
          <button
            onClick={() => signOut()}
            className={cn(
              "group flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 overflow-hidden shadow-sm hover:shadow-red-500/20 flex-1",
              isCollapsed ? "justify-center px-0 w-full" : "bg-white dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-white/5"
            )}
          >
            <div className="relative shrink-0">
              <LogOut className="w-5 h-5 relative z-10 transition-transform group-hover:-translate-x-1" />
              <div className="absolute inset-0 bg-red-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-black text-xs uppercase tracking-widest whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </button>
          
          <div className={cn(
            "shrink-0",
            isCollapsed && "mt-2"
          )}>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Hover Tooltip Portal */}
      <AnimatePresence>
        {isCollapsed && hoveredItem && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ 
              top: hoveredItem.top,
              left: 110, // Sidebar collapsed width + margin
              position: "fixed",
              zIndex: 100
            }}
            className="pointer-events-none"
          >
            <div className="flex items-center">
              {/* Tooltip Arrow */}
              <div className="w-2 h-4 bg-neutral-900 dark:bg-white clip-arrow transform -translate-x-1" style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }} />
              
              {/* Tooltip Body */}
              <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold py-2 px-3 rounded-r-lg rounded-bl-lg shadow-xl whitespace-nowrap flex items-center gap-2">
                <span>{hoveredItem.name}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
