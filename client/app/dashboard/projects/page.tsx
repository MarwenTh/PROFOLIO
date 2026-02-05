"use client";
import React from "react";
import { 
    PageHeader, 
    EmptyState, 
    DashboardCard, 
    DashboardButton 
} from "@/components/dashboard/Shared";
import { FolderOpen, Plus, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();
  
  return (
    <div className="space-y-10">
      <PageHeader 
        title="Portfolios" 
        description="Centralized management for all your created portfolios and web projects."
        action={{
            label: "New Project",
            icon: Plus,
            onClick: () => {}
        }}
      />
      
      <DashboardCard className="bg-neutral-900 dark:bg-white text-white dark:text-black border-transparent" padding="none">
        <div className="p-16 relative z-10">
            <h3 className="text-4xl font-black italic mb-3 tracking-tighter">PROJECT MANAGER</h3>
            <p className="text-neutral-400 dark:text-neutral-500 font-medium mb-12 max-w-sm italic">Use the centralized dashboard to see a summarized view, or manage specific project configurations here.</p>
            <DashboardButton 
                variant="secondary" 
                className="bg-indigo-500 text-white hover:bg-indigo-600 h-14 px-10"
                onClick={() => router.push("/dashboard")}
            >
                Visit Overview &rarr;
            </DashboardButton>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <LayoutGrid className="w-64 h-64 rotate-12" />
        </div>
      </DashboardCard>

      <div className="pt-10">
        <EmptyState 
            title="Projects list loading..."
            description="We are synchronizing your project settings with our secure global infrastructure."
            icon={FolderOpen}
        />
      </div>
    </div>
  );
}
