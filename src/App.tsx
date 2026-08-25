import React, { useState, useEffect } from 'react';
import { INITIAL_WEEKS } from './data/mockData';
import type { WeekData, UserRole } from './types';
import { Header, type DashboardTab } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { RoleSelectorBar } from './components/RoleSelectorBar';
import { ResourceWeeklyReportForm } from './components/ResourceWeeklyReportForm';
import { ManagerDashboardView } from './components/ManagerDashboardView';
import { FinalReportView } from './components/FinalReportView';
import { ESPSection } from './components/ESPSection';
import { TeamSection } from './components/TeamSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { ActionPlanSection } from './components/ActionPlanSection';
import { ComparisonSection } from './components/ComparisonSection';
import { EditWeekModal } from './components/EditWeekModal';
import { AddWeekModal } from './components/AddWeekModal';
import { UploadWeekModal } from './components/UploadWeekModal';
import { LayoutDashboard } from 'lucide-react';

const STORAGE_KEY = 'weekly_ops_dashboard_weeks_v9';
const AUTH_KEY = 'weekly_ops_dashboard_auth_v9';

const EMPTY_WEEK: WeekData = {
  id: 'empty-week',
  dateRange: 'Aug 24 – Aug 28, 2026',
  previousWeekRange: 'Aug 17 – Aug 21, 2026',
  summary: {
    teamUtilization: 0,
    prevTeamUtilization: 0,
    totalCampaigns: 0,
    prevTotalCampaigns: 0,
    totalHours: 0,
    prevTotalHours: 0,
    totalTeamMembers: 7,
    prevTotalTeamMembers: 7,
    completedActivitiesCount: 0,
    prevCompletedActivitiesCount: 0,
  },
  espData: [],
  teamData: [],
  activities: [],
  planItems: [],
};

// Helper function to format Monday - Friday date range from any calendar date
function getWeekRangeFromDate(dateInput: Date): { dateRange: string; weekId: string } {
  const d = new Date(dateInput);
  const day = d.getDay();
  const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
  
  const monday = new Date(d.setDate(diffToMon));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const formatOpt: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const monStr = monday.toLocaleDateString('en-US', formatOpt);
  const friStr = friday.toLocaleDateString('en-US', formatOpt);
  const yearStr = friday.getFullYear();

  const dateRange = `${monStr} – ${friStr}, ${yearStr}`;
  const weekId = `week-${monday.toISOString().split('T')[0]}`;
  return { dateRange, weekId };
}

export const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    return savedAuth !== null;
  });

  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    return (savedAuth as UserRole) || null;
  });

  // Persistence state
  const [weeks, setWeeks] = useState<WeekData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved dashboard weeks from localStorage', e);
      }
    }
    return INITIAL_WEEKS;
  });

  const [selectedWeekId, setSelectedWeekId] = useState<string>(() => weeks[0]?.id || INITIAL_WEEKS[0].id);
  const [activeTab, setActiveTab] = useState<DashboardTab>('reports');

  // Scope Filters State
  const [espFilter, setEspFilter] = useState<string>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Save weeks to localStorage whenever modified
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks));
  }, [weeks]);

  // Handle Login & Logout
  const handleLogin = (role: UserRole) => {
    setCurrentUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, role);
    if (role === 'manager') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('reports');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserRole(null);
    localStorage.removeItem(AUTH_KEY);
  };

  // Selected week dataset
  const currentWeek = weeks.find((w) => w.id === selectedWeekId) || weeks[0] || EMPTY_WEEK;

  // Calendar Date Filter Handler
  const handleSelectCalendarDate = (dateStr: string) => {
    if (!dateStr) return;
    const pickedDate = new Date(dateStr);
    if (isNaN(pickedDate.getTime())) return;

    const { dateRange, weekId } = getWeekRangeFromDate(pickedDate);

    const existingWeek = weeks.find(
      (w) => w.id === weekId || w.dateRange.toLowerCase() === dateRange.toLowerCase()
    );

    if (existingWeek) {
      setSelectedWeekId(existingWeek.id);
    } else {
      // Create new week dataset for the selected calendar date range
      const newWeek: WeekData = {
        ...INITIAL_WEEKS[0],
        id: weekId,
        dateRange,
        previousWeekRange: currentWeek.dateRange,
      };
      setWeeks((prev) => [newWeek, ...prev]);
      setSelectedWeekId(newWeek.id);
    }
  };

  // Filtered Datasets
  const filteredEspData = currentWeek.espData.filter((esp) => {
    if (espFilter !== 'ALL' && esp.name !== espFilter) return false;
    return true;
  });

  const filteredTeamData = currentWeek.teamData.filter((tm) => {
    if (teamFilter !== 'ALL' && tm.name !== teamFilter) return false;
    return true;
  });

  const filteredActivities = currentWeek.activities.filter((act) => {
    if (teamFilter !== 'ALL' && act.owner !== teamFilter && act.owner !== 'Team') return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = act.activity.toLowerCase().includes(q);
      const matchOwner = act.owner.toLowerCase().includes(q);
      const matchCat = act.category ? act.category.toLowerCase().includes(q) : false;
      if (!matchName && !matchOwner && !matchCat) return false;
    }
    return true;
  });

  const filteredPlanItems = currentWeek.planItems.filter((item) => {
    if (teamFilter !== 'ALL' && item.owner !== teamFilter && item.owner !== 'Team') return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.activity.toLowerCase().includes(q);
      const matchOwner = item.owner.toLowerCase().includes(q);
      if (!matchName && !matchOwner) return false;
    }
    return true;
  });

  // Handlers for Data Mutations with REAL-TIME AUTOMATIC TEAM RECALCULATION
  const handleSaveWeek = (updatedWeek: WeekData) => {
    const teamData = updatedWeek.teamData || [];
    
    // Automatically recalculate summary metrics across all team members
    const totalCampaigns = teamData.reduce((acc, t) => acc + (Number(t.campaigns) || 0), 0);
    const totalHours = Math.round(teamData.reduce((acc, t) => acc + (Number(t.hours) || 0), 0) * 10) / 10;
    const totalTeamMembers = teamData.length;
    const teamUtilization = totalTeamMembers > 0
      ? Math.round((teamData.reduce((acc, t) => acc + (Number(t.utilization) || 0), 0) / totalTeamMembers) * 10) / 10
      : 0;
    const completedActivitiesCount = (updatedWeek.activities || []).filter((a) => a.status === 'Completed').length;

    const recalculatedWeek: WeekData = {
      ...updatedWeek,
      summary: {
        ...updatedWeek.summary,
        totalCampaigns,
        totalHours,
        totalTeamMembers,
        teamUtilization,
        completedActivitiesCount,
      },
    };

    setWeeks((prev) => prev.map((w) => (w.id === recalculatedWeek.id ? recalculatedWeek : w)));
  };

  const handleAddWeek = (newWeek: WeekData) => {
    setWeeks((prev) => {
      const existingIdx = prev.findIndex(
        (w) => w.id === newWeek.id || w.dateRange.trim().toLowerCase() === newWeek.dateRange.trim().toLowerCase()
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newWeek;
        return copy;
      }
      return [newWeek, ...prev];
    });
    setSelectedWeekId(newWeek.id);
    setEspFilter('ALL');
    setTeamFilter('ALL');
    setSearchQuery('');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset to default operational dataset?')) {
      localStorage.removeItem(STORAGE_KEY);
      setWeeks(INITIAL_WEEKS);
      setSelectedWeekId(INITIAL_WEEKS[0].id);
      setEspFilter('ALL');
      setTeamFilter('ALL');
      setSearchQuery('');
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all operational data?')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setWeeks([]);
      setSelectedWeekId('');
      setEspFilter('ALL');
      setTeamFilter('ALL');
      setSearchQuery('');
    }
  };

  const handleTogglePlanStatus = (planId: string) => {
    const updatedPlanItems = currentWeek.planItems.map((item) => {
      if (item.id === planId) {
        let nextStatus: 'Planned' | 'In Progress' | 'Completed' = 'Planned';
        if (item.status === 'Planned') nextStatus = 'In Progress';
        else if (item.status === 'In Progress') nextStatus = 'Completed';
        else nextStatus = 'Planned';
        return { ...item, status: nextStatus };
      }
      return item;
    });

    const updatedWeek = { ...currentWeek, planItems: updatedPlanItems };
    handleSaveWeek(updatedWeek);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Category', 'Name/Title', 'Metric 1', 'Metric 2', 'Utilization/Status'];
    const rows: string[][] = [
      ['Date Range', currentWeek.dateRange, '', '', ''],
      ['KPI Summary', 'Team Utilization', `${currentWeek.summary.teamUtilization}%`, 'Prev', `${currentWeek.summary.prevTeamUtilization}%`],
      ['KPI Summary', 'Total Campaigns', `${currentWeek.summary.totalCampaigns}`, 'Prev', `${currentWeek.summary.prevTotalCampaigns}`],
      ['KPI Summary', 'Total Hours', `${currentWeek.summary.totalHours} hrs`, 'Prev', `${currentWeek.summary.prevTotalHours} hrs`],
      ...currentWeek.espData.map((e) => ['ESP Utilization', e.name, `${e.campaigns} campaigns`, `${e.hours} hrs`, `${e.utilization}%`]),
      ...currentWeek.teamData.map((t) => ['Team Member', t.name, `${t.campaigns} campaigns`, `${t.hours} hrs`, `${t.utilization}%`]),
      ...currentWeek.activities.map((a) => ['Key Activity', a.activity, `Owner: ${a.owner}`, `Status: ${a.status}`, `${a.completionPercentage}%`]),
      ...currentWeek.planItems.map((p) => ['Plan Item', p.activity, `Owner: ${p.owner}`, `Target: ${p.targetDate}`, `Status: ${p.status}`]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Weekly_Operations_Report_${currentWeek.dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Handler
  const handlePrintReport = () => {
    window.print();
  };

  // Human Readable Name mapping for roles
  const roleNameMap: Record<UserRole, string> = {
    manager: 'Manager',
    sravani: 'Sravani',
    sricharan: 'Sricharan',
    vamsi: 'Vamsi',
    vivek: 'Vivek',
    dhanusri: 'Dhanusri',
    vishnu: 'Vishnu',
    rahul: 'Rahul',
  };

  // If unauthenticated, render Login Page
  if (!isAuthenticated || !currentUserRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Dropdown Role Simulator Bar */}
      <RoleSelectorBar
        currentRole={currentUserRole}
        onSelectRole={(role) => {
          handleLogin(role);
        }}
      />

      {/* Sticky Header */}
      <Header
        weeks={weeks}
        selectedWeekId={selectedWeekId}
        onSelectWeek={(id) => {
          setSelectedWeekId(id);
          setEspFilter('ALL');
          setTeamFilter('ALL');
        }}
        onSelectCalendarDate={handleSelectCalendarDate}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUserRole={currentUserRole}
        onLogout={handleLogout}
        onOpenEditModal={() => setIsEditModalOpen(true)}
        onOpenAddWeekModal={() => setIsAddWeekModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onExportCSV={handleExportCSV}
        onPrintReport={handlePrintReport}
        onResetData={handleResetData}
        onClearAllData={handleClearAllData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {weeks.length === 0 ? (
          <div className="my-12 p-12 bg-white border border-slate-200 rounded-3xl text-center flex flex-col items-center space-y-5 max-w-xl mx-auto shadow-md">
            <div className="p-5 bg-blue-50 text-blue-600 border border-blue-200 rounded-2xl">
              <LayoutDashboard className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">All Operational Data Cleared</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your dashboard is clean. Upload your CSV spreadsheet or JSON weekly data to start tracking operational performance.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Upload Operational Data
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-all"
              >
                Load Demo Dataset
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ROLE VIEW 1: Individual Resource View (Sravani, Sricharan, Vamsi, etc.) */}
            {currentUserRole !== 'manager' && (
              <ResourceWeeklyReportForm
                key={`${currentWeek.id}-${currentUserRole}`}
                currentWeek={currentWeek}
                resourceName={roleNameMap[currentUserRole]}
                currentRole={currentUserRole}
                onSaveReport={handleSaveWeek}
                onSelectWeek={setSelectedWeekId}
                allWeeks={weeks}
              />
            )}

            {/* ROLE VIEW 2: Manager Overview (Alex) */}
            {currentUserRole === 'manager' && (
              <>
                {/* TAB 1: Dashboard */}
                {activeTab === 'dashboard' && (
                  <ManagerDashboardView
                    currentWeek={currentWeek}
                    onUpdateWeek={handleSaveWeek}
                    onOpenUploadModal={() => setIsUploadModalOpen(true)}
                    onGenerateFinalReport={() => setActiveTab('final')}
                  />
                )}

                {/* TAB 2: Resources Breakdown */}
                {activeTab === 'resources' && (
                  <div className="space-y-8">
                    <TeamSection teamData={filteredTeamData} />
                    <ESPSection espData={filteredEspData} />
                  </div>
                )}

                {/* TAB 3: Weekly Reports */}
                {activeTab === 'reports' && (
                  <div className="space-y-8">
                    <ManagerDashboardView
                      currentWeek={currentWeek}
                      onUpdateWeek={handleSaveWeek}
                      onOpenUploadModal={() => setIsUploadModalOpen(true)}
                      onGenerateFinalReport={() => setActiveTab('final')}
                    />
                    <ActivitiesSection activities={filteredActivities} />
                    <ActionPlanSection planItems={filteredPlanItems} onToggleStatus={handleTogglePlanStatus} />
                  </div>
                )}

                {/* TAB 4: Comparison */}
                {activeTab === 'comparison' && (
                  <ComparisonSection
                    summary={currentWeek.summary}
                    dateRange={currentWeek.dateRange}
                    previousWeekRange={currentWeek.previousWeekRange}
                    allWeeks={weeks}
                  />
                )}

                {/* TAB 5: Final Report */}
                {activeTab === 'final' && (
                  <FinalReportView
                    currentWeek={currentWeek}
                    onExportCSV={handleExportCSV}
                    onPrintReport={handlePrintReport}
                  />
                )}
              </>
            )}
          </>
        )}

      </main>

      {/* Dashboard Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-4 h-4 text-cyan-600" />
            <span className="font-semibold text-slate-700">Team Operations — Weekly Resource Utilization & Manager Platform</span>
          </div>
          <p>© 2026 Operations Management Platform. Built for Ongage, Netcore, Maropost tracking.</p>
        </div>
      </footer>

      {/* Edit Modal */}
      <EditWeekModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        weekData={currentWeek}
        onSave={handleSaveWeek}
      />

      {/* Add Week Modal */}
      <AddWeekModal
        isOpen={isAddWeekModalOpen}
        onClose={() => setIsAddWeekModalOpen(false)}
        currentWeek={currentWeek}
        onAddWeek={handleAddWeek}
      />

      {/* Upload Week Data Modal */}
      <UploadWeekModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentWeek={currentWeek}
        onUploadWeek={handleAddWeek}
      />

    </div>
  );
};

export default App;
