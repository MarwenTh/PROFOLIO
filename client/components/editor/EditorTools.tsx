"use client";

import React from 'react';
import { Type, Image as ImageIcon, Box, MousePointer2, Smartphone, Plus } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';

export const EditorTools = () => {
    const { addComponent, sections, addSection, setMediaModalOpen, selectedSectionId } = useEditor();

    const handleAdd = (type: string, defaultContent: any, defaultSize: any) => {
        // Target the selected section or the first section
        const targetSectionId = selectedSectionId || sections[0]?.id;
        if (!targetSectionId) {
            alert("Add a section first!");
            return;
        }

        addComponent(targetSectionId, {
            type: type as any,
            content: defaultContent,
            styles: {},
            width: defaultSize.w,
            height: defaultSize.h,
            x: 50,
            y: 50
        });
    };

    return (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-[#1e1e1e] border border-white/10 p-2 rounded-xl shadow-xl z-[100]">
            <ToolButton icon={MousePointer2} label="Select" active />
            <div className="h-px bg-white/10 w-full my-1" />
            
            {/* Draggables */}
            <ToolButton 
                icon={Type} 
                label="Text" 
                onClick={() => handleAdd('text', 'New Text', { w: 200, h: 50 })}
            />
            <ToolButton 
                icon={ImageIcon} 
                label="Image" 
                onClick={() => setMediaModalOpen(true)}
            />
            <ToolButton 
                icon={Box} 
                label="Box" 
                onClick={() => handleAdd('container', '', { w: 150, h: 150 })}
            />
            <ToolButton 
                icon={Smartphone} 
                label="Button" 
                onClick={() => handleAdd('button', 'Button', { w: 120, h: 40 })}
            />
             <div className="h-px bg-white/10 w-full my-1" />
             <ToolButton 
                icon={Plus} 
                label="Add Section" 
                onClick={() => addSection()}
                className="text-indigo-400 hover:bg-indigo-500/10"
            />
        </div>
    );
};

const ToolButton = ({ icon: Icon, label, onClick, active, className }: any) => (
    <button 
        onClick={onClick}
        className={cn(
            "p-3 rounded-lg flex items-center justify-center transition-colors group relative",
            active ? "bg-indigo-500 text-white" : "text-neutral-400 hover:bg-white/10 hover:text-white",
            className
        )}
        title={label}
    >
        <Icon className="w-5 h-5" />
    </button>
);
