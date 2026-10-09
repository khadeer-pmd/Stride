import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types/academic';
import { GraduationCap, UserCheck, ShieldCheck, X, ArrowRight, Sparkles, UserPlus, LogIn } from 'lucide-react';

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const { login, registerUser } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  
  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('alex.rivera@stride.edu');
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (authMode === 'login') {
      if (role === 'student') {
        setEmail('alex.rivera@stride.edu');
      } else if (role === 'faculty') {
        setEmail('s.jenkins@stride.edu');
      } else {
        setEmail('r.vance@stride.edu');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      registerUser(fullName || 'New User', email, password, selectedRole);
    } else {
      login(selectedRole);
    }
    onClose();
    onSuccessLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-8 shadow-2xl border border-[#E9EEEB] relative transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D1E5E1] text-[#202421] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#73AFA0]" />
            {authMode === 'login' ? 'SECURE PORTAL LOGIN' : 'CREATE YOUR STRIDE ACCOUNT'}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 max-w-xs mx-auto mb-4 bg-neutral-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Log In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-[#73AFA0] text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register
            </button>
          </div>

          <h2 className="text-2xl font-extrabold text-[#202421]">
            {authMode === 'login' ? 'How would you like to log in?' : 'Register a New Account'}
          </h2>
          <p className="text-xs text-[#777F7B] mt-1">
            {authMode === 'login'
              ? 'Select your account role to access your personalized workspace.'
              : 'Enter your credentials to create your user account and log in immediately.'}
          </p>
        </div>

        {/* Role Options */}
        <div className="grid grid-cols-3 gap-3 mb-5">
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
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? `${item.color} border-[#202421] shadow-soft font-bold scale-[1.02]`
                    : 'bg-gray-50 border-gray-200 hover:border-[#73AFA0]'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center ${item.textColor} shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#202421] capitalize">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <div>
              <label className="text-xs font-bold text-[#777F7B] block mb-1">
                Full Name / Username
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421] focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#777F7B] block mb-1">
              Email Address / Gmail ({selectedRole.toUpperCase()})
            </label>
            <input
              type="email"
              required
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421] focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#777F7B] block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421] focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#202421] hover:bg-[#343B36] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-soft cursor-pointer mt-3"
          >
            {authMode === 'register' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register & Log In ({selectedRole})</span>
              </>
            ) : (
              <>
                <span>Log in as {selectedRole === 'student' ? 'Student' : selectedRole === 'faculty' ? 'Faculty' : 'Admin'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle text */}
        <div className="mt-4 text-center">
          {authMode === 'login' ? (
            <p className="text-xs text-[#777F7B]">
              New to STRIDE?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="font-bold text-[#73AFA0] hover:underline"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-xs text-[#777F7B]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-[#73AFA0] hover:underline"
              >
                Log in here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
