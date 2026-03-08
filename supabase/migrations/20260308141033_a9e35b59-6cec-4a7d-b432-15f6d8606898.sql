
-- Purchase codes table
CREATE TABLE public.purchase_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  course_ids uuid[] NOT NULL DEFAULT '{}',
  expires_at timestamptz,
  max_uses integer NOT NULL DEFAULT 1,
  used_count integer NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  created_by uuid NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.purchase_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage purchase codes"
  ON public.purchase_codes FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Purchase code redemptions table
CREATE TABLE public.purchase_code_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid REFERENCES public.purchase_codes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  generated_email text NOT NULL,
  redeemed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.purchase_code_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage redemptions"
  ON public.purchase_code_redemptions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));
