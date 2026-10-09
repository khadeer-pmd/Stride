import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { StudentProfile, StudyTask, Intervention, SupportRequest, SystemMetrics } from '../types/academic';
import { INITIAL_STUDENTS, MOCK_SUPPORT_REQUESTS, INITIAL_METRICS } from '../data/mockData';
import { calculateRiskAssessment } from '../lib/riskEngine';

/**
 * STRIDE Safe Database Access Layer
 * Seamlessly fetches and persists data to Supabase when configured,
 * with intelligent fallback to local state for demo mode.
 */

export async function getStudentsFromDb(): Promise<{ students: StudentProfile[]; isLiveDb: boolean }> {
  if (!isSupabaseConfigured()) {
    return { students: INITIAL_STUDENTS, isLiveDb: false };
  }

  try {
    const { data: dbStudents, error } = await supabase.from('students').select('*');
    if (error || !dbStudents || dbStudents.length === 0) {
      console.warn('Supabase fetch returned empty or error, falling back to initial dataset:', error);
      return { students: INITIAL_STUDENTS, isLiveDb: false };
    }

    // Fetch relational data for each student
    const fullProfiles: StudentProfile[] = await Promise.all(
      dbStudents.map(async (st) => {
        const [{ data: subjects }, { data: assessments }, { data: tasks }, { data: interventions }] = await Promise.all([
          supabase.from('subjects').select('*').eq('student_id', st.id),
          supabase.from('assessments').select('*').eq('student_id', st.id),
          supabase.from('study_tasks').select('*').eq('student_id', st.id),
          supabase.from('interventions').select('*').eq('student_id', st.id)
        ]);

        const mappedAssessments = (assessments || []).map(a => ({
          id: a.id,
          name: a.name,
          subjectId: a.subject_id_code,
          subjectName: a.subject_name,
          score: Number(a.score),
          maxScore: Number(a.max_score),
          date: a.assessment_date,
          type: a.type
        }));

        const mappedSubjects = (subjects || []).map(s => ({
          subjectId: s.subject_id_code,
          subjectName: s.subject_name,
          code: s.code,
          currentScore: Number(s.current_score),
          previousScore: Number(s.previous_score),
          trend: s.trend,
          attendance: Number(s.attendance),
          instructorName: s.instructor_name,
          suggestedAction: s.suggested_action,
          topicsToReview: s.topics_to_review || []
        }));

        const mappedTasks: StudyTask[] = (tasks || []).map(t => ({
          id: t.id,
          title: t.title,
          subjectName: t.subject_name,
          durationMinutes: t.duration_minutes,
          completed: t.completed,
          priority: t.priority,
          category: t.category,
          dueDate: t.due_date
        }));

        const mappedInterventions: Intervention[] = (interventions || []).map(i => ({
          id: i.id,
          studentId: i.student_id,
          studentName: i.student_name,
          subjectName: i.subject_name,
          type: i.type,
          status: i.status,
          assignedBy: i.assigned_by,
          mentorName: i.mentor_name,
          startDate: i.start_date,
          followUpDate: i.follow_up_date,
          notes: i.notes,
          scoreBefore: i.score_before,
          scoreAfter: i.score_after,
          outcome: i.outcome
        }));

        const riskAssessment = calculateRiskAssessment(
          Number(st.academic_average),
          mappedAssessments,
          Number(st.attendance_percentage),
          st.completed_assignments,
          st.total_assignments
        );

        return {
          id: st.id,
          name: st.name,
          studentId: st.student_id,
          department: st.department,
          semester: st.semester,
          email: st.email,
          avatar: st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          academicAverage: Number(st.academic_average),
          attendancePercentage: Number(st.attendance_percentage),
          completedAssignments: st.completed_assignments,
          pendingAssignments: st.pending_assignments,
          totalAssignments: st.total_assignments,
          goalsAchieved: st.goals_achieved,
          assignedMentor: st.assigned_mentor || 'Dr. Sarah Jenkins',
          subjects: mappedSubjects,
          assessments: mappedAssessments,
          studyTasks: mappedTasks,
          riskAssessment,
          interventions: mappedInterventions
        };
      })
    );

    return { students: fullProfiles, isLiveDb: true };
  } catch (err) {
    console.error('Error connecting to Supabase database:', err);
    return { students: INITIAL_STUDENTS, isLiveDb: false };
  }
}

export async function saveTaskToDb(studentId: string, task: StudyTask) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('study_tasks').insert({
      student_id: studentId,
      title: task.title,
      subject_name: task.subjectName,
      duration_minutes: task.durationMinutes,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      due_date: task.dueDate
    });
  } catch (err) {
    console.error('Error saving study task to Supabase:', err);
  }
}

export async function updateTaskStatusInDb(taskId: string, completed: boolean) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('study_tasks').update({ completed }).eq('id', taskId);
  } catch (err) {
    console.error('Error updating task status in Supabase:', err);
  }
}

export async function saveAssessmentToDb(studentId: string, subjectIdCode: string, subjectName: string, score: number, name: string) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('assessments').insert({
      student_id: studentId,
      name,
      subject_id_code: subjectIdCode,
      subject_name: subjectName,
      score,
      max_score: 100,
      assessment_date: new Date().toISOString().split('T')[0],
      type: 'Quiz'
    });
  } catch (err) {
    console.error('Error saving assessment mark to Supabase:', err);
  }
}

export async function saveInterventionToDb(intervention: Intervention) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('interventions').insert({
      student_id: intervention.studentId,
      student_name: intervention.studentName,
      subject_name: intervention.subjectName,
      type: intervention.type,
      status: intervention.status,
      assigned_by: intervention.assignedBy,
      mentor_name: intervention.mentorName,
      start_date: intervention.startDate,
      follow_up_date: intervention.followUpDate,
      notes: intervention.notes,
      score_before: intervention.scoreBefore
    });
  } catch (err) {
    console.error('Error saving intervention to Supabase:', err);
  }
}

export async function saveSupportRequestToDb(request: SupportRequest) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('support_requests').insert({
      student_id: request.studentId,
      student_name: request.studentName,
      subject_name: request.subjectName,
      issue_category: request.issueCategory,
      description: request.description,
      preferred_faculty_name: request.preferredFacultyName,
      status: request.status,
      created_at: request.createdAt
    });
  } catch (err) {
    console.error('Error saving support request to Supabase:', err);
  }
}

export async function saveAttendanceRecordsToDb(records: any[]) {
  if (!isSupabaseConfigured()) return;
  try {
    const formatted = records.map(r => ({
      student_id: r.studentId,
      date: r.date,
      status: r.status,
      subject_name: r.subjectName,
      session_type: r.sessionType || 'Lecture',
      marked_by: r.markedBy || 'Faculty',
      notes: r.notes || null
    }));
    await supabase.from('attendance_records').insert(formatted);
  } catch (err) {
    console.error('Error saving attendance records to Supabase:', err);
  }
}

export async function saveNotificationToDb(notification: any) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('notifications').insert({
      user_id: notification.userId || null,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      link: notification.link
    });
  } catch (err) {
    console.error('Error saving notification to Supabase:', err);
  }
}

export async function markNotificationAsReadInDb(id: string) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  } catch (err) {
    console.error('Error updating notification read status in Supabase:', err);
  }
}

