"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * BlockServices — Service cards with icons and descriptions.
 * Content shape: { heading, subtitle, services[] }
 */
interface Service {
  title: string;
  description: string;
  icon?: string; // SVG path or emoji
}

interface BlockServicesProps {
  content: {
    heading?: string;
    subtitle?: string;
    services?: Service[];
  };
  styles?: Record<string, any>;
  isEditor?: boolean;
}

const SERVICE_ICONS = [
  <svg
    key="code"
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>,
  <svg
    key="design"
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
    />
  </svg>,
  <svg
    key="mobile"
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
    />
  </svg>,
  <svg
    key="rocket"
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m6-6v-.55a2.25 2.25 0 00-2.25-2.25H9.75a2.25 2.25 0 00-2.25 2.25v.55m5.34 0a2.25 2.25 0 01-2.25 2.25h-.34a2.25 2.25 0 01-2.25-2.25"
    />
  </svg>,
  <svg
    key="chart"
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  </svg>,
  <svg
    key="support"
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  </svg>,
];

export const BlockServices: React.FC<BlockServicesProps> = ({
  content,
  styles = {},
  isEditor = false,
}) => {
  const {
    heading = "What I Do",
    subtitle = "Services tailored to your needs",
    services = [
      {
        title: "Web Development",
        description:
          "Building fast, responsive web applications with modern frameworks and best practices.",
      },
      {
        title: "UI/UX Design",
        description:
          "Creating intuitive and beautiful interfaces that users love to interact with.",
      },
      {
        title: "Mobile Development",
        description:
          "Native and cross-platform mobile apps that deliver seamless experiences.",
      },
      {
        title: "Product Strategy",
        description:
          "From concept to launch — helping you build the right product for your market.",
      },
      {
        title: "Analytics & SEO",
        description:
          "Data-driven insights and optimization to grow your online presence.",
      },
      {
        title: "Consulting",
        description:
          "Expert guidance on architecture, technology stack, and development workflows.",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              className="bg-[#111] rounded-2xl p-8 border border-white/5 hover:border-indigo-500/20 transition-all group"
              initial={isEditor ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 flex items-center justify-center mb-5 text-indigo-400 transition-colors">
                {SERVICE_ICONS[i % SERVICE_ICONS.length]}
              </div>
              <h3 className="text-white font-bold text-base mb-2">
                {service.title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
