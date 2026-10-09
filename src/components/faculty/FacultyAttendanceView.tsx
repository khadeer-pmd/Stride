import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  Filter, 
  Search, 
  Eye, 
  FileCheck2, 
  AlertTriangle,
  History,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AttendanceStatus, AttendanceRecord, StudentProfile } from '../../types/academic';

export const FacultyAttendanceView: React.FC = () => {
  const { students, markAttendanceBatch, attendanceRecords, addToast } = useApp();

  // Workflow Selections
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedSemester, setSelectedSemester] = useState('5');
  const [selectedDepartment, setSelectedDepartment] = useState('Computer Science');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionType, setSessionType] = useState('Lecture');

  // Search filter inside student list
  const [searchQuery, setSearchQuery] = useState('');

  // Map of studentId -> status
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    students.forEach(s => {
      initial[s.id] = 'present';
    });
    return initial;
  });

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [viewStudentHistory, setViewStudentHistory] = useState<StudentProfile | null>(null);

  // Filter students based on department, semester, and search query
  const filteredStudents = students.filter(s => {
    if (s.department !== selectedDepartment) return false;
    if (s.semester.toString() !== selectedSemester) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.studentId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = { ...attendanceState };
    filteredStudents.forEach(s => {
      updated[s.id] = 'present';
    });
    setAttendanceState(updated);
    addToast('Marked all students as Present.', 'info');
  };

  const handleMarkAllAbsent = () => {
    const updated: Record<string, AttendanceStatus> = { ...attendanceState };
    filteredStudents.forEach(s => {
      updated[s.id] = 'absent';
    });
    setAttendanceState(updated);
    addToast('Marked all students as Absent.', 'info');
  };

  const handleSubmitAttendance = () => {
    const batch: Omit<AttendanceRecord, 'id' | 'createdAt'>[] = filteredStudents.map(s => ({
      studentId: s.id,
      date: selectedDate,
      status: attendanceState[s.id] || 'present',
      subjectName: selectedSubject,
      sessionType,
      markedBy: 'Dr. Sarah Jenkins'
    }));

    markAttendanceBatch(batch);
    setShowConfirmModal(false);
  };

  const presentCount = filteredStudents.filter(s => (attendanceState[s.id] || 'present') === 'present').length;
  const absentCount = filteredStudents.filter(s => (attendanceState[s.id] || 'present') === 'absent').length;
  const lateCount = filteredStudents.filter(s => (attendanceState[s.id] || 'present') === 'late').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#D1E5E1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#73AFA0]" />
            <h1 className="text-2xl font-bold text-neutral-900">Faculty Attendance Portal</h1>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Record, review, and submit daily session attendance for your assigned classes.
          </p>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="px-6 py-2.5 bg-[#73AFA0] hover:bg-[#5c9386] text-white font-semibold rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Review & Submit Attendance
        </button>
      </div>

      {/* Class & Session Selector Controls */}
      <div className="bg-white p-6 rounded-2xl border border-[#D1E5E1] shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#73AFA0]" /> Session Setup
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Year</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 bg-[#E8F2F0] border border-[#D1E5E1] rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Semester</label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 bg-[#E8F2F0] border border-[#D1E5E1] rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
            >
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Department</label>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-[#E8F2F0] border border-[#D1E5E1] rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-[#E8F2F0] border border-[#D1E5E1] rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
            >
              <option value="Data Structures">Data Structures</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#E8F2F0] border border-[#D1E5E1] rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Session Type</label>
            <select
              value={sessionType}
              onChange={e => setSessionType(e.target.value)}
              className="w-full px-3 py-2 bg-[#E8F2F0] border border-[#D1E5E1] rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
            >
              <option value="Lecture">Lecture</option>
              <option value="Lab">Lab</option>
              <option value="Practical">Practical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Action Bar & Live Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-[#D1E5E1] shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Search student by name or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#E8F2F0]/50 border border-[#D1E5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 bg-[#2E9D68]/15 hover:bg-[#2E9D68]/25 text-[#2E9D68] text-xs font-semibold rounded-xl border border-[#2E9D68]/30 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark All Present
            </button>
            <button
              onClick={handleMarkAllAbsent}
              className="px-3.5 py-2 bg-[#D94F4F]/15 hover:bg-[#D94F4F]/25 text-[#D94F4F] text-xs font-semibold rounded-xl border border-[#D94F4F]/30 transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> Mark All Absent
            </button>
          </div>
        </div>

        {/* Realtime Summary Pill */}
        <div className="bg-white p-4 rounded-2xl border border-[#D1E5E1] shadow-sm flex items-center justify-around text-center">
          <div>
            <span className="text-[10px] text-neutral-500 font-semibold block">PRESENT</span>
            <span className="text-lg font-bold text-[#2E9D68]">{presentCount}</span>
          </div>
          <div className="h-6 w-px bg-neutral-200" />
          <div>
            <span className="text-[10px] text-neutral-500 font-semibold block">ABSENT</span>
            <span className="text-lg font-bold text-[#D94F4F]">{absentCount}</span>
          </div>
          <div className="h-6 w-px bg-neutral-200" />
          <div>
            <span className="text-[10px] text-neutral-500 font-semibold block">LATE</span>
            <span className="text-lg font-bold text-[#E9B95F]">{lateCount}</span>
          </div>
        </div>
      </div>

      {/* Student Attendance Roster Table */}
      <div className="bg-white rounded-2xl border border-[#D1E5E1] shadow-sm overflow-hidden">
        <div className="p-4 bg-[#E8F2F0]/60 border-b border-[#D1E5E1] flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
            Roster: {filteredStudents.length} Enrolled Students
          </span>
          <span className="text-xs text-neutral-500">
            {selectedSubject} — {selectedDate} ({sessionType})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Current Attendance</th>
                <th className="py-3 px-4 text-center">Status Toggle</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredStudents.map(student => {
                const currentStatus = attendanceState[student.id] || 'present';
                return (
                  <tr key={student.id} className="hover:bg-[#E8F2F0]/20 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                      />
                      <div>
                        <span className="font-semibold text-neutral-900 block">{student.name}</span>
                        <span className="text-[10px] text-neutral-500">{student.department}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600">{student.studentId}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-800">{student.attendancePercentage}%</span>
                        {student.attendancePercentage < 75 && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#D94F4F]/20 text-[#D94F4F] rounded-full">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1 bg-neutral-100 p-1 rounded-xl max-w-xs mx-auto">
                        {(['present', 'absent', 'late', 'leave'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(student.id, st)}
                            className={`px-3 py-1 rounded-lg font-medium text-[11px] capitalize transition-all ${
                              currentStatus === st
                                ? st === 'present'
                                  ? 'bg-[#2E9D68] text-white shadow-sm'
                                  : st === 'absent'
                                  ? 'bg-[#D94F4F] text-white shadow-sm'
                                  : st === 'late'
                                  ? 'bg-[#E9B95F] text-white shadow-sm'
                                  : 'bg-blue-600 text-white shadow-sm'
                                : 'text-neutral-600 hover:bg-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setViewStudentHistory(student)}
                        className="p-1.5 text-neutral-500 hover:text-[#73AFA0] hover:bg-[#D1E5E1]/40 rounded-lg transition-colors"
                        title="View Attendance Audit & History"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#D1E5E1] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
              <FileCheck2 className="w-6 h-6 text-[#73AFA0]" />
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Confirm Attendance Submission</h3>
                <p className="text-xs text-neutral-500">Please review session details before saving</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-700 bg-[#E8F2F0]/40 p-4 rounded-xl border border-[#D1E5E1]">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subject:</span>
                <span className="font-semibold">{selectedSubject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Session Type & Date:</span>
                <span className="font-semibold">{sessionType} — {selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Enrolled:</span>
                <span className="font-semibold">{filteredStudents.length}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2">
                <span className="text-[#2E9D68] font-semibold">Present:</span>
                <span className="font-bold text-[#2E9D68]">{presentCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#D94F4F] font-semibold">Absent:</span>
                <span className="font-bold text-[#D94F4F]">{absentCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E9B95F] font-semibold">Late:</span>
                <span className="font-bold text-[#E9B95F]">{lateCount}</span>
              </div>
            </div>

            {absentCount > 0 && (
              <p className="text-[11px] text-[#D94F4F] bg-[#D94F4F]/10 p-2.5 rounded-lg flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Notifications will automatically be dispatched to the {absentCount} absent students.
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 font-medium rounded-xl text-xs hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAttendance}
                className="flex-1 py-2.5 bg-[#73AFA0] hover:bg-[#5c9386] text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Attendance Detail History Drawer */}
      {viewStudentHistory && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#D1E5E1] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={viewStudentHistory.avatar}
                  alt={viewStudentHistory.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{viewStudentHistory.name}</h3>
                  <p className="text-xs text-neutral-500">{viewStudentHistory.studentId} • {viewStudentHistory.department}</p>
                </div>
              </div>
              <button
                onClick={() => setViewStudentHistory(null)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#E8F2F0]/40 p-4 rounded-xl border border-[#D1E5E1] flex justify-between items-center">
              <div>
                <span className="text-xs text-neutral-500">Overall Attendance Rate</span>
                <h4 className="text-2xl font-bold text-[#73AFA0]">{viewStudentHistory.attendancePercentage}%</h4>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                viewStudentHistory.attendancePercentage >= 75 ? 'bg-[#2E9D68]/20 text-[#2E9D68]' : 'bg-[#D94F4F]/20 text-[#D94F4F]'
              }`}>
                {viewStudentHistory.attendancePercentage >= 75 ? 'Satisfactory' : 'Below 75% Threshold'}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#73AFA0]" /> Recent Session Audit Trail
              </h4>
              <div className="max-h-48 overflow-y-auto divide-y divide-neutral-100 text-xs border rounded-xl">
                {attendanceRecords
                  .filter(r => r.studentId === viewStudentHistory.id)
                  .map(rec => (
                    <div key={rec.id} className="p-2.5 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="font-semibold text-neutral-800">{rec.subjectName}</span>
                        <span className="text-[10px] text-neutral-400 block">{rec.date} ({rec.sessionType})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                        rec.status === 'present' ? 'bg-[#2E9D68]/15 text-[#2E9D68]' : 'bg-[#D94F4F]/15 text-[#D94F4F]'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={() => setViewStudentHistory(null)}
              className="w-full py-2 bg-neutral-100 text-neutral-700 font-medium rounded-xl text-xs hover:bg-neutral-200 transition-colors"
            >
              Close History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
