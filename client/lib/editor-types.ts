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
  children?: EditorComponent[];
}

export interface EditorSections {
  header: EditorComponent[];
  body: EditorComponent[];
  footer: EditorComponent[];
  // Assets are stored separately as a simple list of URLs
  assets: string[];
}

export type SectionKey = keyof EditorSections;
