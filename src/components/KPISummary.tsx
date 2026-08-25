import React from 'react';
import type { MetricSummary } from '../types';
import { TrendingUp, TrendingDown, Users, Zap, Clock, CheckCircle2, Award } from 'lucide-react';

interface KPISummaryProps {
  summary: MetricSummary;
  dateRange: string;
  previousWeekRange: string;
}

export const KPISummary: React.FC<KPISummaryProps> = ({
  summary,
  dateRange,
  previousWeekRange,
}) => {
  // Helper to calculate WoW change %
  const calcChange = (curr: number, prev: number) => {
    if (!prev || prev === 0) return 0;
    return Number((((curr - prev) / prev) * 100).toFixed(1));
  };

  const utilChange = Number((summary.teamUtilization - summary.prevTeamUtilization).toFixed(1));
  const campaignChangePercent = calcChange(summary.totalCampaigns, summary.prevTotalCampaigns);
  const hoursChangePercent = calcChange(summary.totalHours, summary.prevTotalHours);
  const activityChangePercent = calcChange(summary.completedActivitiesCount, summary.prevCompletedActivitiesCount);

  return (
    <div className="mb-8">
      {/* Top Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Executive Performance Summary</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {dateRange}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Comparing against baseline ({previousWeekRange})
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Team Utilization */}
        <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700/70 shadow-lg hover:border-cyan-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Team Utilization
            </span>
            <div className="p-2 bg-cyan-950/80 rounded-xl text-cyan-400 border border-cyan-800/50 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {summary.teamUtilization}%
            </span>
            <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              utilChange >= 0
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                : 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
            }`}>
              {utilChange >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              <span>{utilChange >= 0 ? `↑ ${utilChange}%` : `↓ ${Math.abs(utilChange)}%`}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Prev week: <span className="font-semibold text-slate-300">{summary.prevTeamUtilization}%</span>
          </p>
        </div>

        {/* Card 2: Total Campaigns */}
        <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700/70 shadow-lg hover:border-blue-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Campaigns
            </span>
            <div className="p-2 bg-blue-950/80 rounded-xl text-blue-400 border border-blue-800/50 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {summary.totalCampaigns.toLocaleString()}
            </span>
            <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              campaignChangePercent >= 0
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                : 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
            }`}>
              {campaignChangePercent >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              <span>{campaignChangePercent >= 0 ? `↑ ${campaignChangePercent}%` : `↓ ${Math.abs(campaignChangePercent)}%`}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Prev week: <span className="font-semibold text-slate-300">{summary.prevTotalCampaigns.toLocaleString()}</span>
          </p>
        </div>

        {/* Card 3: Total Hours */}
        <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700/70 shadow-lg hover:border-amber-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Hours
            </span>
            <div className="p-2 bg-amber-950/80 rounded-xl text-amber-400 border border-amber-800/50 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {summary.totalHours} <span className="text-sm font-normal text-slate-400">hrs</span>
            </span>
            <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              hoursChangePercent <= 0
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
            }`}>
              {hoursChangePercent >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              <span>{hoursChangePercent >= 0 ? `↑ ${hoursChangePercent}%` : `↓ ${Math.abs(hoursChangePercent)}%`}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Prev week: <span className="font-semibold text-slate-300">{summary.prevTotalHours} hrs</span>
          </p>
        </div>

        {/* Card 4: Total Team Members */}
        <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700/70 shadow-lg hover:border-purple-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Team Members
            </span>
            <div className="p-2 bg-purple-950/80 rounded-xl text-purple-400 border border-purple-800/50 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {summary.totalTeamMembers}
            </span>
            <span className="text-xs font-semibold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800/50">
              Active Staff
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Avg capacity: <span className="font-semibold text-slate-300">40.0 hrs/wk</span>
          </p>
        </div>

        {/* Card 5: Completed Activities */}
        <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700/70 shadow-lg hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Activities Done
            </span>
            <div className="p-2 bg-emerald-950/80 rounded-xl text-emerald-400 border border-emerald-800/50 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {summary.completedActivitiesCount}
            </span>
            <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              activityChangePercent >= 0
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                : 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
            }`}>
              {activityChangePercent >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              <span>{activityChangePercent >= 0 ? `↑ ${activityChangePercent}%` : `↓ ${Math.abs(activityChangePercent)}%`}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Prev week: <span className="font-semibold text-slate-300">{summary.prevCompletedActivitiesCount} activities</span>
          </p>
        </div>

      </div>
    </div>
  );
};
