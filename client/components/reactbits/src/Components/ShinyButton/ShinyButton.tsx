"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ShinyButtonProps {
  text?: string;
  className?: string;
  onClick?: () => void;
}

const ShinyButton: React.FC<ShinyButtonProps> = ({ 
  text = 'Shiny Button', 
  className,
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200 hover:bg-indigo-700 active:scale-95",
        "before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full before:hover:animate-[shimmer_1.5s_infinite] overflow-hidden",
        className
      )}
    >
      {text}
    </button>
  );
};

export default ShinyButton;
