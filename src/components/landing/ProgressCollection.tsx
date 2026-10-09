import React from 'react';
import { TrendingUp, Award, Clock, FileCheck, CheckSquare } from 'lucide-react';

export const ProgressCollection: React.FC = () => {
  const cards = [
    {
      title: 'Subject Improvement',
      desc: 'Track mark progression across terms to see real knowledge gains.',
      color: 'bg-[#D1E5E1]',
      textColor: 'text-[#3B6E63]',
      icon: TrendingUp
    },
    {
      title: 'Assessment History',
      desc: 'Clear view of quizzes, lab tests, and midterms without single-score pressure.',
      color: 'bg-[#F9D4E5]',
      textColor: 'text-[#A84B68]',
      icon: FileCheck
    },
    {
      title: 'Attendance Consistency',
      desc: 'Understand how regular lecture participation correlates with subject comfort.',
      color: 'bg-[#FFE7A5]',
      textColor: 'text-[#8C6D1F]',
      icon: Clock
    },
    {
      title: 'Assignment Completion',
      desc: 'Celebrate finishing practical tasks on time before stress accumulates.',
      color: 'bg-[#DCCEEB]',
      textColor: 'text-[#62477E]',
      icon: CheckSquare
    },
    {
      title: 'Study-Plan Milestones',
      desc: 'Recognize daily self-study habits and streak achievements.',
      color: 'bg-[#73AFA0]',
      textColor: 'text-white',
      icon: Award
    }
  ];

  return (
    <section id="for-students" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="px-3.5 py-1 rounded-full bg-[#D1E5E1] text-[#202421] text-xs font-bold uppercase tracking-wider">
          YOUR PROGRESS, YOUR WAY
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-3 mb-4">
          Progress Isn't Just One Number.
        </h2>
        <p className="text-base sm:text-lg text-[#777F7B] dark:text-[#9DA8A3]">
          Learning is multi-dimensional. STRIDE tracks different aspects of your education to give a fair, encouraging picture of your growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className={`${c.color} p-6 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center mb-4 text-[#202421]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#202421] mb-2">{c.title}</h3>
                <p className="text-xs text-[#202421]/80 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
