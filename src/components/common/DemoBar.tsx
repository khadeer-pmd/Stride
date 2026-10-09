import React from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types/academic';
import { Sparkles, UserCheck, PlayCircle, HelpCircle, Layers } from 'lucide-react';

export const DemoBar: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    loadDemoScenario,
    setShowWalkthrough
  } = useApp();

  return (
    <div className="bg-[#202421] text-white py-2 px-4 shadow-md transition-all text-xs font-medium sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Hackathon Judge Notice */}
        <div className="flex items-center gap-2">
          <span className="bg-[#73AFA0] text-[#202421] px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
            Hackathon Demo Mode
          </span>
          <span className="hidden md:inline text-gray-300">
            STRIDE — "Every step is a progress."
          </span>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-[#2D332F] p-1 rounded-full border border-gray-700">
          <span className="px-2 text-gray-400 text-[11px] hidden sm:inline flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-[#73AFA0]" /> Role:
          </span>
          {(['student', 'faculty', 'admin'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1 rounded-full text-xs transition-all capitalize ${
                activeRole === role
                  ? 'bg-[#73AFA0] text-[#202421] font-bold shadow-xs'
                  : 'text-[#D1E5E1] hover:text-white'
              }`}
            >
              {role === 'student' ? 'Student' : role === 'faculty' ? 'Faculty' : 'Admin'}
            </button>
          ))}
        </div>

        {/* Preset Scenarios for Hackathon Judges */}
        <div className="hidden lg:flex items-center gap-1.5">
          <span className="text-gray-400 text-[11px] flex items-center gap-1">
            <PlayCircle className="w-3 h-3 text-amber-400" /> Scenarios:
          </span>
          <button
            onClick={() => loadDemoScenario('silent_struggle')}
            className="px-2.5 py-1 rounded-md bg-[#2D332F] hover:bg-[#38403B] text-gray-200 hover:text-white text-[11px] transition-colors border border-gray-700"
            title="Demonstrate downward assessment trend detection"
          >
            📉 Silent Struggle
          </button>
          <button
            onClick={() => loadDemoScenario('high_risk')}
            className="px-2.5 py-1 rounded-md bg-[#2D332F] hover:bg-[#38403B] text-gray-200 hover:text-white text-[11px] transition-colors border border-gray-700"
            title="Demonstrate high priority intervention trigger"
          >
            ⚠️ High Risk
          </button>
          <button
            onClick={() => loadDemoScenario('recovery')}
            className="px-2.5 py-1 rounded-md bg-[#2D332F] hover:bg-[#38403B] text-gray-200 hover:text-white text-[11px] transition-colors border border-gray-700"
            title="Demonstrate post-intervention progress tracking"
          >
            📈 Support Recovery
          </button>
          <button
            onClick={() => loadDemoScenario('reset')}
            className="px-2 py-1 rounded-md bg-[#3D2F33] hover:bg-[#4E3A3F] text-rose-200 text-[11px] transition-colors border border-rose-900/50"
            title="Reset to default seed dataset"
          >
            🔄 Reset
          </button>
        </div>

        {/* Walkthrough Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWalkthrough(true)}
            className="flex items-center gap-1 px-3 py-1 bg-[#D1E5E1] hover:bg-[#b8d8d3] text-[#202421] font-semibold rounded-full transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#548E7D]" />
            <span className="hidden sm:inline">Judge Walkthrough</span>
          </button>
        </div>
      </div>
    </div>
  );
};

