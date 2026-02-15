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
    Plus,
    Play
} from 'lucide-react'
import { useEditor } from '@/context/EditorContext'
import { cn } from '@/lib/utils'

type Category = 'elements' | 'magic' | 'animations' | 'templates' | 'uploads';

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
        { id: 'animations', icon: Play, label: 'Animations' },
        { id: 'templates', icon: Layout, label: 'Templates' },
        { id: 'uploads', icon: Upload, label: 'Uploads' }
    ];

    const basicElements = [
        { icon: Type, name: 'Text', type: 'text', content: 'New Text', size: { w: 200, h: 50 } },
        { icon: ImageIcon, name: 'Image', type: 'image', content: '', size: { w: 400, h: 300 } },
        { icon: Smartphone, name: 'Button', type: 'button', content: 'Button', size: { w: 120, h: 40 } },
        { icon: Layers, name: 'Container', type: 'container', content: '', size: { w: 200, h: 200 } }
    ];

    // ── Sub-category for magic filter ──
    const [magicSub, setMagicSub] = useState<'all' | 'text' | 'backgrounds' | 'components' | 'effects'>('all');

    // ── Text Animations (23) ──
    const textAnimations = [
        { icon: Sparkles, name: 'Split Text', type: 'split-text', content: 'Splitting News', size: { w: 400, h: 60 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Blur Text', type: 'blur-text', content: 'Blurry Reveal', size: { w: 400, h: 60 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Shiny Text', type: 'shiny-text', content: 'Metallic Shine', size: { w: 400, h: 60 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Gradient Text', type: 'gradient-text', content: 'Color Flow', size: { w: 400, h: 60 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Glitch Text', type: 'glitch-text', content: 'System Glitch', size: { w: 400, h: 70 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Count Up', type: 'count-up', content: '100', size: { w: 150, h: 80 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Decrypted Text', type: 'decrypted-text', content: 'Decrypting...', size: { w: 400, h: 60 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Rotating Text', type: 'rotating-text', content: 'Wow', size: { w: 300, h: 60 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Fuzzy Text', type: 'fuzzy-text', content: 'Fuzzy Effect', size: { w: 400, h: 80 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Scrambled Text', type: 'scrambled-text', content: 'Scrambled', size: { w: 400, h: 60 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Circular Text', type: 'circular-text', content: 'CIRCULAR TEXT • REACT BITS • ', size: { w: 200, h: 200 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Text Type', type: 'text-type', content: 'Typing effect...', size: { w: 400, h: 60 }, sub: 'text' as const },
        { icon: Sparkles, name: 'True Focus', type: 'true-focus', content: 'True Focus Effect', size: { w: 400, h: 60 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Scroll Float', type: 'scroll-float', content: 'Floating Text', size: { w: 400, h: 80 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Scroll Reveal', type: 'scroll-reveal', content: 'Scroll to Reveal', size: { w: 400, h: 80 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Scroll Velocity', type: 'scroll-velocity', content: 'React Bits', size: { w: 600, h: 80 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Shuffle', type: 'shuffle', content: 'Shuffle Me', size: { w: 300, h: 60 }, sub: 'text' as const },
        { icon: Sparkles, name: 'Shiny Button', type: 'shiny-button', content: 'Click Me!', size: { w: 160, h: 50 }, sub: 'text' as const },
    ];

    // ── Backgrounds (34) ──
    const backgroundElements = [
        { icon: Grid, name: 'Aurora', type: 'aurora-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Balatro', type: 'balatro-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Ballpit', type: 'ballpit-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Beams', type: 'beams-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Color Bends', type: 'color-bends-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Dark Veil', type: 'dark-veil-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Dither', type: 'dither-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Dot Grid', type: 'dot-grid-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Faulty Terminal', type: 'faulty-terminal-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Floating Lines', type: 'floating-lines-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Galaxy', type: 'galaxy-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Gradient Blinds', type: 'gradient-blinds-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Grainient', type: 'grainient-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Grid Distortion', type: 'grid-distortion-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Grid Motion', type: 'grid-motion-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Grid Scan', type: 'grid-scan-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Hyperspeed', type: 'hyperspeed-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Iridescence', type: 'iridescence-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Letter Glitch', type: 'letter-glitch-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Light Pillar', type: 'light-pillar-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Light Rays', type: 'light-rays-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Lightning', type: 'lightning-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Liquid Chrome', type: 'liquid-chrome', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Liquid Ether', type: 'liquid-ether-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Orb', type: 'orb-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Particles', type: 'particles-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Pixel Blast', type: 'pixel-blast-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Pixel Snow', type: 'pixel-snow-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Plasma', type: 'plasma-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Prism', type: 'prism-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Prismatic Burst', type: 'prismatic-burst-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Ripple Grid', type: 'ripple-grid-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Silk', type: 'silk-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Squares', type: 'squares-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Threads', type: 'threads-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
        { icon: Grid, name: 'Waves', type: 'waves-bg', content: '', size: { w: 600, h: 400 }, sub: 'backgrounds' as const },
    ];

    // ── UI Components (35) ──
    const uiComponents = [
        { icon: Layers, name: 'Spotlight Card', type: 'spotlight-card', content: 'Spotlight Content', size: { w: 300, h: 200 }, sub: 'components' as const },
        { icon: Layers, name: 'Tilted Card', type: 'tilted-card', content: '3D Card Content', size: { w: 300, h: 200 }, sub: 'components' as const },
        { icon: Layers, name: 'Decay Card', type: 'decay-card', content: '', size: { w: 300, h: 200 }, sub: 'components' as const },
        { icon: Layers, name: 'Pixel Card', type: 'pixel-card', content: '', size: { w: 300, h: 200 }, sub: 'components' as const },
        { icon: Layers, name: 'Profile Card', type: 'profile-card', content: '', size: { w: 300, h: 350 }, sub: 'components' as const },
        { icon: Layers, name: 'Reflective Card', type: 'reflective-card', content: '', size: { w: 300, h: 200 }, sub: 'components' as const },
        { icon: Layers, name: 'Bounce Cards', type: 'bounce-cards', content: '', size: { w: 500, h: 300 }, sub: 'components' as const },
        { icon: Layers, name: 'Card Swap', type: 'card-swap', content: '', size: { w: 400, h: 300 }, sub: 'components' as const },
        { icon: Layers, name: 'Animated List', type: 'animated-list', content: '', size: { w: 300, h: 300 }, sub: 'components' as const },
        { icon: Layers, name: 'Stack', type: 'stack', content: '', size: { w: 300, h: 300 }, sub: 'components' as const },
        { icon: Layers, name: 'Folder', type: 'folder', content: '', size: { w: 200, h: 200 }, sub: 'components' as const },
        { icon: Layers, name: 'Dock', type: 'dock', content: '', size: { w: 400, h: 80 }, sub: 'components' as const },
        { icon: Layers, name: 'Elastic Slider', type: 'elastic-slider', content: '', size: { w: 400, h: 100 }, sub: 'components' as const },
        { icon: Layers, name: 'Carousel', type: 'carousel', content: '', size: { w: 600, h: 400 }, sub: 'components' as const },
        { icon: Layers, name: 'Chroma Grid', type: 'chroma-grid', content: '', size: { w: 500, h: 400 }, sub: 'components' as const },
        { icon: Layers, name: 'Circular Gallery', type: 'circular-gallery', content: '', size: { w: 600, h: 400 }, sub: 'components' as const },
        { icon: Layers, name: 'Counter', type: 'counter', content: '', size: { w: 200, h: 100 }, sub: 'components' as const },
        { icon: Layers, name: 'Dome Gallery', type: 'dome-gallery', content: '', size: { w: 600, h: 400 }, sub: 'components' as const },
        { icon: Layers, name: 'Flowing Menu', type: 'flowing-menu', content: '', size: { w: 400, h: 300 }, sub: 'components' as const },
        { icon: Layers, name: 'Fluid Glass', type: 'fluid-glass', content: '', size: { w: 300, h: 200 }, sub: 'components' as const },
        { icon: Layers, name: 'Flying Posters', type: 'flying-posters', content: '', size: { w: 600, h: 400 }, sub: 'components' as const },
        { icon: Layers, name: 'Glass Icons', type: 'glass-icons', content: '', size: { w: 300, h: 200 }, sub: 'components' as const },
        { icon: Layers, name: 'Glass Surface', type: 'glass-surface', content: '', size: { w: 300, h: 200 }, sub: 'components' as const },
        { icon: Layers, name: 'Infinite Menu', type: 'infinite-menu', content: '', size: { w: 400, h: 300 }, sub: 'components' as const },
        { icon: Layers, name: 'Lanyard', type: 'lanyard', content: '', size: { w: 300, h: 400 }, sub: 'components' as const },
        { icon: Layers, name: 'Magic Bento', type: 'magic-bento', content: '', size: { w: 600, h: 400 }, sub: 'components' as const },
        { icon: Layers, name: 'Masonry', type: 'masonry', content: '', size: { w: 600, h: 400 }, sub: 'components' as const },
        { icon: Layers, name: 'Model Viewer', type: 'model-viewer', content: '', size: { w: 400, h: 400 }, sub: 'components' as const },
        { icon: Layers, name: 'Scroll Stack', type: 'scroll-stack', content: '', size: { w: 400, h: 400 }, sub: 'components' as const },
        { icon: Layers, name: 'Stepper', type: 'stepper', content: '', size: { w: 400, h: 80 }, sub: 'components' as const },
    ];

    // ── Animations / Effects (28) ──
    const effectElements = [
        { icon: Play, name: 'Antigravity', type: 'antigravity', content: '', size: { w: 600, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Blob Cursor', type: 'blob-cursor', content: '', size: { w: 600, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Click Spark', type: 'click-spark', content: '', size: { w: 400, h: 300 }, sub: 'effects' as const },
        { icon: Play, name: 'Crosshair', type: 'crosshair', content: '', size: { w: 400, h: 300 }, sub: 'effects' as const },
        { icon: Play, name: 'Cubes', type: 'cubes', content: '', size: { w: 400, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Electric Border', type: 'electric-border', content: 'Electric', size: { w: 300, h: 200 }, sub: 'effects' as const },
        { icon: Play, name: 'Glare Hover', type: 'glare-hover', content: 'Glare', size: { w: 300, h: 200 }, sub: 'effects' as const },
        { icon: Play, name: 'Image Trail', type: 'image-trail', content: '', size: { w: 600, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Laser Flow', type: 'laser-flow', content: '', size: { w: 600, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Logo Loop', type: 'logo-loop', content: '', size: { w: 600, h: 100 }, sub: 'effects' as const },
        { icon: Play, name: 'Magnet', type: 'magnet', content: 'Magnet', size: { w: 200, h: 60 }, sub: 'effects' as const },
        { icon: Play, name: 'Magnet Lines', type: 'magnet-lines', content: '', size: { w: 600, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Meta Balls', type: 'meta-balls', content: '', size: { w: 600, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Metallic Paint', type: 'metallic-paint', content: '', size: { w: 400, h: 300 }, sub: 'effects' as const },
        { icon: Play, name: 'Noise', type: 'noise', content: '', size: { w: 600, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Pixel Trail', type: 'pixel-trail', content: '', size: { w: 600, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Pixel Transition', type: 'pixel-transition', content: '', size: { w: 400, h: 300 }, sub: 'effects' as const },
        { icon: Play, name: 'Ribbons', type: 'ribbons', content: '', size: { w: 600, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Shape Blur', type: 'shape-blur', content: '', size: { w: 400, h: 300 }, sub: 'effects' as const },
        { icon: Play, name: 'Splash Cursor', type: 'splash-cursor', content: '', size: { w: 600, h: 400 }, sub: 'effects' as const },
        { icon: Play, name: 'Star Border', type: 'star-border', content: 'Star Border', size: { w: 300, h: 200 }, sub: 'effects' as const },
        { icon: Play, name: 'Sticker Peel', type: 'sticker-peel', content: '', size: { w: 300, h: 200 }, sub: 'effects' as const },
    ];

    // ── Merged magic list for filtering/search ──
    const allMagicElements = [...textAnimations, ...backgroundElements, ...uiComponents, ...effectElements];
    const filteredMagic = allMagicElements.filter(el => {
        const matchesSearch = !searchQuery || el.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSub = magicSub === 'all' || el.sub === magicSub;
        return matchesSearch && matchesSub;
    });

    const magicSubCategories = [
        { id: 'all', label: 'All', count: allMagicElements.length },
        { id: 'text', label: 'Text', count: textAnimations.length },
        { id: 'backgrounds', label: 'BGs', count: backgroundElements.length },
        { id: 'components', label: 'UI', count: uiComponents.length },
        { id: 'effects', label: 'FX', count: effectElements.length },
    ];

    const animations = [
        { name: 'Fade In', type: 'fade', engine: 'framer', description: 'Framer: Smooth entrance' },
        { name: 'Slide Up', type: 'slide-up', engine: 'framer', description: 'Framer: Moves from bottom' },
        { name: 'Scale Up', type: 'scale-up', engine: 'framer', description: 'Framer: Grows into place' },
        { name: 'Bounce', type: 'bounce', engine: 'framer', description: 'Framer: Playful jump' },
        { name: 'Rotate', type: 'rotate', engine: 'framer', description: 'Framer: Full spin' },
        { name: 'GSAP Pulse', type: 'pulse', engine: 'gsap', description: 'GSAP: Heartbeat loop' },
        { name: 'GSAP Float', type: 'float', engine: 'gsap', description: 'GSAP: Floating air' },
        { name: 'GSAP Wiggle', type: 'wiggle', engine: 'gsap', description: 'GSAP: Playful shake' },
        { name: 'GSAP Spin', type: 'spin-loop', engine: 'gsap', description: 'GSAP: Continuous spin' }
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
                                        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-1">
                                            <p className="text-[10px] text-indigo-300 font-medium">✨ {allMagicElements.length} React Bits Components</p>
                                        </div>
                                        {/* Sub-category filter pills */}
                                        <div className="flex gap-1.5 mb-2 flex-wrap">
                                            {magicSubCategories.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => setMagicSub(sub.id as any)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all",
                                                        magicSub === sub.id
                                                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                                            : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                                                    )}
                                                >
                                                    {sub.label} <span className="opacity-50 ml-1">{sub.count}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {filteredMagic.map((el) => (
                                            <button
                                                key={el.name}
                                                onClick={() => handleAddElement(el.type, el.content, el.size)}
                                                className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#2a2a2b] to-[#252526] border border-white/5 hover:border-indigo-500/50 hover:from-indigo-500/10 transition-all active:scale-[0.98]"
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                                    el.sub === 'text' ? "bg-purple-500/10" :
                                                    el.sub === 'backgrounds' ? "bg-emerald-500/10" :
                                                    el.sub === 'components' ? "bg-blue-500/10" :
                                                    "bg-orange-500/10"
                                                )}>
                                                    <el.icon className={cn(
                                                        "w-5 h-5",
                                                        el.sub === 'text' ? "text-purple-400" :
                                                        el.sub === 'backgrounds' ? "text-emerald-400" :
                                                        el.sub === 'components' ? "text-blue-400" :
                                                        "text-orange-400"
                                                    )} />
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-[11px] text-white font-bold block">{el.name}</span>
                                                    <span className="text-[9px] text-neutral-500 uppercase tracking-tight">
                                                        {el.sub === 'text' ? 'Text Animation' :
                                                         el.sub === 'backgrounds' ? 'Background' :
                                                         el.sub === 'components' ? 'UI Component' :
                                                         'Animation Effect'}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                        {filteredMagic.length === 0 && (
                                            <div className="text-center py-8 text-neutral-500 text-xs">
                                                No components match your search.
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {category === 'animations' && (
                                    <motion.div 
                                        key="animations"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="grid grid-cols-2 gap-3"
                                    >
                                        {animations.map((anim) => (
                                            <div
                                                key={anim.name}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('application/json', JSON.stringify({
                                                        type: 'animation',
                                                        animation: { 
                                                            type: anim.type, 
                                                            engine: anim.engine,
                                                            duration: anim.engine === 'gsap' ? 1.5 : 0.8, 
                                                            delay: 0 
                                                        }
                                                    }));
                                                }}
                                                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#2a2a2b] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/[0.03] transition-all group cursor-grab active:cursor-grabbing"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
                                                    <Play className="w-5 h-5 text-orange-400" />
                                                </div>
                                                <span className="text-[10px] text-neutral-400 group-hover:text-white font-semibold">{anim.name}</span>
                                                <span className="text-[8px] text-neutral-600 mt-1 uppercase">{anim.description}</span>
                                            </div>
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
