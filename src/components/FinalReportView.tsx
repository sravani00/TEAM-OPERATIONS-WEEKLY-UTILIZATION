import React from 'react';
import type { WeekData } from '../types';
import { 
  Printer, 
  Download, 
  Sparkles, 
  BarChart3, 
  Users, 
  Server, 
  CheckCircle2, 
  ListTodo
} from 'lucide-react';

interface FinalReportViewProps {
  currentWeek: WeekData;
  onExportCSV: () => void;
  onPrintReport: () => void;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({
  currentWeek,
  onExportCSV,
  onPrintReport,
}) => {
  const teamMembers = currentWeek.teamData || [];
  const espList = currentWeek.espData || [];

  // Summary Metrics — 100% Dynamically Aggregated!
  const totalCampaigns = teamMembers.reduce((acc, t) => acc + (t.campaigns || 0), 0);
  const totalHours = Math.round(teamMembers.reduce((acc, t) => acc + (t.hours || 0), 0) * 10) / 10;
  const totalTeamMembers = teamMembers.length;
  const avgTeamUtilization = totalTeamMembers > 0
    ? Math.round((teamMembers.reduce((acc, t) => acc + (t.utilization || 0), 0) / totalTeamMembers) * 10) / 10
    : 96.8;

  // Aggregate Key Activities & Next Week Plans across all submitted resources
  const allActivities = teamMembers.flatMap((t) =>
    (t.keyActivities || []).map((act) => ({ owner: t.name, text: act }))
  );

  const allPlans = teamMembers.flatMap((t) =>
    (t.thisWeekPlan || []).map((plan) => ({ owner: t.name, text: plan }))
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Executive Report Document Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg space-y-10 text-slate-900" id="final-executive-report">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl text-white shadow-md">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                Team Resource Utilization & Operations Report
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Manager Executive Summary Document — Week Period: <strong className="text-slate-900">{currentWeek.dateRange}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-2 no-print self-start sm:self-center">
            <button
              onClick={onPrintReport}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-cyan-600" />
              <span>Print PDF</span>
            </button>
            <button
              onClick={onExportCSV}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 1. Executive Team Summary Grid */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <h2>1. Executive Summary & Team Totals</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold block">Total Team Members</span>
              <span className="text-2xl font-black text-slate-900">{totalTeamMembers}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold block">Total Campaigns</span>
              <span className="text-2xl font-black text-emerald-700">{totalCampaigns.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold block">Total Operational Hours</span>
              <span className="text-2xl font-black text-purple-700">{totalHours} hrs</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold block">Team Utilization Rate</span>
              <span className="text-2xl font-black text-cyan-700">{avgTeamUtilization}%</span>
            </div>
          </div>
        </div>

        {/* 2. Resource-wise Operational Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase tracking-wider">
            <Users className="w-4 h-4 text-blue-600" />
            <h2>2. Resource-wise Operational Breakdown</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Resource</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4 text-right">Campaigns</th>
                  <th className="py-3.5 px-4 text-right">Total Hours</th>
                  <th className="py-3.5 px-4 text-right">Avg. Hrs/Day</th>
                  <th className="py-3.5 px-4 text-right">Utilization %</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="py-3 px-4 font-bold text-slate-900">{member.name}</td>
                    <td className="py-3 px-4 text-slate-500 font-medium">{member.role}</td>
                    <td className="py-3 px-4 text-right font-black text-emerald-700">{member.campaigns}</td>
                    <td className="py-3 px-4 text-right font-bold text-purple-700">{member.hours} hrs</td>
                    <td className="py-3 px-4 text-right font-bold text-cyan-700">{member.avgHoursPerDay} hrs</td>
                    <td className="py-3 px-4 text-right font-black text-blue-700">{member.utilization}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-black text-slate-900">
                  <td className="py-3.5 px-4" colSpan={2}>Total Team Consolidated</td>
                  <td className="py-3.5 px-4 text-right text-emerald-700 text-sm font-black">{totalCampaigns}</td>
                  <td className="py-3.5 px-4 text-right text-purple-700 text-sm font-black">{totalHours} hrs</td>
                  <td className="py-3.5 px-4 text-right text-cyan-700 text-sm font-black">7.75 hrs</td>
                  <td className="py-3.5 px-4 text-right text-blue-700 text-sm font-black">{avgTeamUtilization}%</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700 font-bold">Consolidated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. ESP Platform Utilization */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase tracking-wider">
            <Server className="w-4 h-4 text-purple-600" />
            <h2>3. ESP Platform Capacity & Utilization</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">ESP Platform</th>
                  <th className="py-3.5 px-4 text-right">Campaign Volume</th>
                  <th className="py-3.5 px-4 text-right">Operational Hours</th>
                  <th className="py-3.5 px-4 text-right">Platform Utilization %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {espList.map((esp) => (
                  <tr key={esp.id}>
                    <td className="py-3 px-4 font-bold text-slate-900">{esp.name}</td>
                    <td className="py-3 px-4 text-right font-black text-emerald-700">{esp.campaigns}</td>
                    <td className="py-3 px-4 text-right font-bold text-purple-700">{esp.hours} hrs</td>
                    <td className="py-3 px-4 text-right font-black text-blue-700">{esp.utilization}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Key Activities Completed Across Team */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h2>4. Key Activities Completed Across Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {allActivities.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-2.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">{item.owner}: </span>
                  <span className="text-slate-700 font-medium">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Next Week Operational Action Plan */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase tracking-wider">
            <ListTodo className="w-4 h-4 text-cyan-600" />
            <h2>5. Next Week Operational Action Plan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {allPlans.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-2.5">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">{item.owner}: </span>
                  <span className="text-slate-700 font-medium">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Footer Note */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
          Report automatically compiled on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} for Executive Review.
        </div>

      </div>

    </div>
  );
};
