
-- Create vendor-assets storage bucket (public so images are accessible)
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-assets', 'vendor-assets', true);

-- Allow vendor owners to upload to their own folder
CREATE POLICY "Vendor owners can upload assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vendor-assets'
  AND EXISTS (
    SELECT 1 FROM public.vendors
    WHERE owner_id = auth.uid()
    AND id::text = (storage.foldername(name))[1]
    AND status = 'approved'
  )
);

-- Allow vendor owners to update their own assets
CREATE POLICY "Vendor owners can update assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vendor-assets'
  AND EXISTS (
    SELECT 1 FROM public.vendors
    WHERE owner_id = auth.uid()
    AND id::text = (storage.foldername(name))[1]
  )
);

-- Allow vendor owners to delete their own assets
CREATE POLICY "Vendor owners can delete assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vendor-assets'
  AND EXISTS (
    SELECT 1 FROM public.vendors
    WHERE owner_id = auth.uid()
    AND id::text = (storage.foldername(name))[1]
  )
);

-- Anyone can view vendor assets (public bucket)
CREATE POLICY "Anyone can view vendor assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'vendor-assets');
