"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PageHeader Component
 * Standard header for dashboard pages
 */
interface PageHeaderProps {
  title: string;
  description: string;
  action?: {
    label: string;
    icon: React.ElementType;
    onClick: () => void;
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500">
          {title}
        </h1>
        <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 mt-1 font-medium italic">
          {description}
        </p>
      </motion.div>

      {action && (
        <DashboardButton 
          variant="primary" 
          onClick={action.onClick}
          icon={action.icon}
        >
          {action.label}
        </DashboardButton>
      )}
    </div>
  );
}

/**
 * DashboardCard Component
 * Reusable card wrapper with consistent styling
 */
interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: "none" | "small" | "medium" | "large";
}

export function DashboardCard({ children, className, hoverable = true, padding = "medium" }: DashboardCardProps) {
  const paddingStyles = {
    none: "p-0",
    small: "p-4 md:p-6",
    medium: "p-6 md:p-8",
    large: "p-8 md:p-12"
  };

  return (
    <motion.div
      whileHover={hoverable ? { y: -5 } : {}}
      className={cn(
        "relative rounded-[2.5rem] border border-neutral-200 dark:border-white/5 bg-white dark:bg-neutral-900 shadow-xl shadow-black/5 dark:shadow-white/[0.02] overflow-hidden",
        paddingStyles[padding],
        className
      )}
    >
      {hoverable && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * DashboardButton Component
 * Standardized buttons for the dashboard
 */
interface DashboardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "emerald";
  loading?: boolean;
  icon?: React.ElementType;
  iconPosition?: "left" | "right";
}

export function DashboardButton({ 
  children, 
  variant = "primary", 
  loading = false, 
  icon: Icon, 
  iconPosition = "left",
  className,
  ...props 
}: DashboardButtonProps) {
  const variants = {
    primary: "bg-neutral-900 dark:bg-white text-white dark:text-black hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-white/10",
    emerald: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20",
    secondary: "bg-neutral-100 dark:bg-white/5 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/10",
    outline: "bg-transparent border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white hover:bg-white dark:hover:bg-white/5",
    ghost: "bg-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
  };

  // Extract non-button props if needed or cast
  const buttonProps = props as any;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={loading || props.disabled}
      className={cn(
        "relative flex items-center justify-center gap-2 px-6 h-12 rounded-2xl font-black text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
        variants[variant],
        className
      )}
      {...buttonProps}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
        </>
      )}
    </motion.button>
  );
}

/**
 * DashboardInput Component
 * Styled input field with labels and icons
 */
interface DashboardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ElementType;
  prefixText?: string;
  error?: string;
  hint?: string;
}

export function DashboardInput({ label, icon: Icon, prefixText, error, hint, className, ...props }: DashboardInputProps) {
  return (
    <div className="space-y-2 w-full text-left">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1 block">
          {label}
        </label>
      )}
      <div className="relative group">
        {prefixText && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm select-none">
            {prefixText}
          </div>
        )}
        {Icon && !prefixText && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={cn(
            "w-full h-14 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none transition-all font-bold px-5",
            prefixText && "pl-[100px]",
            Icon && !prefixText && "pl-14",
            error && "border-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 px-1">{error}</p>}
      {hint && !error && <p className="text-[10px] font-bold text-neutral-400 px-1 italic">{hint}</p>}
    </div>
  );
}

/**
 * DashboardModal Component
 * Reusable modal with animated backdrop and content
 */
interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  maxWidth?: string;
}

export function DashboardModal({ isOpen, onClose, title, description, children, icon: Icon, maxWidth = "max-w-2xl" }: DashboardModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-200 dark:border-white/5 shadow-2xl p-8 md:p-10 overflow-hidden",
              maxWidth
            )}
          >
            {/* Glossy Backdrop Pattern */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 rounded-full bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors z-20"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>

            <div className="relative z-10 text-left">
              <header className="mb-8">
                {Icon && (
                  <div className="inline-flex p-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black mb-5 shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                )}
                <h2 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-white mb-2">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed italic">
                    {description}
                  </p>
                )}
              </header>

              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * EmptyState Component
 * Displays when no data is available
 */
interface EmptyStateProps {
  title: string;
  description: string;
  icon: any;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, icon: Icon, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-dashed border-neutral-200 dark:border-white/5 bg-neutral-50/50 dark:bg-white/5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white dark:bg-neutral-900 shadow-xl flex items-center justify-center text-neutral-400 dark:text-neutral-600 mb-6">
                <Icon className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-black mb-2 tracking-tight">{title}</h3>
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm font-medium mb-8 italic">{description}</p>
            {actionLabel && (
                <DashboardButton variant="primary" onClick={onAction}>
                  {actionLabel}
                </DashboardButton>
            )}
        </div>
    );
}

/**
 * DashboardBadge Component
 * Status indicators and small tags
 */
interface DashboardBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "neutral" | "info";
  className?: string;
}

export function DashboardBadge({ children, variant = "neutral", className }: DashboardBadgeProps) {
  const variants = {
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    info: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    neutral: "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-transparent"
  };

  return (
    <div className={cn(
      "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}

/**
 * DashboardSection Component
 * Reusable page section with title
 */
interface DashboardSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({ title, description, children, className }: DashboardSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="px-2">
        <h3 className="text-xl font-black italic tracking-tight">{title}</h3>
        {description && <p className="text-xs text-neutral-500 font-medium italic">{description}</p>}
      </div>
      {children}
    </div>
  );
}
