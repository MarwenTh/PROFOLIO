export type ComponentType = 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'divider' 
  | 'socials' 
  | 'container' 
  | 'row' 
  | 'column' 
  | 'spacer' 
  | 'icon' 
  | 'video';

export interface EditorComponent {
  id: string;
  type: ComponentType;
  content: any;
  styles: Record<string, any>;
  
  // Positioning (Now relative to section)
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number; // In degrees
  zIndex?: number;
  
  children?: EditorComponent[];
  responsive?: {
    mobile?: { x: number, y: number, width: number, height: number };
    tablet?: { x: number, y: number, width: number, height: number };
  };
}

export interface EditorSection {
  id: string;
  type: 'header' | 'body' | 'footer' | 'custom';
  styles: Record<string, any>; // Background, padding, etc.
  height: number;
  components: EditorComponent[];
}

export interface EditorSections {
  header: EditorComponent[];
  body: EditorComponent[];
  footer: EditorComponent[];
  // Assets are stored separately as a simple list of URLs
  assets: string[];
}

export type SectionKey = keyof EditorSections;
