"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Twitter } from "lucide-react";
import { ShinyText } from '@/components/reactbits/ShinyText';
import { SplitText } from '@/components/reactbits/SplitText';
import { Aurora } from '@/components/reactbits/Aurora';
import { ShinyButton } from '@/components/reactbits/ShinyButton';
import { BlurText } from '@/components/reactbits/BlurText';
import { GradientText } from '@/components/reactbits/GradientText';
import { CountUp } from '@/components/reactbits/CountUp';
import { Squares } from '@/components/reactbits/Squares';
import { Hyperspeed } from '@/components/reactbits/Hyperspeed';
import { Waves } from '@/components/reactbits/Waves';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { TiltedCard } from '@/components/reactbits/TiltedCard';
import { LiquidChrome } from '@/components/reactbits/LiquidChrome';
import { GlitchText } from '@/components/reactbits/GlitchText';

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const { getPortfolioBySlug, loading } = usePortfolio();
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      getPortfolioBySlug(slug as string).then(res => {
        if (res.success) {
          setPortfolio(res.portfolio);
        }
      });
    }
  }, [slug, getPortfolioBySlug]);

  if (loading || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Handle legacy content if it's not an array of sections
  const sections: any[] = Array.isArray(portfolio.content) && portfolio.content[0]?.components 
    ? portfolio.content 
    : [
        { 
          id: 'default-section', 
          type: 'body', 
          height: 800, 
          styles: {}, 
          components: Array.isArray(portfolio.content) ? portfolio.content : [] 
        }
      ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0b] text-neutral-900 dark:text-white">
      <title>{`${portfolio.title} | PROFOLIO`}</title>
      
      <div className="flex flex-col items-center">
        {sections.map((section: any, index: number) => (
          <div 
            key={section.id}
            className="relative w-full"
            style={{
              height: section.height,
              zIndex: 100 - index, // REVERSE stacking allows previous sections to bleed OVER next ones
              ...section.styles
            }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[1280px] h-full">
              {section.components.map((comp: any) => (
                <RenderComponent key={comp.id} comp={comp} />
              ))}
            </div>
          </div>
        ))}

        <div className="py-20 flex items-center justify-center w-full bg-neutral-50 dark:bg-black/20 z-[200] relative">
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Built with PROFOLIO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RenderComponent({ comp }: { comp: any }) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDevice = () => {
    if (windowWidth < 768) return 'mobile';
    if (windowWidth < 1280) return 'tablet';
    return 'desktop';
  };

  const device = getDevice();
  const displayData = (device !== 'desktop' && comp.responsive?.[device]) 
    ? { ...comp, ...comp.responsive[device] }
    : comp;

  const { x, y, width, height, styles = {}, type, content } = displayData;

  // Separate layout (position/size) from visual styling
  const wrapperStyles: any = {
      position: 'absolute',
      left: x,
      top: y,
      width: width,
      height: height,
      zIndex: styles.zIndex || 10,
  };

const Content = () => {
      if (type === 'text') {
        return (
          <div 
            style={styles} 
            className={cn(
                "w-full h-full m-0 break-words whitespace-pre-wrap overflow-visible",
                !styles.fontSize && "text-base",
                !styles.color && "text-neutral-900 dark:text-white"
            )}
          >
            {content || 'New Text'}
          </div>
        );
      }

      if (type === 'split-text') {
        return <SplitText text={content || 'Splitting Text'} className="text-4xl font-black" />;
      }

      if (type === 'shiny-text') {
        return <ShinyText text={content || 'Metallic Shine'} className="text-4xl font-bold" />;
      }

      if (type === 'blur-text') {
        return <BlurText text={content || 'Blurry Reveal'} className="text-4xl font-bold" />;
      }

      if (type === 'gradient-text') {
        return <GradientText text={content || 'Color Flow'} className="text-4xl font-bold" />;
      }

      if (type === 'glitch-text') {
        return <GlitchText text={content || 'System Glitch'} className="text-4xl font-black" />;
      }

      if (type === 'count-up') {
        return <CountUp to={parseInt(content) || 100} className="text-6xl font-black text-indigo-500" />;
      }

      if (type === 'aurora-bg') {
        return <Aurora className="w-full h-full rounded-2xl" />;
      }

      if (type === 'squares-bg') {
        return <Squares className="w-full h-full rounded-2xl" />;
      }

      if (type === 'hyperspeed-bg') {
        return <Hyperspeed className="w-full h-full rounded-2xl" />;
      }

      if (type === 'waves-bg') {
        return <Waves className="w-full h-full rounded-2xl" />;
      }

      if (type === 'liquid-chrome') {
        return <LiquidChrome className="w-full h-full rounded-2xl" />;
      }

      if (type === 'shiny-button') {
        return <ShinyButton text={content || 'Shiny Button'} className="w-full h-full" />;
      }

      if (type === 'spotlight-card') {
        return <SpotlightCard className="w-full h-full">{content || 'Spotlight Content'}</SpotlightCard>;
      }

      if (type === 'tilted-card') {
        return <TiltedCard className="w-full h-full">{content || '3D Card Content'}</TiltedCard>;
      }
      
      if (type === 'image') {
        return (
            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 rounded-md overflow-hidden ring-1 ring-black/5">
                <img 
                    src={content || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7'} 
                    style={styles}
                    className="w-full h-full object-cover"
                    alt=""
                    onError={(e: any) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Load+Error';
                    }}
                />
            </div>
        );
      }
    
      if (type === 'button') {
        return (
            <button 
                style={styles} 
                className={cn(
                    "w-full h-full flex items-center justify-center transition-all hover:opacity-90 active:scale-95",
                    !styles.backgroundColor && "bg-indigo-500",
                    !styles.color && "text-white",
                    !styles.borderRadius && "rounded-lg",
                    !styles.fontSize && "text-sm font-bold"
                )}
            >
              {content || 'Button'}
            </button>
        );
      }

      if (type === 'divider') {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div style={{ height: '1px', backgroundColor: '#e5e5e5', ...styles }} className="w-full" />
            </div>
        );
      }

      if (type === 'socials') {
        return (
            <div style={styles} className="w-full h-full flex items-center justify-center gap-4">
                <Twitter className="w-5 h-5 text-neutral-400" />
                <Linkedin className="w-5 h-5 text-neutral-400" />
                <Github className="w-5 h-5 text-neutral-400" />
            </div>
        );
      }

      if (type === 'spacer') {
        return <div className="w-full h-full" />;
      }

      if (type === 'container') {
          return <div style={styles} className="w-full h-full bg-neutral-50/50 border border-dashed border-neutral-300 rounded" />;
      }
    
      return null;
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={wrapperStyles}
    >
        <Content />
    </motion.div>
  );
}
