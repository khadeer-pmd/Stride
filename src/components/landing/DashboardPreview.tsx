import React from 'react';
import { Sparkles, TrendingUp, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface DashboardPreviewProps {
  onExplore: () => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ onExplore }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] rounded-[36px] p-6 sm:p-10 border border-[#E9EEEB] dark:border-[#293431] shadow-soft-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#FFE7A5] text-[#8C6D1F] text-xs font-bold uppercase tracking-wider">
              A Dashboard That Feels Human
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-2">
              Designed for Clarity, Built to Support
            </h2>
          </div>
          <button
            onClick={onExplore}
            className="px-6 py-2.5 rounded-full bg-[#73AFA0] hover:bg-[#5d9889] text-white font-bold text-xs flex items-center gap-2 self-start md:self-auto transition-all shadow-xs"
          >
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dashboard Mockup Grid matching pastel reference */}
        <div className="bg-[#E8F2F0] dark:bg-[#121816] p-4 sm:p-6 rounded-3xl border border-[#D1E5E1] dark:border-[#25302C] grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Top Banner */}
          <div className="lg:col-span-12 bg-white dark:bg-[#1A2220] p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-[#E9EEEB] dark:border-[#293431]">
            <div>
              <h3 className="text-lg font-extrabold text-[#202421] dark:text-[#F0F4F2]">
                Welcome back, Alex!
              </h3>
              <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
                Every small step brings you closer to your goals.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#D1E5E1] text-[#3B6E63] text-xs font-bold rounded-full">
                Term Average: 71%
              </span>
              <span className="px-3 py-1 bg-[#FFE7A5] text-[#8C6D1F] text-xs font-bold rounded-full">
                Attendance: 84%
              </span>
            </div>
          </div>

          {/* Left Cards */}
          <div className="lg:col-span-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#D1E5E1] p-5 rounded-2xl">
                <span className="text-xs font-bold text-[#3B6E63]">Positive Momentum</span>
                <h4 className="text-xl font-bold text-[#202421] mt-1 mb-2">Data Structures</h4>
                <p className="text-xs text-[#202421]/80">Score increased from 75% to 78%. Keep practicing binary search trees!</p>
              </div>

              <div className="bg-[#F9D4E5] p-5 rounded-2xl">
                <span className="text-xs font-bold text-[#A84B68]">Subject Needing Practice</span>
                <h4 className="text-xl font-bold text-[#202421] mt-1 mb-2">Mathematics III</h4>
                <p className="text-xs text-[#202421]/80">Revisiting limits & calculus basics each day will build your confidence.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A2220] p-5 rounded-2xl border border-[#E9EEEB] dark:border-[#293431]">
              <h4 className="text-sm font-bold text-[#202421] dark:text-[#F0F4F2] mb-3">Today's Study Plan</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E8F2F0] dark:bg-[#25302C] text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#73AFA0]" />
                    <span className="font-semibold text-[#202421] dark:text-[#F0F4F2]">Practice 5 graph traversal algorithms</span>
                  </div>
                  <span className="text-[#777F7B] dark:text-[#9DA8A3]">30 mins</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-[#202825] text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                    <span className="font-semibold text-[#202421] dark:text-[#F0F4F2]">Revise Mathematics calculus notes</span>
                  </div>
                  <span className="text-[#777F7B] dark:text-[#9DA8A3]">25 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Cards */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-[#FFE7A5] p-5 rounded-2xl">
              <span className="text-xs font-bold text-[#8C6D1F]">Weekly Goal</span>
              <h4 className="text-base font-bold text-[#202421] mt-1 mb-1">Complete 3 Revision Sets</h4>
              <div className="w-full bg-white/60 h-2.5 rounded-full overflow-hidden mt-3">
                <div className="bg-[#E9B95F] h-full w-2/3 rounded-full" />
              </div>
            </div>

            <div className="bg-[#DCCEEB] p-5 rounded-2xl">
              <span className="text-xs font-bold text-[#62477E]">STRIDE Companion</span>
              <p className="text-xs text-[#202421] mt-2 leading-relaxed">
                "You don't need to finish everything at once. Focus on 20 minutes of Calculus practice today!"
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
