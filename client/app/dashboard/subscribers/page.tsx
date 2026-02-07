"use client";
import React, { useState, useEffect } from "react";
import { PageHeader, DashboardCard, DashboardSection, EmptyState } from "@/components/dashboard/Shared";
import { Users, Mail, TrendingUp, Trash2, Download, Send, Upload } from "lucide-react";
import { useSubscribers, useNewsletters } from "@/hooks/useSubscribers";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Loader } from "@/components/ui/Loader";
import { useSession } from "next-auth/react";
import { NewsletterEditor } from "@/components/subscribers/NewsletterEditor";
import { CSVImportModal } from "@/components/subscribers/CSVImportModal";

export default function SubscribersPage() {
  const { data: session } = useSession();
  const { getUserPortfolios } = usePortfolio();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [portfoliosLoading, setPortfoliosLoading] = useState(true);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | undefined>();
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  
  const { subscribers, loading: subsLoading, removeSubscriber, importSubscribers } = useSubscribers(selectedPortfolioId);
  const { newsletters, loading: newslettersLoading } = useNewsletters(selectedPortfolioId);

  // Fetch portfolios
  useEffect(() => {
    if (session?.user?.id) {
      setPortfoliosLoading(true);
      getUserPortfolios(session.user.id).then(res => {
        if (res.success && res.portfolios) {
          setPortfolios(res.portfolios);
          if (res.portfolios.length > 0 && !selectedPortfolioId) {
            setSelectedPortfolioId(res.portfolios[0].id);
          }
        }
        setPortfoliosLoading(false);
      }).catch(() => {
        setPortfoliosLoading(false);
      });
    }
  }, [session?.user?.id]);

  const loading = portfoliosLoading || subsLoading || newslettersLoading;

  // Calculate stats
  const totalSubscribers = subscribers.filter(s => s.status === 'active').length;
  const thisMonth = subscribers.filter(s => {
    const subDate = new Date(s.subscribed_at);
    const now = new Date();
    return subDate.getMonth() === now.getMonth() && 
           subDate.getFullYear() === now.getFullYear() &&
           s.status === 'active';
  }).length;
  const emailsSent = newsletters.filter(n => n.status === 'sent').reduce((acc, n) => acc + n.sent_to, 0);

  const stats = [
    { label: "Total Subscribers", value: totalSubscribers.toString(), icon: Users, color: "indigo" },
    { label: "This Month", value: thisMonth.toString(), icon: TrendingUp, color: "emerald" },
    { label: "Emails Sent", value: emailsSent.toString(), icon: Mail, color: "purple" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader title="Subscribers" description="Manage your newsletter subscribers and email campaigns." />
      
      {/* Portfolio Selector */}
      {portfolios.length > 1 && (
        <div className="flex gap-2">
          {portfolios.map((portfolio: any) => (
            <button
              key={portfolio.id}
              onClick={() => setSelectedPortfolioId(portfolio.id)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                selectedPortfolioId === portfolio.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {portfolio.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <DashboardCard key={stat.label} padding="small">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${colorMap[stat.color]} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black tracking-tight italic">{stat.value}</h4>
          </DashboardCard>
        ))}
      </div>

      <DashboardSection title="Subscriber List" description="People who subscribed to your newsletter">
        {subscribers.length === 0 ? (
          <EmptyState 
            title="No subscribers yet" 
            description="Add a newsletter signup form to your portfolio to start building your audience."
            icon={Users}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-widest text-neutral-400">Email</th>
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-widest text-neutral-400">Name</th>
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-widest text-neutral-400">Status</th>
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-widest text-neutral-400">Subscribed</th>
                  <th className="text-right py-4 px-4 text-xs font-black uppercase tracking-widest text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                    <td className="py-4 px-4 font-medium">{subscriber.email}</td>
                    <td className="py-4 px-4 text-neutral-600 dark:text-neutral-400">{subscriber.name || '-'}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        subscriber.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-neutral-500/10 text-neutral-500'
                      }`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => removeSubscriber(subscriber.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Remove subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardSection>

      {/* Modals */}
      <NewsletterEditor
        isOpen={showNewsletter}
        onClose={() => setShowNewsletter(false)}
        portfolioId={selectedPortfolioId}
        subscriberCount={totalSubscribers}
      />

      <CSVImportModal
        isOpen={showCSVImport}
        onClose={() => setShowCSVImport(false)}
        portfolioId={selectedPortfolioId}
        onImport={async (subs) => {
          await importSubscribers(subs);
        }}
      />

      {/* Action Buttons */}
      <div className="fixed bottom-8 right-8 flex gap-3 z-40">
        <button
          onClick={() => setShowCSVImport(true)}
          disabled={!selectedPortfolioId}
          className="h-14 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105"
        >
          <Upload className="w-5 h-5" />
          Import CSV
        </button>
        <button
          onClick={() => setShowNewsletter(true)}
          disabled={!selectedPortfolioId || totalSubscribers === 0}
          className="h-14 px-6 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105"
        >
          <Send className="w-5 h-5" />
          Send Newsletter
        </button>
      </div>
    </div>
  );
}
