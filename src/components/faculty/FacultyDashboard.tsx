import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/RiskBadge';
import { TrendIndicator } from '../common/TrendIndicator';
import { MotionCard } from '../common/MotionCard';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  HeartHandshake, 
  Plus, 
  Search, 
  FileSpreadsheet,
  CheckCircle2,
  Download,
  FileText,
  BookOpen,
  Filter,
  Mail,
  X,
  Sparkles,
  PieChart as PieChartIcon,
  ShieldAlert,
  Brain,
  GraduationCap,
  ChevronRight,
  Send,
  Check
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie } from 'recharts';
import confetti from 'canvas-confetti';
import type { StudentProfile, Intervention } from '../../types/academic';

interface FacultyDashboardProps {
  onNavigateTab: (tab: string) => void;
  activeTab?: string;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onNavigateTab, activeTab = 'overview' }) => {
  const { students, metrics, interventions, createIntervention, recordAssessmentMark, addToast } = useApp();
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('sub-math');
  const [interventionStatusFilter, setInterventionStatusFilter] = useState<'All' | 'In Progress' | 'Completed'>('All');

  // Modal states for Quick Actions
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentProfile | null>(null);

  // Form states - Record Mark
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-math');
  const [markScore, setMarkScore] = useState(75);
  const [assessmentTitle, setAssessmentTitle] = useState('Calculus Quiz 3');

  // Form states - Intervention
  const [intStudentId, setIntStudentId] = useState(students[0]?.id || '');
  const [intType, setIntType] = useState<'Faculty Mentoring' | 'Remedial Session' | 'Practice Plan'>('Remedial Session');
  const [intNotes, setIntNotes] = useState('2 weekly calculus problem-solving lab sessions.');
  const [intSubject, setIntSubject] = useState('Mathematics & Calculus III');

  // Student messaging state
  const [studentMessage, setStudentMessage] = useState('');

  // Filtered student lists
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || s.riskAssessment.category === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const studentsNeedingSupport = students.filter(s => 
    s.riskAssessment.category === 'High' || s.riskAssessment.category === 'Medium' || s.riskAssessment.silentStruggleDetected
  );

  const filteredInterventions = interventions.filter(i => {
    if (interventionStatusFilter === 'All') return true;
    return i.status === interventionStatusFilter;
  });

  // Recharts Data
  const subjectChartData = [
    { name: 'Mathematics', avg: 72, fill: '#73AFA0' },
    { name: 'Data Structures', avg: 82, fill: '#75A994' },
    { name: 'Operating Systems', avg: 76, fill: '#E9B95F' },
    { name: 'Networks', avg: 79, fill: '#8C6D1F' }
  ];

  const riskDistributionData = [
    { name: 'Low Risk', value: students.filter(s => s.riskAssessment.category === 'Low').length, color: '#75A994' },
    { name: 'Medium Risk', value: students.filter(s => s.riskAssessment.category === 'Medium').length, color: '#E9B95F' },
    { name: 'High Risk', value: students.filter(s => s.riskAssessment.category === 'High').length, color: '#D97979' },
  ];

  // Actions
  const handleRecordMark = (e: React.FormEvent) => {
    e.preventDefault();
    recordAssessmentMark(selectedStudentId, selectedSubjectId, Number(markScore), assessmentTitle);
    addToast(`Assessment mark (${markScore}%) recorded successfully.`, 'success');
    setShowMarkModal(false);
  };

  const handleCreateInt = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === intStudentId);
    if (!st) return;

    createIntervention({
      studentId: st.id,
      studentName: st.name,
      subjectName: intSubject,
      type: intType,
      status: 'In Progress',
      assignedBy: 'Dr. Sarah Jenkins',
      mentorName: 'Dr. Sarah Jenkins',
      followUpDate: '2026-10-25',
      notes: intNotes,
      scoreBefore: st.academicAverage
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    addToast(`Academic intervention scheduled for ${st.name}.`, 'success');
    setShowInterventionModal(false);
  };

  const handleSendMessage = () => {
    if (!studentMessage.trim() || !selectedStudentForModal) return;
    addToast(`Message sent to ${selectedStudentForModal.name} via STRIDE Portal.`, 'success');
    setStudentMessage('');
  };

  // CSV Report Generators
  const downloadReport = (reportType: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    if (reportType === 'academic-summary') {
      csvContent += 'Student Name,Student ID,Department,Academic Avg (%),Attendance (%),Risk Category\n';
      students.forEach(s => {
        csvContent += `"${s.name}","${s.studentId}","${s.department}",${s.academicAverage},${s.attendancePercentage},"${s.riskAssessment.category}"\n`;
      });
    } else if (reportType === 'low-attendance') {
      csvContent += 'Student Name,Student ID,Attendance (%),Status,Mentor\n';
      students.filter(s => s.attendancePercentage < 85).forEach(s => {
        csvContent += `"${s.name}","${s.studentId}",${s.attendancePercentage},"Low Attendance Warning","${s.assignedMentor}"\n`;
      });
    } else {
      csvContent += 'Student Name,Subject,Intervention Type,Status,Assigned Date,Notes\n';
      interventions.forEach(i => {
        csvContent += `"${i.studentName}","${i.subjectName}","${i.type}","${i.status}","${i.startDate}","${i.notes}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `STRIDE_Faculty_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`CSV Report (${reportType}) generated and downloaded.`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Greeting Banner */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E9EEEB] shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-[#73AFA0]" />
            <span className="text-xs font-bold text-[#73AFA0] uppercase tracking-wider">Faculty Portal • CS Department</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#202421]">
            Welcome back, Dr. Sarah Jenkins!
          </h2>
          <p className="text-xs sm:text-sm text-[#777F7B] mt-0.5">
            Overviewing student progress, managing interventions, and assessing subject performance.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowMarkModal(true)}
            className="px-4 py-2.5 bg-[#E8F2F0] hover:bg-[#D1E5E1] text-[#202421] font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors border border-[#D1E5E1]"
          >
            <Plus className="w-4 h-4 text-[#73AFA0]" />
            <span>Record Marks</span>
          </button>

          <button
            onClick={() => setShowInterventionModal(true)}
            className="px-4 py-2.5 bg-[#73AFA0] hover:bg-[#5d9889] text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Create Intervention</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB CONTENT */}

      {/* 1. OVERVIEW TAB */}
      {(activeTab === 'overview') && (
        <div className="space-y-6">
          {/* Metrics Row with 3D Motion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MotionCard className="bg-[#D1E5E1] p-5 shadow-soft border border-[#D1E5E1]">
              <span className="text-xs font-bold text-[#3B6E63] uppercase">Assigned Students</span>
              <h3 className="text-3xl font-extrabold text-[#202421] mt-1">{students.length}</h3>
              <p className="text-[11px] text-[#202421]/70 mt-1">Computer Science & Eng.</p>
            </MotionCard>

            <MotionCard className="bg-[#F9D4E5] p-5 shadow-soft border border-[#F9D4E5]">
              <span className="text-xs font-bold text-[#A84B68] uppercase">Students Needing Review</span>
              <h3 className="text-3xl font-extrabold text-[#202421] mt-1">
                {students.filter(s => s.riskAssessment.category !== 'Low').length}
              </h3>
              <p className="text-[11px] text-[#202421]/70 mt-1">Silent struggle & high risk</p>
            </MotionCard>

            <MotionCard className="bg-[#FFE7A5] p-5 shadow-soft border border-[#FFE7A5]">
              <span className="text-xs font-bold text-[#8C6D1F] uppercase">Average Performance</span>
              <h3 className="text-3xl font-extrabold text-[#202421] mt-1">{metrics.avgAcademicPerformance}%</h3>
              <p className="text-[11px] text-[#202421]/70 mt-1">Across all midterms</p>
            </MotionCard>

            <MotionCard className="bg-[#DCCEEB] p-5 shadow-soft border border-[#DCCEEB]">
              <span className="text-xs font-bold text-[#62477E] uppercase">Active Interventions</span>
              <h3 className="text-3xl font-extrabold text-[#202421] mt-1">{interventions.length}</h3>
              <p className="text-[11px] text-[#202421]/70 mt-1">Remedial labs & mentoring</p>
            </MotionCard>
          </div>

          {/* STUDENTS NEEDING ATTENTION TABLE */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#202421]">
                  Students Needing Attention & Review
                </h3>
                <p className="text-xs text-[#777F7B]">
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
                  className="pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs w-56 focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-[#777F7B]">
                    <th className="pb-3 font-semibold">Student Name</th>
                    <th className="pb-3 font-semibold">Student ID</th>
                    <th className="pb-3 font-semibold">Academic Avg</th>
                    <th className="pb-3 font-semibold">Attendance</th>
                    <th className="pb-3 font-semibold">Risk Priority</th>
                    <th className="pb-3 font-semibold">Main Concern</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-gray-50">
                      <td className="py-3 font-bold text-[#202421] flex items-center gap-2">
                        <img src={st.avatar} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                        <button 
                          onClick={() => setSelectedStudentForModal(st)}
                          className="hover:underline text-left text-[#202421]"
                        >
                          {st.name}
                        </button>
                      </td>
                      <td className="py-3 text-[#777F7B]">{st.studentId}</td>
                      <td className="py-3 font-extrabold text-[#202421]">{st.academicAverage}%</td>
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
        </div>
      )}

      {/* 2. MY STUDENTS TAB */}
      {(activeTab === 'students') && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E9EEEB] shadow-soft">
            <div>
              <h3 className="text-lg font-bold text-[#202421]">Assigned Student Roster</h3>
              <p className="text-xs text-[#777F7B]">View individual profile metrics, subjects, and academic standing</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by name or ID..."
                  className="pl-9 pr-3 py-2 rounded-xl bg-[#E8F2F0] border border-[#D1E5E1] text-xs w-60 focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
                />
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="px-3 py-2 bg-[#E8F2F0] border border-[#D1E5E1] rounded-xl text-xs font-semibold text-neutral-700"
              >
                <option value="All">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((st) => (
              <div 
                key={st.id}
                className="bg-white rounded-3xl border border-[#E9EEEB] p-5 shadow-soft space-y-4 hover:border-[#73AFA0] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#73AFA0]" />
                    <div>
                      <h4 className="font-bold text-sm text-[#202421]">{st.name}</h4>
                      <p className="text-xs text-[#777F7B]">{st.studentId} • Sem {st.semester}</p>
                    </div>
                  </div>
                  <RiskBadge category={st.riskAssessment.category} score={st.riskAssessment.score} />
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#E8F2F0]/50 p-3 rounded-2xl border border-[#D1E5E1]/60 text-xs">
                  <div>
                    <span className="text-[10px] text-[#777F7B] uppercase font-bold block">Academic Avg</span>
                    <span className="font-bold text-[#202421] text-sm">{st.academicAverage}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#777F7B] uppercase font-bold block">Attendance</span>
                    <span className="font-bold text-[#202421] text-sm">{st.attendancePercentage}%</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#777F7B] font-bold uppercase tracking-wider">Enrolled Subjects ({st.subjects.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {st.subjects.map(sub => (
                      <span key={sub.subjectId} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] rounded-lg font-medium">
                        {sub.subjectName.split(' ')[0]}: {sub.currentScore}%
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2 border-t border-neutral-100">
                  <button
                    onClick={() => setSelectedStudentForModal(st)}
                    className="flex-1 py-2 bg-[#E8F2F0] text-[#202421] font-semibold text-xs rounded-xl hover:bg-[#D1E5E1] transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setIntStudentId(st.id);
                      setShowInterventionModal(true);
                    }}
                    className="px-3 py-2 bg-[#73AFA0] text-white font-semibold text-xs rounded-xl hover:bg-[#5d9889] transition-colors"
                  >
                    Intervene
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ACADEMIC INSIGHTS TAB */}
      {(activeTab === 'insights') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Average Comparison Chart */}
            <div className="bg-white p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#202421]">Class Subject Averages</h3>
                  <p className="text-xs text-[#777F7B]">Overall faculty class score benchmarks</p>
                </div>
                <BookOpen className="w-5 h-5 text-[#73AFA0]" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="avg" radius={[8, 8, 0, 0]}>
                      {subjectChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Category Distribution */}
            <div className="bg-white p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#202421]">Student Risk Distribution</h3>
                  <p className="text-xs text-[#777F7B]">Categorized by STRIDE Early Risk Engine</p>
                </div>
                <ShieldAlert className="w-5 h-5 text-[#E9B95F]" />
              </div>

              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-6 text-xs font-semibold">
                {riskDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Topic Weakness Breakdown Table */}
          <div className="bg-white p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4">
            <h3 className="text-base font-bold text-[#202421]">Topic Weakness & Struggle Analysis</h3>
            <p className="text-xs text-[#777F7B]">Identified topics requiring faculty revision or lab problem sessions</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#FFE7A5]/30 border border-[#FFE7A5] rounded-2xl space-y-2">
                <span className="text-xs font-bold text-[#8C6D1F] uppercase">Differential Equations</span>
                <p className="text-xs text-neutral-700">42% of students scored below threshold on Midterm 2.</p>
                <span className="inline-block text-[10px] px-2 py-0.5 bg-[#FFE7A5] font-bold rounded-md text-[#202421]">Remedial Recommended</span>
              </div>

              <div className="p-4 bg-[#F9D4E5]/30 border border-[#F9D4E5] rounded-2xl space-y-2">
                <span className="text-xs font-bold text-[#A84B68] uppercase">Graph Traversal & BFS/DFS</span>
                <p className="text-xs text-neutral-700">35% students struggling with recursive implementation.</p>
                <span className="inline-block text-[10px] px-2 py-0.5 bg-[#F9D4E5] font-bold rounded-md text-[#202421]">Lab Practice Planned</span>
              </div>

              <div className="p-4 bg-[#D1E5E1]/40 border border-[#D1E5E1] rounded-2xl space-y-2">
                <span className="text-xs font-bold text-[#3B6E63] uppercase">Virtual Memory & Deadlocks</span>
                <p className="text-xs text-neutral-700">28% missed synchronization theory questions.</p>
                <span className="inline-block text-[10px] px-2 py-0.5 bg-[#D1E5E1] font-bold rounded-md text-[#202421]">Review Material Sent</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. STUDENTS NEEDING SUPPORT TAB (FLAGGED) */}
      {(activeTab === 'support-needed') && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="text-base font-bold text-amber-900">Students Flagged for Immediate Support</h3>
                <p className="text-xs text-amber-700">Students showing score drops, silent struggle signs, or attendance drop-offs</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-amber-200 text-amber-900 font-bold text-xs rounded-full">
              {studentsNeedingSupport.length} Flagged Students
            </span>
          </div>

          <div className="space-y-4">
            {studentsNeedingSupport.map((st) => (
              <div key={st.id} className="bg-white p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-4">
                    <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-400" />
                    <div>
                      <h4 className="font-bold text-base text-[#202421]">{st.name}</h4>
                      <p className="text-xs text-[#777F7B]">{st.studentId} • Department: {st.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <RiskBadge category={st.riskAssessment.category} score={st.riskAssessment.score} />
                    <button
                      onClick={() => {
                        setIntStudentId(st.id);
                        setShowInterventionModal(true);
                      }}
                      className="px-4 py-2 bg-[#73AFA0] text-white font-bold text-xs rounded-xl hover:bg-[#5d9889] transition-colors"
                    >
                      Schedule Intervention
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
                    <span className="font-bold text-neutral-500 uppercase text-[10px]">Academic Diagnostic</span>
                    <p className="font-semibold text-neutral-800">Current Average: {st.academicAverage}%</p>
                    <p className="text-neutral-500">{st.riskAssessment.explanation}</p>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
                    <span className="font-bold text-neutral-500 uppercase text-[10px]">Attendance Standing</span>
                    <p className="font-semibold text-neutral-800">{st.attendancePercentage}% Attendance Rate</p>
                    <p className="text-neutral-500">Mentored by: {st.assignedMentor}</p>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
                    <span className="font-bold text-neutral-500 uppercase text-[10px]">Recommended Action</span>
                    <p className="font-semibold text-[#73AFA0]">
                      {st.subjects[0]?.suggestedAction || 'Schedule weekly 1-on-1 tutoring session.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. INTERVENTION CENTER TAB */}
      {(activeTab === 'interventions') && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E9EEEB] shadow-soft">
            <div>
              <h3 className="text-lg font-bold text-[#202421]">Intervention Management Center</h3>
              <p className="text-xs text-[#777F7B]">Track, schedule, and update remedial tutoring and faculty mentoring plans</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-[#E8F2F0] p-1 rounded-xl text-xs font-semibold">
                {(['All', 'In Progress', 'Completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setInterventionStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      interventionStatusFilter === st ? 'bg-white text-[#202421] shadow-xs' : 'text-[#777F7B]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowInterventionModal(true)}
                className="px-4 py-2 bg-[#73AFA0] text-white font-bold text-xs rounded-xl hover:bg-[#5d9889] flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Plan</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredInterventions.map((int) => (
              <div key={int.id} className="bg-white p-5 rounded-3xl border border-[#E9EEEB] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#202421]">{int.studentName}</span>
                    <span className="px-2.5 py-0.5 bg-[#D1E5E1] text-[#202421] font-semibold text-[10px] rounded-full">
                      {int.type}
                    </span>
                    <span className={`px-2 py-0.5 font-bold text-[10px] rounded-full ${
                      int.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {int.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#777F7B]">{int.subjectName} • Assigned by: {int.assignedBy}</p>
                  <p className="text-xs text-neutral-600 italic mt-1 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                    "{int.notes}"
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 font-bold block uppercase">Follow-up Date</span>
                    <span className="font-semibold text-neutral-700">{int.followUpDate}</span>
                  </div>

                  {int.status !== 'Completed' && (
                    <button
                      onClick={() => {
                        int.status = 'Completed';
                        confetti({ particleCount: 40 });
                        addToast(`Intervention marked as Completed for ${int.studentName}.`, 'success');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SUBJECT PERFORMANCE TAB */}
      {(activeTab === 'subject-performance') && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-[#E9EEEB] shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#202421]">Subject-Wise Academic Performance</h3>
              <p className="text-xs text-[#777F7B]">Inspect class scores, top performers, and trends per subject course</p>
            </div>

            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-4 py-2 bg-[#E8F2F0] border border-[#D1E5E1] rounded-xl text-xs font-bold text-[#202421]"
            >
              <option value="sub-math">Mathematics & Calculus III (MATH301)</option>
              <option value="sub-dsa">Data Structures & Algorithms (CS302)</option>
              <option value="sub-os">Operating Systems (CS304)</option>
              <option value="sub-cn">Computer Networks (CS306)</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4">
            <h4 className="font-bold text-sm text-[#202421]">Enrolled Student Marks Breakdown</h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-[#777F7B]">
                    <th className="pb-3 font-semibold">Student Name</th>
                    <th className="pb-3 font-semibold">Student ID</th>
                    <th className="pb-3 font-semibold">Subject Grade (%)</th>
                    <th className="pb-3 font-semibold">Trend</th>
                    <th className="pb-3 font-semibold">Attendance</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((st) => {
                    const sub = st.subjects.find(s => s.subjectId === selectedSubjectFilter) || st.subjects[0];
                    return (
                      <tr key={st.id} className="hover:bg-gray-50">
                        <td className="py-3 font-bold text-[#202421] flex items-center gap-2">
                          <img src={st.avatar} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                          <span>{st.name}</span>
                        </td>
                        <td className="py-3 text-[#777F7B]">{st.studentId}</td>
                        <td className="py-3 font-extrabold text-[#202421]">{sub?.currentScore || st.academicAverage}%</td>
                        <td className="py-3">
                          <TrendIndicator trend={sub?.trend || 'stable'} />
                        </td>
                        <td className="py-3 text-[#777F7B]">{sub?.attendance || st.attendancePercentage}%</td>
                        <td className="py-3">
                          <button
                            onClick={() => {
                              setSelectedStudentId(st.id);
                              setSelectedSubjectId(sub?.subjectId || 'sub-math');
                              setShowMarkModal(true);
                            }}
                            className="px-3 py-1 bg-[#E8F2F0] hover:bg-[#D1E5E1] text-[#202421] font-semibold text-[11px] rounded-lg"
                          >
                            Edit Score
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. REPORTS TAB */}
      {(activeTab === 'reports') && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-2">
            <h3 className="text-lg font-bold text-[#202421]">Faculty Reports & Data Export</h3>
            <p className="text-xs text-[#777F7B]">Generate institutional compliance reports, attendance summaries, and risk logs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <FileText className="w-8 h-8 text-[#73AFA0]" />
                <h4 className="font-bold text-sm text-[#202421]">Semester Academic Performance Summary</h4>
                <p className="text-xs text-[#777F7B]">Complete grade roster with student averages, department metrics, and risk status.</p>
              </div>

              <button
                onClick={() => downloadReport('academic-summary')}
                className="w-full py-2.5 bg-[#73AFA0] text-white font-bold text-xs rounded-xl hover:bg-[#5d9889] transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
                <h4 className="font-bold text-sm text-[#202421]">Low Attendance Warning Report</h4>
                <p className="text-xs text-[#777F7B]">List of students falling below the institutional 85% attendance requirement.</p>
              </div>

              <button
                onClick={() => downloadReport('low-attendance')}
                className="w-full py-2.5 bg-[#E9B95F] text-white font-bold text-xs rounded-xl hover:bg-[#d4a54c] transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E9EEEB] shadow-soft space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <HeartHandshake className="w-8 h-8 text-purple-500" />
                <h4 className="font-bold text-sm text-[#202421]">Intervention Effectiveness Log</h4>
                <p className="text-xs text-[#777F7B]">Historical record of tutoring, mentoring plans, and pre/post intervention scores.</p>
              </div>

              <button
                onClick={() => downloadReport('interventions')}
                className="w-full py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT DETAIL MODAL */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E9EEEB] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <img src={selectedStudentForModal.avatar} alt={selectedStudentForModal.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#73AFA0]" />
                <div>
                  <h3 className="text-lg font-bold text-[#202421]">{selectedStudentForModal.name}</h3>
                  <p className="text-xs text-[#777F7B]">{selectedStudentForModal.studentId} • {selectedStudentForModal.department}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudentForModal(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              <div className="flex items-center justify-between bg-[#E8F2F0] p-3 rounded-2xl">
                <span className="text-xs font-bold text-[#202421]">Overall Standing</span>
                <RiskBadge category={selectedStudentForModal.riskAssessment.category} score={selectedStudentForModal.riskAssessment.score} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#777F7B] uppercase">Subject Performance</span>
                {selectedStudentForModal.subjects.map(s => (
                  <div key={s.subjectId} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl border text-xs">
                    <span className="font-semibold text-neutral-800">{s.subjectName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{s.currentScore}%</span>
                      <TrendIndicator trend={s.trend} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-[#777F7B] uppercase">Send Private Message</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={studentMessage}
                    onChange={(e) => setStudentMessage(e.target.value)}
                    placeholder="Type message or study advice..."
                    className="flex-1 text-xs p-2.5 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2.5 bg-[#73AFA0] text-white rounded-xl text-xs font-bold hover:bg-[#5d9889]"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudentForModal(null)}
              className="w-full py-2.5 bg-neutral-100 text-neutral-700 font-semibold rounded-xl text-xs hover:bg-neutral-200"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Record Marks Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E9EEEB] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#202421]">Record Assessment Mark</h3>
            <form onSubmit={handleRecordMark} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421]"
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
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421]"
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
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421]"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E9EEEB] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#202421]">Schedule Academic Intervention</h3>
            <form onSubmit={handleCreateInt} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Target Student</label>
                <select
                  value={intStudentId}
                  onChange={(e) => setIntStudentId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421]"
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
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421]"
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
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#202421]"
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
