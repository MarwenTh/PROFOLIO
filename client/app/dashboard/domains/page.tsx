"use client";
import React from "react";
import { PageHeader, EmptyState } from "@/components/dashboard/Shared";
import { Globe, Plus } from "lucide-react";

export default function DomainsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Custom Domains" 
        description="Connect and manage your professional vanity URLs for your portfolio brand."
        action={{
            label: "Add Domain",
            icon: Plus,
            onClick: () => {}
        }}
      />
      
      <EmptyState 
        title="No domains connected"
        description="Free users are limited to .profolio subdomains. Upgrade to Pro to connect your own high-conversion domain."
        icon={Globe}
        actionLabel="Upgrade Plan"
        onAction={() => {}}
      />
    </div>
  );
}
