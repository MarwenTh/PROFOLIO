"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, 
    Search, 
    Layout, 
    Type, 
    Image as ImageIcon, 
    Smartphone, 
    Layers, 
    Sparkles, 
    Grid, 
    Shapes,
    Upload,
    Plus
} from 'lucide-react'
import { useEditor } from '@/context/EditorContext'
import { cn } from '@/lib/utils'

type Category = 'elements' | 'magic' | 'templates' | 'uploads';

export const ComponentsLibrary = () => {
    const { activeTool, setActiveTool, addComponent, addSectionWithTemplate, sections, selectedSectionId, setMediaModalOpen } = useEditor();
    const [category, setCategory] = useState<Category>('elements');
    const [searchQuery, setSearchQuery] = useState('');

    const isOpen = activeTool === 'components';

    const handleAddElement = (type: any, content: any, size: { w: number, h: number }) => {
        const targetSectionId = selectedSectionId || sections[0]?.id;
        if (!targetSectionId) return;
        
        addComponent(targetSectionId, {
            type,
            content,
            styles: {},
            width: size.w,
            height: size.h,
            x: 100,
            y: 100
        });
    };

    const categories = [
        { id: 'elements', icon: Shapes, label: 'Elements' },
        { id: 'magic', icon: Sparkles, label: 'Magic' },
        { id: 'templates', icon: Layout, label: 'Templates' },
        { id: 'uploads', icon: Upload, label: 'Uploads' }
    ];

    const basicElements = [
        { icon: Type, name: 'Text', type: 'text', content: 'New Text', size: { w: 200, h: 50 } },
        { icon: ImageIcon, name: 'Image', type: 'image', content: '', size: { w: 400, h: 300 } },
        { icon: Smartphone, name: 'Button', type: 'button', content: 'Button', size: { w: 120, h: 40 } },
        { icon: Layers, name: 'Container', type: 'container', content: '', size: { w: 200, h: 200 } }
    ];

    const magicElements = [
        { icon: Sparkles, name: 'Split Text', type: 'split-text', content: 'Splitting News', size: { w: 400, h: 60 } },
        { icon: Sparkles, name: 'Blur Text', type: 'blur-text', content: 'Blurry Reveal', size: { w: 400, h: 60 } },
        { icon: Sparkles, name: 'Shiny Text', type: 'shiny-text', content: 'Metallic Shine', size: { w: 400, h: 60 } },
        { icon: Sparkles, name: 'Gradient Text', type: 'gradient-text', content: 'Color Flow', size: { w: 400, h: 60 } },
        { icon: Sparkles, name: 'Glitch Text', type: 'glitch-text', content: 'System Glitch', size: { w: 400, h: 70 } },
        { icon: Sparkles, name: 'Count Up', type: 'count-up', content: '100', size: { w: 150, h: 80 } },
        { icon: Sparkles, name: 'Aurora BG', type: 'aurora-bg', content: '', size: { w: 600, h: 400 } },
        { icon: Sparkles, name: 'Squares BG', type: 'squares-bg', content: '', size: { w: 600, h: 400 } },
        { icon: Sparkles, name: 'Hyperspeed BG', type: 'hyperspeed-bg', content: '', size: { w: 600, h: 400 } },
        { icon: Sparkles, name: 'Waves BG', type: 'waves-bg', content: '', size: { w: 600, h: 400 } },
        { icon: Sparkles, name: 'Liquid Chrome', type: 'liquid-chrome', content: '', size: { w: 600, h: 400 } },
        { icon: Sparkles, name: 'Shiny Button', type: 'shiny-button', content: 'Click Me!', size: { w: 160, h: 50 } },
        { icon: Sparkles, name: 'Spotlight Card', type: 'spotlight-card', content: 'Spotlight Content', size: { w: 300, h: 200 } },
        { icon: Sparkles, name: 'Tilted Card', type: 'tilted-card', content: '3D Card Content', size: { w: 300, h: 200 } }
    ];

    const templates = [
        {
            id: 'hero-minimal',
            name: 'Minimal Hero',
            preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80',
            description: 'Simple clean header'
        },
        {
            id: 'feature-grid',
            name: 'Feature Grid',
            preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
            description: 'Three columns grid'
        }
    ];

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ x: -400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -400, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute left-2 top-0 bottom-0 w-[420px] bg-[#1e1e1e] border border-white/10 rounded-r-2xl z-[90] flex overflow-hidden shadow-2xl"
                >
                    {/* Left Mini-Sidebar Categories */}
                    <div className="w-[72px] bg-[#1a1a1b] border-r border-white/5 flex flex-col py-4 px-1 gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id as Category)}
                                className={cn(
                                    "flex flex-col items-center justify-center py-3 rounded-lg transition-all group",
                                    category === cat.id ? "bg-indigo-500/10 text-indigo-400" : "text-neutral-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <cat.icon className={cn("w-5 h-5 mb-1", category === cat.id ? "text-indigo-400" : "text-neutral-500 group-hover:text-white")} />
                                <span className="text-[9px] font-medium">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between border-b border-white/5">
                            <span className="text-white font-bold text-sm tracking-tight">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                            <button 
                                onClick={() => setActiveTool('select')}
                                className="p-1 hover:bg-white/5 rounded-md text-neutral-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="p-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={`Search ${category}...`}
                                    className="w-full bg-[#141415] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Category Content */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {category === 'elements' && (
                                    <motion.div 
                                        key="elements"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="grid grid-cols-2 gap-3"
                                    >
                                        {basicElements.map((el) => (
                                            <button
                                                key={el.name}
                                                onClick={() => handleAddElement(el.type, el.content, el.size)}
                                                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#2a2a2b] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/[0.03] transition-all group relative overflow-hidden active:scale-95"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                                                    <el.icon className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <span className="text-[10px] text-neutral-400 group-hover:text-white font-semibold">{el.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {category === 'magic' && (
                                    <motion.div 
                                        key="magic"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="grid grid-cols-1 gap-3"
                                    >
                                        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-2">
                                            <p className="text-[10px] text-indigo-300 font-medium">✨ Powered by ReactBits</p>
                                        </div>
                                        {magicElements.map((el) => (
                                            <button
                                                key={el.name}
                                                onClick={() => handleAddElement(el.type, el.content, el.size)}
                                                className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#2a2a2b] to-[#252526] border border-white/5 hover:border-indigo-500/50 hover:from-indigo-500/10 transition-all active:scale-[0.98]"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-orange-400" />
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-[11px] text-white font-bold block">{el.name}</span>
                                                    <span className="text-[9px] text-neutral-500 uppercase tracking-tight">Animated Effect</span>
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {category === 'templates' && (
                                    <motion.div 
                                        key="templates"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="space-y-4"
                                    >
                                        {templates.map((tpl) => (
                                            <div 
                                                key={tpl.id}
                                                className="group relative rounded-2xl overflow-hidden border border-white/5 cursor-pointer bg-[#2a2a2b] shadow-lg active:scale-[0.99] transition-transform"
                                                onClick={() => addSectionWithTemplate(tpl.name)}
                                            >
                                                <div className="aspect-video w-full bg-neutral-800 relative">
                                                    <img 
                                                        src={tpl.preview} 
                                                        alt={tpl.name}
                                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                        <Plus className="w-8 h-8 text-white transform scale-50 group-hover:scale-100 transition-transform" />
                                                    </div>
                                                </div>
                                                <div className="p-3 border-t border-white/5">
                                                    <p className="text-white text-[11px] font-bold">{tpl.name}</p>
                                                    <p className="text-neutral-500 text-[9px] mt-0.5">{tpl.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {category === 'uploads' && (
                                    <motion.div 
                                        key="uploads"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex flex-col items-center justify-center py-10 px-4 space-y-4 text-center border-2 border-dashed border-white/5 rounded-2xl"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-neutral-500" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-white font-bold">Upload your assets</p>
                                            <p className="text-[10px] text-neutral-500 mt-1 pb-4">Images, videos, or icons</p>
                                            <button 
                                                onClick={() => setMediaModalOpen(true)}
                                                className="px-6 py-2 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-xl"
                                            >
                                                Open Library
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
