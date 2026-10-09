import React from 'react';
import { Database, Eye, Lightbulb, HeartHandshake, TrendingUp, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'RECORD',
      desc: 'Collect academic information such as assessment marks, attendance, and assignment completion.',
      bgColor: 'bg-[#D1E5E1]',
      textColor: 'text-[#3B6E63]',
      icon: Database
    },
    {
      num: '02',
      title: 'NOTICE',
      desc: 'Identify changes in academic performance and subjects that may need attention.',
      bgColor: 'bg-[#F9D4E5]',
      textColor: 'text-[#A84B68]',
      icon: Eye
    },
    {
      num: '03',
      title: 'UNDERSTAND',
      desc: 'Explain the observable academic factors behind each warning transparently.',
      bgColor: 'bg-[#FFE7A5]',
      textColor: 'text-[#8C6D1F]',
      icon: Lightbulb
    },
    {
      num: '04',
      title: 'SUPPORT',
      desc: 'Recommend useful learning activities and connect students with faculty mentors.',
      bgColor: 'bg-[#DCCEEB]',
      textColor: 'text-[#62477E]',
      icon: HeartHandshake
    },
    {
      num: '05',
      title: 'IMPROVE',
      desc: 'Track progress and review whether the chosen support is followed by measurable improvement.',
      bgColor: 'bg-[#73AFA0]',
      textColor: 'text-white',
      icon: TrendingUp
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="px-3.5 py-1 rounded-full bg-[#D1E5E1] text-[#202421] text-xs font-bold uppercase tracking-wider">
          How STRIDE Works
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-3 mb-4">
          Small Steps. Meaningful Progress.
        </h2>
        <p className="text-base sm:text-lg text-[#777F7B] dark:text-[#9DA8A3]">
          STRIDE helps you understand where you are today and decide what to do next.
        </p>
      </div>

      {/* Steps Horizontal Timeline on Desktop / Vertical on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white dark:bg-[#1A2220] border border-[#E9EEEB] dark:border-[#293431] rounded-3xl p-6 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${step.bgColor} ${step.textColor}`}>
                    Step {step.num}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl ${step.bgColor} flex items-center justify-center ${step.textColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-[#202421] dark:text-[#F0F4F2] mb-2 tracking-wide">
                  {step.title}
                </h3>
                <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1A2220] p-1 rounded-full border border-gray-200 dark:border-gray-700 text-[#73AFA0]">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
