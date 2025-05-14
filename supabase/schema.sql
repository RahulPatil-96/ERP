-- =====================
-- Drop Existing Tables
-- =====================
-- DO $$
-- DECLARE
--     r RECORD;
-- BEGIN
--     FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
--         EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
--     END LOOP;
-- END;
-- $$;

-- =====================
-- Users Table
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  department_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Roles Table
-- =====================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

-- =====================
-- User-Roles Join Table
-- =====================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE (user_id, role_id)
);

-- =====================
-- Colleges Table
-- =====================
CREATE TABLE IF NOT EXISTS colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Departments Table
-- =====================
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  college_id UUID REFERENCES colleges(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Academic Years Table
-- =====================
CREATE TABLE IF NOT EXISTS academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Divisions Table
-- =====================
CREATE TABLE IF NOT EXISTS divisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  academic_year_id UUID REFERENCES academic_years(id),
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Subjects Table
-- =====================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  department_id UUID REFERENCES departments(id),
  semester INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Faculty-Subject Assignments Table
-- =====================
CREATE TABLE IF NOT EXISTS faculty_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID REFERENCES users(id),
  subject_id UUID REFERENCES subjects(id),
  academic_year_id UUID REFERENCES academic_years(id),
  division_id UUID REFERENCES divisions(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Students Table
-- =====================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  enrollment_date TEXT ,
  phone TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Student Attendance Table
-- =====================
CREATE TABLE IF NOT EXISTS student_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id),
  subject_id UUID REFERENCES subjects(id),
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Faculty Attendance Table
-- =====================
CREATE TABLE IF NOT EXISTS faculty_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'on_leave')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Exams Table
-- =====================
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id),
  division_id UUID REFERENCES divisions(id),
  date DATE,
  time TEXT,
  venue TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Exam Results Table
-- =====================
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id),
  student_id UUID REFERENCES users(id),
  marks_obtained FLOAT,
  grade TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Fees Table
-- =====================
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id),
  academic_year_id UUID REFERENCES academic_years(id),
  amount NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('paid', 'unpaid', 'pending')) NOT NULL,
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Grading Table
-- =====================
CREATE TABLE IF NOT EXISTS grading (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id),
  student_id UUID REFERENCES users(id),
  internal_marks FLOAT,
  external_marks FLOAT,
  grade TEXT,
  academic_year_id UUID REFERENCES academic_years(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Timetables Table
-- =====================
CREATE TABLE IF NOT EXISTS timetables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  academic_year_id UUID REFERENCES academic_years(id),
  division_id UUID REFERENCES divisions(id),
  day TEXT,
  start_time TEXT,
  end_time TEXT,
  subject_id UUID REFERENCES subjects(id),
  faculty_id UUID REFERENCES users(id),
  room TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Notifications Table
-- =====================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  description TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Feedback Table
-- =====================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id),
  faculty_id UUID REFERENCES users(id),
  subject_id UUID REFERENCES subjects(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- User Settings Table
-- =====================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  notification_sound BOOLEAN DEFAULT TRUE,
  vibration BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Insert Mock Data for Users and Roles
-- =====================

-- Insert users (without specifying id, as it will be auto-generated)
INSERT INTO users (email, password, name, created_at) VALUES
('student@example.com', '$2b$10$As8hsR9FYckDcNFJMBQyM.TGMBjrS.RXFHfprreVHgmrLs2m6aSMC', 'John Doe', NOW()),
('faculty@example.com', '$2b$10$As8hsR9FYckDcNFJMBQyM.TGMBjrS.RXFHfprreVHgmrLs2m6aSMC', 'Jane Smith', NOW()),
('admin@example.com', '$2b$10$As8hsR9FYckDcNFJMBQyM.TGMBjrS.RXFHfprreVHgmrLs2m6aSMC', 'Alex Morgan', NOW()),
('googleuser@example.com', '$2b$10$As8hsR9FYckDcNFJMBQyM.TGMBjrS.RXFHfprreVHgmrLs2m6aSMC', 'Sophie Lee', NOW()),
('hod@example.com', '$2b$10$As8hsR9FYckDcNFJMBQyM.TGMBjrS.RXFHfprreVHgmrLs2m6aSMC', 'Harish Patel', NOW()),
('dean@example.com', '$2b$10$As8hsR9FYckDcNFJMBQyM.TGMBjrS.RXFHfprreVHgmrLs2m6aSMC', 'Susan Brown', NOW());

-- Insert roles
INSERT INTO roles (name) VALUES 
('student'), 
('faculty'), 
('admin'), 
('hod');

-- Assign roles to users
-- User 1 (John Doe) - student
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'student@example.com' AND r.name = 'student';

-- User 2 (Jane Smith) - faculty
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'faculty@example.com' AND r.name = 'faculty';

-- User 3 (Alex Morgan) - admin
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@example.com' AND r.name = 'admin';

-- User 4 (Sophie Lee) - student
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'googleuser@example.com' AND r.name = 'student';

-- User 5 (Harish Patel) - hod
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'hod@example.com' AND r.name = 'hod';

-- User 6 (Susan Brown) - admin, hod, faculty, student
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'dean@example.com' AND r.name IN ('admin', 'hod', 'faculty', 'student');
