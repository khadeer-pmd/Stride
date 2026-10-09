export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  title?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'holiday' | 'unrecorded';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  className?: string;
  subjectName: string;
  subjectCode?: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  sessionType?: string;
  sessionPeriod?: string;
  markedBy?: string;
  facultyName?: string;
  notes?: string;
  remarks?: string;
  createdAt?: string;
}

export interface AttendanceCorrection {
  id: string;
  recordId: string;
  studentId: string;
  previousStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  reason: string;
  correctedBy: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type?: 'attendance' | 'warning' | 'academic' | 'system';
  category?: string;
  timestamp?: string;
  date?: string;
  read: boolean;
  link?: string;
  linkTab?: string;
  subjectName?: string;
}

export interface StudyGuideRecommendation {
  id: string;
  studentId: string;
  overallSummary: string;
  subjectsNeedingAttention: string[];
  strongSubjects: string[];
  recommendedTopics: string[];
  suggestedRevisionSessions: { title: string; duration: number; subject: string }[];
  recommendedNextAction: string;
  lastUpdated: string;
}

export interface Assessment {
  id: string;
  name: string;
  subjectId: string;
  subjectName: string;
  score: number;
  maxScore: number;
  date: string;
  type: 'Quiz' | 'Midterm' | 'Assignment' | 'Final' | 'Lab';
}

export interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  code: string;
  currentScore: number;
  previousScore: number;
  trend: 'improving' | 'stable' | 'declining';
  attendance: number;
  instructorName: string;
  suggestedAction: string;
  topicsToReview: string[];
}

export interface StudyTask {
  id: string;
  title: string;
  subjectName: string;
  durationMinutes: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'revision' | 'practice' | 'assignment' | 'reading';
  dueDate: string;
}

export interface RiskFactors {
  performanceRisk: number;
  declineRisk: number;
  attendanceRisk: number;
  assignmentRisk: number;
}

export interface RiskAssessment {
  score: number;
  category: 'Low' | 'Medium' | 'High';
  factors: RiskFactors;
  explanation: string;
  hasMissingData: boolean;
  silentStruggleDetected: boolean;
  lastUpdated: string;
}

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  type: 'Faculty Mentoring' | 'Remedial Session' | 'Practice Plan' | 'Assignment Catch-Up' | 'Attendance Check-In';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Needs Review';
  assignedBy: string;
  mentorName: string;
  startDate: string;
  followUpDate: string;
  notes: string;
  scoreBefore?: number;
  scoreAfter?: number;
  outcome?: string;
}

export interface SupportRequest {
  id: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  issueCategory: 'subject_difficulty' | 'falling_behind' | 'teacher_guidance' | 'general';
  description: string;
  preferredFacultyName?: string;
  status: 'Open' | 'In Review' | 'Scheduled' | 'Resolved';
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  studentId: string;
  department: string;
  semester: number;
  email: string;
  avatar: string;
  academicAverage: number;
  attendancePercentage: number;
  completedAssignments: number;
  pendingAssignments: number;
  totalAssignments: number;
  goalsAchieved: number;
  assignedMentor: string;
  subjects: SubjectPerformance[];
  assessments: Assessment[];
  studyTasks: StudyTask[];
  riskAssessment: RiskAssessment;
  interventions: Intervention[];
  attendanceRecords?: AttendanceRecord[];
}

export interface SystemMetrics {
  totalStudents: number;
  avgAcademicPerformance: number;
  avgAttendance: number;
  studentsNeedingReview: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  openInterventions: number;
  completedInterventions: number;
}
