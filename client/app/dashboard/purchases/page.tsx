"use client";
import React from "react";
import { PageHeader, DashboardCard, DashboardSection, EmptyState } from "@/components/dashboard/Shared";
import { ShoppingCart, Star, Clock } from "lucide-react";

export default function PurchasesPage() {
  return (
    <div className="space-y-10">
      <PageHeader title="Purchases" description="View and manage your purchased items." />
      
      <DashboardSection title="Recent Purchases" description="Items you've bought from the marketplace">
        <EmptyState 
          title="No purchases yet" 
          description="Browse the marketplace to discover templates, themes, and digital products."
          icon={ShoppingCart}
          actionLabel="Browse Marketplace"
          onAction={() => {}}
        />
      </DashboardSection>
    </div>
  );
}
