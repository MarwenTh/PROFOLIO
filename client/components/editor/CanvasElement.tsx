"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { EditorComponent } from '@/lib/editor-types';
import { cn } from '@/lib/utils';
import { useEditor } from '@/context/EditorContext';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import { Trash2, Move } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// ── Text Animations ─────────────────────────────────────────
import {
  BlurText,
  CountUp,
  DecryptedText,
  FuzzyText,
  GlitchText,
  GradientText,
  RotatingText,
  ScrambledText,
  ShinyText,
  SplitText,
  TextType,
  TrueFocus,
  CircularText,
  ScrollFloat,
  ScrollReveal,
  ScrollVelocity,
  Shuffle,
} from '../reactbits';

// ── Backgrounds (dynamic imports for heavy WebGL components) ─
const Aurora = dynamic(() => import('../reactbits/src/Backgrounds/Aurora/Aurora'), { ssr: false });
const Balatro = dynamic(() => import('../reactbits/src/Backgrounds/Balatro/Balatro'), { ssr: false });
const Ballpit = dynamic(() => import('../reactbits/src/Backgrounds/Ballpit/Ballpit'), { ssr: false });
const Beams = dynamic(() => import('../reactbits/src/Backgrounds/Beams/Beams'), { ssr: false });
const ColorBends = dynamic(() => import('../reactbits/src/Backgrounds/ColorBends/ColorBends'), { ssr: false });
const DarkVeil = dynamic(() => import('../reactbits/src/Backgrounds/DarkVeil/DarkVeil'), { ssr: false });
const Dither = dynamic(() => import('../reactbits/src/Backgrounds/Dither/Dither'), { ssr: false });
const DotGrid = dynamic(() => import('../reactbits/src/Backgrounds/DotGrid/DotGrid'), { ssr: false });
const FaultyTerminal = dynamic(() => import('../reactbits/src/Backgrounds/FaultyTerminal/FaultyTerminal'), { ssr: false });
const FloatingLines = dynamic(() => import('../reactbits/src/Backgrounds/FloatingLines/FloatingLines'), { ssr: false });
const Galaxy = dynamic(() => import('../reactbits/src/Backgrounds/Galaxy/Galaxy'), { ssr: false });
const GradientBlinds = dynamic(() => import('../reactbits/src/Backgrounds/GradientBlinds/GradientBlinds'), { ssr: false });
const Grainient = dynamic(() => import('../reactbits/src/Backgrounds/Grainient/Grainient'), { ssr: false });
const GridDistortion = dynamic(() => import('../reactbits/src/Backgrounds/GridDistortion/GridDistortion'), { ssr: false });
const GridMotion = dynamic(() => import('../reactbits/src/Backgrounds/GridMotion/GridMotion'), { ssr: false });
const GridScan = dynamic(() => import('../reactbits/src/Backgrounds/GridScan/GridScan'), { ssr: false });
const Hyperspeed = dynamic(() => import('../reactbits/src/Backgrounds/Hyperspeed/Hyperspeed'), { ssr: false });
const Iridescence = dynamic(() => import('../reactbits/src/Backgrounds/Iridescence/Iridescence'), { ssr: false });
const LetterGlitch = dynamic(() => import('../reactbits/src/Backgrounds/LetterGlitch/LetterGlitch'), { ssr: false });
const LightPillar = dynamic(() => import('../reactbits/src/Backgrounds/LightPillar/LightPillar'), { ssr: false });
const LightRays = dynamic(() => import('../reactbits/src/Backgrounds/LightRays/LightRays'), { ssr: false });
const Lightning = dynamic(() => import('../reactbits/src/Backgrounds/Lightning/Lightning'), { ssr: false });
const LiquidChrome = dynamic(() => import('../reactbits/src/Backgrounds/LiquidChrome/LiquidChrome'), { ssr: false });
const LiquidEther = dynamic(() => import('../reactbits/src/Backgrounds/LiquidEther/LiquidEther'), { ssr: false });
const Orb = dynamic(() => import('../reactbits/src/Backgrounds/Orb/Orb'), { ssr: false });
const Particles = dynamic(() => import('../reactbits/src/Backgrounds/Particles/Particles'), { ssr: false });
const PixelBlast = dynamic(() => import('../reactbits/src/Backgrounds/PixelBlast/PixelBlast'), { ssr: false });
const PixelSnow = dynamic(() => import('../reactbits/src/Backgrounds/PixelSnow/PixelSnow'), { ssr: false });
const Plasma = dynamic(() => import('../reactbits/src/Backgrounds/Plasma/Plasma'), { ssr: false });
const Prism = dynamic(() => import('../reactbits/src/Backgrounds/Prism/Prism'), { ssr: false });
const PrismaticBurst = dynamic(() => import('../reactbits/src/Backgrounds/PrismaticBurst/PrismaticBurst'), { ssr: false });
const RippleGrid = dynamic(() => import('../reactbits/src/Backgrounds/RippleGrid/RippleGrid'), { ssr: false });
const Silk = dynamic(() => import('../reactbits/src/Backgrounds/Silk/Silk'), { ssr: false });
const Squares = dynamic(() => import('../reactbits/src/Backgrounds/Squares/Squares'), { ssr: false });
const Threads = dynamic(() => import('../reactbits/src/Backgrounds/Threads/Threads'), { ssr: false });
const Waves = dynamic(() => import('../reactbits/src/Backgrounds/Waves/Waves'), { ssr: false });

// ── Components (dynamic imports for heavy 3D/WebGL) ──────────
const SpotlightCard = dynamic(() => import('../reactbits/src/Components/SpotlightCard/SpotlightCard'), { ssr: false });
const TiltedCard = dynamic(() => import('../reactbits/src/Components/TiltedCard/TiltedCard'), { ssr: false });
const AnimatedList = dynamic(() => import('../reactbits/src/Components/AnimatedList/AnimatedList'), { ssr: false });
const BounceCards = dynamic(() => import('../reactbits/src/Components/BounceCards/BounceCards'), { ssr: false });
const DecayCard = dynamic(() => import('../reactbits/src/Components/DecayCard/DecayCard'), { ssr: false });
const PixelCard = dynamic(() => import('../reactbits/src/Components/PixelCard/PixelCard'), { ssr: false });
const ProfileCard = dynamic(() => import('../reactbits/src/Components/ProfileCard/ProfileCard'), { ssr: false });
const Stack = dynamic(() => import('../reactbits/src/Components/Stack/Stack'), { ssr: false });
const Folder = dynamic(() => import('../reactbits/src/Components/Folder/Folder'), { ssr: false });
const Dock = dynamic(() => import('../reactbits/src/Components/Dock/Dock'), { ssr: false });
const ElasticSlider = dynamic(() => import('../reactbits/src/Components/ElasticSlider/ElasticSlider'), { ssr: false });
const Carousel = dynamic(() => import('../reactbits/src/Components/Carousel/Carousel'), { ssr: false });
const ChromaGrid = dynamic(() => import('../reactbits/src/Components/ChromaGrid/ChromaGrid'), { ssr: false });
const CircularGallery = dynamic(() => import('../reactbits/src/Components/CircularGallery/CircularGallery'), { ssr: false });
const Counter = dynamic(() => import('../reactbits/src/Components/Counter/Counter'), { ssr: false });
const DomeGallery = dynamic(() => import('../reactbits/src/Components/DomeGallery/DomeGallery'), { ssr: false });
const FlowingMenu = dynamic(() => import('../reactbits/src/Components/FlowingMenu/FlowingMenu'), { ssr: false });
const FluidGlass = dynamic(() => import('../reactbits/src/Components/FluidGlass/FluidGlass'), { ssr: false });
const FlyingPosters = dynamic(() => import('../reactbits/src/Components/FlyingPosters/FlyingPosters'), { ssr: false });
const GlassIcons = dynamic(() => import('../reactbits/src/Components/GlassIcons/GlassIcons'), { ssr: false });
const GlassSurface = dynamic(() => import('../reactbits/src/Components/GlassSurface/GlassSurface'), { ssr: false });
const InfiniteMenu = dynamic(() => import('../reactbits/src/Components/InfiniteMenu/InfiniteMenu'), { ssr: false });
const Lanyard = dynamic(() => import('../reactbits/src/Components/Lanyard/Lanyard'), { ssr: false });
const MagicBento = dynamic(() => import('../reactbits/src/Components/MagicBento/MagicBento'), { ssr: false });
const Masonry = dynamic(() => import('../reactbits/src/Components/Masonry/Masonry'), { ssr: false });
const ModelViewer = dynamic(() => import('../reactbits/src/Components/ModelViewer/ModelViewer'), { ssr: false });
const ScrollStack = dynamic(() => import('../reactbits/src/Components/ScrollStack/ScrollStack'), { ssr: false });
const Stepper = dynamic(() => import('../reactbits/src/Components/Stepper/Stepper'), { ssr: false });
const CardSwap = dynamic(() => import('../reactbits/src/Components/CardSwap/CardSwap'), { ssr: false });
const ReflectiveCard = dynamic(() => import('../reactbits/src/Components/ReflectiveCard/ReflectiveCard'), { ssr: false });

// ── Animations (dynamic imports) ─────────────────────────────
const Antigravity = dynamic(() => import('../reactbits/src/Animations/Antigravity/Antigravity'), { ssr: false });
const BlobCursor = dynamic(() => import('../reactbits/src/Animations/BlobCursor/BlobCursor'), { ssr: false });
const ClickSpark = dynamic(() => import('../reactbits/src/Animations/ClickSpark/ClickSpark'), { ssr: false });
const Crosshair = dynamic(() => import('../reactbits/src/Animations/Crosshair/Crosshair'), { ssr: false });
const Cubes = dynamic(() => import('../reactbits/src/Animations/Cubes/Cubes'), { ssr: false });
const ElectricBorder = dynamic(() => import('../reactbits/src/Animations/ElectricBorder/ElectricBorder'), { ssr: false });
const GlareHover = dynamic(() => import('../reactbits/src/Animations/GlareHover/GlareHover'), { ssr: false });
const ImageTrail = dynamic(() => import('../reactbits/src/Animations/ImageTrail/ImageTrail'), { ssr: false });
const LaserFlow = dynamic(() => import('../reactbits/src/Animations/LaserFlow/LaserFlow'), { ssr: false });
const LogoLoop = dynamic(() => import('../reactbits/src/Animations/LogoLoop/LogoLoop'), { ssr: false });
const Magnet = dynamic(() => import('../reactbits/src/Animations/Magnet/Magnet'), { ssr: false });
const MagnetLines = dynamic(() => import('../reactbits/src/Animations/MagnetLines/MagnetLines'), { ssr: false });
const MetaBalls = dynamic(() => import('../reactbits/src/Animations/MetaBalls/MetaBalls'), { ssr: false });
const MetallicPaint = dynamic(() => import('../reactbits/src/Animations/MetallicPaint/MetallicPaint'), { ssr: false });
const Noise = dynamic(() => import('../reactbits/src/Animations/Noise/Noise'), { ssr: false });
const PixelTrail = dynamic(() => import('../reactbits/src/Animations/PixelTrail/PixelTrail'), { ssr: false });
const PixelTransition = dynamic(() => import('../reactbits/src/Animations/PixelTransition/PixelTransition'), { ssr: false });
const Ribbons = dynamic(() => import('../reactbits/src/Animations/Ribbons/Ribbons'), { ssr: false });
const ShapeBlur = dynamic(() => import('../reactbits/src/Animations/ShapeBlur/ShapeBlur'), { ssr: false });
const SplashCursor = dynamic(() => import('../reactbits/src/Animations/SplashCursor/SplashCursor'), { ssr: false });
const StarBorder = dynamic(() => import('../reactbits/src/Animations/StarBorder/StarBorder'), { ssr: false });
const StickerPeel = dynamic(() => import('../reactbits/src/Animations/StickerPeel/StickerPeel'), { ssr: false });

interface CanvasElementProps {
  component: EditorComponent;
}

export const CanvasElement = ({ component }: CanvasElementProps) => {
    const { 
      selectedId, 
      selectComponent, 
      updateComponent, 
      removeComponent, 
      scale, 
      device,
      openContextMenu 
    } = useEditor();
    const isSelected = selectedId === component.id;
    const elementRef = useRef<HTMLDivElement>(null);
    
    const [isResizing, setIsResizing] = useState(false);
    const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
    const [size, setSize] = useState({ width: component.width, height: component.height });

    const gsapRef = useGSAPAnimation(component.animation);

    const displayData = (device !== 'desktop' && component.responsive?.[device]) 
      ? { ...component, ...component.responsive[device] }
      : component;

    // Sync internal size when component props change
    useEffect(() => {
        if (!isResizing) {
            setSize({ width: displayData.width, height: displayData.height });
        }
    }, [displayData.width, displayData.height, isResizing]);

    const handleResize = (event: any, info: any) => {
        const newWidth = Math.max(50, initialSize.width + info.offset.x / scale);
        const newHeight = Math.max(20, initialSize.height + info.offset.y / scale);
        setSize({ width: newWidth, height: newHeight });
    };

    const handleResizeEnd = () => {
        setIsResizing(false);
        updateComponent(component.id, { width: size.width, height: size.height });
    };

    const handleDragEnd = (event: any, info: any) => {
        const newX = displayData.x + info.offset.x;
        const newY = displayData.y + info.offset.y;
        updateComponent(component.id, { x: newX, y: newY });
    };

    const [isDragOver, setIsDragOver] = useState(false);

    const animationVariants: Record<string, any> = {
      fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
      'slide-up': { initial: { y: 50, opacity: 0 }, animate: { y: displayData.y, opacity: 1 } },
      'slide-down': { initial: { y: -50, opacity: 0 }, animate: { y: displayData.y, opacity: 1 } },
      'slide-left': { initial: { x: 50, opacity: 0 }, animate: { x: displayData.x, opacity: 1 } },
      'slide-right': { initial: { x: -50, opacity: 0 }, animate: { x: displayData.x, opacity: 1 } },
      'scale-up': { initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
      bounce: { initial: { y: -20, opacity: 0 }, animate: { y: displayData.y, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 10 } } },
      rotate: { initial: { rotate: -180, opacity: 0 }, animate: { rotate: 0, opacity: 1 } }
    };

    const currentAnim = component.animation && component.animation.engine !== 'gsap' 
      ? animationVariants[component.animation.type] 
      : null;

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'animation') {
                updateComponent(component.id, { animation: data.animation });
                toast.success(`Animation "${data.animation.type}" applied!`);
            }
        } catch (err) {
            console.error('Failed to parse animation data', err);
        }
    };

    return (
      <motion.div
        ref={(el) => {
            // @ts-ignore
            elementRef.current = el;
            gsapRef.current = el;
        }}
        drag={isResizing ? false : (isSelected ? true : false)}
        dragMomentum={false} 
        dragElastic={0}
        onDragStart={() => selectComponent(component.id)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onContextMenu={(e) => {
          if (!isSelected) return;
          e.preventDefault();
          e.stopPropagation();
          openContextMenu(e.clientX, e.clientY, component.id, null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(component.id);
        }}
        initial={currentAnim ? currentAnim.initial : { x: displayData.x, y: displayData.y, opacity: 0, scale: 0.9 }}
        animate={{ 
          x: component.styles?.isBackground ? 0 : displayData.x, 
          y: component.styles?.isBackground ? 0 : displayData.y, 
          width: isResizing 
            ? size.width 
            : (component.styles?.isBackground 
                ? (device === 'mobile' ? 375 : device === 'tablet' ? 768 : device === 'wide' ? 1920 : 1280) 
                : displayData.width), 
          height: isResizing ? size.height : displayData.height,
          opacity: 1, 
          scale: 1,
          rotate: 0,
          zIndex: isSelected 
            ? (component.styles?.isBackground ? (component.zIndex ?? 0) : 1000) 
            : (component.zIndex ?? 1),
          ...(currentAnim ? currentAnim.animate : {})
        }}
        transition={isResizing ? { duration: 0 } : { 
          type: "spring", 
          bounce: 0, 
          duration: component.animation?.duration || 0.4,
          delay: component.animation?.delay || 0,
          ...(currentAnim?.animate?.transition || {})
        }}
        style={{
          position: 'absolute',
          ...component.styles
        }}
        className={cn(
            "group cursor-pointer select-none transition-shadow",
            isSelected ? "ring-2 ring-indigo-500 z-50" : "hover:ring-1 hover:ring-indigo-500/50",
            isDragOver && "ring-4 ring-orange-500 bg-orange-500/10"
        )}
    >
        {/* Render Content Based on Type */}
        <div className="w-full h-full overflow-hidden relative pointer-events-none">
            {renderContent(component)}
        </div>

        {/* Selection/Hover Controls */}
        {isSelected && (
            <>
                {/* Resize Handles */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-indigo-500 rounded-full" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-indigo-500 rounded-full" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-indigo-500 rounded-full" />
                
                {/* Active Resize Handle (Bottom Right) */}
                <motion.div 
                    drag
                    dragMomentum={false}
                    dragElastic={0}
                    onDragStart={(e) => {
                        e.stopPropagation();
                        setIsResizing(true);
                        setInitialSize({ width: size.width, height: size.height });
                    }}
                    onDrag={handleResize}
                    onDragEnd={(e) => {
                        e.stopPropagation();
                        handleResizeEnd();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-nwse-resize z-[60]" 
                />

                {/* Quick Actions */}
                <div className="absolute -top-8 right-0 flex items-center gap-1 bg-indigo-500 text-white rounded px-2 py-1 shadow-lg transform scale-0 group-hover:scale-100 transition-transform origin-bottom">
                     <Move className="w-3 h-3" />
                     <div className="w-px h-3 bg-white/20 mx-1" />
                     <button 
                        onClick={(e) => { e.stopPropagation(); removeComponent(component.id); }}
                        className="hover:text-red-200"
                     >
                        <Trash2 className="w-3 h-3" />
                     </button>
                </div>
            </>
        )}
    </motion.div>
  );
};


const renderContent = (component: EditorComponent) => {
    switch (component.type) {
        // ── Core Elements ────────────────────────────────────
        case 'text':
            return <p style={{ fontSize: 'inherit', color: 'inherit' }}>{component.content || 'Double click to edit'}</p>;
        case 'button':
            return (
                <button className="w-full h-full px-4 py-2 bg-indigo-500 text-white rounded shadow-sm flex items-center justify-center">
                    {component.content || 'Button'}
                </button>
            );
        case 'image':
            return (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                    src={component.content || 'https://via.placeholder.com/150'} 
                    alt="placeholder" 
                    className="w-full h-full object-cover pointer-events-none" 
                />
            );
        case 'container':
        case 'row':
        case 'column':
            return <div className="w-full h-full border border-dashed border-neutral-700 bg-neutral-900/50" />;

        // ── Text Animations (23) ─────────────────────────────
        case 'split-text':
            return <SplitText text={component.content || 'Splitting Text'} />;
        case 'blur-text':
            return <BlurText text={component.content || 'Blurry Reveal'} />;
        case 'shiny-text':
            return <ShinyText text={component.content || 'Metallic Shine'} />;
        case 'gradient-text':
            return <GradientText text={component.content || 'Color Flow'} />;
        case 'glitch-text':
            return <GlitchText text={component.content || 'System Glitch'} />;
        case 'count-up':
            return <CountUp to={parseInt(component.content) || 100} />;
        case 'decrypted-text':
            return <DecryptedText text={component.content || 'Decrypting...'} animateOn="view" />;
        case 'rotating-text':
            return <RotatingText texts={['React', 'Bits', 'Magic', component.content || 'Wow']} />;
        case 'fuzzy-text':
            return <FuzzyText>{component.content || 'Fuzzy Effect'}</FuzzyText>;
        case 'scrambled-text':
            return <ScrambledText text={component.content || 'Scrambled'} />;
        case 'circular-text':
            return <CircularText text={component.content || 'CIRCULAR TEXT • REACT BITS • '} />;
        case 'text-type':
            return <TextType text={component.content || 'Typing effect...'} />;
        case 'true-focus':
            return <TrueFocus sentence={component.content || 'True Focus Effect'} />;
        case 'scroll-float':
            return <ScrollFloat>{component.content || 'Floating Text'}</ScrollFloat>;
        case 'scroll-reveal':
            return <ScrollReveal>{component.content || 'Scroll to Reveal'}</ScrollReveal>;
        case 'scroll-velocity':
            return <ScrollVelocity texts={[component.content || 'React Bits']} velocity={3} />;
        case 'shuffle':
            return <Shuffle text={component.content || 'Shuffle Me'} />;

        // ── Backgrounds (34) ─────────────────────────────────
        case 'aurora-bg':
            return <Aurora />;
        case 'balatro-bg':
            return <Balatro />;
        case 'ballpit-bg':
            return <Ballpit />;
        case 'beams-bg':
            return <Beams />;
        case 'color-bends-bg':
            return <ColorBends />;
        case 'dark-veil-bg':
            return <DarkVeil />;
        case 'dither-bg':
            return <Dither />;
        case 'dot-grid-bg':
            return <DotGrid />;
        case 'faulty-terminal-bg':
            return <FaultyTerminal />;
        case 'floating-lines-bg':
            return <FloatingLines />;
        case 'galaxy-bg':
            return <Galaxy />;
        case 'gradient-blinds-bg':
            return <GradientBlinds />;
        case 'grainient-bg':
            return <Grainient />;
        case 'grid-distortion-bg':
            return <GridDistortion />;
        case 'grid-motion-bg':
            return <GridMotion />;
        case 'grid-scan-bg':
            return <GridScan />;
        case 'hyperspeed-bg':
            return <Hyperspeed />;
        case 'iridescence-bg':
            return <Iridescence />;
        case 'letter-glitch-bg':
            return <LetterGlitch />;
        case 'light-pillar-bg':
            return <LightPillar />;
        case 'light-rays-bg':
            return <LightRays />;
        case 'lightning-bg':
            return <Lightning />;
        case 'liquid-chrome':
            return <LiquidChrome />;
        case 'liquid-ether-bg':
            return <LiquidEther />;
        case 'orb-bg':
            return <Orb />;
        case 'particles-bg':
            return <Particles />;
        case 'pixel-blast-bg':
            return <PixelBlast />;
        case 'pixel-snow-bg':
            return <PixelSnow />;
        case 'plasma-bg':
            return <Plasma />;
        case 'prism-bg':
            return <Prism />;
        case 'prismatic-burst-bg':
            return <PrismaticBurst />;
        case 'ripple-grid-bg':
            return <RippleGrid />;
        case 'silk-bg':
            return <Silk />;
        case 'squares-bg':
            return <Squares />;
        case 'threads-bg':
            return <Threads />;
        case 'waves-bg':
            return <Waves />;

        // ── Components (35) ──────────────────────────────────
        case 'spotlight-card':
            return <SpotlightCard>{component.content || 'Spotlight Card'}</SpotlightCard>;
        case 'tilted-card':
            return <TiltedCard>{component.content || '3D Tilted Card'}</TiltedCard>;
        case 'decay-card':
            return <DecayCard />;
        case 'pixel-card':
            return <PixelCard />;
        case 'profile-card':
            return <ProfileCard />;
        case 'reflective-card':
            return <ReflectiveCard />;
        case 'bounce-cards':
            return <BounceCards />;
        case 'card-swap':
            return <CardSwap />;
        case 'animated-list':
            return <AnimatedList />;
        case 'stack':
            return <Stack />;
        case 'folder':
            return <Folder />;
        case 'dock':
            return <Dock />;
        case 'elastic-slider':
            return <ElasticSlider />;
        case 'carousel':
            return <Carousel />;
        case 'chroma-grid':
            return <ChromaGrid />;
        case 'circular-gallery':
            return <CircularGallery />;
        case 'counter':
            return <Counter />;
        case 'dome-gallery':
            return <DomeGallery />;
        case 'flowing-menu':
            return <FlowingMenu />;
        case 'fluid-glass':
            return <FluidGlass />;
        case 'flying-posters':
            return <FlyingPosters />;
        case 'glass-icons':
            return <GlassIcons />;
        case 'glass-surface':
            return <GlassSurface />;
        case 'infinite-menu':
            return <InfiniteMenu />;
        case 'lanyard':
            return <Lanyard />;
        case 'magic-bento':
            return <MagicBento />;
        case 'masonry':
            return <Masonry />;
        case 'model-viewer':
            return <ModelViewer />;
        case 'scroll-stack':
            return <ScrollStack />;
        case 'stepper':
            return <Stepper />;

        // ── Animations (28) ──────────────────────────────────
        case 'antigravity':
            return <Antigravity />;
        case 'blob-cursor':
            return <BlobCursor />;
        case 'click-spark':
            return <ClickSpark />;
        case 'crosshair':
            return <Crosshair />;
        case 'cubes':
            return <Cubes />;
        case 'electric-border':
            return <ElectricBorder>{component.content || 'Electric Border'}</ElectricBorder>;
        case 'glare-hover':
            return <GlareHover>{component.content || 'Glare Effect'}</GlareHover>;
        case 'image-trail':
            return <ImageTrail />;
        case 'laser-flow':
            return <LaserFlow />;
        case 'logo-loop':
            return <LogoLoop />;
        case 'magnet':
            return <Magnet>{component.content || 'Magnet'}</Magnet>;
        case 'magnet-lines':
            return <MagnetLines />;
        case 'meta-balls':
            return <MetaBalls />;
        case 'metallic-paint':
            return <MetallicPaint />;
        case 'noise':
            return <Noise />;
        case 'pixel-trail':
            return <PixelTrail />;
        case 'pixel-transition':
            return <PixelTransition />;
        case 'ribbons':
            return <Ribbons />;
        case 'shape-blur':
            return <ShapeBlur />;
        case 'splash-cursor':
            return <SplashCursor />;
        case 'star-border':
            return <StarBorder>{component.content || 'Star Border'}</StarBorder>;
        case 'sticker-peel':
            return <StickerPeel />;
        case 'shiny-button':
            return <button className="w-full h-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg transition-all hover:shadow-xl">{component.content || 'Shiny Button'}</button>;

        default:
            return <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-500">{component.type}</div>;
    }
};
