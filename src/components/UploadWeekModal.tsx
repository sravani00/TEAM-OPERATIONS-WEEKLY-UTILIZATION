import React, { useState, useRef } from 'react';
import type { WeekData } from '../types';
import { parseWeeklyCSV, parseWeeklyJSON, generateSampleCSV, generateSampleJSON } from '../utils/csvParser';
import { Upload, X, Download, FileText, CheckCircle2, AlertCircle, Sparkles, FileCode, Clipboard } from 'lucide-react';

interface UploadWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: WeekData;
  onUploadWeek: (newWeek: WeekData) => void;
}

export const UploadWeekModal: React.FC<UploadWeekModalProps> = ({
  isOpen,
  onClose,
  currentWeek,
  onUploadWeek,
}) => {
  const [inputTab, setInputTab] = useState<'file' | 'paste'>('file');
  const [fileName, setFileName] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [parsedPreview, setParsedPreview] = useState<WeekData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleParseContent = (content: string, sourceName?: string) => {
    setErrorMsg(null);
    if (!content || content.trim().length === 0) {
      setParsedPreview(null);
      return;
    }

    try {
      const trimmed = content.trim();
      if (trimmed.startsWith('{') || (sourceName && sourceName.toLowerCase().endsWith('.json'))) {
        const result = parseWeeklyJSON(content, currentWeek);
        setParsedPreview(result);
      } else {
        const result = parseWeeklyCSV(content, currentWeek);
        setParsedPreview(result);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to parse data. Please check CSV/JSON structure.');
      setParsedPreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleParseContent(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleParseContent(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handlePastedTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPastedText(text);
    setFileName('Pasted Data');
    handleParseContent(text, 'pasted.csv');
  };

  const handleDownloadSampleCSV = () => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Weekly_Ops_Data_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSampleJSON = () => {
    const jsonContent = generateSampleJSON(currentWeek);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Weekly_Ops_Data_Template.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitImport = () => {
    if (!parsedPreview) return;
    onUploadWeek(parsedPreview);
    handleResetModal();
    onClose();
  };

  const handleResetModal = () => {
    setFileName(null);
    setPastedText('');
    setParsedPreview(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-950 text-blue-400 border border-blue-800/60 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload Weekly Operational Data</h2>
              <p className="text-xs text-slate-400">Import CSV spreadsheet or JSON report to generate weekly dashboard</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleResetModal();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1">

          {/* Download Sample Templates Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-900/40 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-blue-200">Need a weekly data template?</h4>
                <p className="text-[11px] text-slate-400">Download formatted sample files to fill in your weekly team metrics.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleDownloadSampleCSV}
                className="px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800/80 text-blue-300 border border-blue-700/60 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV Template</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadSampleJSON}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON Template</span>
              </button>
            </div>
          </div>

          {/* Tabs: Upload File vs Paste Text */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <button
              type="button"
              onClick={() => setInputTab('file')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                inputTab === 'file'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload CSV / JSON File</span>
            </button>
            <button
              type="button"
              onClick={() => setInputTab('paste')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                inputTab === 'paste'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste Text / Spreadsheet Rows</span>
            </button>
          </div>

          {/* Tab 1: File Dropzone */}
          {inputTab === 'file' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-blue-500 bg-blue-950/20 scale-[0.99]'
                  : fileName
                  ? 'border-emerald-500/60 bg-emerald-950/10'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv,.json,.txt"
                className="hidden"
              />
              {fileName ? (
                <div className="flex flex-col items-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  <div className="text-sm font-bold text-emerald-200">{fileName}</div>
                  <p className="text-xs text-slate-400">File loaded successfully. See parsed report summary below.</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetModal();
                    }}
                    className="mt-2 text-xs text-rose-400 underline hover:text-rose-300"
                  >
                    Remove & Choose Another File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-4 bg-slate-800 rounded-full text-slate-400">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      <span className="text-blue-400 hover:underline">Click to browse</span> or drag and drop your weekly file here
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Supports .CSV spreadsheets or .JSON export files</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Paste Text Area */}
          {inputTab === 'paste' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Paste your CSV content or JSON weekly data string below:
              </label>
              <textarea
                rows={7}
                value={pastedText}
                onChange={handlePastedTextChange}
                placeholder={`Date Range,Aug 24 – Aug 28, 2026\n# ESP_PLATFORMS\nOngage,450,36\nNetcore,325,29.5`}
                className="w-full bg-slate-950 text-slate-100 font-mono text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center space-x-3 text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Summary Preview Card */}
          {parsedPreview && (
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Parsed Weekly Operational Report</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full">
                  Ready to Import
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">Date Range</span>
                  <span className="font-bold text-slate-100 truncate block">{parsedPreview.dateRange}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">Total Campaigns</span>
                  <span className="font-bold text-emerald-400 text-sm">{parsedPreview.summary.totalCampaigns}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">Team Utilization</span>
                  <span className="font-bold text-blue-400 text-sm">{parsedPreview.summary.teamUtilization}%</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">Total Hours</span>
                  <span className="font-bold text-purple-400 text-sm">{parsedPreview.summary.totalHours} hrs</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-300 pt-1">
                <div>ESPs Parsed: <span className="font-bold text-white">{parsedPreview.espData.length}</span></div>
                <div>Team Members: <span className="font-bold text-white">{parsedPreview.teamData.length}</span></div>
                <div>Activities: <span className="font-bold text-white">{parsedPreview.activities.length}</span></div>
                <div>Plan Items: <span className="font-bold text-white">{parsedPreview.planItems.length}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              handleResetModal();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!parsedPreview}
            onClick={handleSubmitImport}
            className={`px-5 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-lg ${
              parsedPreview
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Generate & View Weekly Report</span>
          </button>
        </div>

      </div>
    </div>
  );
};
