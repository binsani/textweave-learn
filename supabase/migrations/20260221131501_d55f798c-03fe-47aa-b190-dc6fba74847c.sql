-- Add unique constraints needed for seed upserts
-- sections: unique per course + order
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sections_course_id_order_key'
  ) THEN
    ALTER TABLE public.sections ADD CONSTRAINT sections_course_id_order_key UNIQUE (course_id, "order");
  END IF;
END $$;

-- lessons: unique per section + order
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lessons_section_id_order_key'
  ) THEN
    ALTER TABLE public.lessons ADD CONSTRAINT lessons_section_id_order_key UNIQUE (section_id, "order");
  END IF;
END $$;

-- user_roles: ensure unique constraint exists for upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;