"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { 
  Loader2, 
  Save, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Type, 
  Image as ImageIcon, 
  MousePointer2,
  ChevronLeft,
  Globe,
  Minus,
  Share2,
  Github,
  Linkedin,
  Twitter,
  Settings
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";

// Types for our editor components
interface EditorComponent {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'socials';
  content: any;
  styles?: any;
}

interface EditorSections {
  header: EditorComponent[];
  body: EditorComponent[];
  footer: EditorComponent[];
}

const COMPONENT_TEMPLATES = {
  text: { type: 'text', content: 'Double click to edit text', styles: { fontSize: '24px', fontWeight: 'bold' } },
  image: { type: 'image', content: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop', styles: { borderRadius: '12px' } },
  button: { type: 'button', content: 'Click Me', styles: { backgroundColor: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '8px' } },
  divider: { type: 'divider', content: '', styles: { height: '1px', backgroundColor: '#e5e5e5', width: '100%', margin: '24px 0' } },
  socials: { type: 'socials', content: [{ platform: 'github', url: '#' }, { platform: 'linkedin', url: '#' }], styles: { gap: '12px' } },
} as const;

export default function PortfolioEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getPortfolioById, updatePortfolio, loading: apiLoading } = usePortfolio();
  
  const [portfolio, setPortfolio] = useState<any>(null);
  const [sections, setSections] = useState<EditorSections>({
    header: [],
    body: [],
    footer: []
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (id) {
      getPortfolioById(id as string).then(res => {
        if (res.success) {
          setPortfolio(res.portfolio);
          const content = res.portfolio.content;
          
          // Data Normalization: Handle old array-only format
          if (Array.isArray(content)) {
            setSections({
              header: [],
              body: content,
              footer: []
            });
          } else if (content && typeof content === 'object') {
            setSections({
              header: content.header || [],
              body: content.body || [],
              footer: content.footer || []
            });
          }
        }
      });
    }
  }, [id, getPortfolioById]);

  const addComponent = (section: keyof EditorSections, type: keyof typeof COMPONENT_TEMPLATES) => {
    const newComponent: EditorComponent = {
      id: Math.random().toString(36).substr(2, 9),
      ...COMPONENT_TEMPLATES[type]
    };
    setSections(prev => ({
      ...prev,
      [section]: [...prev[section], newComponent]
    }));
  };

  const removeComponent = (section: keyof EditorSections, id: string) => {
    setSections(prev => ({
      ...prev,
      [section]: prev[section].filter(c => c.id !== id)
    }));
  };

  const updateComponent = (section: keyof EditorSections, id: string, newContent: any, newStyles?: any) => {
    setSections(prev => ({
      ...prev,
      [section]: prev[section].map(c => c.id === id ? { 
        ...c, 
        content: newContent ?? c.content,
        styles: newStyles ? { ...c.styles, ...newStyles } : c.styles
      } : c)
    }));
  };

  const handleSave = async (customStatus?: string) => {
    setIsSaving(true);
    const statusToSave = customStatus || portfolio?.status || 'draft';
    await updatePortfolio(id as string, { 
      content: sections,
      status: statusToSave
    });
    setPortfolio((prev: any) => ({ ...prev, status: statusToSave }));
    setIsSaving(false);
  };

  if (apiLoading && !portfolio) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* Sidebar Tool */}
      <AnimatePresence>
        {!isPreview && (
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-72 border-r border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900 flex flex-col z-20"
          >
            <div className="p-6 border-b border-neutral-200 dark:border-white/5 flex items-center gap-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-neutral-200 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="font-black tracking-tighter text-lg uppercase">Editor</h2>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              <div>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4 px-1">Elements</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { type: 'text', label: 'Text Block', icon: Type, description: 'Headings & Paragraphs' },
                    { type: 'image', label: 'Image Frame', icon: ImageIcon, description: 'Visual storytelling' },
                    { type: 'button', label: 'Action Button', icon: MousePointer2, description: 'Clickable interactions' },
                    { type: 'divider', label: 'Divider', icon: Minus, description: 'Section separator' },
                    { type: 'socials', label: 'Social Icons', icon: Share2, description: 'Connect accounts' }
                  ].map((item) => (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("componentType", item.type);
                        setIsDragging(true);
                      }}
                      onDragEnd={() => setIsDragging(false)}
                      onClick={() => addComponent('body', item.type as any)}
                      className="group flex flex-col items-start gap-1 p-4 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/5 hover:border-emerald-500/50 hover:bg-neutral-50 dark:hover:bg-white/10 transition-all duration-300 text-left relative overflow-hidden active:scale-[0.98] cursor-grab active:cursor-grabbing"
                    >
                      <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-bl-3xl transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
                      <item.icon className="w-5 h-5 text-neutral-400 group-hover:text-emerald-500 transition-colors mb-2" />
                      <span className="text-sm font-black tracking-tight">{item.label}</span>
                      <span className="text-[10px] text-neutral-500 font-medium">{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto p-6 border-t border-neutral-200 dark:border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Loader2 className={cn("w-5 h-5 text-emerald-500", isSaving && "animate-spin")} />
                    </div>
                    <div>
                        <p className="text-xs font-bold">{portfolio?.title}</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Draft Saved</p>
                    </div>
                </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Toolbar */}
        <header className="h-20 border-b border-neutral-200 dark:border-white/5 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-xl flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            {!isPreview && (
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Editor
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPreview(!isPreview)}
              className="px-5 h-11 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 font-bold text-sm transition-all flex items-center gap-2"
            >
              {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreview ? 'Exit Preview' : 'Live Preview'}
            </button>
            {!isPreview && (
              <>
                <button 
                  onClick={() => handleSave(portfolio?.status === 'published' ? 'draft' : 'published')}
                  className={cn(
                    "px-4 h-11 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border",
                    portfolio?.status === 'published' 
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" 
                      : "bg-neutral-100 dark:bg-white/5 text-neutral-500 border-transparent hover:bg-neutral-200 dark:hover:bg-white/10"
                  )}
                >
                  <Globe className="w-4 h-4" />
                  {portfolio?.status === 'published' ? 'Published' : 'Publish'}
                </button>

                <button 
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="px-6 h-11 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-black text-sm transition-all active:scale-95 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Design
                </button>
              </>
            )}
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto bg-neutral-100 dark:bg-[#050505] relative custom-scrollbar selection:bg-emerald-500/20">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
            style={{ backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`, backgroundSize: '32px 32px' }} 
          />
          
          <div className={cn(
            "max-w-4xl mx-auto min-h-[140vh] bg-white dark:bg-black rounded-[40px] relative transition-all duration-400 ease-out shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col my-12",
            isPreview ? "mt-0 p-0 shadow-none rounded-none" : "border border-neutral-200 dark:border-white/5"
          )}>
            
            {(['header', 'body', 'footer'] as const).map((sectionKey) => {
              const label = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
              const items = sections[sectionKey];
              
              return (
                <div 
                  key={sectionKey}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-emerald-500/[0.02]');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('bg-emerald-500/[0.02]');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-emerald-500/[0.02]');
                    const type = e.dataTransfer.getData("componentType") as any;
                    if (type) addComponent(sectionKey, type);
                  }}
                  className={cn(
                    "relative transition-all duration-300",
                    sectionKey === 'header' && "pt-12",
                    sectionKey === 'footer' && "mt-auto pb-12",
                    sectionKey === 'body' && "flex-1 px-16 py-12 border-y border-dashed border-transparent hover:border-neutral-200 dark:hover:border-white/5",
                    (sectionKey === 'header' || sectionKey === 'footer') && "px-16"
                  )}
                >
                  {/* Section Label (Editor Only) */}
                  {!isPreview && (
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 -translate-x-full pr-8 pointer-events-none group-hover:opacity-100 opacity-20 transition-opacity">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 vertical-text">{label}</span>
                    </div>
                  )}

                  <Reorder.Group 
                    axis="y" 
                    values={items} 
                    onReorder={(newItems) => setSections(prev => ({ ...prev, [sectionKey]: newItems }))} 
                    className="space-y-8"
                  >
                    {items.map((comp) => (
                      <Reorder.Item 
                        key={comp.id} 
                        value={comp}
                        transition={{ type: "spring", stiffness: 500, damping: 50, mass: 1 }}
                        className="relative group/item"
                      >
                         {!isPreview && (
                          <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                              <button className="p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-lg text-neutral-400 hover:text-emerald-500 transition-colors shadow-sm cursor-grab active:cursor-grabbing">
                                  <Plus className="w-4 h-4 rotate-45" />
                              </button>
                              <button 
                                  onClick={() => {
                                    if (comp.type === 'text') {
                                      const size = prompt("Font size (e.g. 24px)", comp.styles?.fontSize);
                                      const color = prompt("Color (hex or name)", comp.styles?.color);
                                      if (size || color) updateComponent(sectionKey, comp.id, null, { fontSize: size, color });
                                    } else if (comp.type === 'button') {
                                      const bg = prompt("Background Color", comp.styles?.backgroundColor);
                                      if (bg) updateComponent(sectionKey, comp.id, null, { backgroundColor: bg });
                                    } else if (comp.type === 'image') {
                                      const radius = prompt("Border Radius (e.g. 12px)", comp.styles?.borderRadius);
                                      if (radius) updateComponent(sectionKey, comp.id, null, { borderRadius: radius });
                                    } else if (comp.type === 'divider') {
                                      const bg = prompt("Divider Color", comp.styles?.backgroundColor);
                                      const h = prompt("Height (e.g. 1px)", comp.styles?.height);
                                      if (bg || h) updateComponent(sectionKey, comp.id, null, { backgroundColor: bg, height: h });
                                    }
                                  }}
                                  className="p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-lg text-neutral-400 hover:text-emerald-500 transition-colors shadow-sm"
                              >
                                  <Settings className="w-4 h-4" />
                              </button>
                              <button 
                                  onClick={() => removeComponent(sectionKey, comp.id)}
                                  className="p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-lg text-neutral-400 hover:text-red-500 transition-colors shadow-sm"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </div>
                        )}
                        
                        <div className={cn(
                          "rounded-3xl transition-all duration-500",
                          !isPreview && "p-2 hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
                        )}>
                          {comp.type === 'text' && (
                            <h2 
                              style={comp.styles} 
                              className="outline-none tracking-tight leading-[1.1] p-4 text-neutral-900 dark:text-white"
                              contentEditable={!isPreview}
                              suppressContentEditableWarning
                              onBlur={(e) => updateComponent(sectionKey, comp.id, e.currentTarget.textContent)}
                            >
                              {comp.content}
                            </h2>
                          )}
                          {comp.type === 'image' && (
                            <div className="relative group/img p-4">
                              <motion.img 
                                src={comp.content} 
                                style={comp.styles}
                                className="w-full h-auto object-cover shadow-2xl rounded-3xl"
                                whileHover={isPreview ? { scale: 1.005 } : {}}
                              />
                              {!isPreview && (
                                <button 
                                  onClick={() => {
                                    const url = prompt("Enter Image URL", comp.content);
                                    if (url) updateComponent(sectionKey, comp.id, url);
                                  }}
                                  className="absolute top-8 right-8 p-3 bg-black/60 backdrop-blur-xl text-white rounded-2xl opacity-0 group-hover/img:opacity-100 transition-all hover:scale-110 active:scale-95 border border-white/20"
                                >
                                  <ImageIcon className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          )}
                          {comp.type === 'button' && (
                            <div className="relative group/btn p-4">
                              <button 
                                style={comp.styles}
                                className="font-black text-xl px-10 py-5 transition-all active:scale-95 shadow-2xl shadow-emerald-500/20"
                              >
                                {comp.content}
                              </button>
                              {!isPreview && (
                                <button 
                                  onClick={() => {
                                    const text = prompt("Enter Button Text", comp.content);
                                    if (text) updateComponent(sectionKey, comp.id, text);
                                  }}
                                  className="absolute -top-2 -right-2 p-2 bg-neutral-900 border border-white/10 text-white rounded-full opacity-0 group-hover/btn:opacity-100 transition-all hover:scale-110"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          )}
                          {comp.type === 'divider' && (
                            <div className="p-4">
                              <div style={comp.styles} />
                            </div>
                          )}
                          {comp.type === 'socials' && (
                            <div className="p-4 flex flex-wrap" style={comp.styles}>
                              {comp.content.map((social: any, idx: number) => (
                                <div key={idx} className="relative group/social">
                                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all cursor-pointer">
                                    {social.platform === 'github' && <Github className="w-5 h-5" />}
                                    {social.platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                                    {social.platform === 'twitter' && <Twitter className="w-5 h-5" />}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  {items.length === 0 && !isPreview && (
                    <div className="py-12 border-2 border-dashed border-neutral-100 dark:border-white/5 rounded-[32px] flex flex-col items-center justify-center text-neutral-400 group/empty hover:border-emerald-500/30 transition-colors">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label} Section</p>
                      <p className="text-xs">Drag and drop components here</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
