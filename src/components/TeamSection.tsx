import React from 'react';
import type { TeamMemberData } from '../types';
import { Users } from 'lucide-react';

interface TeamSectionProps {
  teamData: TeamMemberData[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ teamData }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-50 rounded-xl text-cyan-600 border border-cyan-200 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Team Member Workload Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500">
              Individual utilization, campaigns executed & daily working capacity
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-600">
          Total Specialists: <strong className="text-slate-900 font-extrabold">{teamData.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Specialist Name</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4 text-right">Campaigns</th>
              <th className="py-3.5 px-4 text-right">Hours</th>
              <th className="py-3.5 px-4 text-right">Avg. Hrs/Day</th>
              <th className="py-3.5 px-4 text-right">Utilization %</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {teamData.map((tm) => (
              <tr key={tm.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-xs font-bold text-cyan-700">
                    {tm.name.charAt(0)}
                  </span>
                  <span>{tm.name}</span>
                </td>
                <td className="py-3 px-4 text-slate-500 font-medium">{tm.role}</td>
                <td className="py-3 px-4 text-right font-black text-emerald-700">{tm.campaigns}</td>
                <td className="py-3 px-4 text-right font-bold text-purple-700">{tm.hours} hrs</td>
                <td className="py-3 px-4 text-right font-bold text-cyan-700">{tm.avgHoursPerDay} hrs</td>
                <td className="py-3 px-4 text-right font-black text-blue-700">{tm.utilization}%</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    tm.status === 'Submitted' || tm.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {tm.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
