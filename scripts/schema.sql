-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') NOT NULL,
  face_embedding BYTEA,
  face_image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tests table
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  duration_minutes INT NOT NULL,
  total_questions INT NOT NULL,
  status ENUM('draft', 'active', 'completed') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type ENUM('mcq', 'short', 'essay') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question options (for MCQ)
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  display_order INT NOT NULL
);

-- Assigned tests
CREATE TABLE assigned_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id),
  student_id UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  UNIQUE(test_id, student_id)
);

-- Student attempts/attempts table
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_test_id UUID NOT NULL REFERENCES assigned_tests(id),
  student_id UUID NOT NULL REFERENCES users(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  score INT,
  max_score INT,
  is_submitted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student answers
CREATE TABLE student_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES attempts(id),
  question_id UUID NOT NULL REFERENCES questions(id),
  answer_text TEXT,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Violations/Malpractice detection
CREATE TABLE violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES attempts(id),
  student_id UUID NOT NULL REFERENCES users(id),
  violation_type VARCHAR(255) NOT NULL,
  violation_details TEXT,
  severity ENUM('low', 'medium', 'high') DEFAULT 'medium',
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  screenshot_url VARCHAR(255),
  confidence_score FLOAT
);

-- Analytics
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id),
  total_students INT,
  completed_exams INT,
  average_score FLOAT,
  pass_rate FLOAT,
  total_violations INT,
  high_severity_violations INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tests_created_by ON tests(created_by);
CREATE INDEX idx_questions_test_id ON questions(test_id);
CREATE INDEX idx_assigned_tests_student_id ON assigned_tests(student_id);
CREATE INDEX idx_attempts_student_id ON attempts(student_id);
CREATE INDEX idx_violations_attempt_id ON violations(attempt_id);
CREATE INDEX idx_analytics_test_id ON analytics(test_id);
