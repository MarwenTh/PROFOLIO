"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { 
    PageHeader, 
    DashboardCard, 
    DashboardBadge, 
    DashboardButton,
    DashboardSection,
    EmptyState 
} from "@/components/dashboard/Shared";
import { Code, Terminal, Plus, Save, Trash2, Eye, EyeOff, Globe, Clipboard, Image as ImageIcon, Monitor, Loader2 } from "lucide-react";
import { useCodeSnippets, usePublicSnippets } from "@/hooks/useCode";
import { useLibrary } from "@/hooks/useLibrary";
import { Loader } from "@/components/ui/Loader";
import { toast } from "sonner";

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', color: 'bg-yellow-500/10 text-yellow-500', monacoLang: 'javascript' },
  { value: 'typescript', label: 'TypeScript', color: 'bg-blue-500/10 text-blue-500', monacoLang: 'typescript' },
  { value: 'python', label: 'Python', color: 'bg-green-500/10 text-green-500', monacoLang: 'python' },
  { value: 'html', label: 'HTML', color: 'bg-orange-500/10 text-orange-500', monacoLang: 'html' },
  { value: 'css', label: 'CSS', color: 'bg-purple-500/10 text-purple-500', monacoLang: 'css' },
  { value: 'json', label: 'JSON', color: 'bg-neutral-500/10 text-neutral-500', monacoLang: 'json' },
  { value: 'sql', label: 'SQL', color: 'bg-indigo-500/10 text-indigo-500', monacoLang: 'sql' },
];

export default function CustomCodePage() {
  const { snippets, loading, createSnippet, updateSnippet, deleteSnippet } = useCodeSnippets();
  const { media } = useLibrary();
  const [selectedSnippet, setSelectedSnippet] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleNew = () => {
    setSelectedSnippet(null);
    setIsEditing(true);
    setTitle('');
    setLanguage('javascript');
    setCode('');
    setIsPublic(false);
    setShowPreview(false);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    
    // Auto-populate with template for HTML
    if (newLang === 'html' && !code) {
      setCode(`<h1>Hello World!</h1>

<button onclick="alert('Hello!')">Click Me!</button>

<div style="margin-top: 20px;">
  <input type="text" placeholder="Enter your name..." />
</div>`);
    }
  };

  const handleEdit = (snippet: any) => {
    setSelectedSnippet(snippet);
    setIsEditing(true);
    setTitle(snippet.title || '');
    setLanguage(snippet.language);
    setCode(snippet.code);
    setIsPublic(snippet.is_public);
    setShowPreview(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (selectedSnippet) {
        await updateSnippet(selectedSnippet.id, { title, language, code, is_public: isPublic });
        toast.success('Snippet updated!');
      } else {
        await createSnippet({ title, language, code, is_public: isPublic });
        toast.success('Snippet created!');
      }
      setIsEditing(false);
      setSelectedSnippet(null);
    } catch (error) {
      toast.error('Failed to save snippet');
    } finally {
      setSaving(false);
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
      toast.success('Code pasted from clipboard!');
    } catch (err) {
      toast.error('Failed to read clipboard');
    }
  };

  const insertFromLibrary = (imageUrl: string) => {
    const insertText = language === 'html' 
      ? `<img src="${imageUrl}" alt="Image" />`
      : language === 'css'
      ? `background-image: url('${imageUrl}');`
      : language === 'markdown'
      ? `![Image](${imageUrl})`
      : `"${imageUrl}"`;
    
    setCode(code + '\n' + insertText);
    setShowLibrary(false);
    toast.success('Image URL inserted!');
  };

  const getMonacoLanguage = () => {
    return LANGUAGES.find(l => l.value === language)?.monacoLang || 'javascript';
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
                    onChange={(e) => handleLanguageChange(e.target.value)}
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
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 ${
                      showPreview
                        ? 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/30'
                        : 'bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="px-6 py-3 bg-white/5 border-b border-white/5 flex gap-2">
                <button
                  onClick={handlePaste}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  Paste
                </button>
                <button
                  onClick={() => setShowLibrary(!showLibrary)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Library
                </button>
              </div>

              {/* Library Modal */}
              {showLibrary && (
                <div className="px-6 py-4 bg-black/40 border-b border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-white">Insert from Library</h4>
                    <button onClick={() => setShowLibrary(false)} className="text-white/50 hover:text-white">✕</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                    {media.slice(0, 8).map((item: any) => (
                      <button
                        key={item.id}
                        onClick={() => insertFromLibrary(item.url)}
                        className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-colors"
                      >
                        <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Monaco Editor */}
                <div className={`bg-black/40 ${showPreview ? '' : 'lg:col-span-2'}`}>
                  <MonacoEditor
                    height="500px"
                    language={getMonacoLanguage()}
                    theme="vs-dark"
                    value={code}
                    onChange={(value: string | undefined) => setCode(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: 'on',
                    }}
                  />
                </div>

                {/* Preview */}
                {showPreview && (
                  <div className="bg-white dark:bg-neutral-800 p-6 border-l border-white/5 overflow-auto">
                    <div className="mb-2 text-xs font-bold text-neutral-500 uppercase tracking-widest">Preview</div>
                    {language === 'html' ? (
                      <div className="w-full h-[450px] border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white overflow-auto">
                        <style>{`
                          .html-preview * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                          }
                          .html-preview {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            padding: 20px;
                            background: white;
                            min-height: 100%;
                          }
                          .html-preview button {
                            padding: 10px 20px;
                            font-size: 14px;
                            border-radius: 8px;
                            border: none;
                            background: #6366f1;
                            color: white;
                            cursor: pointer;
                            font-weight: 600;
                            margin: 5px;
                          }
                          .html-preview button:hover {
                            background: #4f46e5;
                          }
                          .html-preview input,
                          .html-preview textarea {
                            padding: 8px 12px;
                            border: 1px solid #e5e7eb;
                            border-radius: 6px;
                            font-size: 14px;
                            margin: 5px;
                          }
                          .html-preview input:focus,
                          .html-preview textarea:focus {
                            outline: none;
                            border-color: #6366f1;
                          }
                          .html-preview h1, .html-preview h2, .html-preview h3 {
                            margin: 10px 0;
                          }
                          .html-preview p {
                            margin: 8px 0;
                          }
                          .html-preview div {
                            margin: 5px 0;
                          }
                        `}</style>
                        <div 
                          className="html-preview"
                          dangerouslySetInnerHTML={{ __html: code }}
                        />
                      </div>
                    ) : (
                      <pre className="w-full h-[450px] overflow-auto bg-neutral-900 text-neutral-300 p-4 rounded-lg font-mono text-sm">
                        <code>{code}</code>
                      </pre>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 flex justify-between gap-3 bg-white/5">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedSnippet(null);
                  }}
                  disabled={saving}
                  className="px-6 h-12 rounded-xl bg-white/10 text-white hover:bg-white/20 font-bold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  {selectedSnippet && (
                    <button
                      onClick={() => handleDelete(selectedSnippet.id)}
                      disabled={saving}
                      className="px-6 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 h-12 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Snippet
                      </>
                    )}
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
