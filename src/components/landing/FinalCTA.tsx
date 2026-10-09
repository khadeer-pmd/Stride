import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onStartJourney: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartJourney, onNavigateToSection }) => {
  return (
    <footer className="w-full bg-[#FFFFFF] dark:bg-[#1A2220] border-t border-[#E9EEEB] dark:border-[#293431] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Box */}
        <div className="bg-gradient-to-br from-[#D1E5E1] via-[#F9D4E5]/40 to-[#FFE7A5]/50 rounded-[36px] p-8 sm:p-14 text-center border border-[#75A994]/20 shadow-soft-lg mb-16 relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-white text-[#202421] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#73AFA0]" />
              TAKE THE FIRST STEP TODAY
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202421] tracking-tight mb-4">
              Your Next Step Starts Here.
            </h2>

            <p className="text-sm sm:text-base text-[#202421]/80 leading-relaxed mb-8">
              You don't need to have everything figured out. Start where you are, and let STRIDE help you move forward.
            </p>

            <button
              onClick={onStartJourney}
              className="px-9 py-4 rounded-full bg-[#202421] hover:bg-[#38403B] text-white font-bold text-sm transition-all shadow-soft inline-flex items-center gap-3 cursor-pointer group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer Navigation Links & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#E9EEEB] dark:border-[#293431]">
          
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#73AFA0] flex items-center justify-center text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 17l6-6 4 4 6-8" />
                  <path d="M14 7h6v6" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-[#202421] dark:text-[#F0F4F2]">
                STRIDE
              </span>
            </div>
            <p className="text-xs font-semibold text-[#73AFA0]">
              Every step is a progress.
            </p>
            <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3] max-w-sm leading-relaxed">
              Student-centered academic performance monitoring, early warning system, and personalized learning guidance.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <h4 className="font-bold text-[#202421] dark:text-[#F0F4F2] mb-3 uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-2 text-[#777F7B] dark:text-[#9DA8A3]">
                <li><button onClick={() => onNavigateToSection?.('how-it-works')} className="hover:text-[#73AFA0]">How It Works</button></li>
                <li><button onClick={() => onNavigateToSection?.('for-students')} className="hover:text-[#73AFA0]">Student Support</button></li>
                <li><button onClick={() => onNavigateToSection?.('for-faculty')} className="hover:text-[#73AFA0]">For Faculty</button></li>
                <li><button onClick={() => onNavigateToSection?.('about')} className="hover:text-[#73AFA0]">About STRIDE</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#202421] dark:text-[#F0F4F2] mb-3 uppercase tracking-wider">
                Innovation
              </h4>
              <ul className="space-y-2 text-[#777F7B] dark:text-[#9DA8A3]">
                <li><span className="hover:text-[#73AFA0]">Silent Struggle Detector</span></li>
                <li><span className="hover:text-[#73AFA0]">What-If Scenario Lab</span></li>
                <li><span className="hover:text-[#73AFA0]">Ask STRIDE Companion</span></li>
                <li><span className="hover:text-[#73AFA0]">Transparent Risk Model</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#202421] dark:text-[#F0F4F2] mb-3 uppercase tracking-wider">
                Governance
              </h4>
              <ul className="space-y-2 text-[#777F7B] dark:text-[#9DA8A3]">
                <li><span className="hover:text-[#73AFA0]">Privacy Principles</span></li>
                <li><span className="hover:text-[#73AFA0]">FERPA Compliance</span></li>
                <li><span className="hover:text-[#73AFA0]">Ethical AI Charter</span></li>
                <li><span className="hover:text-[#73AFA0]">Contact Support</span></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#777F7B] dark:text-[#9DA8A3] gap-3">
          <p>© 2026 STRIDE Academic Support System. Track 03 — EdTech Hackathon.</p>
          <div className="flex items-center gap-4">
            <span>See the progress.</span>
            <span>Understand the challenge.</span>
            <span>Find the next step.</span>
            <span className="font-bold text-[#73AFA0]">Move forward with confidence.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
