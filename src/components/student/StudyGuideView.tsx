import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  PlusCircle, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  Target, 
  Award,
  ArrowRight,
  BrainCircuit,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { StudyTask } from '../../types/academic';

interface RecommendationItem {
  id: string;
  subjectName: string;
  title: string;
  durationMinutes: number;
  priority: 'high' | 'medium' | 'low';
  category: 'revision' | 'practice' | 'assignment' | 'reading';
  reason: string;
}

export const StudyGuideView: React.FC = () => {
  const { currentStudent, addStudyTask, addToast } = useApp();
  const [addedTasks, setAddedTasks] = useState<string[]>([]);

  // Find struggling subjects (declining trend or score < 70%)
  const weakSubjects = currentStudent.subjects.filter(
    s => s.trend === 'declining' || s.currentScore < 70
  );

  // Recommendations derived dynamically
  const recommendations: RecommendationItem[] = currentStudent.subjects.flatMap(subject => {
    if (subject.trend === 'declining' || subject.currentScore < 70) {
      return (subject.topicsToReview || ['Fundamental Concepts', 'Practice Problems']).map((topic): RecommendationItem => ({
        id: `rec-${subject.subjectId}-${topic.replace(/\s+/g, '-').toLowerCase()}`,
        subjectName: subject.subjectName,
        title: `Revise ${subject.subjectName}: ${topic}`,
        durationMinutes: 30,
        priority: 'high',
        category: 'revision',
        reason: `Current score is ${subject.currentScore}% with ${subject.trend} trend.`
      }));
    } else {
      return (subject.topicsToReview || []).slice(0, 1).map((topic): RecommendationItem => ({
        id: `rec-${subject.subjectId}-${topic.replace(/\s+/g, '-').toLowerCase()}`,
        subjectName: subject.subjectName,
        title: `Practice ${subject.subjectName}: ${topic}`,
        durationMinutes: 25,
        priority: 'medium',
        category: 'practice',
        reason: `Maintain high performance score of ${subject.currentScore}%.`
      }));
    }
  });

  const handleAddTaskToPlanner = (rec: RecommendationItem) => {
    addStudyTask({
      title: rec.title,
      subjectName: rec.subjectName,
      durationMinutes: rec.durationMinutes,
      completed: false,
      priority: rec.priority,
      category: rec.category,
      dueDate: 'Today'
    });
    setAddedTasks(prev => [...prev, rec.id]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#73AFA0] to-[#5c9386] p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE7A5]" /> Adaptive AI Performance Guide
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Personalized STRIDE Study Guide
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Tailored study schedule and targeted revision topics generated based on your real-time academic scores, trends, and attendance analysis.
          </p>
        </div>
      </div>

      {/* Focus & Priority Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority Focus Areas */}
        <div className="bg-white p-6 rounded-2xl border border-[#D1E5E1] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#D94F4F]" /> Targeted Attention Areas
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#D94F4F]/15 text-[#D94F4F] rounded-full">
              {weakSubjects.length} {weakSubjects.length === 1 ? 'Subject Needs Focus' : 'Subjects Need Focus'}
            </span>
          </div>

          {weakSubjects.length === 0 ? (
            <div className="p-4 bg-[#2E9D68]/10 rounded-xl border border-[#2E9D68]/20 flex items-center gap-3 text-xs text-[#2E9D68]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Great job! All your subjects currently maintain strong performance averages and positive trends.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {weakSubjects.map(sub => (
                <div key={sub.subjectId} className="p-4 bg-[#FFE7A5]/20 rounded-xl border border-[#FFE7A5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900">{sub.subjectName}</span>
                    <span className="text-xs font-mono font-bold text-[#D94F4F]">{sub.currentScore}% (Prev: {sub.previousScore}%)</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{sub.suggestedAction}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sub.topicsToReview.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white border border-[#D1E5E1] text-[10px] font-medium text-neutral-700 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Academic Performance Summary */}
        <div className="bg-white p-6 rounded-2xl border border-[#D1E5E1] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#73AFA0]" /> Academic Health Overview
            </h2>
            <span className="text-xs font-semibold text-neutral-500">{currentStudent.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-[#E8F2F0]/60 rounded-xl border border-[#D1E5E1]">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Academic Average</span>
              <span className="text-2xl font-bold text-[#73AFA0]">{currentStudent.academicAverage}%</span>
            </div>
            <div className="p-3 bg-[#E8F2F0]/60 rounded-xl border border-[#D1E5E1]">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Attendance Rate</span>
              <span className="text-2xl font-bold text-neutral-800">{currentStudent.attendancePercentage}%</span>
            </div>
            <div className="p-3 bg-[#E8F2F0]/60 rounded-xl border border-[#D1E5E1]">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Completed Tasks</span>
              <span className="text-2xl font-bold text-[#2E9D68]">{currentStudent.completedAssignments}</span>
            </div>
            <div className="p-3 bg-[#E8F2F0]/60 rounded-xl border border-[#D1E5E1]">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Pending Tasks</span>
              <span className="text-2xl font-bold text-[#E9B95F]">{currentStudent.pendingAssignments}</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">
            STRIDE analyzes your exam results after every submission. Adding recommended focus tasks to your Study Planner helps stabilize declining scores before finals.
          </p>
        </div>
      </div>

      {/* Recommended Study Tasks Generator */}
      <div className="bg-white p-6 rounded-2xl border border-[#D1E5E1] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#73AFA0]" /> Smart Study Recommendations
            </h2>
            <p className="text-xs text-neutral-500">Click to instantly push tasks into your daily focus planner.</p>
          </div>
          <span className="text-xs font-medium text-neutral-400">{recommendations.length} Suggestions Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(rec => {
            const isAdded = addedTasks.includes(rec.id);
            return (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-[#D1E5E1] bg-white hover:border-[#73AFA0] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#73AFA0] bg-[#73AFA0]/10 px-2 py-0.5 rounded-full">
                      {rec.subjectName}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {rec.durationMinutes} mins
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900 leading-snug">{rec.title}</h3>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{rec.reason}</p>
                </div>

                <button
                  onClick={() => handleAddTaskToPlanner(rec)}
                  disabled={isAdded}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    isAdded
                      ? 'bg-[#2E9D68]/15 text-[#2E9D68] cursor-default'
                      : 'bg-[#73AFA0] hover:bg-[#5c9386] text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Added to Planner
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" /> Add to Study Planner
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Revision Schedule */}
      <div className="bg-white p-6 rounded-2xl border border-[#D1E5E1] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#73AFA0]" /> Recommended Weekly Study Plan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#E8F2F0]/40 rounded-xl border border-[#D1E5E1] space-y-2">
            <span className="text-xs font-bold text-[#73AFA0]">Monday & Wednesday</span>
            <h4 className="text-xs font-bold text-neutral-800">Mathematics Core Review</h4>
            <p className="text-[11px] text-neutral-600">Focus on Differential Equations & Vector Calculus practice sets (45 mins).</p>
          </div>

          <div className="p-4 bg-[#E8F2F0]/40 rounded-xl border border-[#D1E5E1] space-y-2">
            <span className="text-xs font-bold text-[#73AFA0]">Tuesday & Thursday</span>
            <h4 className="text-xs font-bold text-neutral-800">Data Structures & Algo</h4>
            <p className="text-[11px] text-neutral-600">Solve 3 graph traversal & tree search coding exercises (40 mins).</p>
          </div>

          <div className="p-4 bg-[#E8F2F0]/40 rounded-xl border border-[#D1E5E1] space-y-2">
            <span className="text-xs font-bold text-[#73AFA0]">Friday</span>
            <h4 className="text-xs font-bold text-neutral-800">Operating Systems</h4>
            <p className="text-[11px] text-neutral-600">Read concurrency & thread synchronization chapters (30 mins).</p>
          </div>

          <div className="p-4 bg-[#E8F2F0]/40 rounded-xl border border-[#D1E5E1] space-y-2">
            <span className="text-xs font-bold text-[#73AFA0]">Saturday</span>
            <h4 className="text-xs font-bold text-neutral-800">Mock Quiz Self-Assessment</h4>
            <p className="text-[11px] text-neutral-600">Take a timed 20-question practice test to check progress (30 mins).</p>
          </div>
        </div>
      </div>
    </div>
  );
};
