import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/RiskBadge';
import type { StudentProfile } from '../../types/academic';
import { calculateRiskAssessment } from '../../lib/riskEngine';
import { Search, FileSpreadsheet, Upload, CheckCircle2, AlertTriangle, User } from 'lucide-react';

export const StudentDirectory: React.FC = () => {
  const { students, importStudentsFromCsv } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvText, setCsvText] = useState(
`Name,StudentId,Department,Semester,Email,Average,Attendance
Carlos Gomez,CS2026-099,Computer Science,5,carlos.g@stride.edu,88,94
Sofia Rossi,CS2026-104,Computer Science,5,sofia.r@stride.edu,64,76`
  );
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProcessCsv = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) {
        setImportStatus('CSV must contain a header row and at least 1 student row.');
        return;
      }

      const newProfiles: StudentProfile[] = [];
      const rows = lines.slice(1);

      rows.forEach((row, i) => {
        const cols = row.split(',').map(c => c.trim());
        if (cols.length >= 7) {
          const [name, studentId, department, semesterStr, email, avgStr, attStr] = cols;
          const avg = Number(avgStr) || 75;
          const att = Number(attStr) || 85;

          const profile: StudentProfile = {
            id: `std-csv-${Date.now()}-${i}`,
            name,
            studentId,
            department,
            semester: Number(semesterStr) || 5,
            email,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            academicAverage: avg,
            attendancePercentage: att,
            completedAssignments: 12,
            pendingAssignments: 2,
            totalAssignments: 14,
            goalsAchieved: 5,
            assignedMentor: 'Dr. Sarah Jenkins',
            subjects: [
              { subjectId: 'sub-math', subjectName: 'Mathematics', code: 'MATH301', currentScore: avg, previousScore: avg, trend: 'stable', attendance: att, instructorName: 'Prof. David Miller', suggestedAction: 'Maintain current steady practice.', topicsToReview: [] }
            ],
            assessments: [
              { id: `asm-csv-${i}`, name: 'Quiz 1', subjectId: 'sub-math', subjectName: 'Mathematics', score: avg, maxScore: 100, date: '2026-09-30', type: 'Quiz' }
            ],
            studyTasks: [],
            riskAssessment: calculateRiskAssessment(avg, [], att, 12, 14),
            interventions: []
          };
          newProfiles.push(profile);
        }
      });

      if (newProfiles.length > 0) {
        importStudentsFromCsv(newProfiles);
        setImportStatus(`Successfully imported ${newProfiles.length} student records!`);
        setTimeout(() => {
          setShowCsvModal(false);
          setImportStatus(null);
        }, 1500);
      } else {
        setImportStatus('No valid rows found. Please check CSV formatting.');
      }
    } catch (err) {
      setImportStatus('Failed to parse CSV string.');
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#D1E5E1] text-[#3B6E63] text-xs font-bold uppercase tracking-wider">
            STUDENT DIRECTORY
          </span>
          <h2 className="text-2xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-2 mb-1">
            Institutional Student Directory
          </h2>
          <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
            Search, filter, and batch-import student academic profiles.
          </p>
        </div>

        <button
          onClick={() => setShowCsvModal(true)}
          className="px-5 py-2.5 bg-[#73AFA0] hover:bg-[#5d9889] text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Batch CSV Import</span>
        </button>
      </div>

      {/* Search & Directory Table */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, department..."
              className="pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-[#25302C] border border-gray-200 dark:border-gray-700 text-xs w-full"
            />
          </div>
          <span className="text-xs text-[#777F7B]">Showing {filtered.length} students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-[#777F7B]">
                <th className="pb-3 font-semibold">Student</th>
                <th className="pb-3 font-semibold">ID</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Semester</th>
                <th className="pb-3 font-semibold">Academic Avg</th>
                <th className="pb-3 font-semibold">Attendance</th>
                <th className="pb-3 font-semibold text-right">STRIDE Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((st) => (
                <tr key={st.id} className="hover:bg-gray-50 dark:hover:bg-[#25302C]">
                  <td className="py-3 font-bold text-[#202421] dark:text-[#F0F4F2] flex items-center gap-2">
                    <img src={st.avatar} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <span>{st.name}</span>
                      <span className="block text-[10px] text-gray-400 font-normal">{st.email}</span>
                    </div>
                  </td>
                  <td className="py-3 text-[#777F7B] font-mono">{st.studentId}</td>
                  <td className="py-3 text-[#777F7B]">{st.department}</td>
                  <td className="py-3 text-[#777F7B]">Sem {st.semester}</td>
                  <td className="py-3 font-extrabold text-[#202421] dark:text-[#F0F4F2]">{st.academicAverage}%</td>
                  <td className="py-3 text-[#777F7B]">{st.attendancePercentage}%</td>
                  <td className="py-3 text-right">
                    <RiskBadge category={st.riskAssessment.category} score={st.riskAssessment.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#1A2220] rounded-3xl max-w-lg w-full p-6 border border-[#E9EEEB] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#202421] dark:text-[#F0F4F2]">Batch CSV Student Import</h3>
            <p className="text-xs text-[#777F7B]">
              Paste comma-separated student records with headers: Name, StudentId, Department, Semester, Email, Average, Attendance.
            </p>

            <form onSubmit={handleProcessCsv} className="space-y-4">
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full p-3 font-mono text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C]"
              />

              {importStatus && (
                <div className="p-3 bg-[#D1E5E1] text-[#3B6E63] text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{importStatus}</span>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCsvModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#73AFA0] text-white hover:bg-[#5d9889]"
                >
                  Validate & Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
