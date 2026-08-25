import React from 'react';
import type { PlanItem } from '../types';
import { ListTodo } from 'lucide-react';

interface ActionPlanSectionProps {
  planItems: PlanItem[];
  onToggleStatus: (id: string) => void;
}

export const ActionPlanSection: React.FC<ActionPlanSectionProps> = ({
  planItems,
  onToggleStatus,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
      <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-200">
        <div className="p-2.5 bg-cyan-50 rounded-xl text-cyan-600 border border-cyan-200 shadow-sm">
          <ListTodo className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Next Week Operational Action Plan
          </h2>
          <p className="text-xs text-slate-500">
            Forward-looking operational tasks and target deadlines
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {planItems.map((item) => (
          <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between text-xs">
            <div className="space-y-1">
              <div className="font-extrabold text-slate-900">{item.activity}</div>
              <div className="text-slate-500 font-medium flex items-center space-x-2">
                <span>Owner: <strong>{item.owner}</strong></span>
                <span>•</span>
                <span>Target: <strong>{item.targetDate}</strong></span>
              </div>
            </div>
            <button
              onClick={() => onToggleStatus(item.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                item.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : item.status === 'In Progress'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {item.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
