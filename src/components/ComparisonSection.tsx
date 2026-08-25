import React from 'react';
import type { MetricSummary, WeekData } from '../types';
import { TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ComparisonSectionProps {
  summary: MetricSummary;
  dateRange?: string;
  previousWeekRange: string;
  allWeeks: WeekData[];
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  summary,
  previousWeekRange,
  allWeeks,
}) => {
  // Calculate deltas
  const utilDelta = Number((summary.teamUtilization - summary.prevTeamUtilization).toFixed(1));
  
  const campaignChange = summary.prevTotalCampaigns > 0
    ? Number((((summary.totalCampaigns - summary.prevTotalCampaigns) / summary.prevTotalCampaigns) * 100).toFixed(1))
    : 0;

  const hoursChange = summary.prevTotalHours > 0
    ? Number((((summary.totalHours - summary.prevTotalHours) / summary.prevTotalHours) * 100).toFixed(1))
    : 0;

  // Format historical trend data sorted chronologically
  const historicalData = [...allWeeks]
    .reverse()
    .map((w) => ({
      weekRange: w.dateRange.split(',')[0],
      utilization: w.summary.teamUtilization,
      campaigns: w.summary.totalCampaigns,
      hours: w.summary.totalHours,
    }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-50 rounded-xl text-cyan-600 border border-cyan-200 shadow-sm">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>📊 Previous Week Comparison & Performance Trends</span>
            </h2>
            <p className="text-xs text-slate-500">
              Core week-over-week growth metrics, delta breakdown & multi-week performance trajectory
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-cyan-700 rounded-full border border-slate-200 self-start sm:self-center">
          Baseline Range: {previousWeekRange}
        </span>
      </div>

      {/* Metric Highlight Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        
        {/* Highlight 1: Utilization */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Team Utilization
          </span>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 mr-1">This Week:</span>
              <span className="text-xl font-black text-slate-900">{summary.teamUtilization}%</span>
            </div>
            <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              utilDelta >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {utilDelta >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {utilDelta >= 0 ? `↑ +${utilDelta}%` : `↓ -${Math.abs(utilDelta)}%`}
            </span>
          </div>
        </div>

        {/* Highlight 2: Campaigns */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Campaign Volume
          </span>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 mr-1">This Week:</span>
              <span className="text-xl font-black text-emerald-700">{summary.totalCampaigns.toLocaleString()}</span>
            </div>
            <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              campaignChange >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {campaignChange >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {campaignChange >= 0 ? `↑ +${campaignChange}%` : `↓ -${Math.abs(campaignChange)}%`}
            </span>
          </div>
        </div>

        {/* Highlight 3: Hours */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Operational Time
          </span>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 mr-1">This Week:</span>
              <span className="text-xl font-black text-purple-700">{summary.totalHours} hrs</span>
            </div>
            <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              hoursChange >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {hoursChange >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {hoursChange >= 0 ? `↑ +${hoursChange}%` : `↓ -${Math.abs(hoursChange)}%`}
            </span>
          </div>
        </div>

      </div>

      {/* Multi-Week Trend Line Chart */}
      {historicalData.length > 1 && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Multi-Week Operational Trajectory
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="weekRange" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#0284c7" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" stroke="#059669" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="utilization" name="Utilization (%)" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="campaigns" name="Campaigns" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};
