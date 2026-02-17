"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";
import { Github, Linkedin, Twitter } from "lucide-react";
import { ShinyText } from "@/components/reactbits/ShinyText";
import { SplitText } from "@/components/reactbits/SplitText";
import { Aurora } from "@/components/reactbits/Aurora";
import { ShinyButton } from "@/components/reactbits/ShinyButton";
import { BlurText } from "@/components/reactbits/BlurText";
import { GradientText } from "@/components/reactbits/GradientText";
import { CountUp } from "@/components/reactbits/CountUp";
import { Squares } from "@/components/reactbits/Squares";
import { Hyperspeed } from "@/components/reactbits/Hyperspeed";
import { Waves } from "@/components/reactbits/Waves";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { TiltedCard } from "@/components/reactbits/TiltedCard";
import { LiquidChrome } from "@/components/reactbits/LiquidChrome";
import { GlitchText } from "@/components/reactbits/GlitchText";
import {
  BlockHero,
  BlockAbout,
  BlockSkills,
  BlockProjects,
  BlockExperience,
  BlockTestimonials,
  BlockContact,
  BlockStats,
  BlockCTA,
  BlockSocialBar,
  BlockFooter,
  BlockPricing,
  BlockBlog,
  BlockResume,
  BlockGallery,
  BlockFAQ,
  BlockServices,
  BlockTeam,
  BlockAwards,
  BlockEducation,
} from "@/components/editor/blocks";

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const { getPortfolioBySlug, loading } = usePortfolio();
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      getPortfolioBySlug(slug as string).then((res) => {
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
  const sections: any[] =
    Array.isArray(portfolio.content) && portfolio.content[0]?.components
      ? portfolio.content
      : [
          {
            id: "default-section",
            type: "body",
            height: 800,
            styles: {},
            components: Array.isArray(portfolio.content)
              ? portfolio.content
              : [],
          },
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
              ...section.styles,
            }}
          >
            <div className="absolute inset-0">
              {section.components.map((comp: any) => (
                <RenderComponent key={comp.id} comp={comp} />
              ))}
            </div>
          </div>
        ))}

        <div className="py-20 flex items-center justify-center w-full bg-neutral-50 dark:bg-black/20 z-[200] relative">
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Built with PROFOLIO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RenderComponent({ comp }: { comp: any }) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDevice = () => {
    if (windowWidth < 768) return "mobile";
    if (windowWidth < 1280) return "tablet";
    return "desktop";
  };

  const device = getDevice();
  const displayData =
    device !== "desktop" && comp.responsive?.[device]
      ? { ...comp, ...comp.responsive[device] }
      : comp;

  const gsapRef = useGSAPAnimation(comp.animation);

  const {
    x,
    y,
    width,
    height,
    styles = {},
    type,
    content,
    zIndex: rootZIndex,
  } = displayData;

  const getLeftPostion = () => {
    if (styles.isBackground) return 0;
    const baseWidth =
      device === "mobile" ? 375 : device === "tablet" ? 768 : 1920;
    return `calc(50% - ${baseWidth / 2}px + ${x}px)`;
  };

  // Separate layout (position/size) from visual styling
  const wrapperStyles: any = styles.isBackground
    ? {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: rootZIndex ?? styles.zIndex ?? 0,
        pointerEvents:
          type === "image" || type === "video" || type.includes("-bg")
            ? "none"
            : "auto",
      }
    : {
        position: "absolute",
        left: getLeftPostion(),
        top: y,
        width: width,
        height: height,
        zIndex: rootZIndex ?? styles.zIndex ?? 10,
      };

  const animationVariants: Record<string, any> = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "slide-up": {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
    },
    "slide-down": {
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
    },
    "slide-left": {
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
    },
    "slide-right": {
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
    },
    "scale-up": {
      initial: { scale: 0.5, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
    },
    bounce: {
      initial: { y: -20, opacity: 0 },
      animate: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      },
    },
    rotate: {
      initial: { rotate: -180, opacity: 0 },
      animate: { rotate: 0, opacity: 1 },
    },
  };

  const currentAnim =
    comp.animation && comp.animation.engine !== "gsap"
      ? animationVariants[comp.animation.type]
      : null;

  const Content = () => {
    if (type === "text") {
      return (
        <div
          style={styles}
          className={cn(
            "w-full h-full m-0 break-words whitespace-pre-wrap overflow-visible",
            !styles.fontSize && "text-base",
            !styles.color && "text-neutral-900 dark:text-white",
          )}
        >
          {content || "New Text"}
        </div>
      );
    }

    if (type === "split-text") {
      return (
        <SplitText
          text={content || "Splitting Text"}
          className="text-4xl font-black"
        />
      );
    }

    if (type === "shiny-text") {
      return (
        <ShinyText
          text={content || "Metallic Shine"}
          className="text-4xl font-bold"
        />
      );
    }

    if (type === "blur-text") {
      return (
        <BlurText
          text={content || "Blurry Reveal"}
          className="text-4xl font-bold"
        />
      );
    }

    if (type === "gradient-text") {
      return (
        <GradientText
          text={content || "Color Flow"}
          className="text-4xl font-bold"
        />
      );
    }

    if (type === "glitch-text") {
      return (
        <GlitchText
          text={content || "System Glitch"}
          className="text-4xl font-black"
        />
      );
    }

    if (type === "count-up") {
      return (
        <CountUp
          to={parseInt(content) || 100}
          className="text-6xl font-black text-indigo-500"
        />
      );
    }

    if (type === "aurora-bg") {
      return <Aurora className="w-full h-full" />;
    }

    if (type === "squares-bg") {
      return <Squares className="w-full h-full" />;
    }

    if (type === "hyperspeed-bg") {
      return <Hyperspeed className="w-full h-full" />;
    }

    if (type === "waves-bg") {
      return <Waves className="w-full h-full" />;
    }

    if (type === "liquid-chrome") {
      return <LiquidChrome className="w-full h-full" />;
    }

    if (type === "shiny-button") {
      return (
        <ShinyButton
          text={content || "Shiny Button"}
          className="w-full h-full"
        />
      );
    }

    if (type === "spotlight-card") {
      return (
        <SpotlightCard className="w-full h-full">
          {content || "Spotlight Content"}
        </SpotlightCard>
      );
    }

    if (type === "tilted-card") {
      return (
        <TiltedCard className="w-full h-full">
          {content || "3D Card Content"}
        </TiltedCard>
      );
    }

    if (type === "image") {
      return (
        <img
          src={
            content ||
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"
          }
          style={styles}
          className="w-full h-full object-cover"
          alt=""
          onError={(e: any) => {
            e.target.src =
              "https://via.placeholder.com/400x300?text=Image+Load+Error";
          }}
        />
      );
    }

    if (type === "button") {
      return (
        <button
          style={styles}
          className={cn(
            "w-full h-full flex items-center justify-center transition-all hover:opacity-90 active:scale-95",
            !styles.backgroundColor && "bg-indigo-500",
            !styles.color && "text-white",
            !styles.borderRadius && "rounded-lg",
            !styles.fontSize && "text-sm font-bold",
          )}
        >
          {content || "Button"}
        </button>
      );
    }

    if (type === "divider") {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div
            style={{ height: "1px", backgroundColor: "#e5e5e5", ...styles }}
            className="w-full"
          />
        </div>
      );
    }

    if (type === "socials") {
      return (
        <div
          style={styles}
          className="w-full h-full flex items-center justify-center gap-4"
        >
          <Twitter className="w-5 h-5 text-neutral-400" />
          <Linkedin className="w-5 h-5 text-neutral-400" />
          <Github className="w-5 h-5 text-neutral-400" />
        </div>
      );
    }

    if (type === "spacer") {
      return <div className="w-full h-full" />;
    }

    if (type === "container") {
      return (
        <div
          style={styles}
          className="w-full h-full bg-neutral-50/50 border border-dashed border-neutral-300 rounded"
        />
      );
    }

    // Core Blocks
    if (type === "block-hero")
      return <BlockHero content={content} styles={styles} />;
    if (type === "block-about")
      return <BlockAbout content={content} styles={styles} />;
    if (type === "block-skills")
      return <BlockSkills content={content} styles={styles} />;
    if (type === "block-projects")
      return <BlockProjects content={content} styles={styles} />;
    if (type === "block-experience")
      return <BlockExperience content={content} styles={styles} />;
    if (type === "block-testimonials")
      return <BlockTestimonials content={content} styles={styles} />;
    if (type === "block-contact")
      return <BlockContact content={content} styles={styles} />;
    if (type === "block-stats")
      return <BlockStats content={content} styles={styles} />;
    if (type === "block-cta")
      return <BlockCTA content={content} styles={styles} />;
    if (type === "block-social-bar")
      return <BlockSocialBar content={content} styles={styles} />;
    if (type === "block-footer")
      return <BlockFooter content={content} styles={styles} />;
    // Extended Blocks
    if (type === "block-pricing")
      return <BlockPricing content={content} styles={styles} />;
    if (type === "block-blog")
      return <BlockBlog content={content} styles={styles} />;
    if (type === "block-resume")
      return <BlockResume content={content} styles={styles} />;
    if (type === "block-gallery")
      return <BlockGallery content={content} styles={styles} />;
    if (type === "block-faq")
      return <BlockFAQ content={content} styles={styles} />;
    if (type === "block-services")
      return <BlockServices content={content} styles={styles} />;
    if (type === "block-team")
      return <BlockTeam content={content} styles={styles} />;
    if (type === "block-awards")
      return <BlockAwards content={content} styles={styles} />;
    if (type === "block-education")
      return <BlockEducation content={content} styles={styles} />;
    // Button Variants
    if (type === "btn-primary")
      return (
        <button className="w-full h-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors">
          {content || "Primary"}
        </button>
      );
    if (type === "btn-outline")
      return (
        <button className="w-full h-full px-6 py-3 border-2 border-indigo-500 text-indigo-400 font-bold rounded-xl bg-transparent hover:bg-indigo-500/10 transition-colors">
          {content || "Outline"}
        </button>
      );
    if (type === "btn-ghost")
      return (
        <button className="w-full h-full px-6 py-3 text-white font-bold rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          {content || "Ghost"}
        </button>
      );
    if (type === "btn-pill")
      return (
        <button className="w-full h-full px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-full transition-colors">
          {content || "Pill"}
        </button>
      );
    if (type === "btn-glow")
      return (
        <button className="w-full h-full px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all">
          {content || "Glow"}
        </button>
      );
    // Iconify Icon
    if (type === "iconify-icon")
      return (
        <div
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{
            __html:
              content?.svg ||
              '<svg viewBox="0 0 24 24" class="w-full h-full"><circle cx="12" cy="12" r="10" fill="#6366f1"/></svg>',
          }}
        />
      );

    return null;
  };

  return (
    <motion.div
      ref={gsapRef}
      initial={currentAnim ? currentAnim.initial : { opacity: 0, y: 10 }}
      whileInView={currentAnim ? currentAnim.animate : { opacity: 1, y: 0 }}
      viewport={{ once: comp.animation?.once !== false }}
      transition={{
        type: "spring",
        bounce: 0,
        duration: comp.animation?.duration || 0.4,
        delay: comp.animation?.delay || 0,
        ...(currentAnim?.animate?.transition || {}),
      }}
      style={wrapperStyles}
    >
      <Content />
    </motion.div>
  );
}
