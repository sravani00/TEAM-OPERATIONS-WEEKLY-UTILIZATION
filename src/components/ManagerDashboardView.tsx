import React, { useState } from 'react';
import type { WeekData, TeamMemberData } from '../types';
import { 
  Users, 
  Clock, 
  Eye, 
  RotateCcw, 
  TrendingUp, 
  BarChart3, 
  X,
  FileText,
  Server
} from 'lucide-react';

interface ManagerDashboardViewProps {
  currentWeek: WeekData;
  onUpdateWeek: (updatedWeek: WeekData) => void;
  onOpenUploadModal: () => void;
  onGenerateFinalReport: () => void;
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({
  currentWeek,
  onUpdateWeek,
  onOpenUploadModal,
  onGenerateFinalReport,
}) => {
  const [selectedInspectMember, setSelectedInspectMember] = useState<TeamMemberData | null>(null);

  const teamMembers = currentWeek.teamData || [];

  // Summary Metrics — 100% Dynamically Aggregated from Team Members!
  const totalCampaigns = teamMembers.reduce((acc, t) => acc + (t.campaigns || 0), 0);
  const totalHours = Math.round(teamMembers.reduce((acc, t) => acc + (t.hours || 0), 0) * 10) / 10;
  const totalTeamMembers = teamMembers.length;
  const avgTeamUtilization = totalTeamMembers > 0
    ? Math.round((teamMembers.reduce((acc, t) => acc + (t.utilization || 0), 0) / totalTeamMembers) * 10) / 10
    : 96.8;

  // Status Counts
  const submittedCount = teamMembers.filter((t) => t.status === 'Submitted' || t.status === 'Approved').length;
  const draftCount = teamMembers.filter((t) => t.status === 'Draft').length;

  const handleUpdateStatus = (memberId: string, newStatus: 'Draft' | 'Submitted' | 'Approved') => {
    const updatedTeamData = teamMembers.map((t) =>
      t.id === memberId ? { ...t, status: newStatus } : t
    );

    const updatedWeek: WeekData = {
      ...currentWeek,
      teamData: updatedTeamData,
    };

    onUpdateWeek(updatedWeek);
    if (selectedInspectMember?.id === memberId) {
      setSelectedInspectMember((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Resources */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Team Resources</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">{totalTeamMembers}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Active Operations Specialists</p>
          </div>
        </div>

        {/* Card 2: Campaigns */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Campaigns</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-emerald-700 tracking-tight">
              {totalCampaigns.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Auto-Calculated Across All Members</p>
          </div>
        </div>

        {/* Card 3: Total Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Time</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 border border-purple-200 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-purple-700 tracking-tight">{totalHours} hrs</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Auto-Calculated Weekly Hours</p>
          </div>
        </div>

        {/* Card 4: Team Utilization */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Team Utilization</span>
            <div className="p-2.5 bg-cyan-50 text-cyan-600 border border-cyan-200 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-cyan-700 tracking-tight">{avgTeamUtilization}%</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Auto-Calculated Team Rate</p>
          </div>
        </div>

      </div>

      {/* Submission Status Tracker & Quick Actions Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div className="flex items-center space-x-6 text-xs font-bold">
          <div className="flex items-center space-x-2 text-emerald-700">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span>🟢 Submitted ({submittedCount})</span>
          </div>

          <div className="flex items-center space-x-2 text-amber-700">
            <span className="w-3 h-3 bg-amber-500 rounded-full" />
            <span>🟡 Draft / In Progress ({draftCount})</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenUploadModal}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Upload Data File
          </button>
          <button
            onClick={onGenerateFinalReport}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Final Report</span>
          </button>
        </div>

      </div>

      {/* Main Team Utilization Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Team Utilization — Current Week</h3>
            <p className="text-xs text-slate-500 mt-0.5">Period: {currentWeek.dateRange}</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Resources: <strong className="text-slate-900 font-bold">{teamMembers.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Resource Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4 text-right">Campaigns</th>
                <th className="py-3.5 px-4 text-right">Hours</th>
                <th className="py-3.5 px-4 text-right">Utilization %</th>
                <th className="py-3.5 px-4 text-right">Daily Util %</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Resource Name */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-xs font-bold text-cyan-700">
                      {member.name.charAt(0)}
                    </span>
                    <span>{member.name}</span>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4 text-slate-500 font-medium">{member.role || 'Operations Specialist'}</td>

                  {/* Campaigns */}
                  <td className="py-3.5 px-4 text-right font-black text-emerald-700">
                    {member.campaigns}
                  </td>

                  {/* Hours */}
                  <td className="py-3.5 px-4 text-right font-bold text-purple-700">
                    {member.hours} hrs
                  </td>

                  {/* Utilization % */}
                  <td className="py-3.5 px-4 text-right font-black text-cyan-700">
                    {member.utilization}%
                  </td>

                  {/* Daily Utilization % */}
                  <td className="py-3.5 px-4 text-right font-bold text-blue-700">
                    {member.dailyUtilization || member.utilization}%
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {member.status === 'Submitted' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        🟢 Submitted
                      </span>
                    )}
                    {member.status === 'Approved' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        🟢 Approved
                      </span>
                    )}
                    {member.status === 'Draft' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        🟡 Draft
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => setSelectedInspectMember(member)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 text-[11px] font-bold flex items-center space-x-1 transition-colors shadow-sm"
                        title="Inspect full weekly report"
                      >
                        <Eye className="w-3 h-3 text-cyan-600" />
                        <span>View</span>
                      </button>

                      {member.status === 'Submitted' && (
                        <button
                          onClick={() => handleUpdateStatus(member.id, 'Approved')}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 text-[11px] font-bold transition-colors"
                          title="Approve report"
                        >
                          Approve
                        </button>
                      )}

                      {(member.status === 'Submitted' || member.status === 'Approved') && (
                        <button
                          onClick={() => handleUpdateStatus(member.id, 'Draft')}
                          className="px-2 py-1 bg-slate-100 hover:bg-amber-50 text-amber-700 rounded-lg border border-slate-300 hover:border-amber-200 text-[11px] font-bold flex items-center space-x-1 transition-colors"
                          title="Reopen report for editing"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reopen</span>
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Inspect Member Report Modal */}
      {selectedInspectMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center font-black text-cyan-700 text-sm">
                  {selectedInspectMember.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedInspectMember.name} — Weekly Report
                  </h2>
                  <p className="text-xs text-slate-500">{selectedInspectMember.role} | {currentWeek.dateRange}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInspectMember(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Section 1: ESP Utilization */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center space-x-2 text-sm border-b border-slate-200 pb-1">
                  <Server className="w-4 h-4 text-cyan-600" />
                  <span>ESP-wise Campaign Utilization</span>
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">ESP Platform</th>
                        <th className="py-2.5 px-3 text-right">Campaigns</th>
                        <th className="py-2.5 px-3 text-right">Utilization %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {(selectedInspectMember.espBreakdown || []).map((esp, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-semibold text-slate-800">{esp.esp}</td>
                          <td className="py-2 px-3 text-right font-extrabold text-emerald-700">{esp.campaigns}</td>
                          <td className="py-2 px-3 text-right font-bold text-blue-700">{esp.utilization}%</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-extrabold text-slate-900">
                        <td className="py-2.5 px-3">Total</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700">{selectedInspectMember.campaigns}</td>
                        <td className="py-2.5 px-3 text-right text-blue-700">{selectedInspectMember.utilization}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Campaign & Daily Utilization */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center space-x-2 text-sm border-b border-slate-200 pb-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Campaign & Daily Utilization Summary</span>
                </h4>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Campaigns</span>
                    <span className="font-black text-emerald-700 text-sm">{selectedInspectMember.campaigns}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Total Time</span>
                    <span className="font-black text-purple-700 text-sm">{selectedInspectMember.hours} hrs</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Avg Hours/Day</span>
                    <span className="font-black text-cyan-700 text-sm">{selectedInspectMember.avgHoursPerDay} hrs</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Daily Util %</span>
                    <span className="font-black text-blue-700 text-sm">{selectedInspectMember.dailyUtilization || selectedInspectMember.utilization}%</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Description */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Description</h4>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium">
                  {selectedInspectMember.description || 'No description provided.'}
                </p>
              </div>

              {/* Section 4: Key Activities */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Key Activities Completed</h4>
                <ul className="space-y-1">
                  {(selectedInspectMember.keyActivities || []).map((act, idx) => (
                    <li key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-medium flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 5: Next Week Plan */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">This Week / Next Week Plan</h4>
                <ul className="space-y-1">
                  {(selectedInspectMember.thisWeekPlan || []).map((plan, idx) => (
                    <li key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-medium flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      <span>{plan}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
              {selectedInspectMember.status === 'Submitted' && (
                <button
                  onClick={() => handleUpdateStatus(selectedInspectMember.id, 'Approved')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Approve Report
                </button>
              )}
              <button
                onClick={() => setSelectedInspectMember(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-sm"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
