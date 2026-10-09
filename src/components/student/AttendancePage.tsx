import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  AlertCircle,
  Filter,
  Check,
  Send,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AttendanceStatus, AttendanceRecord } from '../../types/academic';

export const AttendancePage: React.FC = () => {
  const { currentStudent, attendanceRecords, addToast } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Oct 2026 default
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDateRecords, setSelectedDateRecords] = useState<{ date: string; records: AttendanceRecord[] } | null>(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [submittingCorrection, setSubmittingCorrection] = useState(false);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Filter attendance records for current student & subject
  const studentRecords = attendanceRecords.filter(r => r.studentId === currentStudent.id);

  const filteredRecords = studentRecords.filter(r => {
    if (selectedSubject !== 'All' && r.subjectName !== selectedSubject) return false;
    return true;
  });

  // Calculate Monthly Statistics
  const monthString = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthlyRecords = filteredRecords.filter(r => r.date.startsWith(monthString));

  const conductedMonthly = monthlyRecords.filter(r => r.status !== 'holiday' && r.status !== 'unrecorded');
  const attendedMonthly = conductedMonthly.filter(r => r.status === 'present' || r.status === 'late');
  const monthlyPercentage = conductedMonthly.length > 0 
    ? Math.round((attendedMonthly.length / conductedMonthly.length) * 100)
    : 100;

  // Calendar Grid construction
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const daysArray = [];
  // Empty slots before 1st of month
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  // Days 1 to N
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const getRecordsForDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredRecords.filter(r => r.date === formattedDate);
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-[#2E9D68]/15 border-[#2E9D68]/40 text-[#2E9D68]';
      case 'absent':
        return 'bg-[#D94F4F]/15 border-[#D94F4F]/40 text-[#D94F4F]';
      case 'late':
        return 'bg-[#E9B95F]/15 border-[#E9B95F]/40 text-[#b5862d]';
      case 'leave':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'holiday':
        return 'bg-neutral-100 border-neutral-200 text-neutral-400';
      case 'unrecorded':
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-400';
    }
  };

  const handleRequestCorrection = (record: AttendanceRecord) => {
    if (!correctionReason.trim()) {
      addToast('Please enter a reason for the correction request.', 'error');
      return;
    }
    setSubmittingCorrection(true);
    setTimeout(() => {
      addToast(`Attendance correction request submitted to ${record.markedBy || 'Faculty'}.`, 'success');
      setCorrectionReason('');
      setSubmittingCorrection(false);
      setSelectedDateRecords(null);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#D1E5E1] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#73AFA0]" />
            <h1 className="text-2xl font-bold text-neutral-900">Monthly Attendance Calendar</h1>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Track daily lecture attendance, verify monthly percentages, and submit correction requests.
          </p>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 bg-[#E8F2F0] border border-[#D1E5E1] rounded-xl text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#73AFA0]"
          >
            <option value="All">All Subjects</option>
            {currentStudent.subjects.map(s => (
              <option key={s.subjectId} value={s.subjectName}>{s.subjectName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D1E5E1] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Overall Semester</span>
            <Sparkles className="w-4 h-4 text-[#73AFA0]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-neutral-900">{currentStudent.attendancePercentage}%</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              currentStudent.attendancePercentage >= 75 ? 'bg-[#2E9D68]/20 text-[#2E9D68]' : 'bg-[#D94F4F]/20 text-[#D94F4F]'
            }`}>
              {currentStudent.attendancePercentage >= 75 ? 'Good' : 'Low Warning'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Required minimum threshold: 75%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D1E5E1] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{monthNames[month]} Rate</span>
            <CheckCircle2 className="w-4 h-4 text-[#2E9D68]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#73AFA0]">{monthlyPercentage}%</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">{attendedMonthly.length} of {conductedMonthly.length} sessions attended</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D1E5E1] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Conducted Sessions</span>
            <Clock className="w-4 h-4 text-[#E9B95F]" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-neutral-800">{conductedMonthly.length}</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Excludes holidays & unrecorded days</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D1E5E1] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Absences ({monthNames[month]})</span>
            <XCircle className="w-4 h-4 text-[#D94F4F]" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-[#D94F4F]">
              {conductedMonthly.filter(r => r.status === 'absent').length}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Click date box to request correction</p>
        </div>
      </div>

      {/* Main Calendar View */}
      <div className="bg-white rounded-2xl border border-[#D1E5E1] shadow-sm p-6 space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-neutral-800">
              {monthNames[month]} {year}
            </h2>
            <span className="px-3 py-1 bg-[#D1E5E1]/50 text-[#73AFA0] text-xs font-medium rounded-full">
              {selectedSubject}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 bg-neutral-100 hover:bg-[#D1E5E1]/50 rounded-xl transition-colors text-neutral-700"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 bg-neutral-100 hover:bg-[#D1E5E1]/50 rounded-xl transition-colors text-neutral-700"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-neutral-100">
          <span className="font-semibold text-neutral-600">Status Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#2E9D68]" />
            <span className="text-neutral-600">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#D94F4F]" />
            <span className="text-neutral-600">Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#E9B95F]" />
            <span className="text-neutral-600">Late</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-neutral-600">Leave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-neutral-300" />
            <span className="text-neutral-600">Holiday/Weekend</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {/* Weekday Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
            <div key={dayName} className="text-center text-xs font-semibold text-neutral-500 py-2 uppercase">
              {dayName}
            </div>
          ))}

          {/* Days */}
          {daysArray.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-20 sm:h-24 bg-neutral-50/50 rounded-xl border border-transparent" />;
            }

            const dayRecords = getRecordsForDay(day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={`day-${day}`}
                onClick={() => {
                  if (dayRecords.length > 0) {
                    setSelectedDateRecords({ date: dateStr, records: dayRecords });
                  }
                }}
                className={`h-20 sm:h-24 p-2 rounded-xl border transition-all flex flex-col justify-between ${
                  dayRecords.length > 0 ? 'cursor-pointer hover:shadow-md hover:border-[#73AFA0]' : ''
                } ${isToday ? 'border-[#73AFA0] bg-[#E8F2F0]/30 font-bold' : 'border-neutral-200 bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isToday ? 'text-[#73AFA0]' : 'text-neutral-700'}`}>
                    {day}
                  </span>
                  {dayRecords.length > 0 && (
                    <span className="text-[10px] text-neutral-400 font-normal">
                      {dayRecords.length} {dayRecords.length === 1 ? 'class' : 'classes'}
                    </span>
                  )}
                </div>

                {/* Status Badges */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayRecords.slice(0, 2).map((rec, rIdx) => (
                    <div
                      key={rIdx}
                      className={`text-[10px] px-1.5 py-0.5 rounded border truncate capitalize ${getStatusColor(rec.status)}`}
                    >
                      {rec.subjectName.split(' ')[0]}: {rec.status}
                    </div>
                  ))}
                  {dayRecords.length > 2 && (
                    <span className="text-[9px] text-neutral-400 block text-right">
                      +{dayRecords.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Detail Drawer / Modal */}
      {selectedDateRecords && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#D1E5E1] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Attendance Details for {selectedDateRecords.date}
                </h3>
                <p className="text-xs text-neutral-500">Subject records and status audit</p>
              </div>
              <button
                onClick={() => setSelectedDateRecords(null)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedDateRecords.records.map((rec) => (
                <div key={rec.id} className="p-3.5 bg-[#E8F2F0]/40 rounded-xl border border-[#D1E5E1] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-neutral-800">{rec.subjectName}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border capitalize font-semibold ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-600 flex items-center justify-between">
                    <span>Session: {rec.sessionType}</span>
                    <span>Marked by: {rec.markedBy}</span>
                  </div>
                  {rec.notes && (
                    <p className="text-xs text-neutral-500 italic bg-white p-2 rounded-lg border border-neutral-100">
                      Notes: {rec.notes}
                    </p>
                  )}

                  {rec.status === 'absent' && (
                    <div className="pt-2 border-t border-neutral-200/60 mt-2 space-y-2">
                      <span className="text-xs font-semibold text-[#D94F4F] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Request Attendance Correction
                      </span>
                      <textarea
                        value={correctionReason}
                        onChange={(e) => setCorrectionReason(e.target.value)}
                        placeholder="State your reason (e.g. Medical emergency, technical issue)..."
                        className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#73AFA0]"
                        rows={2}
                      />
                      <button
                        onClick={() => handleRequestCorrection(rec)}
                        disabled={submittingCorrection}
                        className="w-full text-xs font-semibold py-1.5 bg-[#73AFA0] text-white rounded-lg hover:bg-[#5c9386] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Submit Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedDateRecords(null)}
              className="w-full py-2.5 bg-neutral-100 text-neutral-700 font-medium rounded-xl text-sm hover:bg-neutral-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
