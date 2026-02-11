import { EditorComponent, ComponentType } from "./editor-types";
import { Layout, User, Mail, Smartphone, Tablet, Monitor, Laptop } from "lucide-react";

export const COMPONENT_TEMPLATES: Record<ComponentType, Partial<EditorComponent>> = {
  text: { 
    type: 'text', 
    content: 'Double click to edit text', 
    styles: { fontSize: '16px', color: '#ffffff' } 
  },
  image: { 
    type: 'image', 
    content: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop', 
    styles: { borderRadius: '12px', width: '400px', height: 'auto' } 
  },
  button: { 
    type: 'button', 
    content: 'Click Me', 
    styles: { backgroundColor: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' } 
  },
  divider: { 
    type: 'divider', 
    content: '', 
    styles: { height: '1px', backgroundColor: '#e5e5e5', width: '100%', margin: '24px 0' } 
  },
  socials: { 
    type: 'socials', 
    content: [{ platform: 'github', url: '#' }, { platform: 'linkedin', url: '#' }], 
    styles: { gap: '12px', display: 'flex' } 
  },
  container: {
    type: 'container',
    content: '',
    styles: { padding: '20px', border: '1px dashed #ccc', width: '300px', minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(255,255,255,0.05)' },
    children: []
  },
  row: {
    type: 'row',
    content: '',
    styles: { display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', minHeight: '50px' },
    children: []
  },
  column: {
    type: 'column',
    content: '',
    styles: { display: 'flex', flexDirection: 'column', gap: '16px', flex: '1', minHeight: '50px' },
    children: []
  },
  spacer: {
      type: 'spacer',
      content: '',
      styles: { height: '50px', width: '100%' }
  },
  icon: {
      type: 'icon',
      content: 'Star',
      styles: { fontSize: '24px', color: '#ffffff' }
  },
  video: {
      type: 'video',
      content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      styles: { width: '480px', height: '270px' }
  }
};

export const SECTION_TEMPLATES = {
  hero: {
    label: 'Hero Section',
    icon: Layout,
    description: 'Header & CTA',
    components: [
      { 
          id: 'hero-container',
          type: 'container',
          content: '',
          styles: { padding: '60px 20px', textAlign: 'center', backgroundColor: '#111' }, // Dark bg
          children: [
            { id: 't1', type: 'text', content: 'Design Your Future', styles: { fontSize: '64px', fontWeight: '900', marginBottom: '16px', color: '#fff' } },
            { id: 't2', type: 'text', content: 'The ultimate professional portfolio builder.', styles: { fontSize: '20px', color: '#aaa', marginBottom: '32px' } },
            { id: 'b1', type: 'button', content: 'Get Started', styles: { backgroundColor: '#6366f1', color: '#fff', padding: '16px 40px', borderRadius: '12px' } }
          ]
      }
    ]
  },
  about: {
    label: 'About Me',
    icon: User,
    description: 'Personal story',
    components: [
       {
           id: 'about-row',
           type: 'row',
           content: '',
           styles: { gap: '40px', alignItems: 'center', padding: '40px 20px' },
           children: [
               { 
                   id: 'col1', 
                   type: 'column', 
                   content: '', 
                   styles: { flex: '1' }, 
                   children: [
                       { id: 'img1', type: 'image', content: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', styles: { borderRadius: '20px', width: '100%' } }
                   ] 
               },
               { 
                   id: 'col2', 
                   type: 'column', 
                   content: '', 
                   styles: { flex: '1' }, 
                   children: [
                       { id: 't3', type: 'text', content: 'About Me', styles: { fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' } },
                       { id: 't4', type: 'text', content: 'I create digital experiences that matter.', styles: { fontSize: '18px', lineHeight: '1.6', color: '#444' } }
                   ] 
               }
           ]
       }
    ]
  },
  // Add other section templates as needed
} as const;
