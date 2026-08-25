import React from 'react';
import type { UserRole } from '../types';
import { UserCheck, Shield, ChevronDown } from 'lucide-react';

interface RoleSelectorBarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectorBar: React.FC<RoleSelectorBarProps> = ({
  currentRole,
  onSelectRole,
}) => {
  const roles: { id: UserRole; name: string; title: string; isManager?: boolean }[] = [
    { id: 'manager', name: 'Manager / Operations Lead', title: 'Manager (Full Access)', isManager: true },
    { id: 'sravani', name: 'Sravani', title: 'Sr. Operations Specialist' },
    { id: 'sricharan', name: 'Sricharan', title: 'ESP Infrastructure Lead' },
    { id: 'vamsi', name: 'Vamsi', title: 'Campaign Operations Specialist' },
    { id: 'vivek', name: 'Vivek', title: 'Deliverability Analyst' },
    { id: 'dhanusri', name: 'Dhanusri', title: 'Campaign Operations Manager' },
    { id: 'vishnu', name: 'Vishnu', title: 'QA & Testing Analyst' },
    { id: 'rahul', name: 'Rahul', title: 'Junior Operations Associate' },
  ];

  const currentRoleObj = roles.find((r) => r.id === currentRole) || roles[0];

  return (
    <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center space-x-2 text-slate-700 font-semibold">
          <UserCheck className="w-4 h-4 text-cyan-600" />
          <span>Select Active User Account / Role:</span>
        </div>

        {/* Clean Dropdown Selector */}
        <div className="relative flex items-center w-full sm:w-auto">
          {currentRoleObj.isManager ? (
            <Shield className="w-4 h-4 text-purple-600 absolute left-3 pointer-events-none z-10" />
          ) : (
            <UserCheck className="w-4 h-4 text-cyan-600 absolute left-3 pointer-events-none z-10" />
          )}

          <select
            value={currentRole}
            onChange={(e) => onSelectRole(e.target.value as UserRole)}
            className="w-full sm:w-72 appearance-none bg-white text-slate-900 font-bold pl-9 pr-9 py-2 rounded-xl text-xs border border-slate-300 hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm cursor-pointer"
          >
            <option value="manager" className="font-bold text-purple-700">
              🛡️ Manager / Operations Lead
            </option>
            <optgroup label="Team Member Accounts">
              <option value="sravani">👤 Sravani (Sr. Ops Specialist)</option>
              <option value="sricharan">👤 Sricharan (ESP Lead)</option>
              <option value="vamsi">👤 Vamsi (Ops Specialist)</option>
              <option value="vivek">👤 Vivek (Deliverability Analyst)</option>
              <option value="dhanusri">👤 Dhanusri (Campaign Manager)</option>
              <option value="vishnu">👤 Vishnu (QA Analyst)</option>
              <option value="rahul">👤 Rahul (Junior Associate)</option>
            </optgroup>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
        </div>

      </div>
    </div>
  );
};
