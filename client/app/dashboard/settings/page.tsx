"use client";
import React, { useState } from "react";
import { User, Shield, Bell, CreditCard, Mail, Lock, Camera, Check, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "security", label: "Login & Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Settings</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage your account and preferences.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Settings Navigation */}
        <aside className="lg:w-72 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group flex items-center gap-3 px-5 py-4 rounded-2xl transition-all text-sm font-bold",
                activeTab === tab.id 
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xl" 
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-white/5">
                  <h3 className="text-xl font-black mb-8">Profile Details</h3>
                  
                  <div className="flex flex-col md:flex-row items-start gap-10">
                    <div className="relative group cursor-pointer">
                      <div className="w-32 h-32 rounded-[2rem] bg-neutral-100 dark:bg-white/5 border-2 border-dashed border-neutral-300 dark:border-white/10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                        {session?.user?.image ? (
                          <Image src={session.user.image} alt="Avatar" width={128} height={128} className="object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-neutral-400" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-center mt-3 text-neutral-400">Change Photo</p>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Full Name</label>
                          <input 
                            type="text" 
                            defaultValue={session?.user?.name || ""}
                            className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Email Address</label>
                          <input 
                            type="email" 
                            defaultValue={session?.user?.email || ""}
                            disabled
                            className="w-full h-14 px-5 rounded-2xl bg-neutral-100 dark:bg-white/10 border border-transparent text-neutral-500 font-bold opacity-70 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Bio (Optional)</label>
                        <textarea 
                          rows={4}
                          className="w-full p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none transition-all font-medium resize-none"
                          placeholder="Tell us a bit about yourself..."
                        />
                      </div>
                      <button className="px-8 h-14 rounded-2xl bg-indigo-500 text-white font-black active:scale-95 transition-all shadow-xl shadow-indigo-500/20">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-white/5">
                  <h3 className="text-xl font-black mb-8">Change Password</h3>
                  <div className="max-w-md space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">New Password</label>
                      <input 
                        type={showPassword ? "text" : "password"}
                        className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <input 
                        type="checkbox" 
                        id="show" 
                        onChange={() => setShowPassword(!showPassword)}
                        className="w-4 h-4 rounded-lg accent-indigo-500" 
                      />
                      <label htmlFor="show" className="text-xs font-bold text-neutral-500 cursor-pointer">Show Passwords</label>
                    </div>
                    <button className="w-full h-14 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black font-black active:scale-95 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10">
                  <h3 className="text-xl font-black text-red-500 mb-2">Danger Zone</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 font-medium">Permanently delete your account and all your portfolios. This action is irreversible.</p>
                  <button className="px-8 py-4 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-white/5"
              >
                <h3 className="text-xl font-black mb-8">Notification Preferences</h3>
                <div className="space-y-6">
                  {[
                    { id: "v", label: "Monthly Analytics Report", desc: "Get a summary of your portfolio traffic once a month." },
                    { id: "s", label: "New Subscriber Alerts", desc: "Instantly notify when someone signs up to your newsletter." },
                    { id: "p", label: "Product Updates", desc: "Stay informed about new Profolio features and templates." },
                    { id: "m", label: "Marketing Tips", desc: "Learn how to optimize your portfolio for better conversions." },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-0 border-neutral-100 dark:border-white/5">
                      <div>
                        <p className="font-bold text-sm tracking-tight">{item.label}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-indigo-500 rounded-full"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-12 rounded-[2.5rem] bg-indigo-500 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <CreditCard className="w-32 h-32 rotate-12" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black italic tracking-tighter mb-4">FREE PLAN</h3>
                  <p className="text-indigo-100 font-medium mb-10 max-w-sm">You are currently using the free tier. Upgrade to unlock custom domains and unlimited portfolios.</p>
                  <button className="px-10 py-5 rounded-2xl bg-white text-indigo-500 font-black text-lg active:scale-95 transition-all shadow-2xl">
                    Coming Soon &rarr;
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
