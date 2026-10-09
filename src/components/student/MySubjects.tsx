import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendIndicator } from '../common/TrendIndicator';
import { BookOpen, User, CheckCircle2, ArrowRight } from 'lucide-react';

export const MySubjects: React.FC = () => {
  const { currentStudent } = useApp();

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft">
        <span className="px-3 py-1 rounded-full bg-[#FFE7A5] text-[#8C6D1F] text-xs font-bold uppercase tracking-wider">
          MY SUBJECTS
        </span>
        <h2 className="text-2xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-2 mb-1">
          Subject Breakdown & Guidance
        </h2>
        <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
          Understand where you excel and where a little extra practice will move you forward.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentStudent.subjects.map((sub) => (
          <div
            key={sub.subjectId}
            className="bg-[#FFFFFF] dark:bg-[#1A2220] rounded-3xl p-6 border border-[#E9EEEB] dark:border-[#293431] shadow-soft flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 bg-[#E8F2F0] text-[#3B6E63] font-bold text-xs rounded-full">
                  {sub.code}
                </span>
                <TrendIndicator trend={sub.trend} />
              </div>

              <h3 className="text-lg font-bold text-[#202421] dark:text-[#F0F4F2] mb-1">
                {sub.subjectName}
              </h3>
              <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3] mb-4 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#73AFA0]" /> Instructor: {sub.instructorName}
              </p>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#E8F2F0] dark:bg-[#25302C] rounded-2xl mb-4">
                <div>
                  <span className="text-[10px] text-[#777F7B] uppercase font-bold">Latest Score</span>
                  <p className="text-xl font-extrabold text-[#202421] dark:text-[#F0F4F2]">{sub.currentScore}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#777F7B] uppercase font-bold">Attendance</span>
                  <p className="text-xl font-extrabold text-[#202421] dark:text-[#F0F4F2]">{sub.attendance}%</p>
                </div>
              </div>

              {sub.topicsToReview.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-bold text-[#202421] dark:text-[#F0F4F2] block mb-2">
                    Recommended Topics to Review:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sub.topicsToReview.map((topic, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#F9D4E5]/50 text-[#A84B68] rounded-xl text-[11px] font-semibold">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3] leading-relaxed">
                💡 <span className="font-semibold text-[#202421] dark:text-[#F0F4F2]">Next Step:</span> {sub.suggestedAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
