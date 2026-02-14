"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Image as ImageIcon, Box, MousePointer2, Smartphone, Plus, LayoutDashboard } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import { ComponentsLibrary } from './ComponentsLibrary';
import { toast } from 'sonner';

export const EditorTools = () => {
    const { addComponent, sections, addSection, setMediaModalOpen, selectedSectionId, activeTool, setActiveTool } = useEditor();

    const handleAdd = (type: string, defaultContent: any, defaultSize: any) => {
        const targetSectionId = selectedSectionId || sections[0]?.id;
        if (!targetSectionId) {
            toast.error("Add a section first!", {
                description: "You need a section to place components."
            });
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
        <div className="absolute left-4 inset-y-0 flex items-center z-[100] pointer-events-none">
            <div className="flex flex-col gap-2 bg-[#1e1e1e] border border-white/10 p-2 rounded-xl shadow-xl pointer-events-auto">
                <ToolButton 
                    icon={MousePointer2} 
                    label="Select" 
                    active={activeTool === 'select'} 
                    onClick={() => setActiveTool('select')}
                />
                <div className="h-px bg-white/10 w-full my-1" />
                
                {/* Library Toggle */}
                <ToolButton 
                    icon={LayoutDashboard} 
                    label="Components" 
                    active={activeTool === 'components'} 
                    onClick={() => setActiveTool(activeTool === 'components' ? 'select' : 'components')}
                    className={cn(activeTool === 'components' && "text-indigo-400")}
                />

                <div className="h-px bg-white/10 w-full my-1" />
                
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

            {/* Components Drawer Overlay */}
            <div className="pointer-events-auto h-full">
                <ComponentsLibrary />
            </div>
        </div>
    );
};

const Tooltip = ({ label }: { label: string }) => (
    <motion.div
        initial={{ opacity: 0, x: -10, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -10, scale: 0.95 }}
        className="absolute left-full ml-3 px-3 py-1.5 bg-neutral-900 border border-white/10 text-white text-[11px] font-medium rounded-lg shadow-xl whitespace-nowrap z-[110] pointer-events-none"
    >
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-neutral-900 border-l border-b border-white/10 rotate-45" />
        {label}
    </motion.div>
);

const ToolButton = ({ icon: Icon, label, onClick, active, className }: any) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div className="relative flex items-center">
            <button 
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "p-3 rounded-lg flex items-center justify-center transition-colors group",
                    active ? "bg-indigo-500 text-white" : "text-neutral-400 hover:bg-white/10 hover:text-white",
                    className
                )}
            >
                <Icon className="w-5 h-5" />
            </button>
            <AnimatePresence>
                {isHovered && <Tooltip label={label} />}
            </AnimatePresence>
        </div>
    );
};
