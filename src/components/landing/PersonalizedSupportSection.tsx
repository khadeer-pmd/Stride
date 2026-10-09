import React from 'react';
import { BookOpen, Calendar, Users, ArrowRight } from 'lucide-react';

export const PersonalizedSupportSection: React.FC = () => {
  const options = [
    {
      title: 'Learn',
      subtitle: 'Targeted Revision Resources',
      desc: 'Get subject-specific micro-lessons, formula summaries, and step-by-step practice problems tailored to your exact weak spots.',
      bgColor: 'bg-[#D1E5E1]',
      textColor: 'text-[#3B6E63]',
      icon: BookOpen
    },
    {
      title: 'Plan',
      subtitle: 'Manageable Study Schedules',
      desc: 'Create realistic 20-to-30 minute study sessions that fit around your class calendar without feeling overwhelming.',
      bgColor: 'bg-[#FFE7A5]',
      textColor: 'text-[#8C6D1F]',
      icon: Calendar
    },
    {
      title: 'Connect',
      subtitle: 'Faculty & Peer Mentoring',
      desc: 'Request friendly 1-on-1 check-ins with assigned faculty mentors or join remedial peer study groups with a single tap.',
      bgColor: 'bg-[#F9D4E5]',
      textColor: 'text-[#A84B68]',
      icon: Users
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="px-3.5 py-1 rounded-full bg-[#D1E5E1] text-[#202421] text-xs font-bold uppercase tracking-wider">
          PERSONALIZED SUPPORT
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-3 mb-4">
          Three Ways STRIDE Helps You Move Forward
        </h2>
        <p className="text-base sm:text-lg text-[#777F7B] dark:text-[#9DA8A3]">
          Every student learns differently. Choose the support style that works best for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((opt, idx) => {
          const Icon = opt.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#1A2220] border border-[#E9EEEB] dark:border-[#293431] rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${opt.bgColor} flex items-center justify-center ${opt.textColor} mb-6`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${opt.textColor}`}>
                  {opt.title}
                </span>
                <h3 className="text-xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-1 mb-3">
                  {opt.subtitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#777F7B] dark:text-[#9DA8A3] leading-relaxed mb-6">
                  {opt.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs font-bold text-[#202421] dark:text-[#F0F4F2]">Explore {opt.title} support</span>
                <div className={`w-8 h-8 rounded-full ${opt.bgColor} flex items-center justify-center ${opt.textColor}`}>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
