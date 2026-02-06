"use client";
import React, { useState, useEffect } from "react";
import { User, Shield, Bell, CreditCard, Mail, Lock, Camera, Check, Eye, EyeOff, Trash2, Globe, Twitter, Github, Linkedin, MapPin, Briefcase } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import api from "@/lib/api";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardButton, 
    DashboardInput, 
    DashboardSection,
    DashboardBadge 
} from "@/components/dashboard/Shared";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    bio: "",
    website: "",
    twitter: "",
    github: "",
    linkedin: "",
    location: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/auth/me");
            if (data.success) {
                setFormData({
                    name: data.user.name || "",
                    profession: data.user.profession || "",
                    bio: data.user.bio || "",
                    website: data.user.website || "",
                    twitter: data.user.twitter || "",
                    github: data.user.github || "",
                    linkedin: data.user.linkedin || "",
                    location: data.user.location || ""
                });
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            toast.error("Failed to load profile data");
        } finally {
            setFetching(false);
        }
    };

    if (session) {
        fetchProfile();
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
        const { data } = await api.put("/auth/profile", formData);
        if (data.success) {
            toast.success("Profile updated successfully!");
            // Update NextAuth session to reflect name change globally
            await update({
                user: {
                    ...session?.user,
                    name: formData.name
                }
            });
        }
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
        setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "security", label: "Login & Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
  ];

  if (fetching) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-10">
      <PageHeader 
        title="Settings" 
        description="Manage your account preferences and personal branding details."
      />

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Settings Navigation */}
        <aside className="lg:w-72 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-sm font-black italic tracking-tight",
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
                <DashboardSection title="Profile Details" description="Update your public profile and how people see you.">
                  <DashboardCard>
                    <div className="flex flex-col md:flex-row items-start gap-10">
                        <div className="relative group cursor-pointer shrink-0">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-neutral-100 dark:bg-white/5 border-2 border-dashed border-neutral-300 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:scale-105 group-hover:border-indigo-500/50">
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
                                <DashboardInput 
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <DashboardInput 
                                    label="Profession / Title"
                                    placeholder="e.g. Senior Product Designer"
                                    value={formData.profession}
                                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                    icon={Briefcase}
                                />
                                <DashboardInput 
                                    label="Location"
                                    placeholder="e.g. Casablanca, Morocco"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    icon={MapPin}
                                />
                                <DashboardInput 
                                    label="Personal Website"
                                    placeholder="https://yourlink.com"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    icon={Globe}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <DashboardInput 
                                    label="Twitter / X"
                                    placeholder="@username"
                                    value={formData.twitter}
                                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                    icon={Twitter}
                                />
                                <DashboardInput 
                                    label="GitHub"
                                    placeholder="github.com/..."
                                    value={formData.github}
                                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                    icon={Github}
                                />
                                <DashboardInput 
                                    label="LinkedIn"
                                    placeholder="linkedin.com/in/..."
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    icon={Linkedin}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Bio (Optional)</label>
                                <textarea 
                                    rows={4}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full p-5 rounded-3xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none transition-all font-bold resize-none italic text-sm"
                                    placeholder="Tell us a bit about yourself..."
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <DashboardButton 
                                    variant="primary" 
                                    onClick={handleUpdateProfile}
                                    loading={loading}
                                    className="h-14 px-10"
                                >
                                    Save Changes
                                </DashboardButton>
                                <DashboardButton variant="secondary" className="h-14 px-8">
                                    Cancel
                                </DashboardButton>
                            </div>
                        </div>
                    </div>
                  </DashboardCard>
                </DashboardSection>
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
                <DashboardSection title="Security" description="Protect your account with a strong password.">
                    <DashboardCard>
                        <div className="max-w-md space-y-6">
                            <DashboardInput 
                                label="Current Password"
                                type={showPassword ? "text" : "password"}
                                icon={Lock}
                            />
                            <DashboardInput 
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                icon={Shield}
                            />
                            <div className="flex items-center gap-2 px-1">
                                <input 
                                    type="checkbox" 
                                    id="show" 
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                    className="w-4 h-4 rounded-lg accent-indigo-500" 
                                />
                                <label htmlFor="show" className="text-[10px] font-black uppercase tracking-widest text-neutral-500 cursor-pointer">Show Passwords</label>
                            </div>
                            <DashboardButton variant="primary" className="w-full h-14" icon={Shield}>
                                Update Password
                            </DashboardButton>
                        </div>
                    </DashboardCard>
                </DashboardSection>

                <DashboardSection title="Danger Zone" description="Irreversible actions for your account.">
                    <DashboardCard className="border-red-500/20 bg-red-500/5 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h4 className="text-lg font-black text-red-500 italic tracking-tight">Delete Account</h4>
                                <p className="text-xs text-neutral-500 font-medium italic">All your data and portfolios will be permanently erased. Please think twice.</p>
                            </div>
                            <DashboardButton variant="danger" icon={Trash2} className="h-14 px-8 shadow-xl shadow-red-500/10">
                                Delete Forever
                            </DashboardButton>
                        </div>
                    </DashboardCard>
                </DashboardSection>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <DashboardSection title="Preferences" description="Control how you receive updates and alerts.">
                    <DashboardCard>
                        <div className="space-y-6">
                        {[
                            { id: "v", label: "Monthly Analytics Report", desc: "Get a summary of your portfolio traffic once a month." },
                            { id: "s", label: "New Subscriber Alerts", desc: "Instantly notify when someone signs up to your newsletter." },
                            { id: "p", label: "Product Updates", desc: "Stay informed about new Profolio features and templates." },
                            { id: "m", label: "Marketing Tips", desc: "Learn how to optimize your portfolio for better conversions." },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-0 border-neutral-100 dark:border-white/5">
                            <div>
                                <p className="font-black text-sm tracking-tight italic">{item.label}</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium italic">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-12 h-6 bg-neutral-200 peer-focus:outline-none dark:bg-neutral-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 rounded-full shadow-inner"></div>
                            </label>
                            </div>
                        ))}
                        </div>
                    </DashboardCard>
                </DashboardSection>
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <DashboardSection title="Subscription" description="Manage your current plan and usage limits.">
                    <DashboardCard className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-transparent relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <CreditCard className="w-7 h-7" />
                                </div>
                                <DashboardBadge variant="success">Active Free Tier</DashboardBadge>
                            </div>
                            <h3 className="text-4xl font-black italic tracking-tighter mb-4">FREE PLAN</h3>
                            <p className="text-indigo-100 font-medium mb-10 max-w-sm italic">You are currently using the free tier. Upgrade to unlock custom domains and unlimited portfolios.</p>
                            <DashboardButton variant="secondary" className="bg-white text-indigo-500 hover:bg-neutral-100 w-full md:w-auto h-14 px-10 shadow-2xl">
                                Upgrade Plan &rarr;
                            </DashboardButton>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                            <CreditCard className="w-48 h-48 rotate-12" />
                        </div>
                    </DashboardCard>
                </DashboardSection>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
