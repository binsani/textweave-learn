
-- Step 1: Add school/branding columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS school_name text,
  ADD COLUMN IF NOT EXISTS school_slug text,
  ADD COLUMN IF NOT EXISTS school_description text DEFAULT '',
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#6366f1',
  ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#8b5cf6',
  ADD COLUMN IF NOT EXISTS certificate_template text DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS certificate_bg_url text,
  ADD COLUMN IF NOT EXISTS certificate_signature_url text,
  ADD COLUMN IF NOT EXISTS certificate_custom_text jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS about_html text DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_email text;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_school_slug_unique ON public.profiles (school_slug) WHERE school_slug IS NOT NULL;

-- Step 2: Migrate existing vendor data into profiles
UPDATE public.profiles p
SET
  school_name = v.name,
  school_slug = v.slug,
  school_description = v.description,
  logo_url = v.logo_url,
  banner_url = v.banner_url,
  website = v.website,
  primary_color = v.primary_color,
  accent_color = v.accent_color,
  certificate_template = v.certificate_template,
  certificate_bg_url = v.certificate_bg_url,
  certificate_signature_url = v.certificate_signature_url,
  certificate_custom_text = v.certificate_custom_text,
  social_links = v.social_links,
  about_html = v.about_html,
  contact_email = v.contact_email
FROM public.vendors v
WHERE v.owner_id = p.id
  AND v.status = 'approved';

-- Step 3: Drop storage policies that reference vendors
DROP POLICY IF EXISTS "Vendor owners can upload assets" ON storage.objects;
DROP POLICY IF EXISTS "Vendor owners can update assets" ON storage.objects;
DROP POLICY IF EXISTS "Vendor owners can delete assets" ON storage.objects;

-- Step 4: Drop vendor_id from courses
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_vendor_id_fkey;
ALTER TABLE public.courses DROP COLUMN IF EXISTS vendor_id;

-- Step 5: Drop vendors table RLS policies
DROP POLICY IF EXISTS "Admins can manage all vendors" ON public.vendors;
DROP POLICY IF EXISTS "Approved vendors viewable by everyone" ON public.vendors;
DROP POLICY IF EXISTS "Instructors can create vendor application" ON public.vendors;
DROP POLICY IF EXISTS "Owners can update own vendor" ON public.vendors;
DROP POLICY IF EXISTS "Owners can view own vendor" ON public.vendors;

-- Step 6: Drop vendors table
DROP TABLE public.vendors;

-- Step 7: Drop vendor_status enum
DROP TYPE IF EXISTS public.vendor_status;

-- Step 8: Add RLS policy for public school pages
CREATE POLICY "Public can view instructor school pages"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (school_slug IS NOT NULL AND school_slug != '');

-- Step 9: Recreate storage policies for instructors
CREATE POLICY "Instructors can upload school assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vendor-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'instructor')
);

CREATE POLICY "Instructors can update school assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vendor-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'instructor')
);

CREATE POLICY "Instructors can delete school assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vendor-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'instructor')
);
