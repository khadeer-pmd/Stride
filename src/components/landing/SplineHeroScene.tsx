import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Sparkles, Heart, BookOpen, Smile, ShieldCheck } from 'lucide-react';

export const SplineHeroScene: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-[440px] lg:h-[500px] flex items-center justify-center">
      {/* 3D Scene container */}
      {!hasError ? (
        <div className="w-full h-full relative z-10 transition-opacity duration-700">
          <Spline
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            onLoad={() => setLoaded(true)}
            onError={() => setHasError(true)}
          />
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#D1E5E1]/40 backdrop-blur-xs rounded-3xl">
              <div className="w-12 h-12 rounded-full border-4 border-[#73AFA0] border-t-transparent animate-spin mb-3" />
              <p className="text-xs font-semibold text-[#202421]">Loading interactive 3D companion...</p>
            </div>
          )}
        </div>
      ) : (
        /* Graceful CSS 3D Fallback Illustration */
        <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#D1E5E1] via-[#F9D4E5]/40 to-[#FFE7A5]/50 flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-inner">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#FFE7A5]/60 blur-2xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#DCCEEB]/60 blur-2xl animate-pulse" />
          
          <div className="w-24 h-24 rounded-3xl bg-white shadow-soft flex items-center justify-center mb-4 transform hover:rotate-6 transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#73AFA0] to-[#75A994] flex items-center justify-center text-white">
              <Smile className="w-10 h-10 animate-bounce" />
            </div>
          </div>
          <h4 className="text-lg font-bold text-[#202421]">STRIDE Companion</h4>
          <p className="text-xs text-[#777F7B] text-center max-w-xs mt-1">
            Interactive, friendly academic guide supporting your learning journey.
          </p>
        </div>
      )}

      {/* Floating Card 1 - Mint (Top Right) */}
      <div className="absolute top-4 -right-2 md:right-2 z-20 animate-float-1">
        <div className="bg-[#D1E5E1] border border-[#75A994]/30 rounded-2xl p-3.5 shadow-soft max-w-[200px] backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#548E7D]">
              <Heart className="w-4 h-4 fill-current text-[#75A994]" />
            </div>
            <span className="text-xs font-bold text-[#202421]">You're doing great!</span>
          </div>
          <p className="text-[11px] text-[#202421]/80 leading-tight">
            Keep taking one step at a time.
          </p>
        </div>
      </div>

      {/* Floating Card 2 - Pink (Left Middle) */}
      <div className="absolute bottom-16 -left-2 md:-left-4 z-20 animate-float-2">
        <div className="bg-[#F9D4E5] border border-[#D97979]/20 rounded-2xl p-3.5 shadow-soft max-w-[210px] backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#C45E5E]">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#202421]">Your next step</span>
          </div>
          <p className="text-[11px] text-[#202421]/80 leading-tight">
            Focus on one topic today.
          </p>
        </div>
      </div>

      {/* Floating Card 3 - Yellow (Bottom Right) */}
      <div className="absolute -bottom-2 right-6 z-20 animate-float-3 hidden sm:block">
        <div className="bg-[#FFE7A5] border border-[#E9B95F]/30 rounded-2xl p-3.5 shadow-soft max-w-[200px] backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#8C6D1F]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#202421]">Little wins matter</span>
          </div>
          <p className="text-[11px] text-[#202421]/80 leading-tight">
            Celebrate your progress.
          </p>
        </div>
      </div>
    </div>
  );
};
