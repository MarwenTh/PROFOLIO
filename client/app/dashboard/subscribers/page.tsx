"use client";
import React from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { Users2, Mail } from "lucide-react";

export default function SubscribersPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Subscribers" 
        description="Manage your audience growth and newsletter following directly from Profolio."
        action={{
            label: "Export List",
            icon: Mail,
            onClick: () => {}
        }}
      />
      
      <EmptyState 
        title="Building your audience..."
        description="Add a newsletter component to your portfolio to start capturing leads and growing your network."
        icon={Users2}
        actionLabel="Browse Components"
        onAction={() => {}}
      />
    </div>
  );
}
