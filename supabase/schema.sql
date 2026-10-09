-- ========================================================
-- STRIDE ACADEMIC SUPPORT SYSTEM — SUPABASE DATABASE MIGRATION
-- ========================================================
-- Tagline: "Every step is a progress."
-- Problem Statement: Academic Performance Monitoring & Early Warning System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (User Accounts & Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  department TEXT,
  title TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  student_id TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  semester INT NOT NULL DEFAULT 5,
  email TEXT NOT NULL,
  avatar TEXT,
  academic_average NUMERIC NOT NULL DEFAULT 75,
  attendance_percentage NUMERIC NOT NULL DEFAULT 85,
  completed_assignments INT NOT NULL DEFAULT 0,
  pending_assignments INT NOT NULL DEFAULT 0,
  total_assignments INT NOT NULL DEFAULT 0,
  goals_achieved INT NOT NULL DEFAULT 0,
  assigned_mentor TEXT DEFAULT 'Dr. Sarah Jenkins',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  code TEXT NOT NULL,
  current_score NUMERIC NOT NULL DEFAULT 75,
  previous_score NUMERIC NOT NULL DEFAULT 75,
  trend TEXT NOT NULL CHECK (trend IN ('improving', 'stable', 'declining')),
  attendance NUMERIC NOT NULL DEFAULT 85,
  instructor_name TEXT NOT NULL,
  suggested_action TEXT,
  topics_to_review TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject_id_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 100),
  max_score NUMERIC NOT NULL DEFAULT 100,
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL CHECK (type IN ('Quiz', 'Midterm', 'Assignment', 'Final', 'Lab')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDY TASKS TABLE
CREATE TABLE IF NOT EXISTS public.study_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 25,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT NOT NULL CHECK (category IN ('revision', 'practice', 'assignment', 'reading')),
  due_date TEXT NOT NULL DEFAULT 'Today',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RISK ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE UNIQUE,
  score INT NOT NULL CHECK (score >= 0 AND score <= 100),
  category TEXT NOT NULL CHECK (category IN ('Low', 'Medium', 'High')),
  performance_risk NUMERIC NOT NULL DEFAULT 0,
  decline_risk NUMERIC NOT NULL DEFAULT 0,
  attendance_risk NUMERIC NOT NULL DEFAULT 0,
  assignment_risk NUMERIC NOT NULL DEFAULT 0,
  explanation TEXT NOT NULL,
  has_missing_data BOOLEAN DEFAULT FALSE,
  silent_struggle_detected BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INTERVENTIONS TABLE
CREATE TABLE IF NOT EXISTS public.interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Faculty Mentoring', 'Remedial Session', 'Practice Plan', 'Assignment Catch-Up', 'Attendance Check-In')),
  status TEXT NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Needs Review')),
  assigned_by TEXT NOT NULL,
  mentor_name TEXT NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  follow_up_date DATE,
  notes TEXT,
  score_before NUMERIC,
  score_after NUMERIC,
  outcome TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUPPORT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  issue_category TEXT NOT NULL,
  description TEXT NOT NULL,
  preferred_faculty_name TEXT,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Review', 'Scheduled', 'Resolved')),
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read & insert for anon/authenticated (hackathon & demo friendly)
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert on students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on students" ON public.students FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Allow public insert on subjects" ON public.subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on subjects" ON public.subjects FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on assessments" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on assessments" ON public.assessments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on study_tasks" ON public.study_tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert on study_tasks" ON public.study_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on study_tasks" ON public.study_tasks FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on risk_assessments" ON public.risk_assessments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on risk_assessments" ON public.risk_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on risk_assessments" ON public.risk_assessments FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on interventions" ON public.interventions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on interventions" ON public.interventions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on interventions" ON public.interventions FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on support_requests" ON public.support_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert on support_requests" ON public.support_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on support_requests" ON public.support_requests FOR UPDATE USING (true);

-- ========================================================
-- SEED INITIAL DATA (Alex Rivera & Demo Dataset)
-- ========================================================

INSERT INTO public.students (id, name, student_id, department, semester, email, avatar, academic_average, attendance_percentage, completed_assignments, pending_assignments, total_assignments, goals_achieved, assigned_mentor)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alex Rivera', 'CS2026-084', 'Computer Science', 5, 'alex.rivera@stride.edu', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 71, 84, 14, 3, 17, 8, 'Dr. Sarah Jenkins'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Maya Chen', 'CS2026-012', 'Computer Science', 5, 'maya.chen@stride.edu', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', 92, 98, 17, 0, 17, 14, 'Dr. Sarah Jenkins'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Liam Patel', 'CS2026-115', 'Computer Science', 5, 'liam.patel@stride.edu', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 54, 68, 10, 6, 16, 3, 'Dr. Sarah Jenkins')
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO public.assessments (student_id, name, subject_id_code, subject_name, score, max_score, assessment_date, type)
VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Quiz 1: Limits & Vectors', 'sub-math', 'Mathematics', 86, 100, '2026-08-15', 'Quiz'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Midterm 1: Integration', 'sub-math', 'Mathematics', 78, 100, '2026-09-02', 'Midterm'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Quiz 2: Partial Derivatives', 'sub-math', 'Mathematics', 69, 100, '2026-09-20', 'Quiz'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Midterm 2: Differential Equations', 'sub-math', 'Mathematics', 58, 100, '2026-10-04', 'Midterm')
ON CONFLICT DO NOTHING;

INSERT INTO public.study_tasks (student_id, title, subject_name, duration_minutes, completed, priority, category, due_date)
VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Revise Mathematics vector calculus notes', 'Mathematics', 25, false, 'high', 'revision', 'Today'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Practice 5 graph traversal algorithms in Python', 'Data Structures', 30, true, 'medium', 'practice', 'Today'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Read Operating Systems thread safety chapter', 'Operating Systems', 20, false, 'low', 'reading', 'Tomorrow')
ON CONFLICT DO NOTHING;

-- 9. ATTENDANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'leave', 'holiday', 'unrecorded')),
  subject_name TEXT NOT NULL,
  session_type TEXT DEFAULT 'Lecture',
  marked_by TEXT DEFAULT 'Faculty',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ATTENDANCE CORRECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.attendance_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID REFERENCES public.attendance_records(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  requested_by TEXT NOT NULL,
  reason TEXT NOT NULL,
  original_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  reviewed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('attendance', 'warning', 'academic', 'system')),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on attendance_records" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert on attendance_records" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on attendance_records" ON public.attendance_records FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on attendance_corrections" ON public.attendance_corrections FOR SELECT USING (true);
CREATE POLICY "Allow public insert on attendance_corrections" ON public.attendance_corrections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on attendance_corrections" ON public.attendance_corrections FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert on notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on notifications" ON public.notifications FOR UPDATE USING (true);
