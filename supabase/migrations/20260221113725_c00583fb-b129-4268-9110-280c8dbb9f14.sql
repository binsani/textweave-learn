
-- ============================================
-- Masashi LMS - Complete Database Schema
-- ============================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE public.course_status AS ENUM ('draft', 'pending_review', 'published', 'archived');
CREATE TYPE public.course_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.course_category AS ENUM (
  'programming', 'data-science', 'business', 'design', 'marketing',
  'personal-development', 'mathematics', 'science', 'humanities', 'language'
);
CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer');
CREATE TYPE public.enrollment_status AS ENUM ('active', 'completed', 'expired');

-- 2. USER ROLES TABLE (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. COURSES TABLE
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  thumbnail TEXT,
  category public.course_category NOT NULL DEFAULT 'programming',
  tags TEXT[] DEFAULT '{}',
  level public.course_level NOT NULL DEFAULT 'beginner',
  status public.course_status NOT NULL DEFAULT 'draft',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  estimated_hours NUMERIC(5,1) NOT NULL DEFAULT 0,
  learning_objectives TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- 5. SECTIONS TABLE
CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

-- 6. LESSONS TABLE
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0,
  reading_time INTEGER NOT NULL DEFAULT 5,
  is_free BOOLEAN NOT NULL DEFAULT false,
  has_quiz BOOLEAN NOT NULL DEFAULT false,
  quiz_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- 7. QUIZZES TABLE
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER NOT NULL DEFAULT 70,
  time_limit INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- 8. QUESTIONS TABLE
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  type public.question_type NOT NULL DEFAULT 'multiple_choice',
  question TEXT NOT NULL,
  options TEXT[],
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 10,
  "order" INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- 9. ENROLLMENTS TABLE
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status public.enrollment_status NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE (user_id, course_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 10. COURSE PROGRESS TABLE
CREATE TABLE public.course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- 11. NOTES TABLE
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 12. BOOKMARKS TABLE
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- 13. REVIEWS TABLE
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 14. QUIZ ATTEMPTS TABLE
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECURITY DEFINER HELPER FUNCTIONS
-- ============================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user is enrolled in a course
CREATE OR REPLACE FUNCTION public.is_enrolled(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = _user_id AND course_id = _course_id AND status = 'active'
  )
$$;

-- Check if user is the instructor of a course
CREATE OR REPLACE FUNCTION public.is_course_instructor(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = _course_id AND instructor_id = _user_id
  )
$$;

-- Get course_id from a section
CREATE OR REPLACE FUNCTION public.get_course_id_from_section(_section_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT course_id FROM public.sections WHERE id = _section_id
$$;

-- Get course_id from a lesson (via section)
CREATE OR REPLACE FUNCTION public.get_course_id_from_lesson(_lesson_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.course_id FROM public.sections s
  JOIN public.lessons l ON l.section_id = s.id
  WHERE l.id = _lesson_id
$$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- USER ROLES
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- PROFILES
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- COURSES
CREATE POLICY "Published courses are viewable by everyone" ON public.courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can view own courses" ON public.courses
  FOR SELECT TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Admins can view all courses" ON public.courses
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors can create courses" ON public.courses
  FOR INSERT TO authenticated
  WITH CHECK (
    instructor_id = auth.uid() AND
    (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Instructors can update own courses" ON public.courses
  FOR UPDATE TO authenticated
  USING (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors can delete own courses" ON public.courses
  FOR DELETE TO authenticated
  USING (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- SECTIONS
CREATE POLICY "Sections viewable by everyone" ON public.sections
  FOR SELECT USING (true);

CREATE POLICY "Course instructors can manage sections" ON public.sections
  FOR ALL TO authenticated
  USING (
    public.is_course_instructor(auth.uid(), course_id) OR
    public.has_role(auth.uid(), 'admin')
  );

-- LESSONS
CREATE POLICY "Free lessons viewable by everyone" ON public.lessons
  FOR SELECT USING (is_free = true);

CREATE POLICY "Enrolled students can view lessons" ON public.lessons
  FOR SELECT TO authenticated
  USING (
    public.is_enrolled(auth.uid(), public.get_course_id_from_section(section_id))
  );

CREATE POLICY "Instructors can view own course lessons" ON public.lessons
  FOR SELECT TO authenticated
  USING (
    public.is_course_instructor(auth.uid(), public.get_course_id_from_section(section_id))
  );

CREATE POLICY "Admins can view all lessons" ON public.lessons
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Course instructors can manage lessons" ON public.lessons
  FOR ALL TO authenticated
  USING (
    public.is_course_instructor(auth.uid(), public.get_course_id_from_section(section_id)) OR
    public.has_role(auth.uid(), 'admin')
  );

-- QUIZZES
CREATE POLICY "Enrolled students can view quizzes" ON public.quizzes
  FOR SELECT TO authenticated
  USING (
    public.is_enrolled(auth.uid(), public.get_course_id_from_lesson(lesson_id)) OR
    public.is_course_instructor(auth.uid(), public.get_course_id_from_lesson(lesson_id)) OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Course instructors can manage quizzes" ON public.quizzes
  FOR ALL TO authenticated
  USING (
    public.is_course_instructor(auth.uid(), public.get_course_id_from_lesson(lesson_id)) OR
    public.has_role(auth.uid(), 'admin')
  );

-- QUESTIONS
CREATE POLICY "Enrolled students can view questions" ON public.questions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = quiz_id AND (
        public.is_enrolled(auth.uid(), public.get_course_id_from_lesson(q.lesson_id)) OR
        public.is_course_instructor(auth.uid(), public.get_course_id_from_lesson(q.lesson_id)) OR
        public.has_role(auth.uid(), 'admin')
      )
    )
  );

CREATE POLICY "Course instructors can manage questions" ON public.questions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = quiz_id AND (
        public.is_course_instructor(auth.uid(), public.get_course_id_from_lesson(q.lesson_id)) OR
        public.has_role(auth.uid(), 'admin')
      )
    )
  );

-- ENROLLMENTS
CREATE POLICY "Users can view own enrollments" ON public.enrollments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all enrollments" ON public.enrollments
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors can view enrollments for their courses" ON public.enrollments
  FOR SELECT TO authenticated
  USING (public.is_course_instructor(auth.uid(), course_id));

CREATE POLICY "Students can enroll themselves" ON public.enrollments
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage enrollments" ON public.enrollments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- COURSE PROGRESS
CREATE POLICY "Users can view own progress" ON public.course_progress
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress" ON public.course_progress
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON public.course_progress
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all progress" ON public.course_progress
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- NOTES
CREATE POLICY "Users can manage own notes" ON public.notes
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notes" ON public.notes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- BOOKMARKS
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all bookmarks" ON public.bookmarks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- REVIEWS
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- QUIZ ATTEMPTS
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own attempts" ON public.quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own attempts" ON public.quiz_attempts
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all attempts" ON public.quiz_attempts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile and student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_sections_course ON public.sections(course_id);
CREATE INDEX idx_lessons_section ON public.lessons(section_id);
CREATE INDEX idx_quizzes_lesson ON public.quizzes(lesson_id);
CREATE INDEX idx_questions_quiz ON public.questions(quiz_id);
CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_progress_user ON public.course_progress(user_id);
CREATE INDEX idx_notes_user ON public.notes(user_id);
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_reviews_course ON public.reviews(course_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
