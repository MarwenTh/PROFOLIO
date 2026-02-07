"use client";
import React from "react";
import { PageHeader, DashboardCard, DashboardSection, EmptyState } from "@/components/dashboard/Shared";
import { Bookmark, Heart } from "lucide-react";

export default function SavedPage() {
  return (
    <div className="space-y-10">
      <PageHeader title="Saved Items" description="Your bookmarked templates and favorites." />
      
      <DashboardSection title="Favorites" description="Templates and items you've saved for later">
        <EmptyState 
          title="No saved items" 
          description="Save templates and products you like to access them quickly later."
          icon={Bookmark}
          actionLabel="Browse Templates"
          onAction={() => {}}
        />
      </DashboardSection>
    </div>
  );
}
