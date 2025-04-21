-- Drop existing RLS policies for book_summaries
DROP POLICY IF EXISTS "Anyone can view published book summaries" ON public.book_summaries;
DROP POLICY IF EXISTS "Authenticated users can view all book summaries" ON public.book_summaries;
DROP POLICY IF EXISTS "Admins can create book summaries" ON public.book_summaries;
DROP POLICY IF EXISTS "Admins can update book summaries" ON public.book_summaries;
DROP POLICY IF EXISTS "Admins can delete book summaries" ON public.book_summaries;

-- Create new RLS policies for book_summaries
ALTER TABLE public.book_summaries ENABLE ROW LEVEL SECURITY;

-- Policy for public viewing of published book summaries
CREATE POLICY "Anyone can view published book summaries"
ON public.book_summaries
FOR SELECT
USING (true);

-- Policy for admin creation of book summaries
CREATE POLICY "Admins can create book summaries"
ON public.book_summaries
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
);

-- Policy for admin updates to book summaries
CREATE POLICY "Admins can update book summaries"
ON public.book_summaries
FOR UPDATE
USING (
  auth.role() = 'authenticated'
)
WITH CHECK (
  auth.role() = 'authenticated'
);

-- Policy for admin deletion of book summaries
CREATE POLICY "Admins can delete book summaries"
ON public.book_summaries
FOR DELETE
USING (
  auth.role() = 'authenticated'
);

-- Repeat for business_plans table
DROP POLICY IF EXISTS "Anyone can view published business plans" ON public.business_plans;
DROP POLICY IF EXISTS "Authenticated users can view all business plans" ON public.business_plans;
DROP POLICY IF EXISTS "Admins can create business plans" ON public.business_plans;
DROP POLICY IF EXISTS "Admins can update business plans" ON public.business_plans;
DROP POLICY IF EXISTS "Admins can delete business plans" ON public.business_plans;

ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published business plans"
ON public.business_plans
FOR SELECT
USING (true);

CREATE POLICY "Admins can create business plans"
ON public.business_plans
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY "Admins can update business plans"
ON public.business_plans
FOR UPDATE
USING (
  auth.role() = 'authenticated'
)
WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY "Admins can delete business plans"
ON public.business_plans
FOR DELETE
USING (
  auth.role() = 'authenticated'
);

-- Repeat for blog_posts table
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (true);

CREATE POLICY "Admins can create blog posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts
FOR UPDATE
USING (
  auth.role() = 'authenticated'
)
WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts
FOR DELETE
USING (
  auth.role() = 'authenticated'
);
