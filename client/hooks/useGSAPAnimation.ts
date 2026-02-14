"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export const useGSAPAnimation = (animation: { type: string; duration?: number; delay?: number; engine?: string } | undefined) => {
    const elementRef = useRef<any>(null);

    useGSAP(() => {
        if (!elementRef.current) return;
        const el = elementRef.current;

        // Kill existing animations on this element to stop loops immediately
        gsap.killTweensOf(el);
        
        // Reset properties that GSAP might have modified to their baseline
        // clearProps: "transform" ensures we don't leave lingering GSAP styles that conflict with Framer
        gsap.set(el, { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, clearProps: "transform" });

        if (animation?.engine !== 'gsap' || !animation) return;

        const duration = animation.duration || 1;
        const delay = animation.delay || 0;

        switch (animation.type) {
            case 'pulse':
                gsap.to(el, {
                    scale: 1.05,
                    duration: duration / 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay
                });
                break;
            case 'float':
                gsap.to(el, {
                    y: "-=10",
                    duration: duration,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay
                });
                break;
            case 'wiggle':
                gsap.to(el, {
                    rotation: 5,
                    duration: duration / 4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay
                });
                break;
            case 'spin-loop':
                gsap.to(el, {
                    rotation: 360,
                    duration: duration * 2,
                    repeat: -1,
                    ease: "none",
                    delay
                });
                break;
            default:
                break;
        }
    }, { dependencies: [animation], scope: elementRef });

    return elementRef;
};
