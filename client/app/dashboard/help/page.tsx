"use client";
import React, { useState } from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardSection,
    DashboardInput,
    DashboardButton
} from "@/components/dashboard/Shared";
import { 
    HelpCircle, 
    Search, 
    Book, 
    Video, 
    MessageCircle, 
    Mail,
    ChevronDown,
    ExternalLink,
    Sparkles,
    Zap,
    Shield,
    Palette,
    Code,
    Globe,
    BarChart3,
    Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const quickLinks = [
    { 
      title: "Getting Started", 
      desc: "Learn the basics of Profolio", 
      icon: Rocket,
      color: "from-indigo-500 to-purple-500"
    },
    { 
      title: "Templates Guide", 
      desc: "Browse & customize templates", 
      icon: Palette,
      color: "from-pink-500 to-rose-500"
    },
    { 
      title: "AI Assistant", 
      desc: "Generate content with AI", 
      icon: Sparkles,
      color: "from-emerald-500 to-teal-500"
    },
    { 
      title: "Custom Domains", 
      desc: "Connect your own domain", 
      icon: Globe,
      color: "from-orange-500 to-amber-500"
    },
    { 
      title: "Analytics", 
      desc: "Track your portfolio metrics", 
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Integrations", 
      desc: "Connect external services", 
      icon: Zap,
      color: "from-violet-500 to-fuchsia-500"
    },
  ];

  const faqs = [
    {
      question: "How do I create my first portfolio?",
      answer: "Navigate to the Templates page, choose a design that fits your style, and click 'Use Template'. You can then customize all sections including projects, experience, and contact information through the visual editor."
    },
    {
      question: "Can I use my own custom domain?",
      answer: "Yes! Go to Settings > Domains and add your custom domain. You'll need to update your DNS records with your domain provider. We support both root domains (example.com) and subdomains (portfolio.example.com)."
    },
    {
      question: "How does the AI content generator work?",
      answer: "Our AI Assistant uses advanced language models to help you write professional bios, project descriptions, and more. Simply select a content type, provide some context, and the AI will generate polished copy that you can edit and refine."
    },
    {
      question: "What integrations are available?",
      answer: "Profolio integrates with popular services like Google Analytics, Mailchimp, GitHub, LinkedIn, and more. Visit the Integrations page to connect your accounts and sync data automatically."
    },
    {
      question: "How do I track portfolio analytics?",
      answer: "Analytics are automatically tracked for all your portfolios. Visit the Analytics dashboard to see visitor counts, traffic sources, popular pages, and engagement metrics. You can also connect Google Analytics for more detailed insights."
    },
    {
      question: "Can I export my portfolio?",
      answer: "Yes, you can export your portfolio as static HTML/CSS files from the Settings page. This allows you to host your portfolio anywhere or keep a local backup."
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes 1 portfolio, access to all templates, basic analytics, and AI content generation. Upgrade to Pro for unlimited portfolios, custom domains, advanced analytics, and priority support."
    },
    {
      question: "How do I delete my account?",
      answer: "You can delete your account from Settings > Security > Danger Zone. Please note this action is permanent and will delete all your portfolios and data."
    },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Help Center" 
        description="Find answers, learn features, and get support for your Profolio journey."
      />

      {/* Search Bar */}
      <DashboardSection title="Search for Help" description="Type your question or topic to find relevant answers.">
        <DashboardCard>
          <DashboardInput 
            icon={Search}
            placeholder="e.g. How do I add a custom domain?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-base"
          />
        </DashboardCard>
      </DashboardSection>

      {/* Quick Links */}
      <DashboardSection title="Quick Start Guides" description="Jump into the most popular topics.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <button 
              key={link.title}
              className="group p-6 rounded-3xl bg-neutral-50 dark:bg-white/5 border border-transparent hover:border-indigo-500/20 hover:bg-white dark:hover:bg-neutral-800 transition-all text-left relative overflow-hidden"
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity",
                link.color
              )} />
              <div className="relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg",
                  link.color
                )}>
                  <link.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black italic tracking-tight text-neutral-900 dark:text-white mb-1">
                  {link.title}
                </h3>
                <p className="text-[10px] text-neutral-500 font-medium italic">
                  {link.desc}
                </p>
              </div>
              <ExternalLink className="absolute top-6 right-6 w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </DashboardSection>

      {/* FAQ Section */}
      <DashboardSection 
        title="Frequently Asked Questions" 
        description={`${filteredFaqs.length} ${searchQuery ? 'matching' : 'common'} questions answered.`}
      >
        <DashboardCard>
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                <p className="text-sm font-bold text-neutral-500 italic">
                  No results found for "{searchQuery}"
                </p>
                <p className="text-xs text-neutral-400 italic mt-1">
                  Try a different search term or browse all questions
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div 
                  key={index}
                  className="border border-neutral-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="font-black italic tracking-tight text-sm text-neutral-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={cn(
                        "w-5 h-5 text-neutral-400 transition-transform shrink-0",
                        expandedFaq === index && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 text-sm text-neutral-600 dark:text-neutral-400 font-medium italic leading-relaxed border-t border-neutral-100 dark:border-white/5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </DashboardCard>
      </DashboardSection>

      {/* Resources */}
      <DashboardSection title="Additional Resources" description="Explore more ways to learn and get help.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-transparent relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Book className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black italic tracking-tight mb-2">Documentation</h3>
              <p className="text-indigo-100 font-medium text-sm italic mb-6">
                Comprehensive guides and API references for developers.
              </p>
              <DashboardButton 
                variant="secondary" 
                className="bg-white text-indigo-500 hover:bg-neutral-100 h-12 px-6"
              >
                Read Docs
              </DashboardButton>
            </div>
            <Book className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
          </DashboardCard>

          <DashboardCard className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-transparent relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black italic tracking-tight mb-2">Video Tutorials</h3>
              <p className="text-pink-100 font-medium text-sm italic mb-6">
                Step-by-step video guides to master every feature.
              </p>
              <DashboardButton 
                variant="secondary" 
                className="bg-white text-pink-500 hover:bg-neutral-100 h-12 px-6"
              >
                Watch Now
              </DashboardButton>
            </div>
            <Video className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
          </DashboardCard>

          <DashboardCard className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-transparent relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black italic tracking-tight mb-2">Community</h3>
              <p className="text-emerald-100 font-medium text-sm italic mb-6">
                Join our Discord to connect with other creators.
              </p>
              <DashboardButton 
                variant="secondary" 
                className="bg-white text-emerald-500 hover:bg-neutral-100 h-12 px-6"
              >
                Join Discord
              </DashboardButton>
            </div>
            <MessageCircle className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
          </DashboardCard>
        </div>
      </DashboardSection>

      {/* Contact Support */}
      <DashboardSection title="Still Need Help?" description="Our support team is here for you.">
        <DashboardCard className="bg-neutral-50 dark:bg-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center shrink-0">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black italic tracking-tight text-neutral-900 dark:text-white">
                  Contact Support
                </h3>
                <p className="text-xs text-neutral-500 font-medium italic">
                  Get personalized help from our team. We typically respond within 24 hours.
                </p>
              </div>
            </div>
            <DashboardButton variant="primary" className="h-14 px-10 shadow-xl">
              Send Message
            </DashboardButton>
          </div>
        </DashboardCard>
      </DashboardSection>
    </div>
  );
}
