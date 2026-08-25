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
  // Only render Role Selector Bar for Managers and Team Leads (Sravani Pinninti)
  const isManagerOrLead = currentRole === 'manager' || currentRole === 'sravani';
  if (!isManagerOrLead) {
    return null;
  }

  const roles: { id: UserRole; name: string; title: string; isManager?: boolean; isLead?: boolean }[] = [
    { id: 'manager', name: 'Operations Manager', title: 'Full Access & Management', isManager: true },
    { id: 'sravani', name: 'Sravani Pinninti', title: 'Associate Team Lead', isLead: true },
    { id: 'sricharan', name: 'SriCharan Khandesh', title: 'Campaign Manager' },
    { id: 'vamsi', name: 'Banoth Vamsi', title: 'Associate Campaign Manager' },
    { id: 'vivek', name: 'Parava Vivekananda Reddy', title: 'Associate Campaign Manager' },
    { id: 'dhanusri', name: 'Pallepati Dhanusri', title: 'Associate Campaign Manager' },
    { id: 'vishnu', name: 'Vishnu R Joshi', title: 'Associate Campaign Manager' },
    { id: 'rahul', name: 'Rahul Kodi', title: 'Associate Campaign Manager' },
  ];

  const currentRoleObj = roles.find((r) => r.id === currentRole) || roles[0];

  return (
    <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center space-x-2 text-slate-700 font-semibold">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>Management Simulator — Account Switcher:</span>
        </div>

        {/* Dropdown Selector */}
        <div className="relative flex items-center w-full sm:w-auto">
          {currentRoleObj.isManager || currentRoleObj.isLead ? (
            <Shield className="w-4 h-4 text-purple-600 absolute left-3 pointer-events-none z-10" />
          ) : (
            <UserCheck className="w-4 h-4 text-cyan-600 absolute left-3 pointer-events-none z-10" />
          )}

          <select
            value={currentRole}
            onChange={(e) => onSelectRole(e.target.value as UserRole)}
            className="w-full sm:w-80 appearance-none bg-white text-slate-900 font-bold pl-9 pr-9 py-2 rounded-xl text-xs border border-slate-300 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm cursor-pointer"
          >
            <option value="manager" className="font-bold text-purple-700">
              🛡️ Operations Manager (Full Access)
            </option>
            <optgroup label="Team Lead Accounts">
              <option value="sravani">🛡️ Sravani Pinninti (Associate Team Lead)</option>
            </optgroup>
            <optgroup label="Team Roster Accounts">
              <option value="sricharan">👤 SriCharan Khandesh (Campaign Manager)</option>
              <option value="vamsi">👤 Banoth Vamsi</option>
              <option value="vivek">👤 Parava Vivekananda Reddy</option>
              <option value="dhanusri">👤 Pallepati Dhanusri</option>
              <option value="vishnu">👤 Vishnu R Joshi</option>
              <option value="rahul">👤 Rahul Kodi</option>
            </optgroup>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
        </div>

      </div>
    </div>
  );
};
