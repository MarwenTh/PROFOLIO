"use client";
import React, { useState } from "react";
import { 
    DashboardModal, 
    DashboardButton, 
    DashboardInput 
} from "./Shared";
import { Key, ShieldCheck, Info, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface AIIntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: {
        id: string;
        name: string;
        description: string;
        icon: any;
    } | null;
    isConnected: boolean;
    onSuccess: () => void;
}

export function AIIntegrationModal({ isOpen, onClose, service, isConnected, onSuccess }: AIIntegrationModalProps) {
    const [apiKey, setApiKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);

    if (!service) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey.trim()) {
            toast.error("Please enter a valid API key");
            return;
        }

        setLoading(true);
        try {
            await api.post("/integrations/save", {
                service_name: service.id,
                api_key: apiKey.trim(),
            });
            toast.success(`${service.name} ${isConnected ? 'updated' : 'connected'} successfully!`);
            setApiKey("");
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save integration");
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm(`Are you sure you want to disconnect ${service.name}? This will remove your API key.`)) return;
        
        setDisconnecting(true);
        try {
            await api.delete(`/integrations/${service.id}`);
            toast.success(`${service.name} disconnected.`);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to disconnect service");
        } finally {
            setDisconnecting(false);
        }
    };

    return (
        <DashboardModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isConnected ? `Manage ${service.name}` : `Connect ${service.name}`}
        >
            <form onSubmit={handleSave} className="space-y-6 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                    <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium leading-relaxed italic">
                        {isConnected 
                            ? `You can update your ${service.name} API key below. Your existing key is stored securely.`
                            : `Your API key is stored securely and used only to power AI features in your projects. Find it in your ${service.name} dash.`
                        }
                    </p>
                </div>

                <div className="space-y-4">
                    <DashboardInput 
                        label={isConnected ? "New API Key (Leave empty to keep current? No, we need it to update)" : "API Key"}
                        placeholder={isConnected ? "Enter new API key to update..." : `Paste your ${service.name} API key here...`}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        icon={Key}
                        type="password"
                        required
                    />
                    
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            Secure Storage
                        </div>
                        {isConnected && (
                            <button 
                                type="button"
                                onClick={handleDisconnect}
                                disabled={disconnecting}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                            >
                                {disconnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                Disconnect
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <DashboardButton 
                        variant="secondary" 
                        onClick={onClose} 
                        className="flex-1"
                        type="button"
                    >
                        Cancel
                    </DashboardButton>
                    <DashboardButton 
                        variant="primary" 
                        className="flex-[2]" 
                        type="submit" 
                        loading={loading}
                        icon={isConnected ? ShieldCheck : Key}
                    >
                        {isConnected ? "Update Key" : "Save Connection"}
                    </DashboardButton>
                </div>
            </form>
        </DashboardModal>
    );
}
