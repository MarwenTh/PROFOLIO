"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { EditorComponent, EditorSection } from '@/lib/editor-types';
import { generateId } from '@/lib/editor-utils';

interface EditorState {
  sections: EditorSection[];
  selectedId: string | null;
  selectedSectionId: string | null;
  scale: number;
  pan: { x: number, y: number };
  device: 'mobile' | 'tablet' | 'desktop';
  isMediaModalOpen: boolean;
  activeTool: string;
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    componentId: string | null;
    sectionId: string | null;
  };
}

interface EditorContextType extends EditorState {
  // Component Actions
  addComponent: (sectionId: string, component: Omit<EditorComponent, 'id'>) => void;
  updateComponent: (id: string, updates: Partial<EditorComponent>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  
  // Section Actions
  addSection: (index?: number) => void;
  addSectionWithTemplate: (templateName: string) => void;
  updateSection: (id: string, updates: Partial<EditorSection>) => void;
  removeSection: (id: string) => void;
  selectSection: (id: string | null) => void;
  reorderSections: (newSections: EditorSection[]) => void;

  // Viewport Actions
  setScale: (scale: number) => void;
  setPan: (pan: { x: number, y: number }) => void;
  setDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;
  setMediaModalOpen: (open: boolean) => void;
  setActiveTool: (tool: string) => void;
  
  // Context Menu Actions
  openContextMenu: (x: number, y: number, componentId: string | null, sectionId: string | null) => void;
  closeContextMenu: () => void;
  setElementAsBackground: (componentId: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children, initialSections = [] }: { children: ReactNode, initialSections?: EditorSection[] }) => {
  const [sections, setSections] = useState<EditorSection[]>(initialSections.length > 0 ? initialSections : [
    { id: 'header-section', type: 'header', height: 100, styles: { backgroundColor: '#ffffff' }, components: [] },
    { id: 'body-section', type: 'body', height: 600, styles: { backgroundColor: '#f9f9f9' }, components: [] },
    { id: 'footer-section', type: 'footer', height: 200, styles: { backgroundColor: '#333333' }, components: [] }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [activeTool, setActiveTool] = useState('select');
  const [isMediaModalOpen, setMediaModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    componentId: null,
    sectionId: null
  } as EditorState['contextMenu']);

  const openContextMenu = useCallback((x: number, y: number, componentId: string | null, sectionId: string | null) => {
    setContextMenu({ isOpen: true, x, y, componentId, sectionId });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);

  const setElementAsBackground = useCallback((componentId: string) => {
    setSections(prev => {
      // 1. Find the component and its current section
      let currentSectionIndex = -1;
      let targetComp: EditorComponent | null = null;
      
      for (let i = 0; i < prev.length; i++) {
        const comp = prev[i].components.find(c => c.id === componentId);
        if (comp) {
          currentSectionIndex = i;
          targetComp = comp;
          break;
        }
      }

      if (!targetComp || currentSectionIndex === -1) return prev;

      // 2. Calculate global Y to find which section it's visually in
      const displayY = (device !== 'desktop' && targetComp.responsive?.[device]) 
        ? targetComp.responsive[device].y 
        : targetComp.y;

      // Calculate where the current section starts
      let sectionStart = 0;
      for (let i = 0; i < currentSectionIndex; i++) {
        sectionStart += prev[i].height;
      }
      
      const globalY = sectionStart + displayY;

      // 3. Find the target section index
      let targetSectionIndex = 0;
      let runningHeight = 0;
      for (let i = 0; i < prev.length; i++) {
        const h = prev[i].height;
        if (globalY >= runningHeight && globalY < runningHeight + h) {
          targetSectionIndex = i;
          break;
        }
        runningHeight += h;
        // If it's below the last section, stick to the last section
        if (i === prev.length - 1) targetSectionIndex = i;
      }

      // 4. Update the component with background properties
      const updatedSection = prev[targetSectionIndex];
      const updatedComp: EditorComponent = {
        ...targetComp,
        x: 0,
        y: 0,
        width: 1280,
        height: updatedSection.height,
        zIndex: 0,
        responsive: {
          ...targetComp.responsive,
          mobile: {
            ...targetComp.responsive?.mobile,
            x: 0, y: 0, width: 375, height: updatedSection.height, zIndex: 0,
            styles: { ...targetComp.styles, isBackground: true }
          },
          tablet: {
            ...targetComp.responsive?.tablet,
            x: 0, y: 0, width: 768, height: updatedSection.height, zIndex: 0,
            styles: { ...targetComp.styles, isBackground: true }
          }
        },
        styles: {
          ...targetComp.styles,
          isBackground: true
        }
      };

      // 5. Build new sections array
      return prev.map((section, idx) => {
        // Remove from old section
        if (idx === currentSectionIndex && idx !== targetSectionIndex) {
          return {
            ...section,
            components: section.components.filter(c => c.id !== componentId)
          };
        }
        // Add (and update) in target section
        if (idx === targetSectionIndex) {
          const filteredComps = section.components.filter(c => c.id !== componentId);
          return {
            ...section,
            components: [updatedComp, ...filteredComps]
          };
        }
        return section;
      });
    });
    closeContextMenu();
  }, [closeContextMenu, device]);

  // --- Section Actions ---
  const addSection = useCallback((index?: number) => {
    const newSection: EditorSection = {
      id: generateId(),
      type: 'custom',
      height: 400,
      styles: { backgroundColor: '#ffffff' },
      components: []
    };
    setSections(prev => {
      const next = [...prev];
      if (index !== undefined) next.splice(index, 0, newSection);
      else next.push(newSection);
      return next;
    });
  }, []);

  const addSectionWithTemplate = useCallback((templateName: string) => {
    const sectionId = generateId();
    let components: any[] = [];
    let height = 600;

    if (templateName === 'Minimal Hero') {
        height = 500;
        components = [
            { id: generateId(), type: 'text', content: 'Modern Design for Your Portfolio', x: 50, y: 150, width: 600, height: 80, styles: { fontSize: '48px', fontWeight: '800' } },
            { id: generateId(), type: 'text', content: 'Build something beautiful with our drag and drop editor.', x: 50, y: 240, width: 450, height: 60, styles: { fontSize: '18px', color: '#666' } },
            { id: generateId(), type: 'button', content: 'Get Started', x: 50, y: 320, width: 160, height: 50, styles: { backgroundColor: '#6366f1', color: '#fff', borderRadius: '8px' } }
        ];
    } else if (templateName === 'Feature Grid') {
        height = 600;
        components = [
            { id: generateId(), type: 'text', content: 'Our Features', x: 400, y: 50, width: 400, height: 40, styles: { fontSize: '32px', fontWeight: '700', textAlign: 'center' } },
            { id: generateId(), type: 'container', content: '', x: 50, y: 150, width: 330, height: 350, styles: { backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } },
            { id: generateId(), type: 'container', content: '', x: 425, y: 150, width: 330, height: 350, styles: { backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } },
            { id: generateId(), type: 'container', content: '', x: 800, y: 150, width: 330, height: 350, styles: { backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }
        ];
    }

    const newSection: EditorSection = {
        id: sectionId,
        type: 'custom',
        height,
        styles: { backgroundColor: '#f8fafc' },
        components
    };

    setSections(prev => [...prev, newSection]);
    setActiveTool('select');
  }, []);

  const updateSection = useCallback((id: string, updates: Partial<EditorSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const removeSection = useCallback((id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  }, []);

  const selectSection = useCallback((id: string | null) => {
    setSelectedSectionId(id);
    if (id) setSelectedId(null);
  }, []);

  const reorderSections = useCallback((newSections: EditorSection[]) => {
    setSections(newSections);
  }, []);

  // --- Component Actions ---
  const addComponent = useCallback((sectionId: string, componentData: Omit<EditorComponent, 'id'>) => {
    const newComponent: EditorComponent = {
      ...componentData,
      id: generateId(),
      x: componentData.x || 50,
      y: componentData.y || 50,
      width: componentData.width || 200,
      height: componentData.height || 100,
      styles: componentData.styles || {}
    };

    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return { ...section, components: [...section.components, newComponent] };
      }
      return section;
    }));
    setSelectedId(newComponent.id);
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<EditorComponent>) => {
    setSections(prev => prev.map(section => ({
      ...section,
      components: section.components.map(comp => {
        if (comp.id !== id) return comp;

        // If we are on mobile/tablet, we store positioning updates in the responsive object
        if (device !== 'desktop' && (updates.x !== undefined || updates.y !== undefined || updates.width !== undefined || updates.height !== undefined)) {
          const currentResponsive = comp.responsive || {};
          const deviceData = currentResponsive[device] || { x: comp.x, y: comp.y, width: comp.width, height: comp.height };
          
          return {
            ...comp,
            responsive: {
              ...currentResponsive,
              [device]: {
                ...deviceData,
                ...updates
              }
            }
          };
        }

        // Default: Update top-level properties (Desktop or non-positioning props)
        return { ...comp, ...updates };
      })
    })));
  }, [device]);

  const removeComponent = useCallback((id: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      components: section.components.filter(c => c.id !== id)
    })));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const selectComponent = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) setSelectedSectionId(null);
  }, []);

  return (
    <EditorContext.Provider value={{
      sections,
      selectedId,
      selectedSectionId,
      scale,
      addComponent,
      updateComponent,
      removeComponent,
      selectComponent,
      addSection,
      addSectionWithTemplate,
      updateSection,
      removeSection,
      selectSection,
      reorderSections,
      setScale,
      pan,
      setPan,
      device,
      setDevice,
      activeTool,
      setActiveTool,
      isMediaModalOpen,
      setMediaModalOpen,
      contextMenu,
      openContextMenu,
      closeContextMenu,
      setElementAsBackground
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
