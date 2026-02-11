"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { 
  Save, Eye, EyeOff, Plus, Trash2, ArrowLeft, Share2, ChevronRight, 
  ChevronLeft, GripVertical, ImageIcon, Github, Linkedin, Twitter, Library, 
  Smartphone, Tablet as TabletIcon, Monitor, Laptop, Type, MousePointer2, 
  Minus, Globe, Settings, Layout, User, Mail, Box, Columns, Rows
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/Loader";
import { toast } from "sonner";
import { EditorMediaModal } from "@/components/library/EditorMediaModal";

// New Imports
import { EditorBlock } from "@/components/editor/EditorBlock";
import { ComponentType, EditorComponent, EditorSections } from "@/lib/editor-types";
import { generateId, findComponentById, updateComponentInList, removeComponentFromList, addComponentToParent, addComponentRelative } from "@/lib/editor-utils";
import { COMPONENT_TEMPLATES, SECTION_TEMPLATES } from "@/lib/editor-constants";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";

// Types
type SectionKey = keyof Omit<EditorSections, 'assets'>;

export default function PortfolioEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getPortfolioById, updatePortfolio, loading: apiLoading } = usePortfolio();
  
  // State
  const [portfolio, setPortfolio] = useState<any>(null);
  const [sections, setSections] = useState<EditorSections>({
    header: [],
    body: [],
    footer: [],
    assets: []
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'elements' | 'assets'>('templates');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'laptop' | 'desktop'>('desktop');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // New state to track if user is dragging from sidebar

  // Load Portfolio
  useEffect(() => {
    if (id) {
      getPortfolioById(id as string).then(res => {
        if (res.success) {
          setPortfolio(res.portfolio);
          const content = res.portfolio.content;
          
          if (content && typeof content === 'object' && !Array.isArray(content)) {
             setSections({
                 header: content.header || [],
                 body: content.body || [],
                 footer: content.footer || [],
                 assets: content.assets || []
             });
          } else if (Array.isArray(content)) {
            // Migration for old format
            setSections({ header: [], body: content, footer: [], assets: [] });
          }
        }
      });
    }
  }, [id, getPortfolioById]);

  // Actions
  const handleAddComponent = (section: SectionKey, type: ComponentType) => {
    const template = COMPONENT_TEMPLATES[type as keyof typeof COMPONENT_TEMPLATES];
    if (!template) return;

    const newComponent: EditorComponent = {
      id: generateId(),
      type: type,
      content: template.content,
      styles: { ...template.styles },
      children: template.children ? [] : undefined
    };

    // If a container/row/column is selected, add to it
    if (selectedId) {
        // Helper to find which section the selected ID belongs to
        const findSectionKey = (s: EditorSections, id: string): SectionKey | null => {
            if (findComponentById(s.header, id)) return 'header';
            if (findComponentById(s.body, id)) return 'body';
            if (findComponentById(s.footer, id)) return 'footer';
            return null;
        };

        const targetSectionKey = findSectionKey(sections, selectedId);
        
        if (selectedId && targetSectionKey) {
             const selectedComponent = findComponentById(sections[targetSectionKey], selectedId);
             if (selectedComponent && ['container', 'row', 'column'].includes(selectedComponent.type)) {
                 setSections(prev => ({
                     ...prev,
                     [targetSectionKey]: addComponentToParent(prev[targetSectionKey], selectedId, newComponent)
                 }));
                 toast.success(`Added ${type} to ${selectedComponent.type}`);
                 return;
             }
        }
    }
    
    // Default: Add to root of section (fallback if no container selected or selected is not container)
    setSections(prev => ({
        ...prev,
        [section]: [...prev[section], newComponent]
    }));
    toast.success(`Added ${type} to ${section}`);
  };

  const handleUpdateComponent = (id: string, updates: Partial<EditorComponent>) => {
    // We need to find which section the component is in.
    // Since we don't know the path, we try updating all sections. 
    // This is inefficient but functional for now. Optimized by knowing the section usually.
    // Alternatively, `EditorBlock` could pass the section key down if we wanted.
    
    setSections(prev => ({
        header: updateComponentInList(prev.header, id, updates),
        body: updateComponentInList(prev.body, id, updates),
        footer: updateComponentInList(prev.footer, id, updates),
        assets: prev.assets
    }));
  };

  const handleDeleteComponent = (id: string) => {
      setSections(prev => ({
          header: removeComponentFromList(prev.header, id),
          body: removeComponentFromList(prev.body, id),
          footer: removeComponentFromList(prev.footer, id),
          assets: prev.assets
      }));
      if (selectedId === id) setSelectedId(null);
      toast.success("Deleted component");
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
    toast.success("Changes saved");
  };

  // UI Helpers


  if (apiLoading && !portfolio) return <div className="h-screen bg-[#0A0A0B] flex items-center justify-center"><Loader /></div>;

  const sidebarTabs = [
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'elements', label: 'Elements', icon: Box },
    { id: 'assets', label: 'Assets', icon: Library },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-neutral-100 font-sans overflow-hidden">
      {/* Side Navigation Ribbon (Canva Style Refined) */}
      <AnimatePresence>
        {!isPreview && (
          <motion.div 
            initial={{ x: -80 }}
            animate={{ x: 0 }}
            className="w-[72px] bg-[#0F0F10] flex flex-col items-center py-6 z-50 shrink-0 border-r border-white/5"
          >
            {/* Professional Logo Icon */}
            <div 
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-10 cursor-pointer hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95 group outline-none"
            >
              <div className="w-6 h-6 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <span className="text-white font-black text-xs">P</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5 w-full px-2">
              {sidebarTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setIsSidebarOpen(true);
                    }}
                    className="group flex flex-col items-center justify-center w-full py-1.5 transition-all outline-none"
                  >
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-all duration-300 relative",
                        isActive ? "bg-white/[0.12]" : "group-hover:bg-white/[0.05]"
                    )}>
                        <tab.icon className={cn(
                          "w-5 h-5 transition-all duration-300", 
                          isActive ? "text-indigo-400 scale-105" : "text-neutral-500 group-hover:text-neutral-300"
                        )} />
                    </div>
                    <span className={cn(
                        "text-[9px] font-bold uppercase tracking-[0.05em] transition-colors",
                        isActive ? "text-white" : "text-neutral-600"
                    )}>
                        {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-2 items-center w-full px-2">
              <button 
                className="group flex flex-col items-center justify-center w-full py-1.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 group-hover:bg-white/[0.05] transition-all">
                    <Settings className="w-5 h-5 text-neutral-500 group-hover:text-neutral-300" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-neutral-600">Config</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Content Panel (Refined Aesthetics) */}
      <AnimatePresence>
        {!isPreview && isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="bg-[#0F0F10] shadow-[10px_0_30px_rgba(0,0,0,0.5)] h-full z-40 relative flex flex-col overflow-hidden border-r border-white/5"
          >
            {/* Panel Header */}
            <div className="h-20 px-6 border-b border-white/[0.03] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {activeTab}
                </h3>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.05] transition-colors text-neutral-500 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-6"
                >
                  {activeTab === 'templates' && (
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(SECTION_TEMPLATES).map(([key, template]) => (
                        <button
                          key={key}
                          onClick={() => {
                                // Logic to add section (Adapted for new structure)
                                const components = (template as any).components.map((c: any) => ({
                                    ...c,
                                    id: generateId(),
                                    children: c.children ? c.children.map((child: any) => ({...child, id: generateId()})) : undefined
                                }));
                                setSections(prev => ({ ...prev, body: [...prev.body, ...components] }));
                                toast.success(`Added ${template.label}`);
                          }}
                          className="p-5 rounded-2xl bg-[#1A1A1E] border border-white/[0.03] hover:border-white/[0.1] hover:bg-[#232328] transition-all group text-left cursor-grab active:cursor-grabbing"
                          draggable={true}
                          onDragStart={(e) => {
                             e.dataTransfer.setData('type', 'section'); // Simplified for now, sections might need special handling
                             e.dataTransfer.setData('templateKey', key);
                             setIsDragging(true); // Start drag tracking
                          }}
                          onDragEnd={() => setIsDragging(false)}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                              <template.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-[13px] font-black tracking-tight text-white mb-0.5">{template.label}</h4>
                              <p className="text-[11px] text-neutral-500 font-medium">{template.description}</p>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-indigo-500/40 rounded-full" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {activeTab === 'elements' && (
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(COMPONENT_TEMPLATES).map(([key, value]) => {
                        let Icon = Plus;
                        if (key === 'text') Icon = Type;
                        if (key === 'image') Icon = ImageIcon;
                        if (key === 'button') Icon = MousePointer2;
                        if (key === 'divider') Icon = Minus;
                        if (key === 'socials') Icon = Share2;
                        if (key === 'container') Icon = Box;
                        if (key === 'row') Icon = Rows;
                        if (key === 'column') Icon = Columns;

                        return (
                          <button
                            key={key}
                            onClick={() => handleAddComponent('body', key as ComponentType)}
                            className="p-5 rounded-3xl bg-[#1A1A1E] border border-white/[0.02] hover:bg-[#232328] hover:border-white/10 transition-all flex flex-col items-center justify-center gap-3 active:scale-[0.98] group cursor-grab active:cursor-grabbing"
                            draggable={true}
                            onDragStart={(e) => {
                                e.dataTransfer.setData('type', key);
                                setIsDragging(true);
                            }}
                            onDragEnd={() => setIsDragging(false)}
                          >
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.02] flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                              <Icon className="w-6 h-6 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
                            </div>
                            <span className="text-[11px] font-black tracking-widest uppercase text-neutral-500 group-hover:text-neutral-300 transition-colors">{key}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {activeTab === 'assets' && (
                    <div className="flex flex-col gap-6">
                      <button
                        onClick={() => {
                          setIsLibraryOpen(true);
                        }}
                        className="w-full h-24 flex flex-col items-center justify-center rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xl shadow-indigo-600/10 group active:scale-[0.98] border border-white/10"
                      >
                        <Library className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[13px] font-black tracking-tight">Open Media Library</span>
                      </button>
                      
                      {sections.assets.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Persistent Assets</span>
                            <button 
                                onClick={() => {
                                    setSections(prev => ({ ...prev, assets: [] }));
                                }}
                                className="text-[9px] font-bold text-neutral-600 hover:text-neutral-400 transition-colors uppercase tracking-widest"
                            >
                                Clear All
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {sections.assets.map((url, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                    // Add image to selected or body
                                    const template = COMPONENT_TEMPLATES['image'];
                                    const newComp = {
                                        id: generateId(),
                                        type: 'image',
                                        content: url,
                                        styles: { ...template.styles },
                                        children: undefined
                                    };
                                    
                                    // Reuse handleAddComponent logic if possible, or manual add
                                    if (selectedId) {
                                         // manual add to selected logic... reusing simplified here
                                         // For now just add to body to be safe or use handleAddComponent if I can trigger it with content override
                                         // Actually better to just setSections manually here to use the URL
                                         setSections(prev => ({
                                             ...prev,
                                             body: [...prev.body, newComp as any]
                                         }));
                                         toast.success("Added image from library");
                                    } else {
                                        setSections(prev => ({
                                            ...prev,
                                            body: [...prev.body, newComp as any]
                                        }));
                                        toast.success("Added image from library");
                                    }
                                }}
                                className="aspect-square rounded-xl bg-white/[0.03] border border-white/[0.05] overflow-hidden group relative hover:border-indigo-500/50 transition-all cursor-grab active:cursor-grabbing"
                              >
                                <img src={url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <Plus className="w-5 h-5 text-white" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {sections.assets.length === 0 && (
                        <div className="py-12 px-6 rounded-3xl border border-dashed border-white/5 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-white/[0.02] flex items-center justify-center mb-4">
                                <Library className="w-5 h-5 text-neutral-700" />
                            </div>
                            <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest leading-loose">
                                Your saved assets <br/> will appear here
                            </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

        {/* MAIN EDITOR AREA */}
        <main className="flex-1 flex flex-col relative bg-[#050505]">
            {/* TOP BAR */}
            <header className="h-16 border-b border-white/5 bg-[#0F0F10] flex items-center justify-between px-6 z-30 shrink-0">
                <div className="flex items-center gap-4">
                    {!isPreview && (
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-neutral-500 tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Editor v2.0
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                     <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                        <button onClick={() => setPreviewMode('desktop')} className={cn("p-1.5 rounded-md transition-all", previewMode === 'desktop' ? "bg-white/10 text-white" : "text-neutral-500")}><Monitor className="w-4 h-4" /></button>
                        <button onClick={() => setPreviewMode('laptop')} className={cn("p-1.5 rounded-md transition-all", previewMode === 'laptop' ? "bg-white/10 text-white" : "text-neutral-500")}><Laptop className="w-4 h-4" /></button>
                        <button onClick={() => setPreviewMode('tablet')} className={cn("p-1.5 rounded-md transition-all", previewMode === 'tablet' ? "bg-white/10 text-white" : "text-neutral-500")}><TabletIcon className="w-4 h-4" /></button>
                        <button onClick={() => setPreviewMode('mobile')} className={cn("p-1.5 rounded-md transition-all", previewMode === 'mobile' ? "bg-white/10 text-white" : "text-neutral-500")}><Smartphone className="w-4 h-4" /></button>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <button onClick={() => setIsPreview(!isPreview)} className="text-sm font-bold text-neutral-300 hover:text-white flex items-center gap-2">
                        {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {isPreview ? 'Stop Preview' : 'Preview'}
                    </button>
                    <button onClick={() => handleSave()} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                        {isSaving ? <Loader size="sm" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                </div>
            </header>

            {/* CANVAS */}
            <div 
                className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px]" 
                onClick={() => setSelectedId(null)}
            >
                <EditorMediaModal 
                  isOpen={isLibraryOpen} 
                  onClose={() => setIsLibraryOpen(false)}
                  onSelectImage={(url) => {
                      if (url) {
                          setSections(prev => ({ ...prev, assets: [...prev.assets, url] }));
                          toast.success("Saved to assets");
                      }
                  }}
                  onImportCollection={(urls) => {
                        setSections(prev => ({ ...prev, assets: [...prev.assets, ...urls] }));
                        toast.success(`Imported ${urls.length} items`);
                        setIsLibraryOpen(false);
                  }}
                  currentAssets={sections.assets}
                />
                
                <div 
                    id="canvas-area"
                    className={cn(
                        "mx-auto bg-black transition-all shadow-2xl relative min-h-[800px] h-full",
                        previewMode === 'desktop' && "w-full",
                        previewMode === 'laptop' && "w-[1280px]",
                        previewMode === 'tablet' && "w-[768px]",
                        previewMode === 'mobile' && "w-[375px]"
                    )}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.dataTransfer.dropEffect = 'copy';
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(false);

                        const type = e.dataTransfer.getData('type') as ComponentType;
                        const templateKey = e.dataTransfer.getData('templateKey');
                        
                        if (templateKey && type === 'section' as any) {
                             // Handle Section Drop (e.g. Hero, About)
                             const template = SECTION_TEMPLATES[templateKey as keyof typeof SECTION_TEMPLATES];
                             if (template) {
                                 // For now, section templates might act as "groups" or just piles of elements
                                 // Since we are free-form, we might want to drop them at 0,0 or relative to drop
                                 // Let's just append them for now (preserving their relative offsets if we had them, but we don't really)
                                 // Simple fallback: just add them.
                                 const components = (template as any).components.map((c: any) => ({
                                    ...c,
                                    id: generateId(),
                                    children: c.children ? c.children.map((child: any) => ({...child, id: generateId()})) : undefined
                                 }));
                                 setSections(prev => ({ ...prev, body: [...prev.body, ...components] }));
                                 toast.success(`Added ${template.label}`);
                             }
                        } else if (type) {
                            // Elements drop
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;

                            const template = COMPONENT_TEMPLATES[type];
                            if (!template) return;

                            const newComponent = {
                                id: generateId(),
                                type: type,
                                content: template.content,
                                styles: { 
                                    ...template.styles,
                                    position: 'absolute',
                                    left: `${x}px`,
                                    top: `${y}px`
                                },
                                children: template.children ? [] : undefined
                            };

                            setSections(prev => ({
                                ...prev,
                                body: [...prev.body, newComponent]
                            }));
                            toast.success(`Added ${type}`);
                        }
                    }}
                >
                    {!isPreview && sections.body.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-gray-500 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
                                <p className="text-lg font-medium mb-2">Free-Form Canvas</p>
                                <p className="text-sm">Drag elements here and place them anywhere!</p>
                            </div>
                        </div>
                    )}

                    {sections.body.map((comp) => (
                        <EditorBlock 
                            key={comp.id}
                            component={comp}
                            selectedId={selectedId}
                            onSelect={(id) => setSelectedId(id)}
                            onUpdate={handleUpdateComponent}
                            isDragging={isDragging}
                            isPreview={isPreview}
                        />
                    ))}
                </div>
            </div>

            {/* PROPERTIES PANEL */}
            {!isPreview && selectedId && (() => {
                const selectedComponent = 
                    findComponentById(sections.header, selectedId) || 
                    findComponentById(sections.body, selectedId) || 
                    findComponentById(sections.footer, selectedId);
                
                if (!selectedComponent) return null;

                return (
                    <div className="absolute right-0 top-16 bottom-0 z-40 h-[calc(100vh-64px)]">
                        <PropertiesPanel 
                            component={selectedComponent}
                            onUpdate={handleUpdateComponent}
                            onDelete={handleDeleteComponent}
                        />
                    </div>
                );
            })()}
        </main>
    </div>
  );
}
