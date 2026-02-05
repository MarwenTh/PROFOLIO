"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  Globe, 
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Users2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ModeToggle } from "@/components/ModeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const isEditor = pathname.includes("/dashboard/edit/");

  if (isEditor) {
    return (
      <div className="h-screen bg-white dark:bg-neutral-950 overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fbfbfc] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-indigo-500/30 transition-colors duration-500 relative overflow-hidden">
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-50">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 dark:bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Mobile Nav Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-neutral-200/50 dark:border-white/5 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl z-[60] flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
                <Image src="/assets/logo2.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-bold tracking-tighter italic">PROFOLIO</span>
        </Link>
        <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
        >
            <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar - Desktop Only with its own logic */}
      <div className="hidden lg:block shrink-0">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[300px] bg-white dark:bg-neutral-900 z-[80] p-6 shadow-2xl flex flex-col"
            >
                <div className="flex items-center justify-between mb-8 overflow-hidden">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 relative shrink-0">
                            <Image src="/assets/logo2.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter italic">PROFOLIO</span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5">
                        <X className="w-5 h-5 text-neutral-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto -mx-6 custom-scrollbar">
                    <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
                </div>

                <div className="mt-auto pt-6 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-white/10">
                            {session?.user?.image ? (
                                <Image src={session.user.image} alt="User" width={40} height={40} className="object-cover" />
                            ) : (
                                <Users2 className="w-5 h-5 text-neutral-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold line-clamp-1">{session?.user?.name}</p>
                            <p className="text-[10px] text-neutral-500 font-medium line-clamp-1 italic">{session?.user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <button onClick={() => signOut()} className="p-3 rounded-xl bg-red-500/10 text-red-500">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main 
        className={cn(
          "flex-1 overflow-y-auto z-10 custom-scrollbar pt-20 lg:pt-0 transition-all duration-300",
          !isEditor && (isCollapsed ? "lg:pl-[80px]" : "lg:pl-[280px]")
        )}
      >
        <div className="p-4 md:p-12 max-w-[1600px] mx-auto min-h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
