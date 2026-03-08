
-- Platform settings table: single-row key-value store for admin config
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read platform settings (needed for certificate rendering)
CREATE POLICY "Platform settings readable by everyone"
  ON public.platform_settings FOR SELECT
  USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage platform settings"
  ON public.platform_settings FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed the certificate settings row
INSERT INTO public.platform_settings (key, value)
VALUES ('certificate_config', '{"template":"classic","bg_url":null,"signature_url":null,"custom_text":{}}'::jsonb);
