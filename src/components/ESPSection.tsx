import React from 'react';
import type { ESPData } from '../types';
import { Server, TrendingUp, TrendingDown, Clock, CheckCircle2 } from 'lucide-react';

interface ESPSectionProps {
  espData: ESPData[];
}

export const ESPSection: React.FC<ESPSectionProps> = ({ espData }) => {
  const totalCampaigns = espData.reduce((acc, curr) => acc + curr.campaigns, 0);
  const totalHours = Number(espData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1));
  const avgUtil = espData.length > 0
    ? Number((espData.reduce((acc, curr) => acc + curr.utilization, 0) / espData.length).toFixed(1))
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-200 shadow-sm">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>ESP Platform Capacity & Utilization</span>
            </h2>
            <p className="text-xs text-slate-500">
              Ongage, Netcore, Maropost workload metrics
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600">
          <span>Avg. ESP Utilization: <strong className="text-blue-700 font-extrabold">{avgUtil}%</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {espData.map((esp) => {
          const delta = Number((esp.utilization - esp.previousWeekUtilization).toFixed(1));
          return (
            <div key={esp.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm">{esp.name}</span>
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  delta >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {delta >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {delta >= 0 ? `+${delta}%` : `${delta}%`}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-bold">Utilization</span>
                  <span className="font-black text-blue-700">{esp.utilization}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, esp.utilization)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600">
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" /> {esp.campaigns} campaigns
                </span>
                <span className="flex items-center gap-1 font-bold text-purple-700">
                  <Clock className="w-3 h-3" /> {esp.hours} hrs
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Banner */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-2">
        <span className="font-bold">Summary Totals across ESPs:</span>
        <div className="flex items-center space-x-4">
          <span>Campaigns: <strong className="text-emerald-700 font-extrabold">{totalCampaigns}</strong></span>
          <span>Time: <strong className="text-purple-700 font-extrabold">{totalHours} hrs</strong></span>
        </div>
      </div>
    </div>
  );
};
