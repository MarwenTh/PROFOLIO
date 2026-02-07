"use client";
import React, { useState } from "react";
import { X, Upload, CheckCircle, AlertCircle, Download } from "lucide-react";
import { DashboardButton } from "@/components/dashboard/Shared";
import { toast } from "sonner";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId?: number;
  onImport: (subscribers: any[]) => Promise<void>;
}

interface ParsedRow {
  email: string;
  name?: string;
  isValid: boolean;
  error?: string;
}

export function CSVImportModal({ isOpen, onClose, portfolioId, onImport }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload');

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const parseCSV = (text: string): ParsedRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const rows: ParsedRow[] = [];

    // Skip header if it exists
    const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const columns = lines[i].split(',').map(col => col.trim().replace(/^"|"$/g, ''));
      
      if (columns.length === 0 || !columns[0]) continue;

      const email = columns[0];
      const name = columns[1] || '';

      const isValid = validateEmail(email);
      rows.push({
        email,
        name,
        isValid,
        error: isValid ? undefined : 'Invalid email format'
      });
    }

    return rows;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      setParsedData(parsed);
      setStep('preview');
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!portfolioId) {
      toast.error('Please select a portfolio first');
      return;
    }

    const validRows = parsedData.filter(row => row.isValid);
    if (validRows.length === 0) {
      toast.error('No valid emails to import');
      return;
    }

    setLoading(true);
    try {
      await onImport(validRows.map(row => ({
        email: row.email,
        name: row.name,
        portfolio_id: portfolioId
      })));
      
      setStep('complete');
      toast.success(`Successfully imported ${validRows.length} subscribers!`);
    } catch (error) {
      toast.error('Failed to import subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setStep('upload');
    onClose();
  };

  if (!isOpen) return null;

  const validCount = parsedData.filter(row => row.isValid).length;
  const invalidCount = parsedData.length - validCount;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-black italic tracking-tighter">Import Subscribers</h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
              <h3 className="text-xl font-black italic mb-2">Upload CSV File</h3>
              <p className="text-neutral-500 mb-6">
                CSV should have columns: email, name (optional)
              </p>
              
              <label className="inline-block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Choose CSV File
                </span>
              </label>

              <div className="mt-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-left max-w-md mx-auto">
                <p className="text-sm font-bold mb-2">Example CSV format:</p>
                <pre className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                  email,name{'\n'}
                  john@example.com,John Doe{'\n'}
                  jane@example.com,Jane Smith
                </pre>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <p className="text-sm text-neutral-500 mb-1">Total Rows</p>
                  <p className="text-2xl font-black italic">{parsedData.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Valid</p>
                  <p className="text-2xl font-black italic text-emerald-600 dark:text-emerald-400">{validCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-red-500/10">
                  <p className="text-sm text-red-600 dark:text-red-400 mb-1">Invalid</p>
                  <p className="text-2xl font-black italic text-red-600 dark:text-red-400">{invalidCount}</p>
                </div>
              </div>

              {/* Preview Table */}
              <div>
                <h4 className="text-sm font-bold mb-3">Preview ({parsedData.length} rows)</h4>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-100 dark:bg-neutral-800 sticky top-0">
                        <tr>
                          <th className="text-left p-3 text-xs font-bold">Status</th>
                          <th className="text-left p-3 text-xs font-bold">Email</th>
                          <th className="text-left p-3 text-xs font-bold">Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.map((row, index) => (
                          <tr key={index} className="border-t border-neutral-200 dark:border-neutral-800">
                            <td className="p-3">
                              {row.isValid ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                            </td>
                            <td className="p-3 text-sm font-mono">{row.email}</td>
                            <td className="p-3 text-sm">{row.name || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
              <h3 className="text-xl font-black italic mb-2">Import Complete!</h3>
              <p className="text-neutral-500 mb-6">
                Successfully imported {validCount} subscribers
              </p>
              <DashboardButton onClick={handleClose}>
                Done
              </DashboardButton>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'preview' && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-6 flex gap-3">
            <button
              onClick={() => setStep('upload')}
              className="flex-1 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleImport}
              disabled={loading || validCount === 0}
              className="flex-1 h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Importing...' : `Import ${validCount} Subscribers`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
