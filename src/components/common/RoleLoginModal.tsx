import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types/academic';
import { GraduationCap, UserCheck, ShieldCheck, X, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('alex.rivera@stride.edu');
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('alex.rivera@stride.edu');
    } else if (role === 'faculty') {
      setEmail('s.jenkins@stride.edu');
    } else {
      setEmail('r.vance@stride.edu');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    onClose();
    onSuccessLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#1A2220] rounded-[32px] max-w-lg w-full p-8 shadow-2xl border border-[#E9EEEB] dark:border-[#293431] relative transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#25302C] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D1E5E1] dark:bg-[#253A35] text-[#202421] dark:text-[#73AFA0] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#73AFA0]" />
            SECURE PORTAL LOGIN
          </div>
          <h2 className="text-2xl font-extrabold text-[#202421] dark:text-[#F0F4F2]">
            How would you like to log in?
          </h2>
          <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3] mt-1">
            Select your account role to access your personalized workspace.
          </p>
        </div>

        {/* Role Options */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { role: 'student' as UserRole, label: 'Student', icon: GraduationCap, color: 'bg-[#D1E5E1]', textColor: 'text-[#3B6E63]' },
            { role: 'faculty' as UserRole, label: 'Faculty', icon: UserCheck, color: 'bg-[#F9D4E5]', textColor: 'text-[#A84B68]' },
            { role: 'admin' as UserRole, label: 'Admin', icon: ShieldCheck, color: 'bg-[#FFE7A5]', textColor: 'text-[#8C6D1F]' }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedRole === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => handleRoleSelect(item.role)}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? `${item.color} border-[#202421] dark:border-white shadow-soft font-bold scale-[1.02]`
                    : 'bg-gray-50 dark:bg-[#25302C] border-gray-200 dark:border-gray-700 hover:border-[#73AFA0]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${item.textColor} shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#202421] dark:text-[#F0F4F2] capitalize">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Auth Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#777F7B] dark:text-[#9DA8A3] block mb-1">
              Email Address ({selectedRole.toUpperCase()})
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs text-[#202421] dark:text-[#F0F4F2]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#777F7B] dark:text-[#9DA8A3] block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs text-[#202421] dark:text-[#F0F4F2]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#202421] hover:bg-[#343B36] text-white dark:bg-[#73AFA0] dark:text-[#202421] dark:hover:bg-[#5d9889] font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-soft cursor-pointer mt-2"
          >
            <span>Log in as {selectedRole === 'student' ? 'Student' : selectedRole === 'faculty' ? 'Faculty' : 'Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
