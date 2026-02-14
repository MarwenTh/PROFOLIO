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
}

interface EditorContextType extends EditorState {
  // Component Actions
  addComponent: (sectionId: string, component: Omit<EditorComponent, 'id'>) => void;
  updateComponent: (id: string, updates: Partial<EditorComponent>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  
  // Section Actions
  addSection: (index?: number) => void;
  updateSection: (id: string, updates: Partial<EditorSection>) => void;
  removeSection: (id: string) => void;
  selectSection: (id: string | null) => void;
  reorderSections: (newSections: EditorSection[]) => void;

  // Viewport Actions
  setScale: (scale: number) => void;
  setPan: (pan: { x: number, y: number }) => void;
  setDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;
  setMediaModalOpen: (open: boolean) => void;
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
  const [isMediaModalOpen, setMediaModalOpen] = useState(false);

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
      updateSection,
      removeSection,
      selectSection,
      reorderSections,
      setScale,
      pan,
      setPan,
      device,
      setDevice,
      isMediaModalOpen,
      setMediaModalOpen
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
