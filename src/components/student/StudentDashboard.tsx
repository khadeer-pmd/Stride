import React from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/RiskBadge';
import { TrendIndicator } from '../common/TrendIndicator';
import { MotionCard } from '../common/MotionCard';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  Award, 
  ArrowRight,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateTab }) => {
  const { currentStudent, toggleTaskCompletion } = useApp();

  const chartData = currentStudent.assessments.map(a => ({
    name: a.name.split(':')[0],
    score: a.score,
    date: a.date
  }));

  return (
    <div className="space-y-6 pb-8">
      {/* Top Greeting Banner */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] rounded-3xl p-6 sm:p-8 border border-[#E9EEEB] dark:border-[#293431] shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-extrabold text-[#202421] dark:text-[#F0F4F2]">
              Welcome back, {currentStudent.name.split(' ')[0]}!
            </h2>
            <RiskBadge category={currentStudent.riskAssessment.category} score={currentStudent.riskAssessment.score} />
          </div>
          <p className="text-xs sm:text-sm text-[#777F7B] dark:text-[#9DA8A3]">
            Every small step brings you closer to your goals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('what-if')}
            className="px-4 py-2 bg-[#D1E5E1] hover:bg-[#c2ded9] text-[#202421] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#548E7D]" />
            <span>Explore Next Step (What-If)</span>
          </button>
          
          <button
            onClick={() => onNavigateTab('planner')}
            className="px-4 py-2 bg-[#73AFA0] hover:bg-[#5d9889] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Study Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION A: YOUR ACADEMIC OVERVIEW CARDS (Pastel Cards with 3D Motion) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Current Average */}
        <MotionCard
          onClick={() => onNavigateTab('subjects')}
          className="bg-[#D1E5E1] p-5 shadow-soft border border-[#D1E5E1]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#3B6E63] uppercase tracking-wider">Academic Average</span>
            <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[#3B6E63] shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#202421]">{currentStudent.academicAverage}%</h3>
            <p className="text-[11px] text-[#202421]/70 mt-1">Across 4 registered subjects</p>
          </div>
        </MotionCard>

        {/* Attendance Percentage */}
        <MotionCard
          onClick={() => onNavigateTab('attendance')}
          className="bg-[#FFE7A5] p-5 shadow-soft border border-[#FFE7A5]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#8C6D1F] uppercase tracking-wider">Attendance Rate</span>
            <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[#8C6D1F] shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#202421]">{currentStudent.attendancePercentage}%</h3>
            <p className="text-[11px] text-[#202421]/70 mt-1">Consistency across lectures</p>
          </div>
        </MotionCard>

        {/* Completed Assignments */}
        <MotionCard
          onClick={() => onNavigateTab('planner')}
          className="bg-[#F9D4E5] p-5 shadow-soft border border-[#F9D4E5]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#A84B68] uppercase tracking-wider">Completed Tasks</span>
            <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[#A84B68] shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#202421]">
              {currentStudent.completedAssignments} / {currentStudent.totalAssignments}
            </h3>
            <p className="text-[11px] text-[#202421]/70 mt-1">{currentStudent.pendingAssignments} pending submission</p>
          </div>
        </MotionCard>

        {/* Goals Achieved */}
        <MotionCard
          onClick={() => onNavigateTab('goals')}
          className="bg-[#DCCEEB] p-5 shadow-soft border border-[#DCCEEB]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#62477E] uppercase tracking-wider">Small Wins</span>
            <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[#62477E] shadow-xs">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#202421]">{currentStudent.goalsAchieved}</h3>
            <p className="text-[11px] text-[#202421]/70 mt-1">Milestones unlocked this semester</p>
          </div>
        </MotionCard>

      </div>

      {/* SECTION B & C: PROGRESS CHART & SUBJECTS NEEDING ATTENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Progress Chart */}
        <div className="lg:col-span-7 bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#202421] dark:text-[#F0F4F2]">
                Learning Trajectory & Assessment History
              </h3>
              <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
                Scores across recently completed quizzes and midterms
              </p>
            </div>
            <button onClick={() => onNavigateTab('progress')} className="text-xs font-semibold text-[#73AFA0] hover:underline">
              View All
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#73AFA0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#73AFA0" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EEEB" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#777F7B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#777F7B' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E9EEEB', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#73AFA0" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subjects Needing Attention */}
        <div className="lg:col-span-5 bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#202421] dark:text-[#F0F4F2]">
              Subjects Needing Attention
            </h3>
            <span className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">Personalized</span>
          </div>

          <div className="space-y-3">
            {currentStudent.subjects.map((sub) => (
              <div
                key={sub.subjectId}
                className={`p-4 rounded-2xl border transition-all ${
                  sub.trend === 'declining'
                    ? 'bg-[#F9D4E5]/40 border-[#D97979]/30'
                    : 'bg-[#E8F2F0] dark:bg-[#25302C] border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#202421] dark:text-[#F0F4F2]">
                    {sub.subjectName}
                  </span>
                  <TrendIndicator trend={sub.trend} />
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-extrabold text-[#202421] dark:text-[#F0F4F2]">
                    {sub.currentScore}%
                  </span>
                  <span className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
                    (Prev: {sub.previousScore}%)
                  </span>
                </div>

                <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3] leading-relaxed">
                  💡 {sub.suggestedAction}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION D & E: TODAY'S PLAN & UPCOMING ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Study Plan (Checkable) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#202421] dark:text-[#F0F4F2]">
                Today's Focus Plan
              </h3>
              <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
                Check off items to track your daily momentum
              </p>
            </div>
            <button onClick={() => onNavigateTab('planner')} className="text-xs font-semibold text-[#73AFA0] hover:underline">
              Open Planner
            </button>
          </div>

          <div className="space-y-2.5">
            {currentStudent.studyTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskCompletion(task.id)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  task.completed
                    ? 'bg-[#D1E5E1]/40 border-[#75A994]/30 line-through opacity-75'
                    : 'bg-[#E8F2F0] dark:bg-[#25302C] border-transparent hover:border-[#73AFA0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-[#75A994] border-[#75A994] text-white' : 'border-gray-400'
                  }`}>
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#202421] dark:text-[#F0F4F2]">
                      {task.title}
                    </h4>
                    <span className="text-[10px] text-[#777F7B] dark:text-[#9DA8A3]">
                      {task.subjectName} • {task.durationMinutes} mins
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  task.priority === 'high' ? 'bg-[#F9D4E5] text-[#D97979]' : 'bg-[#FFE7A5] text-[#8C6D1F]'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ask STRIDE AI Companion Quick Card */}
        <div className="lg:col-span-5 bg-[#DCCEEB]/60 p-6 rounded-3xl border border-[#DCCEEB] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#62477E]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#62477E] uppercase tracking-wider">STRIDE Companion</span>
            </div>

            <h4 className="text-base font-extrabold text-[#202421] mb-2">
              Have a question about your study schedule?
            </h4>
            <p className="text-xs text-[#202421]/80 leading-relaxed mb-4">
              "You don't need to solve everything at once. Focus on 20 minutes of differential calculus practice today!"
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('what-if')}
            className="w-full py-3 bg-[#202421] hover:bg-[#343B36] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Explore What-If Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
