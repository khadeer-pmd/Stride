import React from 'react';
import { AlertCircle, ArrowRight, TrendingDown, Sparkles } from 'lucide-react';

interface EarlySupportSectionProps {
  onExploreInsights: () => void;
}

export const EarlySupportSection: React.FC<EarlySupportSectionProps> = ({ onExploreInsights }) => {
  return (
    <section id="for-faculty" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] rounded-[36px] p-8 sm:p-12 border border-[#E9EEEB] dark:border-[#293431] shadow-soft-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Description */}
          <div className="lg:col-span-6 space-y-6">
            <span className="px-3.5 py-1 rounded-full bg-[#F9D4E5] text-[#A84B68] text-xs font-bold uppercase tracking-wider">
              EARLY SUPPORT, NOT LAST-MINUTE SURPRISES
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202421] dark:text-[#F0F4F2] leading-tight">
              Catch Academic Declines Before Exams Arrive.
            </h2>

            <p className="text-sm sm:text-base text-[#777F7B] dark:text-[#9DA8A3] leading-relaxed">
              Traditional systems flag students only after they fail final exams. STRIDE identifies subtle downward trends early, giving students and faculty time to intervene calmly and effectively.
            </p>

            <div className="bg-[#E8F2F0] dark:bg-[#25302C] p-4 rounded-2xl border border-[#D1E5E1] dark:border-[#293431] flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#73AFA0] shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-[#202421] dark:text-[#F0F4F2] leading-relaxed">
                "We noticed your recent scores have changed. Let's find out which topics need more practice."
              </p>
            </div>

            <button
              onClick={onExploreInsights}
              className="px-8 py-3.5 rounded-full bg-[#202421] hover:bg-[#38403B] text-white dark:bg-[#73AFA0] dark:text-[#202421] dark:hover:bg-[#5d9889] font-bold text-xs transition-all shadow-soft flex items-center gap-2"
            >
              <span>Explore Academic Insights</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Interactive Trend Graphic */}
          <div className="lg:col-span-6 bg-[#E8F2F0] dark:bg-[#121816] p-6 rounded-3xl border border-[#D1E5E1] dark:border-[#25302C]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#777F7B] dark:text-[#9DA8A3] uppercase tracking-wider">
                Sample Student Trend Demonstration
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F9D4E5] text-[#D97979] text-[11px] font-bold flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> Silent Struggle Triggered
              </span>
            </div>

            {/* Assessment Timeline Cards */}
            <div className="space-y-3">
              <div className="bg-white dark:bg-[#1A2220] p-4 rounded-2xl flex items-center justify-between border border-[#E9EEEB] dark:border-[#293431]">
                <div>
                  <h4 className="text-xs font-bold text-[#202421] dark:text-[#F0F4F2]">Assessment 1 (Aug 15)</h4>
                  <p className="text-[11px] text-[#777F7B]">Limits & Vectors Quiz</p>
                </div>
                <span className="text-base font-extrabold text-[#75A994] bg-[#D1E5E1] px-3 py-1 rounded-xl">
                  78%
                </span>
              </div>

              <div className="bg-white dark:bg-[#1A2220] p-4 rounded-2xl flex items-center justify-between border border-[#E9EEEB] dark:border-[#293431]">
                <div>
                  <h4 className="text-xs font-bold text-[#202421] dark:text-[#F0F4F2]">Assessment 2 (Sep 02)</h4>
                  <p className="text-[11px] text-[#777F7B]">Integration Midterm</p>
                </div>
                <span className="text-base font-extrabold text-[#E9B95F] bg-[#FFE7A5] px-3 py-1 rounded-xl">
                  69%
                </span>
              </div>

              <div className="bg-[#F9D4E5] p-4 rounded-2xl flex items-center justify-between border border-[#D97979]/30">
                <div>
                  <h4 className="text-xs font-bold text-[#202421]">Assessment 3 (Oct 04)</h4>
                  <p className="text-[11px] text-[#202421]/70">Differential Equations Midterm</p>
                </div>
                <span className="text-base font-extrabold text-[#D97979] bg-white px-3 py-1 rounded-xl shadow-xs">
                  58%
                </span>
              </div>
            </div>

            <p className="text-[11px] text-center text-[#777F7B] dark:text-[#9DA8A3] mt-4 font-medium">
              STRIDE automatically generates tailored practice goals and connects the student with Dr. Sarah Jenkins.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
