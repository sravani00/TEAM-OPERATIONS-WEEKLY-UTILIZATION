import React, { useState } from 'react';
import type { WeekData, TeamMemberData, ESPBreakdownItem, DailyLogEntry, UserRole } from '../types';
import { 
  Send, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Calendar,
  Sparkles,
  Server,
  FileText,
  ListTodo,
  CalendarDays
} from 'lucide-react';

interface ResourceWeeklyReportFormProps {
  currentWeek: WeekData;
  resourceName: string;
  currentRole?: UserRole;
  onSaveReport: (updatedWeek: WeekData) => void;
  onSelectWeek: (weekId: string) => void;
  allWeeks: WeekData[];
}

const defaultDailyTemplate: DailyLogEntry[] = [
  { day: 'Monday', campaigns: 0, hours: 0, notes: '' },
  { day: 'Tuesday', campaigns: 0, hours: 0, notes: '' },
  { day: 'Wednesday', campaigns: 0, hours: 0, notes: '' },
  { day: 'Thursday', campaigns: 0, hours: 0, notes: '' },
  { day: 'Friday', campaigns: 0, hours: 0, notes: '' },
];

export const ResourceWeeklyReportForm: React.FC<ResourceWeeklyReportFormProps> = ({
  currentWeek,
  resourceName,
  currentRole,
  onSaveReport,
  onSelectWeek,
  allWeeks,
}) => {
  const isManagerOrLead = currentRole === 'manager' || currentRole === 'sravani' || currentRole === 'sricharan';

  // Find current resource's data record in current week
  const memberRecord: TeamMemberData = currentWeek.teamData.find(
    (t) => t.name.toLowerCase() === resourceName.toLowerCase()
  ) || {
    id: `tm-${resourceName.toLowerCase()}`,
    name: resourceName,
    role: 'Operations Specialist',
    campaigns: 0,
    hours: 0,
    avgHoursPerDay: 0,
    utilization: 0,
    dailyUtilization: 0,
    previousWeekUtilization: 0,
    status: 'Draft',
    espBreakdown: [
      { id: '1', esp: 'Ongage', campaigns: 0, utilization: 0 },
      { id: '2', esp: 'Netcore', campaigns: 0, utilization: 0 },
      { id: '3', esp: 'Maropost', campaigns: 0, utilization: 0 },
    ],
    dailyLogs: defaultDailyTemplate,
    description: '',
    keyActivities: [],
    thisWeekPlan: [],
  };

  // Form State
  const [espBreakdown, setEspBreakdown] = useState<ESPBreakdownItem[]>(memberRecord.espBreakdown || []);
  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>(
    memberRecord.dailyLogs && memberRecord.dailyLogs.length > 0 ? memberRecord.dailyLogs : defaultDailyTemplate
  );
  const [description, setDescription] = useState<string>(memberRecord.description || '');
  const [keyActivities, setKeyActivities] = useState<string[]>(memberRecord.keyActivities || []);
  const [thisWeekPlan, setThisWeekPlan] = useState<string[]>(memberRecord.thisWeekPlan || []);
  const [newActivityInput, setNewActivityInput] = useState<string>('');
  const [newPlanInput, setNewPlanInput] = useState<string>('');

  const isLocked = memberRecord.status === 'Submitted' || memberRecord.status === 'Approved';

  // Derived & Auto-Calculated Metrics
  const espTotalCampaigns = espBreakdown.reduce((acc, curr) => acc + (Number(curr.campaigns) || 0), 0);
  const dailyTotalCampaigns = dailyLogs.reduce((acc, curr) => acc + (Number(curr.campaigns) || 0), 0);
  const totalCampaigns = espTotalCampaigns > 0 ? espTotalCampaigns : dailyTotalCampaigns;

  const totalTime = dailyLogs.reduce((acc, curr) => acc + (Number(curr.hours) || 0), 0);
  const avgHoursPerDay = Math.round((totalTime / 4) * 100) / 100;
  const dailyUtilization = Math.min(100, Math.round((totalTime / 32) * 1000) / 10);
  const overallUtilization = espBreakdown.length > 0
    ? Math.round((espBreakdown.reduce((acc, curr) => acc + (Number(curr.utilization) || 0), 0) / espBreakdown.length) * 10) / 10
    : dailyUtilization;

  // Daily Logs Handler
  const handleDailyLogChange = (day: string, field: 'campaigns' | 'hours' | 'notes', val: string | number) => {
    setDailyLogs((prev) =>
      prev.map((entry) => (entry.day === day ? { ...entry, [field]: val } : entry))
    );
  };

  // ESP Table Handlers
  const handleESPChange = (id: string, field: 'esp' | 'campaigns', val: string | number) => {
    setEspBreakdown((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleAddESP = () => {
    setEspBreakdown((prev) => [
      ...prev,
      { id: `esp-${Date.now()}`, esp: 'New ESP', campaigns: 0, utilization: 0 },
    ]);
  };

  const handleRemoveESP = (id: string) => {
    setEspBreakdown((prev) => prev.filter((item) => item.id !== id));
  };

  // Key Activities Handlers
  const handleAddActivity = () => {
    if (newActivityInput.trim()) {
      setKeyActivities((prev) => [...prev, newActivityInput.trim()]);
      setNewActivityInput('');
    }
  };

  const handleRemoveActivity = (idx: number) => {
    setKeyActivities((prev) => prev.filter((_, i) => i !== idx));
  };

  // Plan Handlers
  const handleAddPlanItem = () => {
    if (newPlanInput.trim()) {
      setThisWeekPlan((prev) => [...prev, newPlanInput.trim()]);
      setNewPlanInput('');
    }
  };

  const handleRemovePlanItem = (idx: number) => {
    setThisWeekPlan((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save / Submit Handlers
  const handleSave = (targetStatus: 'Draft' | 'Submitted') => {
    const updatedMember: TeamMemberData = {
      ...memberRecord,
      campaigns: totalCampaigns,
      hours: totalTime,
      avgHoursPerDay,
      utilization: overallUtilization,
      dailyUtilization,
      status: targetStatus,
      espBreakdown,
      dailyLogs,
      description,
      keyActivities,
      thisWeekPlan,
      lastSubmittedAt: targetStatus === 'Submitted' ? new Date().toISOString() : memberRecord.lastSubmittedAt,
    };

    const updatedTeamData = currentWeek.teamData.some((t) => t.name.toLowerCase() === resourceName.toLowerCase())
      ? currentWeek.teamData.map((t) => (t.name.toLowerCase() === resourceName.toLowerCase() ? updatedMember : t))
      : [...currentWeek.teamData, updatedMember];

    const updatedWeek: WeekData = {
      ...currentWeek,
      teamData: updatedTeamData,
    };

    onSaveReport(updatedWeek);
  };

  return (
    <div className="space-y-6">

      {/* Greeting Header & Status Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome, {resourceName} 👋
            </h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
              memberRecord.status === 'Submitted'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : memberRecord.status === 'Approved'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {memberRecord.status === 'Submitted' && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
              {memberRecord.status === 'Draft' && <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />}
              {memberRecord.status === 'Approved' && <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />}
              Status: {memberRecord.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Log your daily metrics (Mon–Fri). Weekly totals and utilization rates calculate automatically in real time.
          </p>
        </div>

        {/* Week Selector */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Calendar className="w-4 h-4 text-cyan-600 absolute left-3 top-3 pointer-events-none z-10" />
            <select
              value={currentWeek.id}
              onChange={(e) => onSelectWeek(e.target.value)}
              className="appearance-none bg-slate-50 text-slate-900 pl-9 pr-8 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:border-cyan-500 focus:outline-none cursor-pointer shadow-sm"
            >
              {allWeeks.map((w) => (
                <option key={w.id} value={w.id}>
                  Week: {w.dateRange}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLocked && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your weekly report for <strong>{currentWeek.dateRange}</strong> is submitted and locked for manager review. Contact your manager if you need to edit.
            </span>
          </div>
        </div>
      )}

      {/* Main Report Form Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8">
        
        {/* Section 1: Daily Operations Logging Grid (Mon - Fri) */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm border-b border-slate-200 pb-2">
            <CalendarDays className="w-4 h-4 text-purple-600" />
            <h3>Daily Operations Logging (Monday – Friday)</h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4 text-right">Campaigns Completed</th>
                  <th className="py-3 px-4 text-right">Hours Worked</th>
                  <th className="py-3 px-4 text-right">Daily Util % (Auto)</th>
                  <th className="py-3 px-4">Notes / Focus Area</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {dailyLogs.map((log) => {
                  const dayUtil = log.hours > 0 ? Math.min(100, Math.round((log.hours / 8) * 100)) : 0;
                  return (
                    <tr key={log.day} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{log.day}</td>
                      
                      {/* Daily Campaigns */}
                      <td className="py-2.5 px-4 text-right">
                        {isLocked ? (
                          <span className="font-bold text-emerald-700">{log.campaigns}</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            value={log.campaigns}
                            onChange={(e) => handleDailyLogChange(log.day, 'campaigns', parseFloat(e.target.value) || 0)}
                            className="bg-slate-50 text-emerald-700 font-extrabold px-3 py-1.5 rounded-lg border border-slate-300 w-24 text-right focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-sm"
                          />
                        )}
                      </td>

                      {/* Daily Hours */}
                      <td className="py-2.5 px-4 text-right">
                        {isLocked ? (
                          <span className="font-bold text-purple-700">{log.hours} hrs</span>
                        ) : (
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={log.hours}
                            onChange={(e) => handleDailyLogChange(log.day, 'hours', parseFloat(e.target.value) || 0)}
                            className="bg-slate-50 text-purple-700 font-extrabold px-3 py-1.5 rounded-lg border border-slate-300 w-24 text-right focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-sm"
                          />
                        )}
                      </td>

                      {/* Daily Util % */}
                      <td className="py-2.5 px-4 text-right">
                        <span className={`font-extrabold px-2.5 py-1 rounded-lg border text-xs ${
                          dayUtil >= 90
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : dayUtil > 0
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {dayUtil}%
                        </span>
                      </td>

                      {/* Notes */}
                      <td className="py-2.5 px-4">
                        {isLocked ? (
                          <span className="text-slate-600 font-medium">{log.notes || '-'}</span>
                        ) : (
                          <input
                            type="text"
                            value={log.notes || ''}
                            onChange={(e) => handleDailyLogChange(log.day, 'notes', e.target.value)}
                            placeholder="Optional day notes..."
                            className="w-full bg-slate-50 text-slate-800 font-medium px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs shadow-sm"
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* Total Row */}
                <tr className="bg-slate-100 font-black text-slate-900">
                  <td className="py-3 px-4">Weekly Total (Mon–Fri)</td>
                  <td className="py-3 px-4 text-right text-emerald-700 font-black text-sm">{dailyTotalCampaigns}</td>
                  <td className="py-3 px-4 text-right text-purple-700 font-black text-sm">{totalTime} hrs</td>
                  <td className="py-3 px-4 text-right text-blue-700 font-black text-sm">{dailyUtilization}%</td>
                  <td className="py-3 px-4 text-slate-500 font-bold">Auto-Aggregated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: ESP-wise Campaign Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
              <Server className="w-4 h-4 text-cyan-600" />
              <h3>ESP-wise Campaign Utilization</h3>
            </div>
            {/* Show Add ESP button ONLY for Managers and Team Leads */}
            {!isLocked && isManagerOrLead && (
              <button
                type="button"
                onClick={handleAddESP}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-cyan-700 rounded-lg text-xs font-bold border border-slate-200 flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add ESP</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ESP Platform</th>
                  <th className="py-3 px-4 text-right">Campaigns Completed</th>
                  <th className="py-3 px-4 text-right">Utilization % (Auto)</th>
                  {/* Show Action Column ONLY for Managers and Team Leads */}
                  {!isLocked && isManagerOrLead && <th className="py-3 px-4 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {espBreakdown.map((item) => {
                  const calculatedUtil = item.utilization || Math.min(100, Math.round((dailyUtilization * (0.96 + (item.campaigns % 5) * 0.01)) * 10) / 10);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        {isLocked || !isManagerOrLead ? (
                          <span className="font-bold text-slate-900">{item.esp}</span>
                        ) : (
                          <input
                            type="text"
                            value={item.esp}
                            onChange={(e) => handleESPChange(item.id, 'esp', e.target.value)}
                            className="bg-slate-50 text-slate-900 font-bold px-3 py-1.5 rounded-lg border border-slate-300 w-36 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {isLocked ? (
                          <span className="font-bold text-emerald-700">{item.campaigns}</span>
                        ) : (
                          <input
                            type="number"
                            value={item.campaigns}
                            onChange={(e) => handleESPChange(item.id, 'campaigns', parseFloat(e.target.value) || 0)}
                            className="bg-slate-50 text-emerald-700 font-extrabold px-3 py-1.5 rounded-lg border border-slate-300 w-24 text-right focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-sm"
                          />
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          {calculatedUtil}%
                        </span>
                      </td>
                      {/* Show Delete Action Trashcan ONLY for Managers and Team Leads */}
                      {!isLocked && isManagerOrLead && (
                        <td className="py-2.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveESP(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}

                {/* Total Row */}
                <tr className="bg-slate-100 font-black text-slate-900">
                  <td className="py-3 px-4">Total</td>
                  <td className="py-3 px-4 text-right text-emerald-700 font-black text-sm">{totalCampaigns}</td>
                  <td className="py-3 px-4 text-right text-blue-700 font-black text-sm">{overallUtilization}%</td>
                  {!isLocked && isManagerOrLead && <td className="py-3 px-4" />}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Metric Summary Cards */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm border-b border-slate-200 pb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h3>Aggregated Operational Metrics</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[11px] text-slate-500 block font-bold">Campaigns Completed</label>
              <div className="text-2xl font-black text-emerald-700">{totalCampaigns}</div>
              <p className="text-[10px] text-slate-400 font-medium">Auto-aggregated</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[11px] text-slate-500 block font-bold">Total Time (Hours)</label>
              <div className="text-2xl font-black text-purple-700">{totalTime} hrs</div>
              <p className="text-[10px] text-slate-400 font-medium">Auto-summed from Daily Log</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[11px] text-slate-500 block font-bold">Avg. Hours / Day</label>
              <div className="text-2xl font-black text-cyan-700">{avgHoursPerDay} hrs</div>
              <p className="text-[10px] text-slate-400 font-medium">Auto-calculated (4-day week)</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[11px] text-slate-500 block font-bold">Daily Utilization %</label>
              <div className="text-2xl font-black text-blue-700">{dailyUtilization}%</div>
              <p className="text-[10px] text-slate-400 font-medium">Auto-calculated from Total Time</p>
            </div>
          </div>
        </div>

        {/* Section 4: Description */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm border-b border-slate-200 pb-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h3>Weekly Description & Operational Scope</h3>
          </div>
          {isLocked ? (
            <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-xs leading-relaxed font-medium">
              {description || 'No description provided.'}
            </p>
          ) : (
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Campaign scheduling, QA, ESP rotation and monitoring."
              className="w-full bg-slate-50 text-slate-900 text-xs font-medium p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none shadow-sm"
            />
          )}
        </div>

        {/* Section 5: Key Activities Completed */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm border-b border-slate-200 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3>Key Activities Completed</h3>
          </div>

          <ul className="space-y-2">
            {keyActivities.map((act, idx) => (
              <li key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                <span className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>{act}</span>
                </span>
                {!isLocked && (
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {!isLocked && (
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={newActivityInput}
                onChange={(e) => setNewActivityInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
                placeholder="Add completed activity..."
                className="flex-1 bg-slate-50 text-slate-900 text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
              />
              <button
                type="button"
                onClick={handleAddActivity}
                className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-xl border border-emerald-200 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 6: This Week Plan */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm border-b border-slate-200 pb-2">
            <ListTodo className="w-4 h-4 text-cyan-600" />
            <h3>This Week / Next Week Plan</h3>
          </div>

          <ul className="space-y-2">
            {thisWeekPlan.map((plan, idx) => (
              <li key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                <span className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                  <span>{plan}</span>
                </span>
                {!isLocked && (
                  <button
                    type="button"
                    onClick={() => handleRemovePlanItem(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {!isLocked && (
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={newPlanInput}
                onChange={(e) => setNewPlanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlanItem()}
                placeholder="Add planned activity..."
                className="flex-1 bg-slate-50 text-slate-900 text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-sm"
              />
              <button
                type="button"
                onClick={handleAddPlanItem}
                className="px-3.5 py-2 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 text-xs font-bold rounded-xl border border-cyan-200 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isLocked && (
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4 text-amber-600" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave('Submitted')}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Report</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
