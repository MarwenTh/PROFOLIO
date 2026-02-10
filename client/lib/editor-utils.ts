import { EditorComponent, EditorSections } from "./editor-types";

// Helper to generate IDs
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Find a component by ID in a list of components (recursive)
export const findComponentById = (components: EditorComponent[], id: string): EditorComponent | null => {
  for (const component of components) {
    if (component.id === id) return component;
    if (component.children) {
      const found = findComponentById(component.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Update a component by ID in a list (immutable)
export const updateComponentInList = (
  components: EditorComponent[], 
  id: string, 
  updates: Partial<EditorComponent>
): EditorComponent[] => {
  return components.map(component => {
    if (component.id === id) {
      return { ...component, ...updates };
    }
    if (component.children) {
      return {
        ...component,
        children: updateComponentInList(component.children, id, updates)
      };
    }
    return component;
  });
};

// Remove a component by ID from a list (immutable)
export const removeComponentFromList = (
  components: EditorComponent[],
  id: string
): EditorComponent[] => {
  return components
    .filter(c => c.id !== id)
    .map(c => ({
      ...c,
      children: c.children ? removeComponentFromList(c.children, id) : undefined
    }));
};

// Add a component to a parent (or root list)
export const addComponentToParent = (
  components: EditorComponent[],
  parentId: string | null,
  newComponent: EditorComponent
): EditorComponent[] => {
  if (!parentId) {
    // Add to root
    return [...components, newComponent];
  }
  
  return components.map(component => {
    if (component.id === parentId) {
        // Ensure children array exists
        const currentChildren = component.children || [];
        return {
            ...component,
            children: [...currentChildren, newComponent]
        };
    }
    if (component.children) {
      return {
        ...component,
        children: addComponentToParent(component.children, parentId, newComponent)
      };
    }
    return component;
  });
};

// Add a component relative to another component (sibling)
export const addComponentRelative = (
  components: EditorComponent[],
  targetId: string,
  newComponent: EditorComponent,
  position: 'before' | 'after' | 'inside'
): { updated: EditorComponent[], success: boolean } => {
  // 1. Check if target is in current list
  const targetIndex = components.findIndex(c => c.id === targetId);

  if (targetIndex !== -1) {
    // Found target in current list
    if (position === 'inside') {
        // Special case: Add to children of target (if it's a container)
        // This usually should be handled by addComponentToParent, but we can do it here
        const updatedComponents = [...components];
        const target = { ...updatedComponents[targetIndex] };
        target.children = [...(target.children || []), newComponent];
        updatedComponents[targetIndex] = target;
        return { updated: updatedComponents, success: true };
    } else {
        // Insert before or after target in THIS list
        const updatedComponents = [...components];
        const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;
        updatedComponents.splice(insertIndex, 0, newComponent);
        return { updated: updatedComponents, success: true };
    }
  }

  // 2. Recursive search in children
  let success = false;
  const updatedComponents = components.map(component => {
    if (component.children) {
      const result = addComponentRelative(component.children, targetId, newComponent, position);
      if (result.success) {
        success = true; // Mark as found in this branch
        return { ...component, children: result.updated };
      }
    }
    return component;
  });

  return { updated: updatedComponents, success };
};
