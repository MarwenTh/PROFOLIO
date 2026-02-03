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
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";

// Types for our editor components
interface EditorComponent {
  id: string;
  type: 'text' | 'image' | 'button';
  content: any;
  styles?: any;
}

const COMPONENT_TEMPLATES = {
  text: { type: 'text', content: 'Double click to edit text', styles: { fontSize: '24px', fontWeight: 'bold' } },
  image: { type: 'image', content: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop', styles: { borderRadius: '12px' } },
  button: { type: 'button', content: 'Click Me', styles: { backgroundColor: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '8px' } },
} as const;

export default function PortfolioEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getPortfolioById, updatePortfolio, loading: apiLoading } = usePortfolio();
  
  const [portfolio, setPortfolio] = useState<any>(null);
  const [components, setComponents] = useState<EditorComponent[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getPortfolioById(id as string).then(res => {
        if (res.success) {
          setPortfolio(res.portfolio);
          setComponents(res.portfolio.content || []);
        }
      });
    }
  }, [id, getPortfolioById]);

  const addComponent = (type: keyof typeof COMPONENT_TEMPLATES) => {
    const newComponent: EditorComponent = {
      id: Math.random().toString(36).substr(2, 9),
      ...COMPONENT_TEMPLATES[type]
    };
    setComponents([...components, newComponent]);
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const updateComponent = (id: string, newContent: any) => {
    setComponents(components.map(c => c.id === id ? { ...c, content: newContent } : c));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updatePortfolio(id as string, { content: components });
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
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
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

            <div className="p-6 space-y-4 overflow-y-auto">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Components</p>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => addComponent('text')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/5 hover:border-emerald-500/50 transition-all group"
                >
                  <Type className="w-5 h-5 text-neutral-500 group-hover:text-emerald-500" />
                  <span className="text-sm font-bold">Text Block</span>
                </button>
                <button 
                  onClick={() => addComponent('image')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/5 hover:border-emerald-500/50 transition-all group"
                >
                  <ImageIcon className="w-5 h-5 text-neutral-500 group-hover:text-emerald-500" />
                  <span className="text-sm font-bold">Image Frame</span>
                </button>
                <button 
                  onClick={() => addComponent('button')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/5 hover:border-emerald-500/50 transition-all group"
                >
                  <MousePointer2 className="w-5 h-5 text-neutral-500 group-hover:text-emerald-500" />
                  <span className="text-sm font-bold">Action Button</span>
                </button>
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
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 h-11 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-black text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Design
              </button>
            )}
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-12 bg-neutral-50 dark:bg-[#080808] relative">
          <div className={cn(
            "max-w-4xl mx-auto min-h-screen bg-white dark:bg-black shadow-2xl rounded-3xl p-12 relative transition-all duration-500",
            isPreview ? "border-0 shadow-none" : "border border-neutral-200 dark:border-white/5"
          )}>
            {/* Draggable Components */}
            <Reorder.Group axis="y" values={components} onReorder={setComponents} className="space-y-6">
              {components.map((comp) => (
                <Reorder.Item 
                  key={comp.id} 
                  value={comp}
                  className="relative group/item"
                >
                   {!isPreview && (
                    <button 
                      onClick={() => removeComponent(comp.id)}
                      className="absolute -right-4 top-0 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity z-20 hover:scale-110 active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className={cn(
                    "p-4 rounded-2xl transition-all relative",
                    !isPreview && "hover:ring-2 hover:ring-emerald-500/50 cursor-grab active:cursor-grabbing"
                  )}>
                    {comp.type === 'text' && (
                      <h2 
                        style={comp.styles} 
                        className="outline-none tracking-tight p-2"
                        contentEditable={!isPreview}
                        suppressContentEditableWarning
                        onBlur={(e) => updateComponent(comp.id, e.currentTarget.textContent)}
                      >
                        {comp.content}
                      </h2>
                    )}
                    {comp.type === 'image' && (
                      <div className="relative group/img">
                        <motion.img 
                          src={comp.content} 
                          style={comp.styles}
                          className="w-full h-auto object-cover shadow-2xl rounded-2xl"
                          whileHover={isPreview ? { scale: 1.01 } : {}}
                        />
                        {!isPreview && (
                          <button 
                            onClick={() => {
                              const url = prompt("Enter Image URL", comp.content);
                              if (url) updateComponent(comp.id, url);
                            }}
                            className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                    {comp.type === 'button' && (
                      <div className="relative group/btn">
                        <button 
                          style={comp.styles}
                          className="font-black text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/10"
                        >
                          {comp.content}
                        </button>
                        {!isPreview && (
                          <button 
                            onClick={() => {
                              const text = prompt("Enter Button Text", comp.content);
                              if (text) updateComponent(comp.id, text);
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-neutral-900 border border-white/10 text-white rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {components.length === 0 && !isPreview && (
              <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-neutral-200 dark:border-white/5 rounded-3xl text-neutral-400">
                <Plus className="w-12 h-12 mb-4 animate-pulse" />
                <p className="font-bold">Drag and drop components from the sidebar</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
