"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EditorSection } from '@/lib/editor-types';
import { useEditor } from '@/context/EditorContext';
import { CanvasElement } from './CanvasElement';
import { Settings, Plus, GripVertical } from 'lucide-react';

interface SectionProps {
  section: EditorSection;
  index: number;
}

export const Section = ({ section, index }: SectionProps) => {
    const { selectSection, selectedSectionId, addSection, addComponent } = useEditor();
    const isSelected = selectedSectionId === section.id;

    return (
        <div 
            className={cn(
                "relative group transition-all duration-200",
                isSelected ? "ring-2 ring-indigo-500 ring-inset" : "hover:ring-1 hover:ring-indigo-500/30 ring-inset"
            )}
            onClick={(e) => {
                e.stopPropagation();
                selectSection(section.id);
            }}
            style={{
                height: section.height,
                ...section.styles
            }}
        >
            {/* Elements Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Visual Grid for section? */}
            </div>

            <div className="relative w-full h-full">
                {section.components.map(component => (
                    <CanvasElement key={component.id} component={component} />
                ))}
            </div>

            {/* Section Controls (Visible on hover or selection) */}
            <div className={cn(
                "absolute -right-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-2",
                isSelected && "opacity-100"
            )}>
                 <button className="p-2 bg-[#1e1e1e] border border-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-grab">
                    <GripVertical className="w-4 h-4" />
                </button>
                <button className="p-2 bg-[#1e1e1e] border border-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => addSection(index + 1)}
                    className="p-2 bg-[#1e1e1e] border border-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Drag Target Helper */}
            <div className="absolute inset-0 pointer-events-none z-10 hidden group-hover/drop:block bg-indigo-500/10 border-2 border-indigo-500/50" />
        </div>
    );
};
