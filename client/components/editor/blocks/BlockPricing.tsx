"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockPricing — Pricing cards with tier comparison (Free / Pro / Enterprise).
 * Content shape: { heading, subtitle, plans[] }
 */
interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText?: string;
  ctaLink?: string;
  highlighted?: boolean;
}

interface BlockPricingProps {
  content: {
    heading?: string;
    subtitle?: string;
    plans?: PricingPlan[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockPricing: React.FC<BlockPricingProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Simple Pricing",
    subtitle = "Choose the plan that works for you",
    plans = [
      {
        name: "Starter",
        price: "$29",
        period: "/project",
        description: "Perfect for small projects",
        features: [
          "1 Page Design",
          "2 Revisions",
          "Source Files",
          "Email Support",
        ],
        ctaText: "Get Started",
      },
      {
        name: "Professional",
        price: "$79",
        period: "/project",
        description: "For growing businesses",
        features: [
          "5 Page Design",
          "Unlimited Revisions",
          "Source Files",
          "Priority Support",
          "SEO Optimization",
        ],
        ctaText: "Most Popular",
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "$199",
        period: "/project",
        description: "Full-scale solutions",
        features: [
          "Unlimited Pages",
          "Unlimited Revisions",
          "Source Files",
          "24/7 Support",
          "SEO + Analytics",
          "Custom Integrations",
        ],
        ctaText: "Contact Me",
      },
    ],
  } = content || {};

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={isEditor ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            {heading}
          </h2>
          <p className="text-neutral-500 text-base">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              className={`relative rounded-2xl p-8 border transition-all ${
                plan.highlighted
                  ? "bg-indigo-500/10 border-indigo-500/30 shadow-xl shadow-indigo-500/5"
                  : "bg-[#111] border-white/5 hover:border-white/10"
              }`}
              initial={isEditor ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full">
                  Popular
                </div>
              )}
              <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
              <p className="text-neutral-500 text-sm mb-6">
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-neutral-500 text-sm">
                    {plan.period}
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 text-neutral-300 text-sm"
                  >
                    <svg
                      className="w-4 h-4 text-indigo-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={isEditor ? undefined : plan.ctaLink || "#"}
                onClick={(e) => isEditor && e.preventDefault()}
                className={`block w-full py-3 rounded-xl text-sm font-bold text-center transition-all ${
                  plan.highlighted
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {plan.ctaText || "Get Started"}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
