import React, { useState } from 'react';
import type { WeekData, ESPData, TeamMemberData, KeyActivity, PlanItem } from '../types';
import { X, Plus, Trash2, Save, Layers, Server, Users, CheckCircle2, Calendar } from 'lucide-react';

interface EditWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekData: WeekData;
  onSave: (updatedWeek: WeekData) => void;
}

export const EditWeekModal: React.FC<EditWeekModalProps> = ({
  isOpen,
  onClose,
  weekData,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'esps' | 'team' | 'activities' | 'plan'>('summary');
  const [formData, setFormData] = useState<WeekData>({ ...weekData });

  if (!isOpen) return null;

  // Handlers for Summary
  const handleSummaryChange = (field: keyof typeof weekData.summary, value: number) => {
    setFormData((prev) => ({
      ...prev,
      summary: {
        ...prev.summary,
        [field]: value,
      },
    }));
  };

  // Handlers for ESPs
  const handleEspChange = (index: number, field: keyof ESPData, value: any) => {
    const newEsps = [...formData.espData];
    newEsps[index] = { ...newEsps[index], [field]: value };
    setFormData((prev) => ({ ...prev, espData: newEsps }));
  };

  const handleAddEsp = () => {
    const newEsp: ESPData = {
      id: `esp-${Date.now()}`,
      name: 'New ESP Platform',
      campaigns: 100,
      hours: 10,
      utilization: 50,
      previousWeekUtilization: 45,
    };
    setFormData((prev) => ({ ...prev, espData: [...prev.espData, newEsp] }));
  };

  const handleDeleteEsp = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      espData: prev.espData.filter((_, i) => i !== index),
    }));
  };

  // Handlers for Team
  const handleTeamChange = (index: number, field: keyof TeamMemberData, value: any) => {
    const newTeam = [...formData.teamData];
    newTeam[index] = { ...newTeam[index], [field]: value };
    setFormData((prev) => ({ ...prev, teamData: newTeam }));
  };

  const handleAddTeam = () => {
    const newMember: TeamMemberData = {
      id: `tm-${Date.now()}`,
      name: 'New Team Member',
      role: 'Operations Associate',
      campaigns: 50,
      hours: 30,
      avgHoursPerDay: 6,
      utilization: 75,
      dailyUtilization: 75,
      previousWeekUtilization: 70,
      status: 'Submitted',
      espBreakdown: [],
      description: 'Operations execution and campaign scheduling.',
      keyActivities: ['Campaign scheduling'],
      thisWeekPlan: ['Complete campaign execution'],
    };
    setFormData((prev) => ({ ...prev, teamData: [...prev.teamData, newMember] }));
  };

  const handleDeleteTeam = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      teamData: prev.teamData.filter((_, i) => i !== index),
    }));
  };

  // Handlers for Activities
  const handleActivityChange = (index: number, field: keyof KeyActivity, value: any) => {
    const newActs = [...formData.activities];
    newActs[index] = { ...newActs[index], [field]: value };
    setFormData((prev) => ({ ...prev, activities: newActs }));
  };

  const handleAddActivity = () => {
    const newAct: KeyActivity = {
      id: `act-${Date.now()}`,
      activity: 'New Operational Activity',
      owner: 'Team',
      status: 'In Progress',
      completionPercentage: 50,
    };
    setFormData((prev) => ({ ...prev, activities: [...prev.activities, newAct] }));
  };

  const handleDeleteActivity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
  };

  // Handlers for Plan
  const handlePlanChange = (index: number, field: keyof PlanItem, value: any) => {
    const newPlan = [...formData.planItems];
    newPlan[index] = { ...newPlan[index], [field]: value };
    setFormData((prev) => ({ ...prev, planItems: newPlan }));
  };

  const handleAddPlan = () => {
    const newPlanItem: PlanItem = {
      id: `pi-${Date.now()}`,
      activity: 'New Plan Action Item',
      owner: 'Team',
      priority: 'Medium',
      targetDate: 'Aug 30',
      status: 'Planned',
    };
    setFormData((prev) => ({ ...prev, planItems: [...prev.planItems, newPlanItem] }));
  };

  const handleDeletePlan = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      planItems: prev.planItems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-950 rounded-xl text-cyan-400 border border-cyan-800/60">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Weekly Operational Data</h2>
              <p className="text-xs text-slate-400">Date Range: {formData.dateRange}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/70 border-b border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'summary' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>KPI Summary</span>
          </button>
          <button
            onClick={() => setActiveTab('esps')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'esps' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>ESP Utilization ({formData.espData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'team' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Members ({formData.teamData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'activities' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Activities ({formData.activities.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'plan' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Plan ({formData.planItems.length})</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-6">
          
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date Range</label>
                  <input
                    type="text"
                    value={formData.dateRange}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Previous Week Baseline Range</label>
                  <input
                    type="text"
                    value={formData.previousWeekRange}
                    onChange={(e) => setFormData((prev) => ({ ...prev, previousWeekRange: e.target.value }))}
                    className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Team Utilization %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.summary.teamUtilization}
                    onChange={(e) => handleSummaryChange('teamUtilization', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prev Team Utilization %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.summary.prevTeamUtilization}
                    onChange={(e) => handleSummaryChange('prevTeamUtilization', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Campaigns</label>
                  <input
                    type="number"
                    value={formData.summary.totalCampaigns}
                    onChange={(e) => handleSummaryChange('totalCampaigns', parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prev Total Campaigns</label>
                  <input
                    type="number"
                    value={formData.summary.prevTotalCampaigns}
                    onChange={(e) => handleSummaryChange('prevTotalCampaigns', parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Hours Spent</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.summary.totalHours}
                    onChange={(e) => handleSummaryChange('totalHours', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prev Total Hours</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.summary.prevTotalHours}
                    onChange={(e) => handleSummaryChange('prevTotalHours', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ESPs */}
          {activeTab === 'esps' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">ESP Platforms</h3>
                <button
                  type="button"
                  onClick={handleAddEsp}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add ESP</span>
                </button>
              </div>

              {formData.espData.map((esp, i) => (
                <div key={esp.id} className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">ESP #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteEsp(i)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">ESP Name</label>
                      <input
                        type="text"
                        value={esp.name}
                        onChange={(e) => handleEspChange(i, 'name', e.target.value)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Campaigns</label>
                      <input
                        type="number"
                        value={esp.campaigns}
                        onChange={(e) => handleEspChange(i, 'campaigns', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Hours</label>
                      <input
                        type="number"
                        step="0.1"
                        value={esp.hours}
                        onChange={(e) => handleEspChange(i, 'hours', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Utilization %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={esp.utilization}
                        onChange={(e) => handleEspChange(i, 'utilization', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Prev Utilization %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={esp.previousWeekUtilization}
                        onChange={(e) => handleEspChange(i, 'previousWeekUtilization', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: TEAM */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Team Members</h3>
                <button
                  type="button"
                  onClick={handleAddTeam}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              {formData.teamData.map((tm, i) => (
                <div key={tm.id} className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">Team Member #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTeam(i)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Member Name</label>
                      <input
                        type="text"
                        value={tm.name}
                        onChange={(e) => handleTeamChange(i, 'name', e.target.value)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Role Title</label>
                      <input
                        type="text"
                        value={tm.role || ''}
                        onChange={(e) => handleTeamChange(i, 'role', e.target.value)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Campaigns</label>
                      <input
                        type="number"
                        value={tm.campaigns}
                        onChange={(e) => handleTeamChange(i, 'campaigns', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Total Hours</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tm.hours}
                        onChange={(e) => handleTeamChange(i, 'hours', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Avg Hrs/Day</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tm.avgHoursPerDay}
                        onChange={(e) => handleTeamChange(i, 'avgHoursPerDay', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Utilization %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tm.utilization}
                        onChange={(e) => handleTeamChange(i, 'utilization', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Prev Utilization %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tm.previousWeekUtilization}
                        onChange={(e) => handleTeamChange(i, 'previousWeekUtilization', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ACTIVITIES */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Key Activities</h3>
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
              </div>

              {formData.activities.map((act, i) => (
                <div key={act.id} className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Activity #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteActivity(i)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1">Activity Description</label>
                      <input
                        type="text"
                        value={act.activity}
                        onChange={(e) => handleActivityChange(i, 'activity', e.target.value)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Owner</label>
                      <input
                        type="text"
                        value={act.owner}
                        onChange={(e) => handleActivityChange(i, 'owner', e.target.value)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Completion %</label>
                      <input
                        type="number"
                        value={act.completionPercentage}
                        onChange={(e) => handleActivityChange(i, 'completionPercentage', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: PLAN */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Plan for the Week</h3>
                <button
                  type="button"
                  onClick={handleAddPlan}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Action Item</span>
                </button>
              </div>

              {formData.planItems.map((plan, i) => (
                <div key={plan.id} className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400">Action Item #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeletePlan(i)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1">Action Description</label>
                      <input
                        type="text"
                        value={plan.activity}
                        onChange={(e) => handlePlanChange(i, 'activity', e.target.value)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Owner</label>
                      <input
                        type="text"
                        value={plan.owner}
                        onChange={(e) => handlePlanChange(i, 'owner', e.target.value)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Priority</label>
                      <select
                        value={plan.priority}
                        onChange={(e) => handlePlanChange(i, 'priority', e.target.value as any)}
                        className="w-full bg-slate-900 text-white px-2 py-1.5 rounded border border-slate-700"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Target Date</label>
                      <input
                        type="text"
                        value={plan.targetDate}
                        onChange={(e) => handlePlanChange(i, 'targetDate', e.target.value)}
                        className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
