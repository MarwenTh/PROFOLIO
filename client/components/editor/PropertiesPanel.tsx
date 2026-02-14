"use client";
import React from "react";
import { EditorComponent } from "@/lib/editor-types";
import { 
    AlignLeft, AlignCenter, AlignRight, AlignJustify, 
    Bold, Italic, Underline, Type,  
    Layout, Box, Palette, Monitor, Smartphone, Trash2,
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
    StretchHorizontal, StretchVertical, X, Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "@/context/EditorContext";

interface PropertiesPanelProps {
    component: EditorComponent;
    onUpdate: (id: string, updates: Partial<EditorComponent>) => void;
    onDelete: (id: string) => void;
}

export const PropertiesPanel = ({ component, onUpdate, onDelete }: PropertiesPanelProps) => {
    const { selectComponent, selectSection } = useEditor();

    const updateStyle = (key: string, value: any) => {
        onUpdate(component.id, {
            styles: {
                ...component.styles,
                [key]: value
            }
        });
    };

    const updateContent = (value: any) => {
        onUpdate(component.id, { content: value } as any);
    };

    const updateAnimation = (key: string, value: any) => {
        onUpdate(component.id, {
            animation: {
                ...(component.animation || { type: 'fade', duration: 0.8, delay: 0 }),
                [key]: value
            }
        });
    };

    const isSection = ['header', 'body', 'footer', 'custom'].includes(component.type);

    return (
        <div className="w-[320px] bg-[#0F0F10] border-l border-white/5 flex flex-col h-full overflow-hidden text-neutral-300 font-sans shadow-2xl">
            {/* Header */}
            <div className="h-14 px-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#141415]">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                        {isSection ? 'Section' : component.type}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">#{component.id.substr(0,4)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => onDelete(component.id)}
                        className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => {
                            selectComponent(null);
                            selectSection(null);
                        }}
                        className="p-1.5 hover:bg-white/10 hover:text-white rounded-md transition-colors"
                        title="Close Panel"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                
                {/* Content Section (for Text/Button/Image) */}
                {(component.type === 'text' || component.type === 'button') && (
                    <div className="space-y-3">
                        <SectionHeader icon={Type} label="Content" />
                        <textarea
                            value={component.content}
                            onChange={(e) => updateContent(e.target.value)}
                            className="w-full bg-[#1A1A1E] border border-white/5 rounded-lg p-3 text-xs text-white focus:border-indigo-500/50 outline-none resize-none min-h-[80px]"
                            placeholder="Type something..."
                        />
                    </div>
                )}

                {component.type === 'image' && (
                    <div className="space-y-3">
                        <SectionHeader icon={Box} label="Image Source" />
                        <input
                            type="text"
                            value={component.content || ''}
                            onChange={(e) => updateContent(e.target.value)}
                            className="w-full bg-[#1A1A1E] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500/50 outline-none"
                            placeholder="https://..."
                        />
                    </div>
                )}

                {/* Layout Section (Flexbox) - For Containers/Rows/Columns */}
                {['container', 'row', 'column'].includes(component.type) && (
                    <div className="space-y-4">
                        <SectionHeader icon={Layout} label="Flex Layout" />
                        
                        {/* Direction */}
                        <div className="grid grid-cols-2 gap-2">
                           <IconButton 
                                active={component.styles.flexDirection === 'row' || (!component.styles.flexDirection && component.type === 'row')}
                                onClick={() => updateStyle('flexDirection', 'row')}
                                icon={ArrowRight}
                                label="Row"
                           />
                           <IconButton 
                                active={component.styles.flexDirection === 'column' || (!component.styles.flexDirection && component.type !== 'row')}
                                onClick={() => updateStyle('flexDirection', 'column')}
                                icon={ArrowDown}
                                label="Col"
                           />
                        </div>

                        {/* Justify & Align */}
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Justify</label>
                            <div className="flex bg-[#1A1A1E] rounded-lg p-1 border border-white/5">
                                <IconButtonSmall icon={AlignLeft} active={component.styles.justifyContent === 'flex-start'} onClick={() => updateStyle('justifyContent', 'flex-start')} />
                                <IconButtonSmall icon={AlignCenter} active={component.styles.justifyContent === 'center'} onClick={() => updateStyle('justifyContent', 'center')} />
                                <IconButtonSmall icon={AlignRight} active={component.styles.justifyContent === 'flex-end'} onClick={() => updateStyle('justifyContent', 'flex-end')} />
                                <IconButtonSmall icon={AlignJustify} active={component.styles.justifyContent === 'space-between'} onClick={() => updateStyle('justifyContent', 'space-between')} />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Align</label>
                            <div className="flex bg-[#1A1A1E] rounded-lg p-1 border border-white/5">
                                <IconButtonSmall icon={StretchHorizontal} active={component.styles.alignItems === 'flex-start'} onClick={() => updateStyle('alignItems', 'flex-start')} />
                                <IconButtonSmall icon={AlignCenter} active={component.styles.alignItems === 'center'} onClick={() => updateStyle('alignItems', 'center')} />
                                <IconButtonSmall icon={StretchHorizontal} active={component.styles.alignItems === 'flex-end'} onClick={() => updateStyle('alignItems', 'flex-end')} />
                                <IconButtonSmall icon={StretchVertical} active={component.styles.alignItems === 'stretch'} onClick={() => updateStyle('alignItems', 'stretch')} />
                            </div>
                         </div>

                         {/* Gap */}
                         <NumberInput 
                            label="Gap" 
                            value={parseInt(component.styles.gap || '0')} 
                            onChange={(v: number) => updateStyle('gap', `${v}px`)}
                            suffix="px"
                         />
                    </div>
                )}

                {/* Typography (For Text/Button) */}
                {(component.type === 'text' || component.type === 'button') && (
                    <div className="space-y-4">
                        <SectionHeader icon={Type} label="Typography" />
                        
                        <div className="grid grid-cols-2 gap-3">
                             <NumberInput 
                                label="Size" 
                                value={parseInt(component.styles.fontSize || '16')} 
                                onChange={(v: number) => updateStyle('fontSize', `${v}px`)}
                                suffix="px"
                             />
                             <div className="space-y-1">
                                <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Weight</label>
                                <select 
                                    value={component.styles.fontWeight || '400'}
                                    onChange={(e) => updateStyle('fontWeight', e.target.value)}
                                    className="w-full h-9 bg-[#1A1A1E] text-xs text-white border border-white/5 rounded-lg px-2 outline-none focus:border-indigo-500/50"
                                >
                                    <option value="300">Light</option>
                                    <option value="400">Regular</option>
                                    <option value="600">SemiBold</option>
                                    <option value="700">Bold</option>
                                    <option value="900">Black</option>
                                </select>
                             </div>
                        </div>

                        <div className="flex bg-[#1A1A1E] rounded-lg p-1 border border-white/5 w-fit">
                             <IconButtonSmall icon={AlignLeft} active={component.styles.textAlign === 'left'} onClick={() => updateStyle('textAlign', 'left')} />
                             <IconButtonSmall icon={AlignCenter} active={component.styles.textAlign === 'center'} onClick={() => updateStyle('textAlign', 'center')} />
                             <IconButtonSmall icon={AlignRight} active={component.styles.textAlign === 'right'} onClick={() => updateStyle('textAlign', 'right')} />
                        </div>
                        
                        <ColorInput 
                            label="Color" 
                            value={component.styles.color || '#ffffff'} 
                            onChange={(v: string) => updateStyle('color', v)} 
                        />
                    </div>
                )}

                {/* Size & Spacing */}
                <div className="space-y-4">
                     <SectionHeader icon={Box} label="Dimensions & Spacing" />
                     
                     {isSection ? (
                        <div className="space-y-4">
                             <NumberInput 
                                label="Section Height" 
                                value={(component as any).height || 0} 
                                onChange={(v: number) => onUpdate(component.id, { height: v } as any)}
                                suffix="px"
                             />
                        </div>
                     ) : (
                        <>
                             <div className="grid grid-cols-2 gap-3">
                                <NumberInput 
                                   label="X (Left)" 
                                   value={Math.round((component as any).x || 0)} 
                                   onChange={(v: number) => onUpdate(component.id, { x: v } as any)}
                                   suffix="px"
                                />
                                <NumberInput 
                                   label="Y (Top)" 
                                   value={Math.round((component as any).y || 0)} 
                                   onChange={(v: number) => onUpdate(component.id, { y: v } as any)}
                                   suffix="px"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Width</label>
                                    <input 
                                       type="number" 
                                       value={(component as any).width || ''}
                                       onChange={(e) => onUpdate(component.id, { width: parseInt(e.target.value) || 0 } as any)}
                                       className="w-full h-9 bg-[#1A1A1E] border border-white/5 rounded-lg px-2 text-xs text-white outline-none focus:border-indigo-500/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Height</label>
                                    <input 
                                       type="number" 
                                       value={(component as any).height || ''}
                                       onChange={(e) => onUpdate(component.id, { height: parseInt(e.target.value) || 0 } as any)}
                                       className="w-full h-9 bg-[#1A1A1E] border border-white/5 rounded-lg px-2 text-xs text-white outline-none focus:border-indigo-500/50"
                                    />
                                </div>
                            </div>
                        </>
                     )}

                     <div className="grid grid-cols-2 gap-3">
                         <NumberInput 
                            label="Padding" 
                            value={parseInt(component.styles.padding || '0')} 
                            onChange={(v: number) => updateStyle('padding', `${v}px`)}
                            suffix="px"
                         />
                         <NumberInput 
                            label="Margin" 
                            value={parseInt(component.styles.margin || '0')} 
                            onChange={(v: number) => updateStyle('margin', `${v}px`)}
                            suffix="px"
                         />
                     </div>
                </div>

                {/* Appearance */}
                <div className="space-y-4">
                     <SectionHeader icon={Palette} label="Appearance" />
                     
                     <ColorInput 
                        label="Background" 
                        value={component.styles.backgroundColor || 'transparent'} 
                        onChange={(v: string) => updateStyle('backgroundColor', v)} 
                     />
                     
                     <div className="grid grid-cols-2 gap-3">
                        <NumberInput 
                            label="Radius" 
                            value={parseInt(component.styles.borderRadius || '0')} 
                            onChange={(v: number) => updateStyle('borderRadius', `${v}px`)}
                            suffix="px"
                        />
                        <div className="space-y-1">
                             <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Border</label>
                             <input 
                                type="text" 
                                value={component.styles.border || 'none'}
                                onChange={(e) => updateStyle('border', e.target.value)}
                                className="w-full h-9 bg-[#1A1A1E] border border-white/5 rounded-lg px-2 text-xs text-white outline-none focus:border-indigo-500/50"
                                placeholder="1px solid #ddd"
                             />
                        </div>
                     </div>
                </div>

                {/* Effects */}
                <div className="space-y-4">
                     <SectionHeader icon={Monitor} label="Effects" />
                     
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Shadow</label>
                        <select 
                            value={component.styles.boxShadow || 'none'}
                            onChange={(e) => updateStyle('boxShadow', e.target.value)}
                            className="w-full h-9 bg-[#1A1A1E] text-xs text-white border border-white/5 rounded-lg px-2 outline-none focus:border-indigo-500/50"
                        >
                            <option value="none">None</option>
                            <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)">Subtle</option>
                            <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)">Medium</option>
                            <option value="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)">Large</option>
                            <option value="0 25px 50px -12px rgba(0, 0, 0, 0.25)">Extra Large</option>
                            <option value="0 0 15px rgba(255, 255, 255, 0.1)">Glow (White)</option>
                            <option value="0 0 15px rgba(99, 102, 241, 0.3)">Glow (Indigo)</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Opacity</label>
                         <input 
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={component.styles.opacity || '1'}
                            onChange={(e) => updateStyle('opacity', e.target.value)}
                            className="w-full h-2 bg-[#1A1A1E] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                     </div>
                </div>

                {/* Animation Section */}
                {!isSection && (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <SectionHeader icon={Play} label="Animation" />
                            {component.animation?.engine && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-500 font-bold uppercase tracking-tighter">
                                    {component.animation.engine}
                                </span>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Preset</label>
                           <select 
                                value={component.animation?.type || 'none'}
                                onChange={(e) => {
                                    if (e.target.value === 'none') {
                                        onUpdate(component.id, { animation: undefined });
                                    } else {
                                        updateAnimation('type', e.target.value);
                                    }
                                }}
                                className="w-full bg-[#1A1A1E] border border-white/5 rounded-lg p-2.5 text-xs text-white outline-none focus:border-indigo-500/50"
                           >
                                <option value="none">No Animation</option>
                                <option value="fade">Fade In</option>
                                <option value="slide-up">Slide Up</option>
                                <option value="slide-down">Slide Down</option>
                                <option value="slide-left">Slide Left</option>
                                <option value="slide-right">Slide Right</option>
                                <option value="scale-up">Scale Up</option>
                                <option value="bounce">Bounce</option>
                                <option value="rotate">Rotate</option>
                           </select>
                        </div>

                        {component.animation && (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <NumberInput 
                                        label="Duration" 
                                        value={component.animation.duration || 0.8} 
                                        step={0.1}
                                        onChange={(v: number) => updateAnimation('duration', v)}
                                        suffix="s"
                                    />
                                    <NumberInput 
                                        label="Delay" 
                                        value={component.animation.delay || 0} 
                                        step={0.1}
                                        onChange={(v: number) => updateAnimation('delay', v)}
                                        suffix="s"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        id="anim-once"
                                        checked={component.animation.once !== false}
                                        onChange={(e) => updateAnimation('once', e.target.checked)}
                                        className="w-3.5 h-3.5 rounded border-white/10 bg-[#1A1A1E] text-indigo-500 focus:ring-0"
                                    />
                                    <label htmlFor="anim-once" className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider cursor-pointer">
                                        Animate Once
                                    </label>
                                </div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

// Sub-components for cleaner code
const SectionHeader = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
        <Icon className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">{label}</span>
    </div>
);

const IconButton = ({ icon: Icon, onClick, active, label }: any) => (
    <button 
        onClick={onClick}
        className={cn(
            "flex items-center justify-center gap-2 h-9 rounded-lg border text-xs font-bold transition-all",
            active 
                ? "bg-indigo-500 text-white border-indigo-500" 
                : "bg-[#1A1A1E] text-neutral-400 border-white/5 hover:bg-[#25252A] hover:text-white"
        )}
    >
        <Icon className="w-3.5 h-3.5" />
        {label}
    </button>
);

const IconButtonSmall = ({ icon: Icon, onClick, active }: any) => (
    <button 
        onClick={onClick}
        className={cn(
            "w-7 h-7 flex items-center justify-center rounded transition-all",
            active ? "bg-indigo-500 text-white shadow-lg" : "text-neutral-500 hover:text-white"
        )}
    >
        <Icon className="w-3.5 h-3.5" />
    </button>
);

const NumberInput = ({ label, value, onChange, suffix, step }: any) => (
    <div className="space-y-1">
        <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">{label}</label>
        <div className="relative">
            <input 
                type="number"
                value={isNaN(value) ? 0 : value}
                step={step || 1}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-9 bg-[#1A1A1E] border border-white/5 rounded-lg pl-2 pr-6 text-xs text-white outline-none focus:border-indigo-500/50"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-600 font-bold">{suffix}</span>
        </div>
    </div>
);

const ColorInput = ({ label, value, onChange }: any) => (
    <div className="space-y-1">
         <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">{label}</label>
         <div className="flex gap-2 items-center">
             <div className="w-9 h-9 rounded-lg border border-white/10 overflow-hidden relative shrink-0">
                 <input 
                    type="color" 
                    value={value.startsWith('#') ? value : '#000000'}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                 />
             </div>
             <input 
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-9 bg-[#1A1A1E] border border-white/5 rounded-lg px-2 text-xs text-white outline-none focus:border-indigo-500/50 font-mono uppercase"
             />
         </div>
    </div>
);
