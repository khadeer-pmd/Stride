import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendIndicator } from '../common/TrendIndicator';
import { RiskBadge } from '../common/RiskBadge';
import { TrendingUp, AlertCircle, Sparkles, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const MyProgress: React.FC = () => {
  const { currentStudent } = useApp();

  const chartData = currentStudent.assessments.map(a => ({
    name: a.name,
    score: a.score,
    date: a.date
  }));

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft">
        <span className="px-3 py-1 rounded-full bg-[#D1E5E1] text-[#3B6E63] text-xs font-bold uppercase tracking-wider">
          MY JOURNEY
        </span>
        <h2 className="text-2xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-2 mb-1">
          Academic Progress Over Time
        </h2>
        <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
          Every small step builds towards your long-term educational growth.
        </p>
      </div>

      {/* SILENT STRUGGLE DETECTOR BANNER (If downward trend detected) */}
      {currentStudent.riskAssessment.silentStruggleDetected && (
        <div className="bg-[#F9D4E5] border border-[#D97979]/40 p-6 rounded-3xl shadow-soft">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#D97979] shrink-0 shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="px-3 py-0.5 rounded-full bg-white text-[#D97979] text-xs font-bold uppercase">
                Silent Struggle Detector Activated
              </span>
              <h3 className="text-lg font-bold text-[#202421]">
                We noticed a change in your recent Calculus assessment scores.
              </h3>
              <p className="text-xs text-[#202421]/80 leading-relaxed max-w-2xl">
                Recent scores: 86% → 78% → 69% → 58%. Even though your overall term average is passing (71%), addressing this downward trend today will make your end-of-term exams much easier!
              </p>
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-bold text-[#202421]">Recommended Action:</span>
                <span className="text-xs bg-white px-3 py-1 rounded-full font-semibold text-[#202421]">
                  Review 20-minute daily calculus problem sets with Dr. Sarah Jenkins
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Trend Line Chart */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft">
        <h3 className="text-base font-bold text-[#202421] dark:text-[#F0F4F2] mb-4">
          Assessment History Trendline
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EEEB" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#777F7B' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#777F7B' }} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="score" stroke="#73AFA0" strokeWidth={3} dot={{ r: 6, fill: '#73AFA0' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recorded Assessments Table */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft">
        <h3 className="text-base font-bold text-[#202421] dark:text-[#F0F4F2] mb-4">
          Recorded Assessments Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-[#777F7B] dark:text-[#9DA8A3]">
                <th className="pb-3 font-semibold">Assessment Name</th>
                <th className="pb-3 font-semibold">Subject</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {currentStudent.assessments.map((asm) => (
                <tr key={asm.id} className="hover:bg-gray-50 dark:hover:bg-[#25302C]">
                  <td className="py-3 font-bold text-[#202421] dark:text-[#F0F4F2]">{asm.name}</td>
                  <td className="py-3 text-[#777F7B] dark:text-[#9DA8A3]">{asm.subjectName}</td>
                  <td className="py-3 text-[#777F7B] dark:text-[#9DA8A3]">{asm.date}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8F2F0] text-[#202421] font-medium">
                      {asm.type}
                    </span>
                  </td>
                  <td className="py-3 text-right font-extrabold text-[#202421] dark:text-[#F0F4F2]">
                    {asm.score}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
