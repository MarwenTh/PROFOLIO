"use client";

import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Rocket } from "lucide-react";
import { EditorContext } from "@/context/EditorContext";
import { cn } from "@/lib/utils";

interface ProModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ProModal = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}: ProModalProps) => {
  const editorContext = useContext(EditorContext);

  const isOpen =
    propIsOpen !== undefined ? propIsOpen : editorContext?.isProModalOpen;
  const setOpen = propOnClose || editorContext?.setProModalOpen;

  if (!isOpen) return null;

  const handleClose = () => {
    if (setOpen) setOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header Image/Pattern */}
          <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#ffffff,transparent)]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Rocket className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/70 hover:text-white hover:bg-black/40 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-black text-white">Upgrade to Pro</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                The{" "}
                <span className="text-indigo-400 font-bold">
                  "Built with PROFOLIO"
                </span>{" "}
                branding is required for free users. Upgrade to Pro to remove it
                and unlock premium features.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Remove platform branding",
                "Unlimited portfolios",
                "Custom domain support",
                "Premium animation engines",
                "Priority support",
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-neutral-300"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-indigo-400" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-all"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  window.open("/pricing", "_blank");
                  handleClose();
                }}
                className="flex-[1.5] px-4 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                View Pricing
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
