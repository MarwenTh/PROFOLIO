export type ComponentType =
  | "text"
  | "image"
  | "button"
  | "divider"
  | "socials"
  | "container"
  | "row"
  | "column"
  | "spacer"
  | "icon"
  | "video"
  | "split-text"
  | "shiny-text"
  | "aurora-bg"
  | "shiny-button"
  | "blur-text"
  | "gradient-text"
  | "count-up"
  | "text-pressure"
  | "squares-bg"
  | "hyperspeed-bg"
  | "particles-bg"
  | "waves-bg"
  | "tilted-card"
  | "spotlight-card"
  | "pixel-card"
  | "liquid-chrome"
  | "glitch-text"
  // Portfolio Blocks — Core
  | "block-hero"
  | "block-about"
  | "block-skills"
  | "block-projects"
  | "block-experience"
  | "block-testimonials"
  | "block-contact"
  | "block-stats"
  | "block-cta"
  | "block-social-bar"
  | "block-footer"
  // Portfolio Blocks — Extended
  | "block-pricing"
  | "block-blog"
  | "block-resume"
  | "block-gallery"
  | "block-faq"
  | "block-services"
  | "block-team"
  | "block-awards"
  | "block-education"
  // Background types
  | "bg-gradient"
  | "bg-mesh"
  | "bg-pattern"
  // Pre-styled button variants
  | "btn-primary"
  | "btn-outline"
  | "btn-ghost"
  | "btn-pill"
  | "btn-glow"
  // Iconify icon
  | "iconify-icon";

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
  animation?: {
    type: string;
    duration?: number;
    delay?: number;
    once?: boolean;
    engine?: "framer" | "gsap";
  };
  responsive?: {
    mobile?: {
      x: number;
      y: number;
      width: number;
      height: number;
      zIndex?: number;
      styles?: Record<string, any>;
    };
    tablet?: {
      x: number;
      y: number;
      width: number;
      height: number;
      zIndex?: number;
      styles?: Record<string, any>;
    };
    wide?: {
      x: number;
      y: number;
      width: number;
      height: number;
      zIndex?: number;
      styles?: Record<string, any>;
    };
  };
}

export type DeviceType = "mobile" | "tablet" | "desktop" | "wide";

export interface EditorSection {
  id: string;
  type: "header" | "body" | "footer" | "custom";
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
