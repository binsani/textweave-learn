-- 1. Fix profiles: replace public SELECT with authenticated-only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Profiles viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated
USING (true);

-- 2. Fix enrollments: restrict self-enrollment to free courses only
DROP POLICY IF EXISTS "Students can enroll themselves" ON public.enrollments;

CREATE POLICY "Students can enroll in free courses"
ON public.enrollments FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = course_id
    AND is_free = true
    AND status = 'published'
  )
);

-- 3. Fix sections: restrict public visibility to published courses only
DROP POLICY IF EXISTS "Sections viewable by everyone" ON public.sections;

CREATE POLICY "Sections viewable for published courses"
ON public.sections FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = course_id AND status = 'published'
  )
);

CREATE POLICY "Instructors can view own course sections"
ON public.sections FOR SELECT TO authenticated
USING (
  public.is_course_instructor(auth.uid(), course_id)
);

CREATE POLICY "Admins can view all sections"
ON public.sections FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
);