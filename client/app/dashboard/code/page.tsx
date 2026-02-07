"use client";
import React, { useState } from "react";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardBadge, 
    DashboardButton,
    DashboardSection,
    EmptyState 
} from "@/components/dashboard/Shared";
import { Code, Terminal, Plus, Save, Trash2, Eye, EyeOff, Globe } from "lucide-react";
import { useCodeSnippets, usePublicSnippets } from "@/hooks/useCode";
import { Loader } from "@/components/ui/Loader";

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', color: 'bg-yellow-500/10 text-yellow-500' },
  { value: 'typescript', label: 'TypeScript', color: 'bg-blue-500/10 text-blue-500' },
  { value: 'python', label: 'Python', color: 'bg-green-500/10 text-green-500' },
  { value: 'html', label: 'HTML', color: 'bg-orange-500/10 text-orange-500' },
  { value: 'css', label: 'CSS', color: 'bg-purple-500/10 text-purple-500' },
  { value: 'json', label: 'JSON', color: 'bg-neutral-500/10 text-neutral-500' },
  { value: 'sql', label: 'SQL', color: 'bg-indigo-500/10 text-indigo-500' },
];

export default function CustomCodePage() {
  const { snippets, loading, createSnippet, updateSnippet, deleteSnippet } = useCodeSnippets();
  const [selectedSnippet, setSelectedSnippet] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleNew = () => {
    setSelectedSnippet(null);
    setIsEditing(true);
    setTitle('');
    setLanguage('javascript');
    setCode('');
    setIsPublic(false);
  };

  const handleEdit = (snippet: any) => {
    setSelectedSnippet(snippet);
    setIsEditing(true);
    setTitle(snippet.title || '');
    setLanguage(snippet.language);
    setCode(snippet.code);
    setIsPublic(snippet.is_public);
  };

  const handleSave = async () => {
    try {
      if (selectedSnippet) {
        await updateSnippet(selectedSnippet.id, { title, language, code, isPublic });
      } else {
        await createSnippet({ title, language, code, isPublic });
      }
      setIsEditing(false);
      setSelectedSnippet(null);
    } catch (error) {
      console.error('Error saving snippet:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      await deleteSnippet(id);
      if (selectedSnippet?.id === id) {
        setSelectedSnippet(null);
        setIsEditing(false);
      }
    }
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
      <PageHeader 
        title="Code Snippets" 
        description="Save and manage your code snippets with syntax highlighting."
        action={{
          label: "New Snippet",
          icon: Plus,
          onClick: handleNew
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Snippets List */}
        <div className="lg:col-span-1">
          <DashboardSection title="Your Snippets" description={`${snippets.length} saved`}>
            {snippets.length === 0 ? (
              <EmptyState 
                title="No snippets yet" 
                description="Create your first code snippet to get started."
                icon={Code}
                actionLabel="New Snippet"
                onAction={handleNew}
              />
            ) : (
              <div className="space-y-2">
                {snippets.map((snippet) => (
                  <button
                    key={snippet.id}
                    onClick={() => handleEdit(snippet)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedSnippet?.id === snippet.id
                        ? 'bg-indigo-500/10 border-indigo-500/50'
                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        LANGUAGES.find(l => l.value === snippet.language)?.color || 'bg-neutral-500/10 text-neutral-500'
                      }`}>
                        {snippet.language}
                      </span>
                      {snippet.is_public && <Globe className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <h4 className="font-bold text-sm mb-1">{snippet.title || 'Untitled'}</h4>
                    <p className="text-xs text-neutral-500 truncate font-mono">{snippet.code.substring(0, 50)}...</p>
                  </button>
                ))}
              </div>
            )}
          </DashboardSection>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <DashboardCard className="bg-neutral-900 border-white/5 shadow-2xl overflow-hidden p-0" hoverable={false}>
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3 flex-1">
                  <Terminal className="w-5 h-5 text-indigo-500" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Snippet title..."
                    className="flex-1 bg-transparent text-white text-xl font-black italic tracking-tighter outline-none placeholder:text-white/30"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-white/10 text-white border border-white/10 text-sm font-bold"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.value} value={lang.value} className="bg-neutral-900">
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setIsPublic(!isPublic)}
                    className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 ${
                      isPublic 
                        ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                        : 'bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {isPublic ? 'Public' : 'Private'}
                  </button>
                </div>
              </div>
              <div className="bg-black/40 p-6">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Write your code here..."
                  className="w-full h-[500px] bg-transparent text-neutral-300 font-mono text-sm leading-relaxed outline-none resize-none"
                  spellCheck={false}
                />
              </div>
              <div className="p-6 flex justify-between gap-3 bg-white/5">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedSnippet(null);
                  }}
                  className="px-6 h-12 rounded-xl bg-white/10 text-white hover:bg-white/20 font-bold transition-colors"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  {selectedSnippet && (
                    <button
                      onClick={() => handleDelete(selectedSnippet.id)}
                      className="px-6 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="px-6 h-12 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Snippet
                  </button>
                </div>
              </div>
            </DashboardCard>
          ) : (
            <DashboardCard>
              <div className="text-center py-20">
                <Code className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-xl font-black italic mb-2">No snippet selected</h3>
                <p className="text-neutral-500 mb-6">Select a snippet from the list or create a new one</p>
                <DashboardButton onClick={handleNew} icon={Plus}>
                  New Snippet
                </DashboardButton>
              </div>
            </DashboardCard>
          )}
        </div>
      </div>
    </div>
  );
}
