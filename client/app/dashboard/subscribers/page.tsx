"use client";
import React from "react";
import { 
    PageHeader, 
    EmptyState, 
    DashboardButton 
} from "@/components/dashboard/Shared";
import { Users2, Mail, Download } from "lucide-react";

export default function SubscribersPage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="Subscribers" 
        description="Manage your audience growth and newsletter following directly from Profolio."
        action={{
            label: "Export List",
            icon: Download,
            onClick: () => {}
        }}
      />
      
      <EmptyState 
        title="Building your audience..."
        description="Add a newsletter component to your portfolio to start capturing leads and growing your network."
        icon={Users2}
        actionLabel="Browse Templates"
        onAction={() => {}}
      />
    </div>
  );
}
