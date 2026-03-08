ALTER TABLE public.purchase_codes 
ADD COLUMN student_first_name text DEFAULT '',
ADD COLUMN student_last_name text DEFAULT '';