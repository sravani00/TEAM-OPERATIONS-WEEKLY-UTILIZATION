import React from 'react';
import type { WeekData, UserRole } from '../types';
import { 
  Calendar, 
  BarChart3, 
  Edit3, 
  PlusCircle, 
  Upload,
  Download, 
  Printer, 
  RotateCcw,
  Trash2,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  ArrowRightLeft,
  FileText,
  LogOut,
  UserCheck,
  Shield
} from 'lucide-react';

export type DashboardTab = 'dashboard' | 'resources' | 'reports' | 'comparison' | 'final';

interface HeaderProps {
  weeks: WeekData[];
  selectedWeekId: string;
  onSelectWeek: (id: string) => void;
  onSelectCalendarDate: (dateStr: string) => void;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  currentUserRole?: UserRole | null;
  onLogout?: () => void;
  onOpenEditModal: () => void;
  onOpenAddWeekModal: () => void;
  onOpenUploadModal: () => void;
  onExportCSV: () => void;
  onPrintReport: () => void;
  onResetData: () => void;
  onClearAllData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  weeks,
  selectedWeekId,
  onSelectWeek,
  onSelectCalendarDate,
  activeTab,
  onSelectTab,
  currentUserRole,
  onLogout,
  onOpenEditModal,
  onOpenAddWeekModal,
  onOpenUploadModal,
  onExportCSV,
  onPrintReport,
  onResetData,
  onClearAllData,
}) => {
  const isManagerOrLead = currentUserRole === 'manager' || currentUserRole === 'sravani';

  const allTabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = isManagerOrLead ? [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'resources', label: 'Resources', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'reports', label: 'Weekly Reports', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'comparison', label: 'Comparison', icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
    { id: 'final', label: 'Final Report', icon: <FileText className="w-3.5 h-3.5" /> },
  ] : [
    { id: 'reports', label: 'My Weekly Report', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Title & Badge */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-md text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  TEAM OPERATIONS – WEEKLY UTILIZATION
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                  <Sparkles className="w-3 h-3 mr-1 text-cyan-600" />
                  {isManagerOrLead ? 'Manager Platform' : 'Resource Portal'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isManagerOrLead
                  ? 'Team utilization tracking, ESP campaign metrics & automated manager reports'
                  : 'Log your daily metrics & weekly campaign activity'}
              </p>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Calendar Date Picker Week Filter */}
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-cyan-600 absolute left-3 pointer-events-none z-10" />
              <input
                type="date"
                title="Select a date on calendar to filter week"
                onChange={(e) => {
                  if (e.target.value) {
                    onSelectCalendarDate(e.target.value);
                  }
                }}
                className="bg-slate-50 text-slate-900 font-bold pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-300 hover:border-cyan-500 focus:outline-none cursor-pointer shadow-sm"
              />
            </div>

            {/* Week Selector Dropdown */}
            <div className="relative flex items-center">
              <select
                value={selectedWeekId}
                onChange={(e) => onSelectWeek(e.target.value)}
                disabled={weeks.length === 0}
                className="appearance-none bg-slate-50 text-slate-900 font-bold pl-4 pr-9 py-2 rounded-xl text-xs border border-slate-300 hover:border-cyan-500 focus:outline-none cursor-pointer shadow-sm disabled:opacity-50"
              >
                {weeks.length === 0 ? (
                  <option value="">No Weeks Loaded</option>
                ) : (
                  weeks.map((w) => (
                    <option key={w.id} value={w.id} className="bg-white text-slate-900">
                      Week: {w.dateRange}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
            </div>

            {/* Action Buttons (Only visible to Managers & Leads) */}
            {isManagerOrLead && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenUploadModal}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md border border-blue-500/20"
                  title="Upload CSV or JSON weekly data file"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Data</span>
                </button>

                <button
                  onClick={onOpenEditModal}
                  disabled={weeks.length === 0}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-all shadow-sm disabled:opacity-50"
                  title="Edit weekly data & metrics"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="hidden sm:inline">Edit Data</span>
                </button>

                <button
                  onClick={onOpenAddWeekModal}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-all shadow-sm"
                  title="Add new week record"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">New Week</span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

                <button
                  onClick={onExportCSV}
                  disabled={weeks.length === 0}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-300 transition-all disabled:opacity-50"
                  title="Export Week Data to CSV"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={onPrintReport}
                  disabled={weeks.length === 0}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-300 transition-all disabled:opacity-50"
                  title="Print Executive Dashboard Report"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={onClearAllData}
                  className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-300 transition-all"
                  title="Clear all weekly data"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={onResetData}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl border border-slate-300 transition-all"
                  title="Reset to demo dataset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* User Profile Badge & Logout Button */}
            {currentUserRole && onLogout && (
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
                {isManagerOrLead ? (
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                )}
                <span className="text-xs font-bold text-slate-800 capitalize">
                  {currentUserRole === 'manager' ? 'Manager' : currentUserRole}
                </span>
                <button
                  onClick={onLogout}
                  className="ml-1 text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                  title="Log out of account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center space-x-1.5 overflow-x-auto">
          {allTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
