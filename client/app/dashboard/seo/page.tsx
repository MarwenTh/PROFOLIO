"use client";
import React from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardInput, 
    DashboardBadge,
    DashboardSection,
    DashboardButton 
} from "@/components/dashboard/Shared";
import { Search, Globe, Eye, Share2, Upload } from "lucide-react";

export default function SEOPage() {
  return (
    <div className="space-y-10">
      <PageHeader 
        title="SEO & Social" 
        description="Optimize how your portfolio appears in Google, Twitter, and LinkedIn."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardSection title="Google Search Preview" description="How your site appears in search results.">
            <DashboardCard>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black italic tracking-tighter">Search Preview</h3>
                </div>
                
                <DashboardCard className="bg-neutral-50 dark:bg-white/5 border-dashed mb-8" padding="small" hoverable={false}>
                    <p className="text-blue-600 dark:text-blue-400 text-xl font-black italic mb-1 hover:underline cursor-pointer">Marwen Th • Product Designer & Developer</p>
                    <p className="text-emerald-700 dark:text-emerald-500 text-xs font-bold mb-2 uppercase tracking-widest">profolio.pro/p/marwen</p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed italic">Marwen is a multi-disciplinary designer specializing in high-performance web applications and brand identities for startups and tech companies.</p>
                </DashboardCard>

                <div className="space-y-6">
                    <DashboardInput 
                        label="Meta Title"
                        defaultValue="Marwen Th • Product Designer & Developer"
                    />
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Meta Description</label>
                        <textarea 
                            rows={3} 
                            className="w-full p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none font-bold resize-none transition-all" 
                            defaultValue="Marwen is a multi-disciplinary designer specializing in high-performance web applications..." 
                        />
                    </div>
                    <DashboardButton variant="primary" className="w-full">Save SEO Settings</DashboardButton>
                </div>
            </DashboardCard>
        </DashboardSection>

        <DashboardSection title="Social Sharing (OG)" description="The visual card displayed on social media platforms.">
            <DashboardCard className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Share2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black italic tracking-tighter">Open Graph Card</h3>
                </div>
                
                <div className="aspect-video rounded-3xl bg-neutral-100 dark:bg-white/5 flex flex-col items-center justify-center border border-neutral-200 dark:border-white/5 overflow-hidden group shadow-inner flex-1">
                    <Eye className="w-14 h-14 text-neutral-300 dark:text-neutral-700 group-hover:scale-110 group-hover:text-indigo-500/30 transition-all duration-500" />
                    <p className="text-neutral-400 font-black italic mt-4 uppercase tracking-widest text-[10px]">Preview Social Image</p>
                </div>
                
                <div className="mt-8">
                    <DashboardButton variant="outline" className="w-full border-dashed border-2 h-16" icon={Upload}>
                        Upload Social Card
                    </DashboardButton>
                </div>
            </DashboardCard>
        </DashboardSection>
      </div>
    </div>
  );
}
