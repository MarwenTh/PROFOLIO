"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * BlockFAQ — Expandable accordion-style FAQ section.
 * Content shape: { heading, subtitle, faqs[] }
 */
interface FAQ {
  question: string;
  answer: string;
}

interface BlockFAQProps {
  content: {
    heading?: string;
    subtitle?: string;
    faqs?: FAQ[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

export const BlockFAQ: React.FC<BlockFAQProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "Frequently Asked Questions",
    subtitle = "Everything you need to know",
    faqs = [
      {
        question: "What services do you offer?",
        answer:
          "I offer web design, frontend development, full-stack development, and UI/UX consulting. Each project is tailored to your specific needs.",
      },
      {
        question: "What is your typical project timeline?",
        answer:
          "Most projects take 2-6 weeks depending on complexity. I'll provide a detailed timeline during our initial consultation.",
      },
      {
        question: "Do you offer ongoing support?",
        answer:
          "Yes! I offer maintenance packages to keep your site running smoothly after launch, including updates, bug fixes, and performance monitoring.",
      },
      {
        question: "What is your pricing structure?",
        answer:
          "I offer both project-based and hourly pricing. The best option depends on the scope and nature of your project. Let's discuss!",
      },
    ],
  } = content || {};

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div
      className="w-full py-16 md:py-24 px-8 md:px-16"
      style={{ backgroundColor: "#0a0a0a", ...styles }}
    >
      <div className="max-w-3xl mx-auto">
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

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-[#111] rounded-xl border border-white/5 overflow-hidden"
              initial={isEditor ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-white font-semibold text-sm pr-4">
                  {faq.question}
                </span>
                <motion.svg
                  className="w-5 h-5 text-neutral-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-neutral-400 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
