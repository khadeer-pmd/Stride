import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/RiskBadge';
import { TrendIndicator } from '../common/TrendIndicator';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  HeartHandshake, 
  Plus, 
  Search, 
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface FacultyDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onNavigateTab }) => {
  const { students, metrics, createIntervention, recordAssessmentMark } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states for Quick Actions
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);

  // Form states
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-math');
  const [markScore, setMarkScore] = useState(75);
  const [assessmentTitle, setAssessmentTitle] = useState('Calculus Quiz 3');

  // Intervention form state
  const [intStudentId, setIntStudentId] = useState(students[0]?.id || '');
  const [intType, setIntType] = useState<'Faculty Mentoring' | 'Remedial Session' | 'Practice Plan'>('Remedial Session');
  const [intNotes, setIntNotes] = useState('2 weekly calculus problem-solving lab sessions.');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subjectChartData = [
    { name: 'Mathematics', avg: 72 },
    { name: 'Data Structures', avg: 82 },
    { name: 'Operating Systems', avg: 76 },
    { name: 'Networks', avg: 79 }
  ];

  const handleRecordMark = (e: React.FormEvent) => {
    e.preventDefault();
    recordAssessmentMark(selectedStudentId, selectedSubjectId, Number(markScore), assessmentTitle);
    setShowMarkModal(false);
  };

  const handleCreateInt = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === intStudentId);
    if (!st) return;

    createIntervention({
      studentId: st.id,
      studentName: st.name,
      subjectName: 'Mathematics & Calculus III',
      type: intType,
      status: 'In Progress',
      assignedBy: 'Dr. Sarah Jenkins',
      mentorName: 'Dr. Sarah Jenkins',
      followUpDate: '2026-10-25',
      notes: intNotes,
      scoreBefore: st.academicAverage
    });

    setShowInterventionModal(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Greeting Banner */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 sm:p-8 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#202421] dark:text-[#F0F4F2]">
            Welcome back, Dr. Sarah Jenkins!
          </h2>
          <p className="text-xs sm:text-sm text-[#777F7B] dark:text-[#9DA8A3]">
            Here is how your assigned engineering students are progressing today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowMarkModal(true)}
            className="px-4 py-2 bg-[#D1E5E1] hover:bg-[#c2ded9] text-[#202421] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#548E7D]" />
            <span>Record Marks</span>
          </button>

          <button
            onClick={() => setShowInterventionModal(true)}
            className="px-4 py-2 bg-[#73AFA0] hover:bg-[#5d9889] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Create Intervention</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#D1E5E1] p-5 rounded-3xl shadow-soft">
          <span className="text-xs font-bold text-[#3B6E63] uppercase">Assigned Students</span>
          <h3 className="text-3xl font-extrabold text-[#202421] mt-1">{students.length}</h3>
          <p className="text-[11px] text-[#202421]/70 mt-1">Computer Science & Eng.</p>
        </div>

        <div className="bg-[#F9D4E5] p-5 rounded-3xl shadow-soft">
          <span className="text-xs font-bold text-[#A84B68] uppercase">Students Needing Review</span>
          <h3 className="text-3xl font-extrabold text-[#202421] mt-1">
            {students.filter(s => s.riskAssessment.category !== 'Low').length}
          </h3>
          <p className="text-[11px] text-[#202421]/70 mt-1">Silent struggle & high risk</p>
        </div>

        <div className="bg-[#FFE7A5] p-5 rounded-3xl shadow-soft">
          <span className="text-xs font-bold text-[#8C6D1F] uppercase">Average Performance</span>
          <h3 className="text-3xl font-extrabold text-[#202421] mt-1">{metrics.avgAcademicPerformance}%</h3>
          <p className="text-[11px] text-[#202421]/70 mt-1">Across all midterms</p>
        </div>

        <div className="bg-[#DCCEEB] p-5 rounded-3xl shadow-soft">
          <span className="text-xs font-bold text-[#62477E] uppercase">Active Interventions</span>
          <h3 className="text-3xl font-extrabold text-[#202421] mt-1">{metrics.openInterventions}</h3>
          <p className="text-[11px] text-[#202421]/70 mt-1">Remedial labs & mentoring</p>
        </div>
      </div>

      {/* SECTION A: STUDENTS NEEDING ATTENTION TABLE */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#202421] dark:text-[#F0F4F2]">
              Students Needing Attention & Review
            </h3>
            <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
              Flagged by STRIDE Early Support Engine without public ranking
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student..."
              className="pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-[#25302C] border border-gray-200 dark:border-gray-700 text-xs w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-[#777F7B] dark:text-[#9DA8A3]">
                <th className="pb-3 font-semibold">Student Name</th>
                <th className="pb-3 font-semibold">Student ID</th>
                <th className="pb-3 font-semibold">Academic Avg</th>
                <th className="pb-3 font-semibold">Attendance</th>
                <th className="pb-3 font-semibold">Risk Priority</th>
                <th className="pb-3 font-semibold">Main Concern</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-gray-50 dark:hover:bg-[#25302C]">
                  <td className="py-3 font-bold text-[#202421] dark:text-[#F0F4F2] flex items-center gap-2">
                    <img src={st.avatar} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{st.name}</span>
                  </td>
                  <td className="py-3 text-[#777F7B]">{st.studentId}</td>
                  <td className="py-3 font-extrabold text-[#202421] dark:text-[#F0F4F2]">{st.academicAverage}%</td>
                  <td className="py-3 text-[#777F7B]">{st.attendancePercentage}%</td>
                  <td className="py-3">
                    <RiskBadge category={st.riskAssessment.category} score={st.riskAssessment.score} />
                  </td>
                  <td className="py-3 text-[#777F7B] max-w-xs truncate">
                    {st.riskAssessment.explanation}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        setIntStudentId(st.id);
                        setShowInterventionModal(true);
                      }}
                      className="px-3 py-1 bg-[#73AFA0] text-white font-semibold text-[11px] rounded-lg hover:bg-[#5d9889]"
                    >
                      Intervene
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Marks Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#1A2220] rounded-3xl max-w-md w-full p-6 border border-[#E9EEEB] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#202421] dark:text-[#F0F4F2]">Record Assessment Mark</h3>
            <form onSubmit={handleRecordMark} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs text-[#202421] dark:text-[#F0F4F2]"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Assessment Title</label>
                <input
                  type="text"
                  required
                  value={assessmentTitle}
                  onChange={(e) => setAssessmentTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Score Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={markScore}
                  onChange={(e) => setMarkScore(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMarkModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#73AFA0] text-white hover:bg-[#5d9889]"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Intervention Modal */}
      {showInterventionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#1A2220] rounded-3xl max-w-md w-full p-6 border border-[#E9EEEB] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#202421] dark:text-[#F0F4F2]">Schedule Academic Intervention</h3>
            <form onSubmit={handleCreateInt} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Target Student</label>
                <select
                  value={intStudentId}
                  onChange={(e) => setIntStudentId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs text-[#202421] dark:text-[#F0F4F2]"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Avg: {s.academicAverage}%)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Intervention Type</label>
                <select
                  value={intType}
                  onChange={(e) => setIntType(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs text-[#202421] dark:text-[#F0F4F2]"
                >
                  <option value="Remedial Session">Remedial Session</option>
                  <option value="Faculty Mentoring">Faculty Mentoring</option>
                  <option value="Practice Plan">Practice Plan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Notes & Follow-Up Goals</label>
                <textarea
                  rows={3}
                  value={intNotes}
                  onChange={(e) => setIntNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterventionModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#73AFA0] text-white hover:bg-[#5d9889]"
                >
                  Schedule Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
