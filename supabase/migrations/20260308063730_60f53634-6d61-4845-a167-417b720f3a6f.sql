
-- Vendor status enum
CREATE TYPE public.vendor_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- Vendors table
CREATE TABLE public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  logo_url text,
  banner_url text,
  primary_color text DEFAULT '#6366f1',
  accent_color text DEFAULT '#8b5cf6',
  website text,
  contact_email text,
  social_links jsonb DEFAULT '{}',
  about_html text DEFAULT '',
  status vendor_status NOT NULL DEFAULT 'pending',
  applied_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Approved vendors viewable by everyone"
  ON public.vendors FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Owners can view own vendor"
  ON public.vendors FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can update own vendor"
  ON public.vendors FOR UPDATE
  USING (owner_id = auth.uid() AND status = 'approved');

CREATE POLICY "Instructors can create vendor application"
  ON public.vendors FOR INSERT
  WITH CHECK (owner_id = auth.uid() AND has_role(auth.uid(), 'instructor'));

CREATE POLICY "Admins can manage all vendors"
  ON public.vendors FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Add vendor_id to courses (nullable, existing courses have no vendor)
ALTER TABLE public.courses ADD COLUMN vendor_id uuid REFERENCES public.vendors(id) ON DELETE SET NULL;

-- Update trigger for updated_at
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
