"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const { getPortfolioBySlug, loading } = usePortfolio(); // Need to add this to hook
  const [portfolio, setPortfolio] = useState<any>(null);
  const [sections, setSections] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      getPortfolioBySlug(slug as string).then(res => {
        if (res.success) {
          setPortfolio(res.portfolio);
          const content = res.portfolio.content;
          
          if (Array.isArray(content)) {
            setSections({ header: [], body: content, footer: [] });
          } else {
            setSections(content);
          }
        }
      });
    }
  }, [slug, getPortfolioBySlug]);

  if (loading || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const { header = [], body = [], footer = [] } = sections || {};

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-emerald-500/20">
      <title>{`${portfolio.title} | PROFOLIO`}</title>
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        {header.length > 0 && (
          <header className="space-y-8 mb-16">
            {header.map((comp: any) => (
              <RenderComponent key={comp.id} comp={comp} />
            ))}
          </header>
        )}

        {/* Body */}
        <main className="space-y-12 mb-16">
          {body.map((comp: any) => (
            <RenderComponent key={comp.id} comp={comp} />
          ))}
        </main>

        {/* Footer */}
        {footer.length > 0 && (
          <footer className="space-y-8 pt-16 border-t border-neutral-100 dark:border-white/5">
            {footer.map((comp: any) => (
              <RenderComponent key={comp.id} comp={comp} />
            ))}
            
            <div className="pt-20 pb-12 flex items-center justify-center">
              <div className="px-4 py-2 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Built with PROFOLIO</span>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

function RenderComponent({ comp }: { comp: any }) {
  // Extract layout styles for the wrapper
  const { left, top, position, width, height, ...visualStyles } = comp.styles || {};
  
  // Default to absolute if x/y exist, else relative (backward compat)
  const isAbsolute = left !== undefined && top !== undefined;

  const wrapperStyles: any = {
      position: isAbsolute ? 'absolute' : 'relative',
      left,
      top,
      width,
      height,
      zIndex: 10
  };

  const Content = () => {
      if (comp.type === 'text') {
        return (
          <h2 
            style={visualStyles} 
            className="tracking-tight leading-[1.1] selection:bg-emerald-500/20 break-words"
          >
            {comp.content}
          </h2>
        );
      }
      
      if (comp.type === 'image') {
        return (
            <img 
              src={comp.content} 
              style={{...visualStyles, width: '100%', height: '100%'}}
              className="object-cover shadow-2xl rounded-3xl"
              alt="Portfolio element"
            />
        );
      }
    
      if (comp.type === 'button') {
        return (
            <button 
              style={visualStyles}
              className="font-black text-xl px-10 py-5 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20"
            >
              {comp.content}
            </button>
        );
      }
    
      if (comp.type === 'divider') {
        return <div style={{...visualStyles, width: '100%', height: '1px', backgroundColor: visualStyles.backgroundColor || '#e5e5e5'}} />;
      }
    
      if (comp.type === 'socials') {
        return (
          <div className="flex flex-wrap gap-3" style={visualStyles}>
            {comp.content.map((social: any, idx: number) => (
              <a 
                key={idx} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
              >
                {social.platform === 'github' && <Github className="w-5 h-5" />}
                {social.platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                {social.platform === 'twitter' && <Twitter className="w-5 h-5" />}
              </a>
            ))}
          </div>
        );
      }

      if (comp.type === 'video') {
         return (
             <div style={visualStyles} className="relative bg-black/10 overflow-hidden rounded-xl">
                {comp.content && (
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={comp.content} 
                        title="Video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                )}
             </div>
         );
      }

      return null;
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={wrapperStyles}
    >
        <Content />
    </motion.div>
  );
}
