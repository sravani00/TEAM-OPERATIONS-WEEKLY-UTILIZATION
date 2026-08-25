import React, { useState } from 'react';
import type { UserRole } from '../types';
import { Shield, UserCheck, BarChart3, Sparkles, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const USER_PASSWORDS: Record<UserRole, string> = {
  manager: 'manager123',
  sravani: 'sravani123',
  sricharan: 'sricharan123',
  vamsi: 'vamsi123',
  vivek: 'vivek123',
  dhanusri: 'dhanusri123',
  vishnu: 'vishnu123',
  rahul: 'rahul123',
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('sravani');
  const [passcode, setPasscode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const accounts: { id: UserRole; name: string; title: string; avatar: string; isManager?: boolean; isLead?: boolean }[] = [
    { id: 'manager', name: 'Operations Manager', title: 'Full Access & Management', avatar: 'M', isManager: true },
    { id: 'sricharan', name: 'Sricharan', title: 'ESP Infrastructure Lead', avatar: 'S', isLead: true },
    { id: 'dhanusri', name: 'Dhanusri', title: 'Campaign Operations Manager', avatar: 'D', isLead: true },
    { id: 'sravani', name: 'Sravani', title: 'Sr. Operations Specialist', avatar: 'S' },
    { id: 'vamsi', name: 'Vamsi', title: 'Campaign Operations Specialist', avatar: 'V' },
    { id: 'vivek', name: 'Vivek', title: 'Deliverability Analyst', avatar: 'V' },
    { id: 'vishnu', name: 'Vishnu', title: 'QA & Testing Analyst', avatar: 'V' },
    { id: 'rahul', name: 'Rahul', title: 'Junior Operations Associate', avatar: 'R' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const expectedPassword = USER_PASSWORDS[selectedRole];
    if (!passcode || passcode.trim() !== expectedPassword) {
      setErrorMsg(`Invalid password for ${accounts.find((a) => a.id === selectedRole)?.name}. Please check passcode.`);
      return;
    }

    onLogin(selectedRole);
  };

  const selectedAccount = accounts.find((a) => a.id === selectedRole) || accounts[0];

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
            <span>Select your account and enter your password to sign in</span>
          </div>
        </div>

        {/* Account Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {accounts.map((acc) => {
            const isSelected = selectedRole === acc.id;
            return (
              <div
                key={acc.id}
                onClick={() => {
                  setSelectedRole(acc.id);
                  setErrorMsg('');
                  setPasscode('');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? acc.isManager || acc.isLead
                      ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500 shadow-md'
                      : 'bg-cyan-50 border-cyan-400 ring-2 ring-cyan-500 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                    acc.isManager || acc.isLead
                      ? 'bg-purple-100 text-purple-700 border-purple-300'
                      : 'bg-cyan-100 text-cyan-700 border-cyan-300'
                  }`}>
                    {acc.avatar}
                  </div>
                  {acc.isManager || acc.isLead ? (
                    <Shield className="w-4 h-4 text-purple-600" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-cyan-600" />
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                    <span>{acc.name}</span>
                    {acc.isLead && <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">Lead</span>}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">{acc.title}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? (acc.isManager || acc.isLead ? 'text-purple-700' : 'text-cyan-700') : 'text-slate-400'}>
                    {isSelected ? 'Selected' : 'Click to Select'}
                  </span>
                  {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Login Form Container */}
        <form onSubmit={handleFormSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 max-w-md mx-auto">
          
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700 block">
              Signing in as: <span className="text-cyan-700 font-black">{selectedAccount.name}</span>
            </label>
            <p className="text-[11px] text-slate-500 font-medium">Enter account password to sign in.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={`Enter password for ${selectedAccount.name}...`}
                className="w-full bg-slate-50 text-slate-900 font-bold text-xs pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Hint Toggle */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 font-medium flex items-center justify-between">
              <span>Default Password Hint: <strong className="text-slate-900 font-bold">{selectedRole}123</strong></span>
              <button
                type="button"
                onClick={() => setPasscode(`${selectedRole}123`)}
                className="text-cyan-700 hover:text-cyan-800 font-bold underline ml-2"
              >
                Auto-fill
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
