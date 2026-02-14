"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { EditorComponent } from '@/lib/editor-types';
import { cn } from '@/lib/utils';
import { useEditor } from '@/context/EditorContext';
import { Trash2, Move } from 'lucide-react';
import { ShinyText } from '../reactbits/ShinyText';
import { SplitText } from '../reactbits/SplitText';
import { Aurora } from '../reactbits/Aurora';
import { ShinyButton } from '../reactbits/ShinyButton';
import { BlurText } from '../reactbits/BlurText';
import { GradientText } from '../reactbits/GradientText';
import { CountUp } from '../reactbits/CountUp';
import { Squares } from '../reactbits/Squares';
import { Hyperspeed } from '../reactbits/Hyperspeed';
import { Waves } from '../reactbits/Waves';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { TiltedCard } from '../reactbits/TiltedCard';
import { LiquidChrome } from '../reactbits/LiquidChrome';
import { GlitchText } from '../reactbits/GlitchText';

interface CanvasElementProps {
  component: EditorComponent;
}

export const CanvasElement = ({ component }: CanvasElementProps) => {
    const { selectedId, selectComponent, updateComponent, removeComponent, scale, device } = useEditor();
    const isSelected = selectedId === component.id;
    const elementRef = useRef<HTMLDivElement>(null);
    
    const [isResizing, setIsResizing] = useState(false);
    const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
    const [size, setSize] = useState({ width: component.width, height: component.height });

    const displayData = (device !== 'desktop' && component.responsive?.[device]) 
      ? { ...component, ...component.responsive[device] }
      : component;

    // Sync internal size when component props change
    useEffect(() => {
        if (!isResizing) {
            setSize({ width: displayData.width, height: displayData.height });
        }
    }, [displayData.width, displayData.height, isResizing]);

    const handleResize = (event: any, info: any) => {
        const newWidth = Math.max(50, initialSize.width + info.offset.x / scale);
        const newHeight = Math.max(20, initialSize.height + info.offset.y / scale);
        setSize({ width: newWidth, height: newHeight });
    };

    const handleResizeEnd = () => {
        setIsResizing(false);
        updateComponent(component.id, { width: size.width, height: size.height });
    };

    const handleDragEnd = (event: any, info: any) => {
        const newX = displayData.x + info.offset.x;
        const newY = displayData.y + info.offset.y;
        updateComponent(component.id, { x: newX, y: newY });
    };

    return (
      <motion.div
        ref={elementRef}
        drag={isResizing ? false : (isSelected ? true : false)}
        dragMomentum={false} 
        dragElastic={0}
        onDragStart={() => selectComponent(component.id)}
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(component.id);
        }}
        initial={{ x: displayData.x, y: displayData.y, opacity: 0, scale: 0.9 }}
        animate={{ 
          x: displayData.x, 
          y: displayData.y, 
          width: isResizing ? size.width : displayData.width, 
          height: isResizing ? size.height : displayData.height,
          opacity: 1, 
          scale: 1,
          zIndex: isSelected ? 1000 : (component.zIndex || 1)
        }}
        transition={isResizing ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.4 }}
        style={{
          position: 'absolute',
          ...component.styles
        }}
      className={cn(
        "group cursor-pointer select-none",
        isSelected ? "ring-2 ring-indigo-500 z-50" : "hover:ring-1 hover:ring-indigo-500/50"
      )}
    >
        {/* Render Content Based on Type */}
        <div className="w-full h-full overflow-hidden relative pointer-events-none">
            {renderContent(component)}
        </div>

        {/* Selection/Hover Controls */}
        {isSelected && (
            <>
                {/* Resize Handles */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-indigo-500 rounded-full" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-indigo-500 rounded-full" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-indigo-500 rounded-full" />
                
                {/* Active Resize Handle (Bottom Right) */}
                <motion.div 
                    drag
                    dragMomentum={false}
                    dragElastic={0}
                    onDragStart={(e) => {
                        e.stopPropagation();
                        setIsResizing(true);
                        setInitialSize({ width: size.width, height: size.height });
                    }}
                    onDrag={handleResize}
                    onDragEnd={(e) => {
                        e.stopPropagation();
                        handleResizeEnd();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-nwse-resize z-[60]" 
                />

                {/* Quick Actions */}
                <div className="absolute -top-8 right-0 flex items-center gap-1 bg-indigo-500 text-white rounded px-2 py-1 shadow-lg transform scale-0 group-hover:scale-100 transition-transform origin-bottom">
                     <Move className="w-3 h-3" />
                     <div className="w-px h-3 bg-white/20 mx-1" />
                     <button 
                        onClick={(e) => { e.stopPropagation(); removeComponent(component.id); }}
                        className="hover:text-red-200"
                     >
                        <Trash2 className="w-3 h-3" />
                     </button>
                </div>
            </>
        )}
    </motion.div>
  );
};


const renderContent = (component: EditorComponent) => {
    switch (component.type) {
        case 'text':
            return <p style={{ fontSize: 'inherit', color: 'inherit' }}>{component.content || 'Double click to edit'}</p>;
        case 'split-text':
            return <SplitText text={component.content || 'Splitting Text'} />;
        case 'shiny-text':
            return <ShinyText text={component.content || 'Metallic Shine'} />;
        case 'blur-text':
            return <BlurText text={component.content || 'Blurry Reveal'} />;
        case 'gradient-text':
            return <GradientText text={component.content || 'Color Flow'} />;
        case 'glitch-text':
            return <GlitchText text={component.content || 'System Glitch'} />;
        case 'count-up':
            return <CountUp to={parseInt(component.content) || 100} />;
        case 'aurora-bg':
            return <Aurora />;
        case 'squares-bg':
            return <Squares />;
        case 'hyperspeed-bg':
            return <Hyperspeed />;
        case 'waves-bg':
            return <Waves />;
        case 'liquid-chrome':
            return <LiquidChrome />;
        case 'shiny-button':
            return <ShinyButton text={component.content || 'Shiny Button'} />;
        case 'spotlight-card':
            return <SpotlightCard>{component.content || 'Spotlight Card'}</SpotlightCard>;
        case 'tilted-card':
            return <TiltedCard>{component.content || '3D Tilted Card'}</TiltedCard>;
        case 'button':
            return (
                <button className="w-full h-full px-4 py-2 bg-indigo-500 text-white rounded shadow-sm flex items-center justify-center">
                    {component.content || 'Button'}
                </button>
            );
        case 'image':
            return (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                    src={component.content || 'https://via.placeholder.com/150'} 
                    alt="placeholder" 
                    className="w-full h-full object-cover pointer-events-none" 
                />
            );
        case 'container':
        case 'row':
        case 'column':
            return <div className="w-full h-full border border-dashed border-neutral-700 bg-neutral-900/50" />;
        default:
            return <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-500">{component.type}</div>;
    }
};
