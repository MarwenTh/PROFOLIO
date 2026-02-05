"use client";
import React from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardBadge, 
    DashboardButton,
    DashboardSection 
} from "@/components/dashboard/Shared";
import { Palette, Plus, Eye, BarChart2, Globe, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const DUMMY_CREATIONS = [
  { 
    id: 1, 
    title: "Minimalist Portfolio v2", 
    type: "Template", 
    status: "active", 
    sales: 12, 
    price: "$29", 
    views: "1.2k",
    slug: "minimalist-v2"
  },
  { 
    id: 2, 
    title: "Glassmorphism UI Kit", 
    type: "Component Pack", 
    status: "pending", 
    sales: 0, 
    price: "$19", 
    views: "45",
    slug: "glass-ui"
  },
  { 
    id: 3, 
    title: "3D Dark Mode Theme", 
    type: "Template", 
    status: "active", 
    sales: 45, 
    price: "$49", 
    views: "3.8k",
    slug: "dark-3d"
  }
];

export default function CreationsPage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="My Creations" 
        description="Track your performance and manage your global design listings."
        action={{
          label: "List Item",
          icon: Plus,
          onClick: () => {}
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DUMMY_CREATIONS.map((item) => (
          <DashboardCard key={item.id} className="group">
            <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Palette className="w-6 h-6" />
                </div>
                <DashboardBadge variant={item.status === 'active' ? 'success' : 'warning'}>
                    {item.status}
                </DashboardBadge>
            </div>
            
            <h3 className="text-xl font-black italic tracking-tighter mb-1">{item.title}</h3>
            <p className="text-[10px] font-black uppercase text-neutral-400 mb-6 tracking-widest">{item.type} &bull; {item.price}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
                    <p className="text-[10px] font-bold text-neutral-400 mb-1">Total Sales</p>
                    <p className="text-lg font-black italic">{item.sales}</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
                    <p className="text-[10px] font-bold text-neutral-400 mb-1">Views</p>
                    <p className="text-lg font-black italic">{item.views}</p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-neutral-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-400 hover:text-indigo-500">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-400 hover:text-indigo-500">
                        <BarChart2 className="w-4 h-4" />
                    </button>
                </div>
                <DashboardButton 
                    variant="ghost" 
                    className="h-8 px-4 text-xs font-black italic"
                >
                    Edit Listing
                </DashboardButton>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
