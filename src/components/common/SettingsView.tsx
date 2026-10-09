import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, User, Lock, Save, ShieldCheck, Sun } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, updateUserProfile } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department || 'Computer Science & Engineering');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(name, email, department);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E9EEEB] shadow-soft">
        <span className="px-3 py-1 rounded-full bg-[#D1E5E1] text-[#3B6E63] text-xs font-bold uppercase tracking-wider">
          SYSTEM PREFERENCES
        </span>
        <h2 className="text-2xl font-extrabold text-[#202421] mt-2 mb-1">
          Account & System Settings
        </h2>
        <p className="text-xs text-[#777F7B]">
          Manage your personal profile information and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile & Theme Info */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Profile Form */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4">
            <h3 className="text-base font-bold text-[#202421] flex items-center gap-2">
              <User className="w-4 h-4 text-[#73AFA0]" />
              <span>Profile Information</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#73AFA0] hover:bg-[#5d9889] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Theme Display Card */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-3">
            <h3 className="text-base font-bold text-[#202421] flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#73AFA0]" />
              <span>Theme Identity</span>
            </h3>

            <div className="bg-[#E8F2F0] p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#202421]">
                  STRIDE Light Visual System
                </h4>
                <p className="text-[11px] text-[#777F7B]">
                  Optimized pastel mint palette (<span className="font-mono text-xs font-bold">#E8F2F0 / #73AFA0</span>) for maximum readability and accessibility.
                </p>
              </div>
              <span className="px-3 py-1 bg-[#73AFA0] text-white text-xs font-bold rounded-full">Active</span>
            </div>
          </div>

        </div>

        {/* Security Settings */}
        <div className="lg:col-span-5 bg-[#FFFFFF] p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4 h-fit">
          <h3 className="text-base font-bold text-[#202421] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#73AFA0]" />
            <span>Password & Security</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#777F7B] block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#777F7B] block mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#777F7B] block mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="w-full py-2.5 bg-[#202421] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Update Security Credentials</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

