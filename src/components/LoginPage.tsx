import React, { useState } from 'react';
import type { UserRole } from '../types';
import { Shield, UserCheck, BarChart3, Sparkles, Lock, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('sravani');
  const [passcode, setPasscode] = useState<string>('');

  const accounts: { id: UserRole; name: string; title: string; avatar: string; isManager?: boolean }[] = [
    { id: 'manager', name: 'Operations Manager', title: 'Full Access & Team Dashboard', avatar: 'M', isManager: true },
    { id: 'sravani', name: 'Sravani', title: 'Sr. Operations Specialist', avatar: 'S' },
    { id: 'sricharan', name: 'Sricharan', title: 'ESP Infrastructure Lead', avatar: 'S' },
    { id: 'vamsi', name: 'Vamsi', title: 'Campaign Operations Specialist', avatar: 'V' },
    { id: 'vivek', name: 'Vivek', title: 'Deliverability Analyst', avatar: 'V' },
    { id: 'dhanusri', name: 'Dhanusri', title: 'Campaign Operations Manager', avatar: 'D' },
    { id: 'vishnu', name: 'Vishnu', title: 'QA & Testing Analyst', avatar: 'V' },
    { id: 'rahul', name: 'Rahul', title: 'Junior Operations Associate', avatar: 'R' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      
      <div className="max-w-4xl w-full space-y-6">
        
        {/* Logo & Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl shadow-lg text-white mb-2">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            TEAM OPERATIONS PLATFORM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
            Weekly Resource Utilization, Daily Operations Logging & Manager Reporting
          </p>
          <div className="inline-flex items-center space-x-1 px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-full text-xs font-bold text-cyan-700 mt-2">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-600" />
            <span>Select your user account to sign in</span>
          </div>
        </div>

        {/* Account Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {accounts.map((acc) => {
            const isSelected = selectedRole === acc.id;
            return (
              <div
                key={acc.id}
                onClick={() => setSelectedRole(acc.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? acc.isManager
                      ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500 shadow-md'
                      : 'bg-cyan-50 border-cyan-400 ring-2 ring-cyan-500 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                    acc.isManager
                      ? 'bg-purple-100 text-purple-700 border-purple-300'
                      : 'bg-cyan-100 text-cyan-700 border-cyan-300'
                  }`}>
                    {acc.avatar}
                  </div>
                  {acc.isManager ? (
                    <Shield className="w-4 h-4 text-purple-600" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-cyan-600" />
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{acc.name}</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">{acc.title}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? (acc.isManager ? 'text-purple-700' : 'text-cyan-700') : 'text-slate-400'}>
                    {isSelected ? 'Selected' : 'Click to Select'}
                  </span>
                  {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Login Action Card */}
        <form onSubmit={handleFormSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 max-w-md mx-auto">
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700 block">
              Signing in as: <span className="text-cyan-700 font-black">{accounts.find((a) => a.id === selectedRole)?.name}</span>
            </label>
            <p className="text-[11px] text-slate-400 font-medium">Enter passcode (optional) or click Sign In to enter dashboard.</p>
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode (Optional)..."
              className="w-full bg-slate-50 text-slate-900 font-bold text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
