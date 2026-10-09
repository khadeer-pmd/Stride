import type { StudentProfile, User, SystemMetrics, SupportRequest, Intervention, AttendanceRecord, AppNotification } from '../types/academic';
import { calculateRiskAssessment } from '../lib/riskEngine';

export const MOCK_USERS: User[] = [
  {
    id: 'user-student-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@stride.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-faculty-1',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@stride.edu',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    title: 'Associate Professor & Academic Mentor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-admin-1',
    name: 'Dean Robert Vance',
    email: 'r.vance@stride.edu',
    role: 'admin',
    department: 'Academic Affairs',
    title: 'Dean of Undergraduate Studies',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
  }
];

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  // Alex Rivera Oct 2026 attendance
  { id: 'att-101', studentId: 'std-101', studentName: 'Alex Rivera', className: 'CS-5A', subjectName: 'Mathematics & Calculus III', subjectCode: 'MATH301', date: '2026-10-01', status: 'present', sessionPeriod: '09:00 AM - 10:00 AM', facultyName: 'Prof. David Miller' },
  { id: 'att-102', studentId: 'std-101', studentName: 'Alex Rivera', className: 'CS-5A', subjectName: 'Data Structures & Algorithms', subjectCode: 'CS302', date: '2026-10-02', status: 'present', sessionPeriod: '10:15 AM - 11:15 AM', facultyName: 'Dr. Sarah Jenkins' },
  { id: 'att-103', studentId: 'std-101', studentName: 'Alex Rivera', className: 'CS-5A', subjectName: 'Mathematics & Calculus III', subjectCode: 'MATH301', date: '2026-10-05', status: 'absent', sessionPeriod: '09:00 AM - 10:00 AM', facultyName: 'Prof. David Miller', remarks: 'Unexcused absence' },
  { id: 'att-104', studentId: 'std-101', studentName: 'Alex Rivera', className: 'CS-5A', subjectName: 'Operating Systems', subjectCode: 'CS304', date: '2026-10-06', status: 'present', sessionPeriod: '11:30 AM - 12:30 PM', facultyName: 'Prof. Alan Vance' },
  { id: 'att-105', studentId: 'std-101', studentName: 'Alex Rivera', className: 'CS-5A', subjectName: 'Computer Networks', subjectCode: 'CS306', date: '2026-10-07', status: 'late', sessionPeriod: '02:00 PM - 03:00 PM', facultyName: 'Dr. Helen Carter', remarks: 'Arrived 15 mins late' },
  { id: 'att-106', studentId: 'std-101', studentName: 'Alex Rivera', className: 'CS-5A', subjectName: 'Mathematics & Calculus III', subjectCode: 'MATH301', date: '2026-10-08', status: 'present', sessionPeriod: '09:00 AM - 10:00 AM', facultyName: 'Prof. David Miller' },
  { id: 'att-107', studentId: 'std-101', studentName: 'Alex Rivera', className: 'CS-5A', subjectName: 'Data Structures & Algorithms', subjectCode: 'CS302', date: '2026-10-09', status: 'present', sessionPeriod: '10:15 AM - 11:15 AM', facultyName: 'Dr. Sarah Jenkins' },
  { id: 'att-108', studentId: 'std-101', studentName: 'Alex Rivera', className: 'CS-5A', subjectName: 'General University Holiday', subjectCode: 'HOLIDAY', date: '2026-10-11', status: 'holiday', facultyName: 'Institution' },

  // Liam Patel Oct 2026 attendance
  { id: 'att-201', studentId: 'std-103', studentName: 'Liam Patel', className: 'CS-5A', subjectName: 'Data Structures & Algorithms', subjectCode: 'CS302', date: '2026-10-01', status: 'absent', sessionPeriod: '10:15 AM - 11:15 AM', facultyName: 'Dr. Sarah Jenkins' },
  { id: 'att-202', studentId: 'std-103', studentName: 'Liam Patel', className: 'CS-5A', subjectName: 'Data Structures & Algorithms', subjectCode: 'CS302', date: '2026-10-05', status: 'absent', sessionPeriod: '10:15 AM - 11:15 AM', facultyName: 'Dr. Sarah Jenkins' },
  { id: 'att-203', studentId: 'std-103', studentName: 'Liam Patel', className: 'CS-5A', subjectName: 'Operating Systems', subjectCode: 'CS304', date: '2026-10-06', status: 'late', sessionPeriod: '11:30 AM - 12:30 PM', facultyName: 'Prof. Alan Vance' }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'std-101',
    title: 'Attendance Updated',
    message: 'Your attendance for Data Structures & Algorithms on Oct 9, 2026 was marked Present.',
    category: 'attendance',
    date: '2026-10-09',
    read: false,
    linkTab: 'attendance',
    subjectName: 'Data Structures & Algorithms'
  },
  {
    id: 'notif-2',
    userId: 'std-101',
    title: 'Attendance Alert',
    message: 'Your attendance for Mathematics on Oct 5, 2026 was marked Absent. Contact your faculty if incorrect.',
    category: 'attendance',
    date: '2026-10-05',
    read: false,
    linkTab: 'attendance',
    subjectName: 'Mathematics'
  },
  {
    id: 'notif-3',
    userId: 'std-101',
    title: 'Your STRIDE Study Guide Is Ready',
    message: 'Personalized revision recommendations updated based on Midterm 2 results.',
    category: 'study_guide',
    date: '2026-10-06',
    read: true,
    linkTab: 'study-guide'
  }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'std-101',
    name: 'Alex Rivera',
    studentId: 'CS2026-084',
    department: 'Computer Science',
    semester: 5,
    email: 'alex.rivera@stride.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    academicAverage: 71,
    attendancePercentage: 84,
    completedAssignments: 14,
    pendingAssignments: 3,
    totalAssignments: 17,
    goalsAchieved: 8,
    assignedMentor: 'Dr. Sarah Jenkins',
    attendanceRecords: MOCK_ATTENDANCE_RECORDS.filter(a => a.studentId === 'std-101'),
    subjects: [
      {
        subjectId: 'sub-math',
        subjectName: 'Mathematics & Calculus III',
        code: 'MATH301',
        currentScore: 58,
        previousScore: 69,
        trend: 'declining',
        attendance: 78,
        instructorName: 'Prof. David Miller',
        suggestedAction: 'Revisiting the basics and practicing 5 differential problems each day may help.',
        topicsToReview: ['Differential Equations', 'Vector Calculus', 'Matrix Transformations']
      },
      {
        subjectId: 'sub-dsa',
        subjectName: 'Data Structures & Algorithms',
        code: 'CS302',
        currentScore: 78,
        previousScore: 75,
        trend: 'improving',
        attendance: 88,
        instructorName: 'Dr. Sarah Jenkins',
        suggestedAction: 'Solid performance. Continue daily binary tree traversal practice.',
        topicsToReview: ['Graph Algorithms', 'Dynamic Programming']
      },
      {
        subjectId: 'sub-os',
        subjectName: 'Operating Systems',
        code: 'CS304',
        currentScore: 72,
        previousScore: 74,
        trend: 'stable',
        attendance: 85,
        instructorName: 'Prof. Alan Vance',
        suggestedAction: 'Review process synchronization notes before next lab quiz.',
        topicsToReview: ['Deadlocks', 'Virtual Memory Management']
      },
      {
        subjectId: 'sub-cn',
        subjectName: 'Computer Networks',
        code: 'CS306',
        currentScore: 76,
        previousScore: 72,
        trend: 'improving',
        attendance: 87,
        instructorName: 'Dr. Helen Carter',
        suggestedAction: 'Good progress on TCP/IP protocol stack assignments.',
        topicsToReview: ['Subnetting', 'Routing Algorithms']
      }
    ],
    assessments: [
      { id: 'asm-1', name: 'Quiz 1: Limits & Vectors', subjectId: 'sub-math', subjectName: 'Mathematics', score: 86, maxScore: 100, date: '2026-08-15', type: 'Quiz' },
      { id: 'asm-2', name: 'Midterm 1: Integration', subjectId: 'sub-math', subjectName: 'Mathematics', score: 78, maxScore: 100, date: '2026-09-02', type: 'Midterm' },
      { id: 'asm-3', name: 'Quiz 2: Partial Derivatives', subjectId: 'sub-math', subjectName: 'Mathematics', score: 69, maxScore: 100, date: '2026-09-20', type: 'Quiz' },
      { id: 'asm-4', name: 'Midterm 2: Differential Equations', subjectId: 'sub-math', subjectName: 'Mathematics', score: 58, maxScore: 100, date: '2026-10-04', type: 'Midterm' },
      { id: 'asm-5', name: 'DSA Midterm Exam', subjectId: 'sub-dsa', subjectName: 'Data Structures', score: 78, maxScore: 100, date: '2026-09-25', type: 'Midterm' }
    ],
    studyTasks: [
      { id: 'task-1', title: 'Revise Mathematics vector calculus notes', subjectName: 'Mathematics', durationMinutes: 25, completed: false, priority: 'high', category: 'revision', dueDate: 'Today' },
      { id: 'task-2', title: 'Practice 5 graph traversal algorithms in Python', subjectName: 'Data Structures', durationMinutes: 30, completed: true, priority: 'medium', category: 'practice', dueDate: 'Today' },
      { id: 'task-3', title: 'Read Operating Systems thread safety chapter', subjectName: 'Operating Systems', durationMinutes: 20, completed: false, priority: 'low', category: 'reading', dueDate: 'Tomorrow' },
      { id: 'task-4', title: 'Complete Computer Networks Wireshark assignment draft', subjectName: 'Computer Networks', durationMinutes: 45, completed: false, priority: 'high', category: 'assignment', dueDate: 'Oct 12' }
    ],
    riskAssessment: calculateRiskAssessment(71, [
      { id: 'asm-1', name: 'Quiz 1', subjectId: 'sub-math', subjectName: 'Mathematics', score: 86, maxScore: 100, date: '2026-08-15', type: 'Quiz' },
      { id: 'asm-2', name: 'Midterm 1', subjectId: 'sub-math', subjectName: 'Mathematics', score: 78, maxScore: 100, date: '2026-09-02', type: 'Midterm' },
      { id: 'asm-3', name: 'Quiz 2', subjectId: 'sub-math', subjectName: 'Mathematics', score: 69, maxScore: 100, date: '2026-09-20', type: 'Quiz' },
      { id: 'asm-4', name: 'Midterm 2', subjectId: 'sub-math', subjectName: 'Mathematics', score: 58, maxScore: 100, date: '2026-10-04', type: 'Midterm' }
    ], 84, 14, 17),
    interventions: [
      {
        id: 'int-101',
        studentId: 'std-101',
        studentName: 'Alex Rivera',
        subjectName: 'Mathematics & Calculus III',
        type: 'Remedial Session',
        status: 'In Progress',
        assignedBy: 'Dr. Sarah Jenkins',
        mentorName: 'Prof. David Miller',
        startDate: '2026-10-05',
        followUpDate: '2026-10-18',
        notes: 'Scheduled 2 weekly problem-solving lab sessions focused on calculus fundamentals.',
        scoreBefore: 58
      }
    ]
  },
  {
    id: 'std-102',
    name: 'Maya Chen',
    studentId: 'CS2026-012',
    department: 'Computer Science',
    semester: 5,
    email: 'maya.chen@stride.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    academicAverage: 92,
    attendancePercentage: 98,
    completedAssignments: 17,
    pendingAssignments: 0,
    totalAssignments: 17,
    goalsAchieved: 14,
    assignedMentor: 'Dr. Sarah Jenkins',
    attendanceRecords: [],
    subjects: [
      { subjectId: 'sub-math', subjectName: 'Mathematics', code: 'MATH301', currentScore: 94, previousScore: 92, trend: 'improving', attendance: 98, instructorName: 'Prof. David Miller', suggestedAction: 'Outstanding progress! Keep exploring advanced optional problem sets.', topicsToReview: [] },
      { subjectId: 'sub-dsa', subjectName: 'Data Structures', code: 'CS302', currentScore: 91, previousScore: 90, trend: 'improving', attendance: 99, instructorName: 'Dr. Sarah Jenkins', suggestedAction: 'Excellent depth of understanding in competitive programming.', topicsToReview: [] }
    ],
    assessments: [
      { id: 'm-1', name: 'Calculus Midterm', subjectId: 'sub-math', subjectName: 'Mathematics', score: 94, maxScore: 100, date: '2026-09-28', type: 'Midterm' }
    ],
    studyTasks: [],
    riskAssessment: calculateRiskAssessment(92, [], 98, 17, 17),
    interventions: []
  },
  {
    id: 'std-103',
    name: 'Liam Patel',
    studentId: 'CS2026-115',
    department: 'Computer Science',
    semester: 5,
    email: 'liam.patel@stride.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    academicAverage: 54,
    attendancePercentage: 68,
    completedAssignments: 10,
    pendingAssignments: 6,
    totalAssignments: 16,
    goalsAchieved: 3,
    assignedMentor: 'Dr. Sarah Jenkins',
    attendanceRecords: MOCK_ATTENDANCE_RECORDS.filter(a => a.studentId === 'std-103'),
    subjects: [
      { subjectId: 'sub-dsa', subjectName: 'Data Structures & Algorithms', code: 'CS302', currentScore: 48, previousScore: 55, trend: 'declining', attendance: 65, instructorName: 'Dr. Sarah Jenkins', suggestedAction: 'Attendance check-in recommended. Needs help with recursive tree problems.', topicsToReview: ['Binary Search Trees', 'Recursion'] },
      { subjectId: 'sub-os', subjectName: 'Operating Systems', code: 'CS304', currentScore: 58, previousScore: 60, trend: 'declining', attendance: 70, instructorName: 'Prof. Alan Vance', suggestedAction: 'Assignment completion support needed.', topicsToReview: ['Memory Paging'] }
    ],
    assessments: [
      { id: 'l-1', name: 'DSA Midterm', subjectId: 'sub-dsa', subjectName: 'Data Structures', score: 48, maxScore: 100, date: '2026-09-22', type: 'Midterm' }
    ],
    studyTasks: [],
    riskAssessment: calculateRiskAssessment(54, [
      { id: 'l-1', name: 'DSA Midterm', subjectId: 'sub-dsa', subjectName: 'Data Structures', score: 55, maxScore: 100, date: '2026-09-01', type: 'Midterm' },
      { id: 'l-2', name: 'DSA Quiz 2', subjectId: 'sub-dsa', subjectName: 'Data Structures', score: 48, maxScore: 100, date: '2026-09-22', type: 'Quiz' }
    ], 68, 10, 16),
    interventions: [
      {
        id: 'int-102',
        studentId: 'std-103',
        studentName: 'Liam Patel',
        subjectName: 'Data Structures & Algorithms',
        type: 'Faculty Mentoring',
        status: 'Pending',
        assignedBy: 'Dr. Sarah Jenkins',
        mentorName: 'Dr. Sarah Jenkins',
        startDate: '2026-10-08',
        followUpDate: '2026-10-20',
        notes: 'Initial 1-on-1 academic review to organize catch-up study schedule.',
        scoreBefore: 48
      }
    ]
  },
  {
    id: 'std-104',
    name: 'Priya Sharma',
    studentId: 'CS2026-049',
    department: 'Computer Science',
    semester: 5,
    email: 'priya.sharma@stride.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    academicAverage: 81,
    attendancePercentage: 91,
    completedAssignments: 15,
    pendingAssignments: 1,
    totalAssignments: 16,
    goalsAchieved: 11,
    assignedMentor: 'Dr. Sarah Jenkins',
    attendanceRecords: [],
    subjects: [
      { subjectId: 'sub-math', subjectName: 'Mathematics', code: 'MATH301', currentScore: 82, previousScore: 68, trend: 'improving', attendance: 92, instructorName: 'Prof. David Miller', suggestedAction: 'Remarkable recovery following attendance at math workshops!', topicsToReview: [] },
      { subjectId: 'sub-os', subjectName: 'Operating Systems', code: 'CS304', currentScore: 80, previousScore: 78, trend: 'improving', attendance: 90, instructorName: 'Prof. Alan Vance', suggestedAction: 'Solid steady progress.', topicsToReview: [] }
    ],
    assessments: [
      { id: 'p-1', name: 'Calculus Quiz 1', subjectId: 'sub-math', subjectName: 'Mathematics', score: 62, maxScore: 100, date: '2026-08-20', type: 'Quiz' },
      { id: 'p-2', name: 'Calculus Midterm', subjectId: 'sub-math', subjectName: 'Mathematics', score: 74, maxScore: 100, date: '2026-09-15', type: 'Midterm' },
      { id: 'p-3', name: 'Calculus Quiz 2', subjectId: 'sub-math', subjectName: 'Mathematics', score: 82, maxScore: 100, date: '2026-10-02', type: 'Quiz' }
    ],
    studyTasks: [],
    riskAssessment: calculateRiskAssessment(81, [], 91, 15, 16),
    interventions: [
      {
        id: 'int-103',
        studentId: 'std-104',
        studentName: 'Priya Sharma',
        subjectName: 'Mathematics & Calculus III',
        type: 'Remedial Session',
        status: 'Completed',
        assignedBy: 'Dr. Sarah Jenkins',
        mentorName: 'Prof. David Miller',
        startDate: '2026-08-25',
        followUpDate: '2026-10-03',
        notes: 'Attended 4 remedial math problem workshops. Score increased from 62% to 82%.',
        scoreBefore: 62,
        scoreAfter: 82,
        outcome: 'Measurable Improvement (+20%)'
      }
    ]
  }
];

export const MOCK_SUPPORT_REQUESTS: SupportRequest[] = [
  {
    id: 'req-1',
    studentId: 'std-101',
    studentName: 'Alex Rivera',
    subjectName: 'Mathematics & Calculus III',
    issueCategory: 'subject_difficulty',
    description: "I'm finding differential equations concepts challenging after Midterm 2 and would love guidance on extra practice problems.",
    preferredFacultyName: 'Prof. David Miller',
    status: 'Scheduled',
    createdAt: '2026-10-06'
  }
];

export const INITIAL_METRICS: SystemMetrics = {
  totalStudents: 342,
  avgAcademicPerformance: 76.4,
  avgAttendance: 87.2,
  studentsNeedingReview: 28,
  lowRiskCount: 264,
  mediumRiskCount: 54,
  highRiskCount: 24,
  openInterventions: 18,
  completedInterventions: 42
};
