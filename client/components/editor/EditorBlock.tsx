"use client";
import React, { useCallback, useRef, useState } from "react";
import { EditorComponent, ComponentType } from "@/lib/editor-types";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { GripVertical, Move } from "lucide-react";

interface EditorBlockProps {
  component: EditorComponent;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<EditorComponent>) => void;
  isDragging?: boolean;
  isPreview: boolean;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

export const EditorBlock = ({ 
  component, 
  selectedId, 
  onSelect, 
  onUpdate,
  isDragging,
  isPreview,
  canvasRef
}: EditorBlockProps) => {
  const isSelected = selectedId === component.id;
  const elementRef = useRef<HTMLDivElement>(null);
  const [isMoving, setIsMoving] = useState(false);
  const moveStartRef = useRef<{ startX: number; startY: number; origLeft: number; origTop: number } | null>(null);

  // ─── Drag-to-Move Logic ───
  const handleMoveStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(component.id);

    const left = parseFloat(component.styles.left) || 0;
    const top = parseFloat(component.styles.top) || 0;

    moveStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origLeft: left,
      origTop: top
    };
    setIsMoving(true);

    const handleMouseMove = (ev: MouseEvent) => {
      if (!moveStartRef.current) return;
      const dx = ev.clientX - moveStartRef.current.startX;
      const dy = ev.clientY - moveStartRef.current.startY;
      
      const newLeft = Math.max(0, moveStartRef.current.origLeft + dx);
      const newTop = Math.max(0, moveStartRef.current.origTop + dy);

      // Live update position
      onUpdate(component.id, {
        styles: {
          ...component.styles,
          left: `${newLeft}px`,
          top: `${newTop}px`,
        }
      });
    };

    const handleMouseUp = () => {
      setIsMoving(false);
      moveStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [component, onSelect, onUpdate]);

  // ─── Content Renderers ───
  const renderContent = () => {
    // Extract position styles so they don't apply to the inner content
    const { left, top, position, ...contentStyles } = component.styles;

    switch (component.type) {
      case 'text':
        return (
          <div 
            style={contentStyles}
            className="outline-none empty:before:content-['Type_text...'] empty:before:text-gray-400"
          >
            {component.content}
          </div>
        );
      
      case 'image':
        return (
          <img 
            src={component.content || "https://via.placeholder.com/400x300"} 
            alt="User uploaded"
            className="object-cover"
            style={contentStyles}
            draggable={false}
          />
        );
      
      case 'button':
        return (
          <button style={contentStyles} className="pointer-events-none">
            {component.content}
          </button>
        );

      case 'divider':
        return <div style={contentStyles} />;
      
      case 'spacer':
        return <div style={{...contentStyles, minHeight: '20px'}} className={cn(!isPreview && "bg-gray-100/10 border border-dashed border-gray-500/20")} />;

      case 'icon':
          const IconComp = (LucideIcons as any)[component.content] || LucideIcons.Star;
          return <div style={contentStyles}><IconComp className="w-full h-full" /></div>;

      case 'video':
          return (
             <div style={contentStyles} className="relative bg-black/10 min-h-[50px]">
                {component.content ? (
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={component.content} 
                        title="Video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className={cn("w-full h-full", !isPreview && "pointer-events-none")} 
                    ></iframe>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Video Embed</div>
                )}
             </div>
          );

      case 'socials':
        return (
            <div style={contentStyles} className="flex">
                {(component.content as any[]).map((s, i) => (
                    <a key={i} href={s.url} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-500 rounded-full" />
                    </a>
                ))}
            </div>
        );

      case 'container':
      case 'row':
      case 'column':
        const flexStyles: React.CSSProperties = {
            ...contentStyles,
            display: 'flex',
            flexDirection: (contentStyles.flexDirection || (component.type === 'column' ? 'column' : 'row')) as any,
            flexWrap: (contentStyles.flexWrap || (component.type === 'row' ? 'wrap' : 'nowrap')) as any,
        };
        
        if (!isPreview && (!flexStyles.minHeight || flexStyles.minHeight === 'auto')) {
            flexStyles.minHeight = component.children?.length === 0 ? '80px' : 'auto';
        }

        return (
            <div 
                style={flexStyles}
                className={cn(
                    "relative transition-all",
                    component.children && component.children.length === 0 && !isPreview && "bg-gray-50/50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center after:content-['Drop_Here'] after:text-gray-400 after:text-[10px] after:uppercase after:tracking-widest"
                )}
            >
                {component.children?.map(child => (
                    <EditorBlock 
                      key={child.id} 
                      component={child} 
                      selectedId={selectedId}
                      onSelect={onSelect}
                      onUpdate={onUpdate}
                      isDragging={isDragging}
                      isPreview={isPreview}
                    /> 
                ))}
            </div>
        );

      default:
        return <div>Unknown component: {component.type}</div>;
    }
  };

  // ─── Preview Mode: No controls ───
  if (isPreview) {
      return (
          <div 
            style={{ 
              position: 'absolute',
              left: component.styles.left || '0px',
              top: component.styles.top || '0px',
            }}
          >
               {renderContent()}
          </div>
      );
  }

  // ─── Editor Mode: With controls + drag-to-move ───
  return (
    <div
      ref={elementRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
      style={{
        position: 'absolute',
        left: component.styles.left || '0px',
        top: component.styles.top || '0px',
        cursor: isMoving ? 'grabbing' : 'default',
      }}
      className={cn(
        "group/block select-none",
        isSelected && "z-20",
        !isSelected && "z-10",
      )}
    >
      {/* Selection Ring */}
      <div className={cn(
        "relative ring-2 transition-all rounded-sm",
        isSelected ? "ring-indigo-500" : "ring-transparent hover:ring-indigo-500/40",
        isMoving && "ring-indigo-400 shadow-lg shadow-indigo-500/20"
      )}>
        
        {/* ── Controls Overlay ── */}
        {isSelected && (
          <>
            {/* Move Handle */}
            <div 
              className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-md cursor-grab active:cursor-grabbing shadow-lg z-50 whitespace-nowrap select-none"
              onMouseDown={handleMoveStart}
            >
              <Move size={10} />
              <span className="uppercase tracking-wider font-bold">{component.type}</span>
            </div>

            {/* Resize Handles (visual only for now) */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-indigo-500 rounded-sm cursor-nw-resize z-50" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-indigo-500 rounded-sm cursor-ne-resize z-50" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-indigo-500 rounded-sm cursor-sw-resize z-50" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-indigo-500 rounded-sm cursor-se-resize z-50" />
          </>
        )}

        {/* Label on Hover (non-selected) */}
        {!isSelected && (
          <div className="absolute -top-5 left-0 text-[9px] bg-indigo-500/80 text-white px-1.5 py-0.5 rounded-t opacity-0 group-hover/block:opacity-100 transition-opacity whitespace-nowrap z-40 pointer-events-none uppercase tracking-wider font-bold">
              {component.type}
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
};
