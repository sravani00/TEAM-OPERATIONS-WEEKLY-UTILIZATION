import React from 'react';
import type { KeyActivity } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface ActivitiesSectionProps {
  activities: KeyActivity[];
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
      <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-200">
        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Key Activities Completed Across Team
          </h2>
          <p className="text-xs text-slate-500">
            Summary log of operational tasks completed this week
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activities.map((act) => (
          <div key={act.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-extrabold text-slate-900">{act.activity}</div>
              <div className="text-slate-500 font-medium flex items-center space-x-2">
                <span>Owner: <strong>{act.owner}</strong></span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">{act.status} ({act.completionPercentage}%)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
