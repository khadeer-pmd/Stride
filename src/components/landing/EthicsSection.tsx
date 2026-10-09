import React from 'react';
import { ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';

export const EthicsSection: React.FC = () => {
  const principles = [
    'Student academic records are strictly protected with role-based permissions.',
    'Academic warnings are fully explained using transparent, data-backed evidence.',
    'Recommendations can be reviewed and adjusted by authorized faculty mentors.',
    'Missing assessment data is never automatically treated as academic failure.',
    'Academic risk scores are indicators for support, never definitive judgments.',
    'Students are always treated respectfully without public ranking or stigma.'
  ];

  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#E8F2F0] dark:bg-[#121816] rounded-[36px] p-8 sm:p-12 border border-[#D1E5E1] dark:border-[#25302C]">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D1E5E1] dark:bg-[#253A35] text-[#202421] dark:text-[#73AFA0] text-xs font-bold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5 text-[#73AFA0]" />
            RESPONSIBLE & PRIVATE SUPPORT
          </div>
          <h2 className="text-3xl font-extrabold text-[#202421] dark:text-[#F0F4F2]">
            Built on Trust, Privacy, and Ethical AI
          </h2>
          <p className="text-sm text-[#777F7B] dark:text-[#9DA8A3] mt-2">
            STRIDE is designed to empower students and faculty while upholding the highest standards of data security and dignity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {principles.map((text, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1A2220] p-4 rounded-2xl border border-[#E9EEEB] dark:border-[#293431] flex items-start gap-3 shadow-xs"
            >
              <CheckCircle2 className="w-5 h-5 text-[#75A994] shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-[#202421] dark:text-[#F0F4F2] leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
