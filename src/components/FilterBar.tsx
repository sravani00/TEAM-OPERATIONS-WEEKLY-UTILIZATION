import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  availableEsps: string[];
  availableMembers: string[];
  espFilter: string;
  onSelectEsp: (esp: string) => void;
  teamFilter: string;
  onSelectTeam: (member: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  availableEsps,
  availableMembers,
  espFilter,
  onSelectEsp,
  teamFilter,
  onSelectTeam,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
      
      <div className="flex flex-wrap items-center gap-3">
        {/* ESP Filter */}
        <select
          value={espFilter}
          onChange={(e) => onSelectEsp(e.target.value)}
          className="bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer shadow-sm"
        >
          <option value="ALL">Filter: All ESPs</option>
          {availableEsps.map((esp) => (
            <option key={esp} value={esp}>{esp}</option>
          ))}
        </select>

        {/* Team Member Filter */}
        <select
          value={teamFilter}
          onChange={(e) => onSelectTeam(e.target.value)}
          className="bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer shadow-sm"
        >
          <option value="ALL">Filter: All Specialists</option>
          {availableMembers.map((tm) => (
            <option key={tm} value={tm}>{tm}</option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <div className="relative flex items-center w-full md:w-64">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search activities or team..."
          className="w-full bg-slate-50 text-slate-900 text-xs font-medium pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-sm"
        />
      </div>

    </div>
  );
};
