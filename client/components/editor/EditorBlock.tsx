"use client";
import React from "react";
import { EditorComponent, ComponentType } from "@/lib/editor-types";
import { cn } from "@/lib/utils";
import { useDragControls, Reorder } from "framer-motion";
import * as LucideIcons from "lucide-react"; // Import all icons
import { GripVertical } from "lucide-react";
import { COMPONENT_TEMPLATES } from "@/lib/editor-constants";
import { generateId } from "@/lib/editor-utils";
import { toast } from "sonner";

interface EditorBlockProps {
  component: EditorComponent;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<EditorComponent>) => void;
  onAddComponent?: (targetId: string, type: ComponentType, position: 'before' | 'after' | 'inside') => void;
  isDragging?: boolean;
  isPreview: boolean;
}

// Fancy Drop Indicator
const DropIndicator = ({ position }: { position: 'before' | 'after' | 'inside' }) => {
    if (position === 'inside') return (
        <div className="absolute inset-0 border-2 border-indigo-500 bg-indigo-500/10 rounded-lg pointer-events-none z-50 animate-pulse" />
    );

    return (
        <div 
            className={cn(
                "absolute left-0 right-0 h-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full z-50 pointer-events-none shadow-[0_0_10px_rgba(99,102,241,0.8)]",
                position === 'before' ? "-top-[6px]" : "-bottom-[6px]"
            )}
        >
             <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-md border border-indigo-500" />
             <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-md border border-indigo-500" />
        </div>
    );
};

export const EditorBlock = ({ 
  component, 
  selectedId, 
  onSelect, 
  onUpdate,
  onAddComponent,
  isDragging,
  isPreview 
}: EditorBlockProps) => {
  const controls = useDragControls();
  const isSelected = selectedId === component.id;
  const [dropPosition, setDropPosition] = React.useState<'before' | 'after' | 'inside' | null>(null);

  // Basic Renderers based on type
  const renderContent = () => {
    switch (component.type) {
      case 'text':
        return (
          <div 
            style={component.styles}
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
            className="w-full h-full object-cover"
            style={component.styles}
          />
        );
      
      case 'button':
        return (
          <button style={component.styles}>
            {component.content}
          </button>
        );

      case 'divider':
        return <div style={component.styles} />;
      
      case 'spacer':
        return <div style={{...component.styles, minHeight: '20px'}} className={cn(!isPreview && "bg-gray-100/10 border border-dashed border-gray-500/20")} />;

      case 'icon':
          const IconComp = (LucideIcons as any)[component.content] || LucideIcons.Star;
          return <div style={component.styles}><IconComp className="w-full h-full" /></div>;

      case 'video':
          return (
             <div style={component.styles} className="relative bg-black/10 min-h-[50px]">
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
            <div style={component.styles} className="flex">
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
        // Safe styling for flex containers
        const flexStyles: React.CSSProperties = {
            ...component.styles,
            display: 'flex',
            flexDirection: (component.styles.flexDirection || (component.type === 'column' ? 'column' : 'row')) as any,
            flexWrap: (component.styles.flexWrap || (component.type === 'row' ? 'wrap' : 'nowrap')) as any,
        };
        
        // Ensure minimum dimensions for editing
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
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = 'copy';
                    
                    if (isDragging) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = e.clientY - rect.top;
                        const height = rect.height;
                        
                        // If empty or explicitly targeting center (container logic), use inside
                        // But if we want insertion, check edges.
                        // For containers, let's say top 20% is before, bottom 20% is after, rest is inside.
                        if (y < height * 0.2) setDropPosition('before');
                        else if (y > height * 0.8) setDropPosition('after');
                        else setDropPosition('inside');
                    }
                }}
                onDragLeave={() => setDropPosition(null)}
                onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const type = e.dataTransfer.getData('type') as ComponentType;
                    if (type && onAddComponent && dropPosition) {
                         onAddComponent(component.id, type, dropPosition);
                    }
                    setDropPosition(null);
                }}
            >


                {/* Visual Drop Indicator */}
                {dropPosition && <DropIndicator position={dropPosition} />}

                {/* Recursive Rendering with Reorder */}
                <Reorder.Group
                    axis={flexStyles.flexDirection === 'column' ? 'y' : 'x'}
                    values={component.children || []}
                    onReorder={(newChildren) => onUpdate(component.id, { children: newChildren })}
                    className="flex flex-1 w-full h-full"
                    style={{ flexDirection: flexStyles.flexDirection as any, flexWrap: flexStyles.flexWrap as any, gap: flexStyles.gap as any, alignItems: flexStyles.alignItems as any, justifyContent: flexStyles.justifyContent as any }}
                >
                    {component.children?.map(child => (
                       <Reorder.Item key={child.id} value={child} dragListener={!isPreview && !isDragging}>
                           <EditorBlock 
                             key={child.id} 
                             component={child} 
                             selectedId={selectedId}
                             onSelect={onSelect}
                             onUpdate={onUpdate}
                             onAddComponent={onAddComponent}
                             isDragging={isDragging}
                             isPreview={isPreview}
                           /> 
                       </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>
        );

      default:
        return <div>Unknown component: {component.type}</div>;
    }
  };

  if (isPreview) {
      return (
          <div style={{ position: 'relative' }}>
               {renderContent()}
          </div>
      );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
      className={cn(
        "relative group ring-2 ring-transparent transition-all",
        isSelected ? "ring-indigo-500 z-10" : "hover:ring-indigo-500/50"
      )}
      onDragOver={(e) => {
          // If this is a container, let the container handle it (it has its own onDragOver)
          // We only handle if default prevented is false? No, explicit check.
          if (component.type === 'container' || component.type === 'row' || component.type === 'column') return;
          
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'copy';
          
          if (isDragging) {
              const rect = e.currentTarget.getBoundingClientRect();
              const y = e.clientY - rect.top;
              // Simple 50/50 split for non-containers
              if (y < rect.height / 2) setDropPosition('before');
              else setDropPosition('after');
          }
      }}
      onDragLeave={() => {
           if (component.type === 'container' || component.type === 'row' || component.type === 'column') return;
           setDropPosition(null);
      }}
      onDrop={(e) => {
          if (component.type === 'container' || component.type === 'row' || component.type === 'column') return;
          
          e.preventDefault();
          e.stopPropagation();
          const type = e.dataTransfer.getData('type') as ComponentType;
          if (type && onAddComponent && dropPosition) {
               onAddComponent(component.id, type, dropPosition);
          }
          setDropPosition(null);
      }}

    >
      {/* Visual Drop Indicator for Items */}
      {dropPosition && <DropIndicator position={dropPosition} />}

      {/* Editor Controls Overlay (Appears on Hover/Select) */}
      {!isPreview && (
          <>
             {/* Drag Handle - Visual only for now */}
             <div 
                className="absolute top-0 left-0 p-1 opacity-0 group-hover/block:opacity-100 cursor-grab active:cursor-grabbing z-50 bg-indigo-500 text-white rounded-br-lg"
                onPointerDown={(e) => controls.start(e)}
             >
                 <GripVertical size={12} />
             </div>
             
             {/* Label Tag */}
             <div className="absolute -top-5 left-0 text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-t opacity-0 group-hover/block:opacity-100 transition-opacity whitespace-nowrap z-40 pointer-events-none uppercase tracking-wider font-bold">
                 {component.type}
             </div>
          </>
      )}

      {renderContent()}
    </div>
  );
};
