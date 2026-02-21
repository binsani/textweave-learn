-- Add unique constraints for progress/notes/bookmarks upserts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'course_progress_user_course_lesson_key'
  ) THEN
    ALTER TABLE public.course_progress ADD CONSTRAINT course_progress_user_course_lesson_key UNIQUE (user_id, course_id, lesson_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'notes_user_course_lesson_key'
  ) THEN
    ALTER TABLE public.notes ADD CONSTRAINT notes_user_course_lesson_key UNIQUE (user_id, course_id, lesson_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookmarks_user_course_lesson_key'
  ) THEN
    ALTER TABLE public.bookmarks ADD CONSTRAINT bookmarks_user_course_lesson_key UNIQUE (user_id, course_id, lesson_id);
  END IF;
END $$;