"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
    Terminal, 
    Play, 
    RotateCcw, 
    Circle, 
    CheckCircle2, 
    XCircle, 
    Loader2,
    Command,
    Sparkles,
    Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface AITestSectionProps {
    connectedServices: string[];
}

interface LogEntry {
    type: "info" | "success" | "error" | "ai";
    message: string;
    timestamp: string;
}

export function AITestSection({ connectedServices }: AITestSectionProps) {
    const [selectedService, setSelectedService] = useState(connectedServices[0] || "");
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (connectedServices.length > 0 && !selectedService) {
            setSelectedService(connectedServices[0]);
        }
    }, [connectedServices, selectedService]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = (type: LogEntry["type"], message: string) => {
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev, { type, message, timestamp: time }]);
    };

    const runTest = async () => {
        if (!selectedService) return;

        setIsRunning(true);
        setLogs([]);
        addLog("info", `Initializing diagnostic sequence for ${selectedService.toUpperCase()}...`);
        
        await new Promise(r => setTimeout(r, 800));
        addLog("info", "Establishing encrypted handshake...");
        
        try {
            const response = await api.post(`/integrations/test/${selectedService}`);
            const { aiResponse, modelUsed } = response.data;
            
            await new Promise(r => setTimeout(r, 600));
            addLog("success", `Model synchronized: ${modelUsed.toUpperCase()}`);
            
            await new Promise(r => setTimeout(r, 400));
            addLog("ai", aiResponse);
            
            await new Promise(r => setTimeout(r, 200));
            addLog("success", `Diagnostic complete. Agent [${modelUsed.split('-').join(' ').toUpperCase()}] is online.`);
        } catch (err: any) {
            addLog("error", err.response?.data?.message || "Failed to communicate with AI provider.");
            addLog("error", "Check your API key and connection status.");
        } finally {
            setIsRunning(false);
        }
    };

    const clearLogs = () => {
        setLogs([]);
    };

    return (
        <div className="mt-20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight italic">AI Diagnostic Terminal</h2>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] italic">Testing and Verification Environment</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <select 
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl px-4 h-10 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        disabled={isRunning}
                    >
                        <option value="" disabled>Select active agent...</option>
                        {connectedServices.map(id => (
                            <option key={id} value={id}>{id.toUpperCase()}</option>
                        ))}
                    </select>

                    <button 
                        onClick={runTest}
                        disabled={isRunning || !selectedService}
                        className="flex items-center gap-2 px-6 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-indigo-600/20"
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                        Run Diagnostic
                    </button>

                    <button 
                        onClick={clearLogs}
                        disabled={isRunning || logs.length === 0}
                        className="flex items-center justify-center w-10 h-10 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all text-neutral-400"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Terminal Window */}
            <div className="relative group">
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 rounded-3xl pointer-events-none z-0" />
                
                <div className="relative bg-neutral-900 dark:bg-neutral-950 rounded-3xl border border-neutral-800 dark:border-white/5 overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                            <Circle className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                            <Circle className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <Circle className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic">
                            <Command className="w-3 h-3" /> system.diag.pulse_ai
                        </div>
                        <div className="w-12" />
                    </div>

                    {/* Console Output */}
                    <div 
                        ref={scrollRef}
                        className="h-80 overflow-y-auto p-6 font-mono text-[13px] leading-relaxed custom-scrollbar"
                    >
                        {logs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 text-white">
                                <Bot className="w-12 h-12 mb-4" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Waiting for sequence trigger...</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {logs.map((log, i) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={i} 
                                        className="flex gap-4"
                                    >
                                        <span className="text-white/20 shrink-0 select-none">[{log.timestamp}]</span>
                                        <div className={cn(
                                            "flex-1",
                                            log.type === "success" && "text-emerald-400",
                                            log.type === "error" && "text-red-400",
                                            log.type === "info" && "text-indigo-400",
                                            log.type === "ai" && "text-white p-4 rounded-2xl bg-white/5 border border-white/5 italic"
                                        )}>
                                            {log.type === "ai" && (
                                                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                                    <Sparkles className="w-3 h-3" /> Agent Response
                                                </div>
                                            )}
                                            {log.message}
                                        </div>
                                    </motion.div>
                                ))}
                                {isRunning && (
                                    <div className="flex gap-4">
                                        <span className="text-white/20 animate-pulse">[_:__:__]</span>
                                        <span className="text-white/40 animate-pulse italic">Processing...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Connection Line */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-px bg-gradient-to-r from-transparent to-indigo-500/50 hidden lg:block" />
            </div>
        </div>
    );
}
