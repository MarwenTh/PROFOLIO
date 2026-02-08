"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { 
  Save, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Share2, 
  ChevronRight,
  ChevronLeft,
  GripVertical,
  ImageIcon,
  Github,
  Linkedin,
  Twitter,
  Library,
  Smartphone,
  Tablet as TabletIcon,
  Monitor,
  Laptop,
  Type,
  MousePointer2,
  Minus,
  Globe,
  Settings,
  Layout,
  User,
  Mail
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/Loader";
import { EditorMediaModal } from "@/components/library/EditorMediaModal";
import { toast } from "sonner";

// Helper for URL comparison
const getIdentifier = (url: string) => url.split('?')[0].trim();

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
  assets: string[];
}

const COMPONENT_TEMPLATES = {
  text: { type: 'text', content: 'Double click to edit text', styles: { fontSize: '24px', fontWeight: 'bold' } },
  image: { type: 'image', content: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop', styles: { borderRadius: '12px' } },
  button: { type: 'button', content: 'Click Me', styles: { backgroundColor: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '8px' } },
  divider: { type: 'divider', content: '', styles: { height: '1px', backgroundColor: '#e5e5e5', width: '100%', margin: '24px 0' } },
  socials: { type: 'socials', content: [{ platform: 'github', url: '#' }, { platform: 'linkedin', url: '#' }], styles: { gap: '12px' } },
} as const;

const SECTION_TEMPLATES = {
  hero: {
    label: 'Hero Section',
    icon: Layout,
    description: 'Header & CTA',
    components: [
      { type: 'text', content: 'Design Your Future', styles: { fontSize: '64px', fontWeight: '900', textAlign: 'center', marginBottom: '12px' } },
      { type: 'text', content: 'The ultimate professional portfolio builder for creators.', styles: { fontSize: '18px', textAlign: 'center', color: '#666', marginBottom: '32px' } },
      { type: 'button', content: 'Get Started', styles: { backgroundColor: '#10b981', color: '#fff', padding: '16px 40px', borderRadius: '12px', margin: '0 auto', display: 'block' } }
    ]
  },
  about: {
    label: 'About Me',
    icon: User,
    description: 'Personal story',
    components: [
      { type: 'text', content: 'About Me', styles: { fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' } },
      { type: 'text', content: 'I am a passionate designer focused on creating minimal and functional user interfaces.', styles: { fontSize: '16px', lineHeight: '1.6', color: '#444' } }
    ]
  },
  contact: {
    label: 'Contact',
    icon: Mail,
    description: 'Get in touch',
    components: [
      { type: 'text', content: 'Let\'s Connect', styles: { fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' } },
      { type: 'socials', content: [{ platform: 'github', url: '#' }, { platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }], styles: { gap: '24px', justifyContent: 'center' } }
    ]
  }
} as const;

export default function PortfolioEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getPortfolioById, updatePortfolio, loading: apiLoading } = usePortfolio();
  
  const [portfolio, setPortfolio] = useState<any>(null);
  const [sections, setSections] = useState<EditorSections>({
    header: [],
    body: [],
    footer: [],
    assets: []
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'laptop' | 'desktop'>('desktop');
  const [hoveredItem, setHoveredItem] = useState<{ name: string; top: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'elements' | 'assets'>('templates');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sidebarTabs = [
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'elements', label: 'Elements', icon: Plus },
    { id: 'assets', label: 'Assets', icon: Library },
  ];

  useEffect(() => {
    if (id) {
      // 1. Restore Active Tab
      const savedTab = localStorage.getItem(`editor_tab_${id}`);
      if (savedTab && ['templates', 'elements', 'assets'].includes(savedTab)) {
        setActiveTab(savedTab as any);
      }

      // 2. Restore Library Modal State
      const savedLibraryOpen = localStorage.getItem(`editor_library_open_${id}`);
      if (savedLibraryOpen === 'true') {
        setIsLibraryOpen(true);
      }

      getPortfolioById(id as string).then(res => {
        if (res.success) {
          setPortfolio(res.portfolio);
          const content = res.portfolio.content;
          
          // Data Normalization: Handle old array-only format
          if (Array.isArray(content)) {
            setSections({ header: [], body: content, footer: [], assets: [] });
          } else if (content && typeof content === 'object') {
            setSections({
              header: content.header || [],
              body: content.body || [],
              footer: content.footer || [],
              assets: content.assets || []
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

  const addSection = (templateKey: keyof typeof SECTION_TEMPLATES) => {
    const template = SECTION_TEMPLATES[templateKey];
    const newComponents = template.components.map(comp => ({
      id: Math.random().toString(36).substr(2, 9),
      ...comp
    }));
    setSections(prev => ({
      ...prev,
      body: [...prev.body, ...newComponents]
    }));
  };

  const removeComponent = (section: keyof Omit<EditorSections, 'assets'>, id: string) => {
    setSections(prev => ({
      ...prev,
      [section]: (prev[section] as EditorComponent[]).filter(c => c.id !== id)
    }));
  };

  const isAddedToAssets = (url: string) => {
    const assetIdentifiers = sections.assets.map(getIdentifier);
    return assetIdentifiers.includes(getIdentifier(url));
  };

  const updateComponent = (section: keyof Omit<EditorSections, 'assets'>, id: string, newContent: any, newStyles?: any) => {
    setSections(prev => ({
      ...prev,
      [section]: (prev[section] as EditorComponent[]).map(c => c.id === id ? { 
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
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-neutral-100 transition-colors duration-300 overflow-hidden font-sans">
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
                      localStorage.setItem(`editor_tab_${id}`, tab.id);
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
            className="bg-[#0F0F10] shadow-[10px_0_30px_rgba(0,0,0,0.5)] h-full z-40 relative flex flex-col overflow-hidden"
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
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("sectionTemplate", key);
                            setIsDragging(true);
                          }}
                          onDragEnd={() => setIsDragging(false)}
                          onClick={() => addSection(key as keyof typeof SECTION_TEMPLATES)}
                          className="p-5 rounded-2xl bg-[#1A1A1E] border border-white/[0.03] hover:border-white/[0.1] hover:bg-[#232328] transition-all group text-left"
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

                        return (
                          <button
                            key={key}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("componentType", key);
                              setIsDragging(true);
                            }}
                            onDragEnd={() => setIsDragging(false)}
                            onClick={() => addComponent('body', key as keyof typeof COMPONENT_TEMPLATES)}
                            className="p-5 rounded-3xl bg-[#1A1A1E] border border-white/[0.02] hover:bg-[#232328] hover:border-white/10 transition-all flex flex-col items-center justify-center gap-3 active:scale-[0.98] group"
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
                          localStorage.setItem(`editor_library_open_${id}`, 'true');
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
                                    const newSections = { ...sections, assets: [] };
                                    setSections(newSections);
                                    updatePortfolio(id as string, { content: newSections });
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
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData("imageAsset", url);
                                    setIsDragging(true);
                                }}
                                onDragEnd={() => setIsDragging(false)}
                                onClick={() => {
                                    setSections(prev => ({
                                        ...prev,
                                        body: [...prev.body, { 
                                            id: Math.random().toString(36).substr(2, 9),
                                            ...COMPONENT_TEMPLATES.image,
                                            content: url
                                        }]
                                    }));
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

      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ 
              top: hoveredItem.top,
              left: 90,
              position: "fixed",
              zIndex: 100
            }}
            className="pointer-events-none"
          >
            <div className="flex items-center">
              <div className="w-2 h-4 bg-neutral-900 dark:bg-white transform -translate-x-1" style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }} />
              <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-r-lg rounded-bl-lg shadow-xl whitespace-nowrap">
                {hoveredItem.name}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Toolbar (Refined Header) */}
        <header className="h-20 border-b border-white/[0.03] bg-[#0F0F10]/80 backdrop-blur-2xl flex items-center justify-between px-8 z-30 shrink-0">
          <div className="flex items-center gap-4">
            {!isPreview && (
              <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                Live Editor
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-white/[0.03] rounded-2xl p-1 gap-1 border border-white/[0.05]">
              <DeviceButton 
                active={previewMode === 'desktop'} 
                onClick={() => setPreviewMode('desktop')} 
                icon={Monitor} 
                label="Desktop" 
              />
              <DeviceButton 
                active={previewMode === 'laptop'} 
                onClick={() => setPreviewMode('laptop')} 
                icon={Laptop} 
                label="Laptop" 
              />
              <DeviceButton 
                active={previewMode === 'tablet'} 
                onClick={() => setPreviewMode('tablet')} 
                icon={TabletIcon} 
                label="Tablet" 
              />
              <DeviceButton 
                active={previewMode === 'mobile'} 
                onClick={() => setPreviewMode('mobile')} 
                icon={Smartphone} 
                label="Mobile" 
              />
            </div>

            <div className="w-px h-6 bg-white/[0.08]" />

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPreview(!isPreview)}
                className="px-5 h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] font-bold text-sm transition-all flex items-center gap-2 text-neutral-300 hover:text-white"
              >
                {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isPreview ? 'Exit Preview' : 'Preview'}
              </button>
              {!isPreview && (
                <>
                  <button 
                    onClick={() => handleSave(portfolio?.status === 'published' ? 'draft' : 'published')}
                    className={cn(
                      "px-5 h-11 rounded-xl border font-bold text-sm transition-all flex items-center gap-2 h-11",
                      portfolio?.status === 'published' 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" 
                        : "bg-white/[0.03] text-neutral-400 border-white/[0.05] hover:bg-white/[0.08] hover:text-white"
                    )}
                  >
                    <Globe className="w-4 h-4" />
                    {portfolio?.status === 'published' ? 'Published' : 'Publish'}
                  </button>

                  <button 
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="px-6 h-11 rounded-xl bg-white text-black font-black text-sm transition-all active:scale-95 flex items-center gap-2 shadow-xl hover:shadow-white/5 disabled:opacity-50"
                  >
                    {isSaving ? <Loader size="sm" /> : <Save className="w-4 h-4" />}
                    Save Design
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Editor Area (Optimized Surface) */}
        <div className="flex-1 overflow-y-auto bg-[#050505] relative no-scrollbar selection:bg-indigo-500/30">
          {/* Subtle Dynamic Grid */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
            style={{ 
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, 
                backgroundSize: '40px 40px' 
            }} 
          />
          
          <div className="flex-1 overflow-y-auto no-scrollbar p-12">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const sectionKey = e.dataTransfer.getData("sectionTemplate") as keyof typeof SECTION_TEMPLATES;
                const componentType = e.dataTransfer.getData("componentType") as keyof typeof COMPONENT_TEMPLATES;
                const imageUrl = e.dataTransfer.getData("imageAsset");
                
                if (sectionKey) {
                  addSection(sectionKey);
                } else if (componentType) {
                  addComponent('body', componentType);
                } else if (imageUrl) {
                  setSections(prev => {
                    const newComp: EditorComponent = {
                      id: Math.random().toString(36).substr(2, 9),
                      ...COMPONENT_TEMPLATES.image,
                      content: imageUrl
                    };
                    return {
                      ...prev,
                      body: [...prev.body, newComp]
                    };
                  });
                }
                setIsDragging(false);
              }}
              className={cn(
                "mx-auto bg-white dark:bg-[#121214] shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden",
                isDragging && "ring-4 ring-indigo-500/50 ring-offset-[12px] ring-offset-[#050505]",
                previewMode === 'mobile' && "w-[375px] rounded-[3.5rem] border-[12px] border-[#1A1A1E] min-h-[667px]",
                previewMode === 'tablet' && "w-[768px] rounded-[3rem] border-[10px] border-[#1A1A1E] min-h-[1024px]",
                previewMode === 'laptop' && "w-[1200px] rounded-2xl border-[4px] border-[#1A1A1E] min-h-[800px]",
                previewMode === 'desktop' && "w-full min-h-full"
              )}
              onClick={() => setSelectedId(null)}
            >
              {/* Device Notch for Mobile/Tablet */}
              {(previewMode === 'mobile' || previewMode === 'tablet') && (
                <div className="h-7 w-full flex items-center justify-center pt-1 shrink-0 bg-[#1A1A1E]">
                  <div className="w-20 h-5 rounded-b-2xl bg-[#0F0F10] flex items-center justify-center">
                    <div className="w-8 h-1 rounded-full bg-white/10" />
                  </div>
                </div>
              )}

              <div className={cn(
                "transition-all duration-300 min-h-full pt-16",
                previewMode !== 'desktop' && "p-0 pt-16"
              )}>
                {Object.entries(sections)
                  .filter(([sk]) => sk !== 'assets')
                  .map(([sk, items]) => {
                    const sectionKey = sk as keyof Omit<EditorSections, 'assets'>;
                    const itemsTyped = items as EditorComponent[];
                    const label = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
                  return (
                    <div key={sectionKey} className="group/section">
                      <div className="flex items-center justify-between py-5 px-10 bg-neutral-900/[0.4] border-y border-white/[0.03] opacity-0 group-hover/section:opacity-100 transition-all backdrop-blur-sm sticky top-0 z-20">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">{label} Scope</span>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-indigo-500/20 border border-indigo-500/40" />
                        </div>
                      </div>

                      <Reorder.Group 
                        axis="y" 
                        values={itemsTyped} 
                        onReorder={(newOrder) => setSections(prev => ({ ...prev, [sectionKey]: newOrder }))}
                        className="space-y-6 p-4"
                      >
                        {itemsTyped.map((comp: EditorComponent) => {
                          const isSelected = selectedId === comp.id;
                          return (
                            <Reorder.Item 
                              key={comp.id} 
                              value={comp}
                              transition={{ type: "spring", stiffness: 500, damping: 50, mass: 1 }}
                              className={cn(
                                "relative group transition-all duration-300 rounded-3xl",
                                isSelected ? "ring-2 ring-indigo-500 ring-offset-4 ring-offset-white dark:ring-offset-[#121214] z-50" : "hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(comp.id);
                              }}
                            >
                              {!isPreview && isSelected && (
                                <div className="absolute -top-12 right-0 flex items-center gap-1 p-1 bg-[#0F0F10]/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl z-[60] animate-in fade-in slide-in-from-bottom-2 duration-300">
                                  <div className="p-2 cursor-grab active:cursor-grabbing text-neutral-500 hover:text-white transition-colors">
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </div>
                                  
                                  <div className="w-px h-4 bg-white/10 mx-0.5" />

                                  <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (comp.type === 'text') {
                                          const size = prompt("Font Size (px)", comp.styles?.fontSize);
                                          const color = prompt("Color", comp.styles?.color);
                                          if (size || color) updateComponent(sectionKey, comp.id, null, { fontSize: size, color });
                                        } else if (comp.type === 'button') {
                                          const radius = prompt("Border Radius", comp.styles?.borderRadius);
                                          if (radius) updateComponent(sectionKey, comp.id, null, { borderRadius: radius });
                                        } else if (comp.type === 'divider') {
                                          const bg = prompt("Divider Color", comp.styles?.backgroundColor);
                                          const h = prompt("Height (e.g. 1px)", comp.styles?.height);
                                          if (bg || h) updateComponent(sectionKey, comp.id, null, { backgroundColor: bg, height: h });
                                        }
                                      }}
                                      className="p-2 text-neutral-500 hover:text-emerald-400 transition-colors"
                                      title="Settings"
                                  >
                                      <Settings className="w-3.5 h-3.5" />
                                  </button>

                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeComponent(sectionKey, comp.id);
                                      setSelectedId(null);
                                    }}
                                    className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                              
                              <div className={cn(
                                "rounded-3xl transition-all duration-500 relative",
                                !isPreview && "p-2"
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
                                    {!isPreview && isSelected && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const url = prompt("Enter Image URL", comp.content);
                                          if (url) updateComponent(sectionKey, comp.id, url);
                                        }}
                                        className="absolute top-8 right-8 p-3 bg-black/60 backdrop-blur-xl text-white rounded-2xl transition-all hover:scale-110 active:scale-95 border border-white/20"
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
                                    {!isPreview && isSelected && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const text = prompt("Enter Button Text", comp.content);
                                          if (text) updateComponent(sectionKey, comp.id, text);
                                        }}
                                        className="absolute -top-2 -right-2 p-2 bg-neutral-900 border border-white/10 text-white rounded-full transition-all hover:scale-110"
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
                          );
                        })}
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
          </div>
        </div>
      </main>


      <EditorMediaModal 
        isOpen={isLibraryOpen}
        onClose={() => {
          setIsLibraryOpen(false);
          localStorage.setItem(`editor_library_open_${id}`, 'false');
        }}
        currentAssets={sections.assets}
        onSelectImage={async (url) => {
          const getIdentifier = (u: string) => u.split('?')[0].trim();
          const targetId = getIdentifier(url);
          
          if (sections.assets.some(a => getIdentifier(a) === targetId)) {
            toast.info("Image already in assets");
            return;
          }
          const newSections = {
            ...sections,
            assets: [url, ...sections.assets].slice(0, 12)
          };
          setSections(newSections);
          await updatePortfolio(id as string, { content: newSections });
          toast.success("Added to assets");
        }}
        onImportCollection={async (images) => {
            const newAssets = [...new Set([...images, ...sections.assets])].slice(0, 12);
            const newSections = {
                ...sections,
                assets: newAssets
            };
            setSections(newSections);
            await updatePortfolio(id as string, { content: newSections });
            toast.success(`${images.length} images added to assets`);
        }}
      />
    </div>
  );
}

/**
 * DeviceButton Component for Responsive Controls
 */
function DeviceButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center transition-all group relative overflow-hidden",
        active 
          ? "bg-white/[0.08] text-indigo-400 shadow-sm" 
          : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]"
      )}
    >
      {active && (
        <motion.div 
          layoutId="deviceGlow"
          className="absolute inset-0 bg-indigo-500/5 blur-lg"
        />
      )}
      <Icon className={cn("w-4 h-4 relative z-10 transition-transform", active && "scale-110")} />
    </button>
  );
}
