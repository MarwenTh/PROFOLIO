"use client";
import React from "react";
import {
  Search,
  Bell,
  ShoppingBag,
  Sparkles,
  Command,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  LogOut,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashboardButton } from "./Shared";
import Link from "next/link";
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import api from "@/lib/api";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Sale!",
    message: "Someone bought 'Elite Theme v1'",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    title: "System Update",
    message: "New AI features are now live",
    time: "1h ago",
    read: true,
  },
  {
    id: 3,
    title: "Welcome back",
    message: "Ready to build something amazing?",
    time: "5h ago",
    read: true,
  },
];

export function TopNavbar({ onSearchOpen }: { onSearchOpen?: () => void }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-20 border-b border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-2xl flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-500">
      {/* Glossy Top Edge Glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />

      <div className="flex items-center gap-6 flex-1">
        {/* Global Search Bar - Refined Command Palette Trigger */}
        <div
          onClick={onSearchOpen}
          className="relative group max-w-md w-full hidden md:block cursor-pointer"
        >
          <div className="absolute inset-0 bg-neutral-100 dark:bg-white/5 rounded-2xl group-hover:bg-neutral-200 dark:group-hover:bg-white/10 transition-colors" />
          <div className="relative flex items-center gap-3 px-4 h-12">
            <Search className="w-5 h-5 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
            <span className="text-sm text-neutral-400 font-medium italic">
              Search anything...
            </span>
            <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-xl bg-white/50 dark:bg-black/20 border border-neutral-200 dark:border-white/10 shadow-sm transition-all group-hover:scale-105 group-hover:border-indigo-500/30">
              <Command className="w-3 h-3 text-neutral-400" />
              <span className="text-[10px] font-black text-neutral-400">K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Marketplace Link - Standalone & Glowing */}
        <Link href="/marketplace">
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            {/* Pulsing Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur-md opacity-20 group-hover:opacity-60 animate-pulse transition-opacity" />

            <DashboardButton
              variant="primary"
              className="relative h-12 px-8 bg-black dark:bg-white text-white dark:text-black border-none shadow-2xl overflow-visible group-hover:shadow-indigo-500/20 transition-all"
              icon={ShoppingBag}
            >
              <span className="flex items-center gap-2.5">
                Marketplace
                <div className="flex items-center gap-1 bg-white/20 dark:bg-black/10 px-2 py-0.5 rounded-lg backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-indigo-400 animate-bounce" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">
                    New Area
                  </span>
                </div>
              </span>
            </DashboardButton>
          </motion.div>
        </Link>

        {/* User Quick Actions */}
        <div className="flex items-center gap-3 border-l border-neutral-200 dark:border-white/10 pl-6 h-10 relative">
          {/* Notification Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className={cn(
                "p-3 rounded-2xl transition-all relative group",
                showNotifications
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400",
              )}
            >
              <Bell
                className={cn(
                  "w-5 h-5",
                  showNotifications
                    ? ""
                    : "group-hover:rotate-12 transition-transform",
                )}
              />
              {!showNotifications && (
                <>
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-neutral-900 shadow-lg animate-ping" />
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-neutral-900 shadow-lg" />
                </>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 5 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-900 rounded-[2rem] shadow-3xl border border-neutral-200 dark:border-white/5 z-50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
                      <h4 className="text-sm font-black italic uppercase tracking-widest">
                        Inbox
                      </h4>
                      <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-lg font-black italic">
                        1 New
                      </span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                      {MOCK_NOTIFICATIONS.map((note) => (
                        <div
                          key={note.id}
                          className="p-5 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group cursor-pointer border-b border-neutral-100 dark:border-white/5 last:border-none"
                        >
                          <div className="flex gap-4">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                note.read
                                  ? "bg-neutral-200 dark:bg-neutral-700"
                                  : "bg-indigo-500",
                              )}
                            />
                            <div>
                              <p className="text-xs font-black italic leading-none mb-1">
                                {note.title}
                              </p>
                              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium italic mb-2">
                                {note.message}
                              </p>
                              <span className="text-[9px] font-black uppercase text-neutral-400">
                                {note.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-neutral-50 dark:bg-white/5 text-center">
                      <button className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:underline">
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Dropdown Toggle */}
          <div className="relative">
            {isLoaded && user && (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 rounded-xl border border-indigo-500/20 shadow-sm",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
