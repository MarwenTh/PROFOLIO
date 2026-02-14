"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useEditor } from '@/context/EditorContext';
import { Section } from './Section';

export const Canvas = () => {
    const { sections, scale, setScale, selectSection, device } = useEditor();
    const containerRef = useRef<HTMLDivElement>(null);

    // Device dimensions
    const deviceWidths = {
        mobile: 375,
        tablet: 768,
        desktop: 1280
    };

    const currentWidth = deviceWidths[device] || deviceWidths.desktop;

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const newScale = Math.min(Math.max(scale - e.deltaY * 0.001, 0.1), 5);
            setScale(newScale);
        }
    };

    return (
        <div 
            ref={containerRef}
            className="flex-1 w-full h-full bg-[#1e1e1e] overflow-y-auto relative custom-scrollbar"
            onWheel={handleWheel}
            onClick={() => selectSection(null)}
        >
            <div className="min-h-full w-full py-20 flex flex-col items-center">
                <motion.div
                    className="bg-white shadow-2xl relative"
                    animate={{
                        width: currentWidth,
                        scale: scale,
                    }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    style={{
                        transformOrigin: 'top center',
                    }}
                >
                    {sections.map((section, index) => (
                        <Section key={section.id} section={section} index={index} />
                    ))}
                </motion.div>
            </div>
            
            {/* HUD */}
            <div className="fixed bottom-4 right-[340px] bg-neutral-800 text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 z-50">
                {Math.round(scale * 100)}% | {device.toUpperCase()}
            </div>
        </div>
    );
};
