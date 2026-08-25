import React, { useState } from 'react';
import type { WeekData } from '../types';
import { PlusCircle, X, Calendar, Sparkles } from 'lucide-react';

interface AddWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: WeekData;
  onAddWeek: (newWeek: WeekData) => void;
}

export const AddWeekModal: React.FC<AddWeekModalProps> = ({
  isOpen,
  onClose,
  currentWeek,
  onAddWeek,
}) => {
  const [dateRange, setDateRange] = useState('Aug 24 – Aug 28, 2026');
  const [previousWeekRange, setPreviousWeekRange] = useState(currentWeek.dateRange);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newWeek: WeekData = {
      id: `week-${Date.now()}`,
      dateRange,
      previousWeekRange,
      summary: {
        teamUtilization: 85.0,
        prevTeamUtilization: currentWeek.summary.teamUtilization,
        totalCampaigns: 1280,
        prevTotalCampaigns: currentWeek.summary.totalCampaigns,
        totalHours: 120.0,
        prevTotalHours: currentWeek.summary.totalHours,
        totalTeamMembers: currentWeek.summary.totalTeamMembers,
        prevTotalTeamMembers: currentWeek.summary.totalTeamMembers,
        completedActivitiesCount: 16,
        prevCompletedActivitiesCount: currentWeek.summary.completedActivitiesCount,
      },
      espData: currentWeek.espData.map((esp) => ({
        ...esp,
        id: `esp-${Date.now()}-${esp.name}`,
        previousWeekUtilization: esp.utilization,
      })),
      teamData: currentWeek.teamData.map((tm) => ({
        ...tm,
        id: `tm-${Date.now()}-${tm.name}`,
        previousWeekUtilization: tm.utilization,
      })),
      activities: [
        {
          id: `act-${Date.now()}-1`,
          activity: 'Weekly ESP campaign execution',
          owner: 'Team',
          status: 'In Progress',
          completionPercentage: 50,
        },
        {
          id: `act-${Date.now()}-2`,
          activity: 'Domain reputation checks & DNS monitoring',
          owner: 'Sravani',
          status: 'In Progress',
          completionPercentage: 70,
        },
      ],
      planItems: [
        {
          id: `pi-${Date.now()}-1`,
          activity: 'Quarterly deliverability review',
          owner: 'Dhanusri',
          priority: 'High',
          targetDate: 'Sep 02',
          status: 'Planned',
        },
      ],
    };

    onAddWeek(newWeek);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950 rounded-xl text-emerald-400 border border-emerald-800/60">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Operational Week Log</h2>
              <p className="text-xs text-slate-400">Initialize a new weekly tracking period</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Week Date Range</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="e.g. Aug 24 – Aug 28, 2026"
                className="w-full bg-slate-800 text-white text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Previous Week Reference Range</label>
            <input
              type="text"
              required
              value={previousWeekRange}
              onChange={(e) => setPreviousWeekRange(e.target.value)}
              className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Cloning Feature</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              The new week will inherit team roster and ESP platform structures, setting current week’s utilization metrics as baseline previous values.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Week Log</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
