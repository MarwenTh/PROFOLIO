"use client";
import React from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { FolderOpen, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Portfolios" 
        description="Centralized management for all your created portfolios and web projects."
        action={{
            label: "New Project",
            icon: Plus,
            onClick: () => {}
        }}
      />
      
      <div className="p-12 rounded-[3rem] bg-neutral-900 dark:bg-white text-white dark:text-black shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
            <h3 className="text-2xl font-black italic mb-2 tracking-tighter">PROJECT MANAGER</h3>
            <p className="opacity-70 font-medium mb-8 max-w-sm">Use the overview page to see a summarized view, or manage specific project configurations here.</p>
            <button className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl active:scale-95">
                Visit Overview &rarr;
            </button>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <FolderOpen className="w-48 h-48 rotate-12" />
        </div>
      </div>

      <div className="mt-12">
        <EmptyState 
            title="Projects list loading..."
            description="We are synchronizing your project settings with our secure global infrastructure."
            icon={FolderOpen}
        />
      </div>
    </div>
  );
}
