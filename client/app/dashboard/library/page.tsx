"use client";
import React from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { Image as ImageIcon, Upload } from "lucide-react";

export default function MediaLibraryPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Media Library" 
        description="Global assets and media storage for your portfolio projects."
        action={{
            label: "Upload Assets",
            icon: Upload,
            onClick: () => {}
        }}
      />
      
      <EmptyState 
        title="Your library is empty"
        description="Upload images, icons, and videos to use them across all your portfolio sites effortlessly."
        icon={ImageIcon}
        actionLabel="Start Uploading"
        onAction={() => {}}
      />
    </div>
  );
}
