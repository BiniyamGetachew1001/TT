-- 07_storage_setup.sql
-- This snippet sets up storage buckets and policies

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('book-covers', 'Book Cover Images', true),
  ('business-plan-images', 'Business Plan Images', true),
  ('blog-images', 'Blog Post Images', true),
  ('profile-images', 'User Profile Images', true),
  ('content-images', 'Content Images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for book covers
CREATE POLICY "Public Access to Book Covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'book-covers');

CREATE POLICY "Admin Users Can Upload Book Covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'book-covers' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

CREATE POLICY "Admin Users Can Update Book Covers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'book-covers' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

CREATE POLICY "Admin Users Can Delete Book Covers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'book-covers' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

-- Set up storage policies for business plan images
CREATE POLICY "Public Access to Business Plan Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-plan-images');

CREATE POLICY "Admin Users Can Upload Business Plan Images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'business-plan-images' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

CREATE POLICY "Admin Users Can Update Business Plan Images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'business-plan-images' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

CREATE POLICY "Admin Users Can Delete Business Plan Images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'business-plan-images' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

-- Set up storage policies for blog images
CREATE POLICY "Public Access to Blog Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admin Users Can Upload Blog Images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

CREATE POLICY "Admin Users Can Update Blog Images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'blog-images' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

CREATE POLICY "Admin Users Can Delete Blog Images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-images' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

-- Set up storage policies for profile images
CREATE POLICY "Public Access to Profile Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Users Can Upload Their Own Profile Images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users Can Update Their Own Profile Images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users Can Delete Their Own Profile Images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Set up storage policies for content images
CREATE POLICY "Public Access to Content Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-images');

CREATE POLICY "Admin Users Can Upload Content Images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'content-images' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

CREATE POLICY "Admin Users Can Update Content Images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'content-images' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

CREATE POLICY "Admin Users Can Delete Content Images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'content-images' AND
    (auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );
