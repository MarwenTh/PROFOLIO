"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  Globe, 
  BarChart3,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Portfolios", href: "/dashboard/portfolios", icon: Globe },
  { name: "Create New", href: "/dashboard/create", icon: PlusCircle },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isEditor = pathname.includes("/dashboard/edit/");

  if (isEditor) {
    return (
      <div className="h-screen bg-white dark:bg-neutral-950 overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-indigo-500/30 transition-colors duration-300 relative overflow-hidden">
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden text-black">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Mobile Nav Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-neutral-200/50 dark:border-white/5 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl z-30 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 relative">
                <Image src="/assets/logo2.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-bold tracking-tighter">PROFOLIO</span>
        </Link>
        <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
        >
            <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 256,
          x: typeof window !== 'undefined' && window.innerWidth < 1024 ? (isMobileMenuOpen ? 0 : -256) : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
            "z-50 border-r border-neutral-200/50 dark:border-white/5 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl flex flex-col fixed inset-y-0 lg:relative",
            "lg:flex"
        )}
      >
        {/* Toggle Button (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-full items-center justify-center shadow-md z-30 hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <div className={cn("p-8", isCollapsed && "px-4 lg:flex lg:justify-center")}>
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 relative shrink-0">
                  <Image src="/assets/logo2.png" alt="Logo" fill className="object-contain group-hover:scale-110 transition-transform" />
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 whitespace-nowrap"
                >
                    PROFOLIO
                </motion.span>
              )}
            </Link>
            <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(false)}>
                <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200",
                  isCollapsed ? "lg:justify-center lg:px-0" : "gap-3",
                  isActive 
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black shadow-lg shadow-black/5 dark:shadow-white/5" 
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110 shrink-0", isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100")} />
                {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {link.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={cn("p-6 mt-auto border-t border-neutral-200/50 dark:border-white/5 bg-neutral-50/50 dark:bg-white/5", isCollapsed && "lg:p-4 lg:flex lg:flex-col lg:items-center")}>
          <div className={cn("flex items-center gap-3 px-2 py-2 mb-4", isCollapsed && "lg:px-0 lg:justify-center")}>
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-white/10 ring-2 ring-transparent transition-all shrink-0">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="User" width={40} height={40} className="object-cover" />
              ) : (
                <User className="w-5 h-5 text-neutral-500" />
              )}
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-bold truncate tracking-tight">{session?.user?.name}</p>
                <p className="text-[10px] text-neutral-500 truncate font-medium">{session?.user?.email}</p>
              </motion.div>
            )}
          </div>
          <button
            onClick={() => signOut()}
            className={cn(
              "flex items-center justify-center gap-2 text-xs font-bold text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white border border-red-500/10 rounded-xl transition-all duration-200 active:scale-95",
              isCollapsed ? "lg:w-10 lg:h-10 lg:p-0 w-full p-3" : "w-full px-4 py-3"
            )}
            title={isCollapsed ? "Sign Out" : ""}
          >
            <LogOut className="w-3.5 h-3.5" />
            {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 1024)) && "Sign Out"}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 z-10 overflow-y-auto relative pt-16 lg:pt-0">
        <div className="p-6 md:p-10 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
