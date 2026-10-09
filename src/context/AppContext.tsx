import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserRole, 
  StudentProfile, 
  Intervention, 
  SupportRequest, 
  SystemMetrics, 
  StudyTask, 
  User,
  AttendanceRecord,
  AppNotification
} from '../types/academic';
import { 
  INITIAL_STUDENTS, 
  MOCK_USERS, 
  MOCK_SUPPORT_REQUESTS, 
  INITIAL_METRICS,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_NOTIFICATIONS
} from '../data/mockData';
import { calculateRiskAssessment } from '../lib/riskEngine';
import { 
  getStudentsFromDb, 
  saveTaskToDb, 
  updateTaskStatusInDb, 
  saveAssessmentToDb, 
  saveInterventionToDb,
  saveAttendanceRecordsToDb,
  saveNotificationToDb,
  markNotificationAsReadInDb
} from '../services/dbService';
import confetti from 'canvas-confetti';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  currentUser: User;
  login: (role: UserRole, studentId?: string) => void;
  logout: () => void;
  students: StudentProfile[];
  currentStudent: StudentProfile;
  setCurrentStudentId: (id: string) => void;
  metrics: SystemMetrics;
  interventions: Intervention[];
  attendanceRecords: AttendanceRecord[];
  notifications: AppNotification[];
  isLiveDb: boolean;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addStudyTask: (task: Omit<StudyTask, 'id'>) => void;
  createIntervention: (intervention: Omit<Intervention, 'id' | 'startDate'>) => void;
  recordAssessmentMark: (studentId: string, subjectId: string, score: number, name: string) => void;
  markAttendanceBatch: (newRecords: Omit<AttendanceRecord, 'id' | 'createdAt'>[]) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  importStudentsFromCsv: (newStudents: StudentProfile[]) => void;
  updateUserProfile: (name: string, email: string, department: string) => void;
  loadDemoScenario: (scenario: 'silent_struggle' | 'high_risk' | 'recovery' | 'reset') => void;
  showWalkthrough: boolean;
  setShowWalkthrough: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);

  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [currentStudentId, setCurrentStudentId] = useState<string>('std-101');
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE_RECORDS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [showWalkthrough, setShowWalkthrough] = useState<boolean>(false);
  const [isLiveDb, setIsLiveDb] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Ensure Light Mode ONLY
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('stride_theme', 'light');
  }, []);

  // Toast manager
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync with Supabase on Mount if configured
  useEffect(() => {
    getStudentsFromDb().then(({ students: loadedStudents, isLiveDb: live }) => {
      if (live && loadedStudents.length > 0) {
        setStudents(loadedStudents);
        setCurrentStudentId(loadedStudents[0].id);
        setIsLiveDb(true);
      }
    });
  }, []);

  const login = (role: UserRole, studentId?: string) => {
    setActiveRole(role);
    setIsAuthenticated(true);

    if (role === 'student') {
      const targetId = studentId || 'std-101';
      setCurrentStudentId(targetId);
      const matched = students.find(s => s.id === targetId);
      setCurrentUser({
        id: matched?.id || 'std-101',
        name: matched?.name || 'Alex Rivera',
        email: matched?.email || 'alex.rivera@stride.edu',
        role: 'student',
        department: matched?.department || 'Computer Science'
      });
      addToast(`Welcome back, ${matched?.name || 'Alex Rivera'}!`, 'success');
    } else if (role === 'faculty') {
      setCurrentUser(MOCK_USERS[1]); // Dr. Sarah Jenkins
      addToast(`Welcome back, Dr. Sarah Jenkins!`, 'success');
    } else {
      setCurrentUser(MOCK_USERS[2]); // Dean Robert Vance
      addToast(`Welcome back, Dean Robert Vance!`, 'success');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast('You have been logged out successfully.', 'info');
  };

  const updateUserProfile = (name: string, email: string, department: string) => {
    setCurrentUser(prev => ({
      ...prev,
      name,
      email,
      department
    }));

    if (activeRole === 'student') {
      setStudents(prev => prev.map(s => s.id === currentStudentId ? { ...s, name, email, department } : s));
    }

    addToast('Profile settings saved successfully.', 'success');
  };

  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];
  const interventions = students.flatMap(s => s.interventions);

  const toggleTaskCompletion = (taskId: string) => {
    let isCompleted = false;

    setStudents(prev => prev.map(student => {
      if (student.id !== currentStudent.id) return student;

      const updatedTasks = student.studyTasks.map(t => {
        if (t.id === taskId) {
          isCompleted = !t.completed;
          return { ...t, completed: isCompleted };
        }
        return t;
      });

      const allDone = updatedTasks.every(t => t.completed);
      if (allDone && updatedTasks.length > 0) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        addToast('All today\'s focus tasks completed! Great work!', 'success');
      }

      return {
        ...student,
        studyTasks: updatedTasks,
        goalsAchieved: allDone ? student.goalsAchieved + 1 : student.goalsAchieved
      };
    }));

    updateTaskStatusInDb(taskId, isCompleted);
  };

  const addStudyTask = (task: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`
    };

    setStudents(prev => prev.map(student => {
      if (student.id !== currentStudent.id) return student;
      return {
        ...student,
        studyTasks: [newTask, ...student.studyTasks]
      };
    }));

    saveTaskToDb(currentStudent.id, newTask);
    addToast(`Task "${task.title}" added to your planner.`, 'success');
  };

  const createIntervention = (interventionData: Omit<Intervention, 'id' | 'startDate'>) => {
    const newInt: Intervention = {
      ...interventionData,
      id: `int-${Date.now()}`,
      startDate: new Date().toISOString().split('T')[0]
    };

    setStudents(prev => prev.map(student => {
      if (student.id !== interventionData.studentId) return student;
      return {
        ...student,
        interventions: [newInt, ...student.interventions]
      };
    }));

    setMetrics(prev => ({
      ...prev,
      openInterventions: prev.openInterventions + 1
    }));

    saveInterventionToDb(newInt);
    addToast(`Academic intervention scheduled for ${interventionData.studentName}.`, 'success');
  };

  const recordAssessmentMark = (studentId: string, subjectId: string, score: number, name: string) => {
    let subjectNameFound = 'Subject';

    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;

      subjectNameFound = student.subjects.find(s => s.subjectId === subjectId)?.subjectName || 'Subject';

      const newAssessment = {
        id: `asm-${Date.now()}`,
        name,
        subjectId,
        subjectName: subjectNameFound,
        score,
        maxScore: 100,
        date: new Date().toISOString().split('T')[0],
        type: 'Quiz' as const
      };

      const updatedAssessments = [...student.assessments, newAssessment];
      const avg = Math.round(updatedAssessments.reduce((acc, curr) => acc + curr.score, 0) / updatedAssessments.length);

      const updatedSubjects = student.subjects.map(s => {
        if (s.subjectId === subjectId) {
          const prev = s.currentScore;
          return {
            ...s,
            previousScore: prev,
            currentScore: score,
            trend: score > prev ? ('improving' as const) : score < prev ? ('declining' as const) : ('stable' as const)
          };
        }
        return s;
      });

      const updatedRisk = calculateRiskAssessment(
        avg,
        updatedAssessments,
        student.attendancePercentage,
        student.completedAssignments,
        student.totalAssignments
      );

      return {
        ...student,
        academicAverage: avg,
        assessments: updatedAssessments,
        subjects: updatedSubjects,
        riskAssessment: updatedRisk
      };
    }));

    saveAssessmentToDb(studentId, subjectId, subjectNameFound, score, name);
    addToast(`Assessment mark (${score}%) recorded successfully.`, 'success');
  };

  const markAttendanceBatch = (newRecords: Omit<AttendanceRecord, 'id' | 'createdAt'>[]) => {
    const created: AttendanceRecord[] = newRecords.map(r => ({
      ...r,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    }));

    setAttendanceRecords(prev => [...created, ...prev]);

    // Update student attendance metrics
    const newNotifications: AppNotification[] = [];

    setStudents(prev => prev.map(student => {
      const studentNewAtt = created.filter(r => r.studentId === student.id);
      if (studentNewAtt.length === 0) return student;

      const allStudentAtt = [...attendanceRecords.filter(r => r.studentId === student.id), ...studentNewAtt];
      const validConducted = allStudentAtt.filter(r => r.status !== 'holiday' && r.status !== 'unrecorded');
      const presentCount = validConducted.filter(r => r.status === 'present' || r.status === 'late').length;
      const newPercentage = validConducted.length > 0 ? Math.round((presentCount / validConducted.length) * 100) : student.attendancePercentage;

      // Check if student was marked absent today and generate notification
      const absentToday = studentNewAtt.find(r => r.status === 'absent');
      if (absentToday) {
        newNotifications.push({
          id: `notif-${Date.now()}-${student.id}`,
          title: 'Attendance Alert: Absence Recorded',
          message: `You were marked ABSENT for ${absentToday.subjectName} on ${absentToday.date}. Contact faculty if this is an error.`,
          timestamp: 'Just now',
          type: 'attendance',
          read: false,
          link: '/attendance'
        });
      }

      if (newPercentage < 75) {
        newNotifications.push({
          id: `notif-low-${Date.now()}-${student.id}`,
          title: 'Low Attendance Warning',
          message: `Your overall attendance has fallen to ${newPercentage}%, below the required 75% threshold.`,
          timestamp: 'Just now',
          type: 'warning',
          read: false,
          link: '/attendance'
        });
      }

      const updatedRisk = calculateRiskAssessment(
        student.academicAverage,
        student.assessments,
        newPercentage,
        student.completedAssignments,
        student.totalAssignments
      );

      return {
        ...student,
        attendancePercentage: newPercentage,
        riskAssessment: updatedRisk
      };
    }));

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
    }

    saveAttendanceRecordsToDb(created);
    addToast(`Attendance submitted successfully for ${created.length} students.`, 'success');
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    markNotificationAsReadInDb(notificationId);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read.', 'info');
  };

  const importStudentsFromCsv = (newStudents: StudentProfile[]) => {
    setStudents(prev => [...newStudents, ...prev]);
    setMetrics(prev => ({
      ...prev,
      totalStudents: prev.totalStudents + newStudents.length
    }));
    addToast(`Imported ${newStudents.length} student records.`, 'success');
  };

  const loadDemoScenario = (scenario: 'silent_struggle' | 'high_risk' | 'recovery' | 'reset') => {
    if (scenario === 'reset') {
      setStudents(INITIAL_STUDENTS);
      setCurrentStudentId('std-101');
      addToast('Demo data reset to default seed.', 'info');
      return;
    }

    if (scenario === 'silent_struggle') {
      setCurrentStudentId('std-101');
      login('student', 'std-101');
    } else if (scenario === 'high_risk') {
      setCurrentStudentId('std-103');
      login('student', 'std-103');
    } else if (scenario === 'recovery') {
      setCurrentStudentId('std-104');
      login('student', 'std-104');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        isAuthenticated,
        currentUser,
        login,
        logout,
        students,
        currentStudent,
        setCurrentStudentId,
        metrics,
        interventions,
        attendanceRecords,
        notifications,
        isLiveDb,
        toasts,
        addToast,
        removeToast,
        toggleTaskCompletion,
        addStudyTask,
        createIntervention,
        recordAssessmentMark,
        markAttendanceBatch,
        markNotificationRead,
        markAllNotificationsRead,
        importStudentsFromCsv,
        updateUserProfile,
        loadDemoScenario,
        showWalkthrough,
        setShowWalkthrough
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

