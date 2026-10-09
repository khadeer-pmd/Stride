import React from 'react';
import { SplineHeroScene } from './SplineHeroScene';
import { Sparkles, Heart, ArrowRight, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

interface HeroSectionProps {
  onStartJourney: () => void;
  onSeeHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartJourney, onSeeHowItWorks }) => {
  return (
    <section id="hero" className="w-full bg-[#E8F2F0] dark:bg-[#121816] py-8 lg:py-12 px-4 sm:px-6 lg:px-8 bg-line-pattern transition-colors">
      {/* Large Rounded Main Surface Container (Exact visual reference matching) */}
      <div className="max-w-7xl mx-auto bg-[#FFFFFF] dark:bg-[#1A2220] rounded-[32px] p-6 sm:p-10 lg:p-14 border border-[#E9EEEB] dark:border-[#293431] shadow-soft-lg transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D1E5E1] dark:bg-[#253A35] text-[#202421] dark:text-[#73AFA0] text-xs font-bold tracking-wide uppercase mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#73AFA0]" />
              <span>YOUR ACADEMIC JOURNEY, MADE SIMPLER</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202421] dark:text-[#F0F4F2] leading-[1.15] tracking-tight mb-6">
              Every Student Has Potential.{' '}
              <span className="relative inline-block text-[#73AFA0]">
                Every Step Moves You Forward.
                {/* Subtle hand-drawn underline */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#73AFA0]/40" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9C50 3 150 3 197 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#777F7B] dark:text-[#9DA8A3] leading-relaxed mb-8 max-w-2xl font-normal">
              Learning isn't always a straight path. STRIDE helps you understand your progress, find the support you need, and take your next step with confidence. Because every small improvement matters.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={onStartJourney}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#202421] hover:bg-[#38403B] text-white dark:bg-[#73AFA0] dark:text-[#202421] dark:hover:bg-[#5d9889] font-bold text-sm transition-all shadow-soft flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onSeeHowItWorks}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FFFFFF] dark:bg-[#25302C] hover:bg-[#E9EEEB] dark:hover:bg-[#2D3934] text-[#202421] dark:text-[#F0F4F2] font-bold text-sm border border-[#E9EEEB] dark:border-[#293431] transition-all shadow-xs flex items-center justify-center cursor-pointer"
              >
                See How It Works
              </button>
            </div>

            {/* Supporting Trust Indicators */}
            <div className="pt-6 border-t border-[#E9EEEB] dark:border-[#293431] w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#D1E5E1] flex items-center justify-center text-[#548E7D] shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#202421] dark:text-[#F0F4F2]">
                  Progress at Your Own Pace
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#F9D4E5] flex items-center justify-center text-[#C45E5E] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#202421] dark:text-[#F0F4F2]">
                  Support Without Judgment
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FFE7A5] flex items-center justify-center text-[#8C6D1F] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#202421] dark:text-[#F0F4F2]">
                  Celebrate Every Small Win
                </span>
              </div>
            </div>

          </div>

          {/* Right Column (Interactive 3D Scene + Floating Cards) */}
          <div className="lg:col-span-5 w-full">
            <SplineHeroScene />
          </div>

        </div>
      </div>
    </section>
  );
};
