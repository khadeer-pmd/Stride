import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Sparkles, CheckCircle2, Heart, TrendingUp } from 'lucide-react';

export const MyGoals: React.FC = () => {
  const { currentStudent } = useApp();

  const achievements = [
    { title: 'Consistency Champion', desc: 'Maintained above 80% lecture attendance.', date: 'Oct 01', color: 'bg-[#D1E5E1]', textColor: 'text-[#3B6E63]' },
    { title: 'Data Structures Growth', desc: 'Improved test score from 75% to 78%.', date: 'Sep 25', color: 'bg-[#FFE7A5]', textColor: 'text-[#8C6D1F]' },
    { title: 'Assignment Master', desc: 'Completed 14 core lab submissions.', date: 'Oct 04', color: 'bg-[#F9D4E5]', textColor: 'text-[#A84B68]' },
    { title: 'Proactive Mentor Check-in', desc: 'Scheduled guidance with Dr. Sarah Jenkins.', date: 'Oct 06', color: 'bg-[#DCCEEB]', textColor: 'text-[#62477E]' }
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft">
        <span className="px-3 py-1 rounded-full bg-[#FFE7A5] text-[#8C6D1F] text-xs font-bold uppercase tracking-wider">
          MY GOALS & SMALL WINS
        </span>
        <h2 className="text-2xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-2 mb-1">
          Celebrate Every Step of Progress
        </h2>
        <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
          Every completed task and practice session is a milestone worth celebrating.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((ach, idx) => (
          <div key={idx} className={`${ach.color} p-6 rounded-3xl shadow-soft space-y-3`}>
            <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center text-[#202421]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase ${ach.textColor}`}>{ach.date}</span>
              <h3 className="text-base font-extrabold text-[#202421] mt-0.5">{ach.title}</h3>
              <p className="text-xs text-[#202421]/80 mt-1 leading-relaxed">{ach.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
