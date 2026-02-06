"use client";
import React, { useState, useEffect, useCallback } from "react";
import { 
    PageHeader, 
    EmptyState, 
    DashboardCard, 
    DashboardBadge, 
    DashboardButton,
    DashboardSection 
} from "@/components/dashboard/Shared";
import { Zap, Github, Twitter, Instagram, Mail, ExternalLink, Sparkles, Bot, Brain, LayoutGrid } from "lucide-react";
import { AIIntegrationModal } from "@/components/dashboard/AIIntegrationModal";
import { AITestSection } from "@/components/dashboard/AITestSection";
import api from "@/lib/api";

interface IntegrationItem {
    id: string;
    name: string;
    desc: string;
    icon: any;
    status: string;
    category: "Social" | "AI" | "Marketing";
}

export default function IntegrationsPage() {
    const [activeService, setActiveService] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [connectedServices, setConnectedServices] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const integrations: IntegrationItem[] = [
        { id: "github", name: "GitHub", icon: Github, status: "Connected", category: "Social", desc: "Sync your project repositories." },
        { id: "twitter", name: "Twitter", icon: Twitter, status: "Pending", category: "Social", desc: "Automate your social feeds." },
        { id: "instagram", name: "Instagram", icon: Instagram, status: "Soon", category: "Social", desc: "Showcase your visual work." },
        { id: "mailchimp", name: "Mailchimp", icon: Mail, status: "Connected", category: "Marketing", desc: "Connect your subscriber base." },
        { id: "gemini", name: "Google Gemini", icon: Sparkles, status: "Connect", category: "AI", desc: "Power your content with Google's most capable AI model." },
        { id: "openai", name: "OpenAI ChatGPT", icon: Bot, status: "Connect", category: "AI", desc: "Leverage GPT-4 for intelligent writing and assistance." },
    ];

    const fetchConnectedServices = useCallback(async () => {
        try {
            const response = await api.get("/integrations");
            if (response.data.success) {
                setConnectedServices(response.data.integrations.map((i: any) => i.service_name));
            }
        } catch (err) {
            console.error("Failed to fetch integrations:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConnectedServices();
    }, [fetchConnectedServices]);

    const handleManage = (item: IntegrationItem) => {
        if (item.category === "AI") {
            setActiveService(item);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            <PageHeader 
                title="Integrations" 
                description="Supercharge your portfolio with third-party tools and automations."
            />

            <div className="space-y-16">
                {/* Social & Marketing Platforms */}
                <DashboardSection 
                    title="Social & Platforms" 
                    description="Connect your existing social presence and marketing tools."
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {integrations.filter(i => i.category !== "AI").map((item) => (
                            <DashboardCard key={item.id} className="group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400 mb-6 group-hover:text-indigo-500 group-hover:bg-indigo-500/10 transition-all">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black mb-1 tracking-tight italic">{item.name}</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-medium leading-relaxed italic">{item.desc}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <DashboardBadge variant={item.status === 'Connected' ? 'success' : 'neutral'}>
                                        {item.status}
                                    </DashboardBadge>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:underline flex items-center gap-1">
                                        Manage <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </DashboardCard>
                        ))}
                    </div>
                </DashboardSection>

                {/* AI Agents Section */}
                <DashboardSection 
                    title="AI Intelligence" 
                    description="Bring powerful AI agents to your workspace. Provide your API keys to get started."
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {integrations.filter(i => i.category === "AI").map((item) => {
                            const isConnected = connectedServices.includes(item.id);
                            return (
                                <DashboardCard key={item.id} className="group relative overflow-hidden border-2 border-transparent hover:border-indigo-500/20 transition-all duration-500 flex flex-col h-full">
                                    {isConnected && (
                                        <div className="absolute top-0 right-0 p-3">
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Active</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-500 shrink-0">
                                            <item.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight italic text-neutral-900 dark:text-white">{item.name}</h3>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">AI Agent</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed italic mb-8">
                                        {item.desc}
                                    </p>
                                    <div className="mt-auto space-y-4">
                                        <DashboardButton 
                                            variant={isConnected ? "secondary" : "primary"} 
                                            className="w-full"
                                            onClick={() => handleManage(item)}
                                            icon={isConnected ? Brain : Zap}
                                        >
                                            {isConnected ? "Update Settings" : "Connect Model"}
                                        </DashboardButton>
                                        {isConnected && (
                                            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                                <LayoutGrid className="w-3.5 h-3.5" />
                                                Enabled in Editor
                                            </div>
                                        )}
                                    </div>
                                </DashboardCard>
                            );
                        })}
                    </div>
                </DashboardSection>

                {/* AI Testing Section */}
                {connectedServices.length > 0 && (
                    <AITestSection connectedServices={connectedServices} />
                )}

                <div className="pt-10">
                    <EmptyState 
                        title="Custom Developer Access"
                        description="Our full REST API and webhook system is currently in private beta."
                        icon={Zap}
                        actionLabel="Request Access"
                        onAction={() => {}}
                    />
                </div>
            </div>

            <AIIntegrationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={activeService}
                isConnected={activeService ? connectedServices.includes(activeService.id) : false}
                onSuccess={fetchConnectedServices}
            />
        </div>
    );
}
