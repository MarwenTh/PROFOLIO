"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Palette, Image as ImageIcon, Wand2, ArrowLeft } from 'lucide-react';
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { OptionsProvider } from '../../../../components/reactbits/shared/context/OptionsContext/OptionsContext';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic imports for the tools to keep bundle size optimized
const BackgroundStudio = dynamic(() => import('../../../../components/reactbits/tools/background-studio/BackgroundStudio'), { ssr: false });
const ShapeMagic = dynamic(() => import('../../../../components/reactbits/tools/shape-magic/ShapeMagic'), { ssr: false });
const TextureLab = dynamic(() => import('../../../../components/reactbits/tools/texture-lab/TextureLab'), { ssr: false });

export default function CreativeStudioPage() {
    const [activeTab, setActiveTab] = useState<'background' | 'shape' | 'texture'>('background');

    return (
        <div className="relative h-screen w-screen bg-[#0D0716] text-white overflow-hidden">
            {/* Immersive Background Content */}
            <div className="absolute inset-0 z-0">
                <OptionsProvider>
                    <ChakraProvider>
                        <div className="h-full w-full custom-chakra-wrapper">
                            {activeTab === 'background' && <BackgroundStudio toolSelector={null} />}
                            {activeTab === 'shape' && <ShapeMagic toolSelector={null} />}
                            {activeTab === 'texture' && <TextureLab toolSelector={null} />}
                        </div>
                    </ChakraProvider>
                </OptionsProvider>
            </div>

            {/* Floating UI Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Floating Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 pointer-events-auto">
                    <div className="flex items-center gap-6">
                        <Link 
                            href="/dashboard"
                            className="p-2.5 bg-black/40 backdrop-blur-xl hover:bg-white/10 rounded-xl text-neutral-400 transition-all hover:text-white border border-white/5 hover:border-white/10 group flex items-center gap-2 shadow-2xl"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-semibold pr-2">Dashboard</span>
                        </Link>
                        
                        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
                            <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                <Wand2 className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-sm tracking-tight leading-none">Studio</h2>
                                <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">Workshop</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center bg-black/60 backdrop-blur-2xl p-1 rounded-2xl border border-white/10 shadow-2xl">
                        <TabButton 
                            active={activeTab === 'background'} 
                            onClick={() => setActiveTab('background')}
                            icon={Sparkles}
                            label="Backgrounds"
                        />
                        <TabButton 
                            active={activeTab === 'shape'} 
                            onClick={() => setActiveTab('shape')}
                            icon={Palette}
                            label="Shapes"
                        />
                        <TabButton 
                            active={activeTab === 'texture'} 
                            onClick={() => setActiveTab('texture')}
                            icon={ImageIcon}
                            label="Textures"
                        />
                    </div>

                    <div className="hidden sm:block w-[120px]" />
                </div>
            </div>
        </div>
    );
}

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 relative group ${
            active 
                ? 'text-white' 
                : 'text-neutral-500 hover:text-neutral-300'
        }`}
    >
        {active && (
            <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/30 rounded-xl z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
        <Icon className={`w-4 h-4 relative z-10 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="text-sm font-semibold relative z-10">{label}</span>
    </button>
);
