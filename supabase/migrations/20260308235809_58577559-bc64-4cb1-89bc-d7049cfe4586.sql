-- Create function to prevent instructors from publishing directly
CREATE OR REPLACE FUNCTION public.validate_course_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If changing to 'published', require admin role
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
      RAISE EXCEPTION 'Only admins can publish courses';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on courses table
CREATE TRIGGER enforce_course_publishing
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION validate_course_status_change();

-- Add RLS policy for admins to update any course
DROP POLICY IF EXISTS "Admins can update any course" ON public.courses;
CREATE POLICY "Admins can update any course" ON public.courses
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));