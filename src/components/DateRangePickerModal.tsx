import React, { useState } from 'react';
import { Calendar, X, Check, Clock, Sparkles } from 'lucide-react';

interface DateRangePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDateRange: string;
  onSelectCustomRange: (dateRangeStr: string, numDays: number) => void;
}

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  isOpen,
  onClose,
  currentDateRange,
  onSelectCustomRange,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(5);
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [customDays, setCustomDays] = useState<string>('7');

  if (!isOpen) return null;

  const presets = [
    { label: '5 Days (Workweek)', days: 5 },
    { label: '7 Days (1 Week)', days: 7 },
    { label: '10 Days', days: 10 },
    { label: '15 Days', days: 15 },
    { label: '30 Days (Monthly)', days: 30 },
  ];

  const handleApplyPreset = (days: number) => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + (days - 1));

    const formatOpt: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = start.toLocaleDateString('en-US', formatOpt);
    const endStr = end.toLocaleDateString('en-US', formatOpt);
    const yearStr = end.getFullYear();

    const rangeStr = `${startStr} – ${endStr}, ${yearStr} (${days} Days)`;
    onSelectCustomRange(rangeStr, days);
    onClose();
  };

  const handleApplyCustomDates = () => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const formatOpt: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = start.toLocaleDateString('en-US', formatOpt);
    const endStr = end.toLocaleDateString('en-US', formatOpt);
    const yearStr = end.getFullYear();

    const rangeStr = `${startStr} – ${endStr}, ${yearStr} (${days} Days)`;
    onSelectCustomRange(rangeStr, days);
    onClose();
  };

  const handleApplyCustomDaysNum = () => {
    const num = parseInt(customDays, 10);
    if (isNaN(num) || num <= 0) return;
    handleApplyPreset(num);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-50 border border-cyan-200 text-cyan-600 rounded-2xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">Select Custom Date Range & Duration</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Current: {currentDateRange}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-700 block flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-cyan-600 mr-1" />
            <span>Quick Duration Presets:</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => {
                  setSelectedPreset(p.days);
                  handleApplyPreset(p.days);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedPreset === p.days
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom N-Days Input */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <label className="text-xs font-extrabold text-slate-700 block flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 mr-1" />
            <span>Specify Custom Number of Days:</span>
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="365"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              placeholder="e.g. 14 days..."
              className="flex-1 bg-slate-50 text-slate-900 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
            <button
              type="button"
              onClick={handleApplyCustomDaysNum}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
            >
              Apply {customDays || 'N'} Days
            </button>
          </div>
        </div>

        {/* Custom Start & End Date Pickers */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <label className="text-xs font-extrabold text-slate-700 block">Or Select Custom Start & End Dates:</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 font-bold text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-1">End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 font-bold text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleApplyCustomDates}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Selected Calendar Range</span>
          </button>
        </div>

      </div>
    </div>
  );
};
