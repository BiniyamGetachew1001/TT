-- 02_row_level_security.sql
-- This snippet sets up Row Level Security (RLS) policies for the tables

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" 
  ON public.users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users" 
  ON public.users FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for book_summaries table
CREATE POLICY "Anyone can view book summaries" 
  ON public.book_summaries FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert book summaries" 
  ON public.book_summaries FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update book summaries" 
  ON public.book_summaries FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete book summaries" 
  ON public.book_summaries FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for business_plans table
CREATE POLICY "Anyone can view business plans" 
  ON public.business_plans FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert business plans" 
  ON public.business_plans FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update business plans" 
  ON public.business_plans FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete business plans" 
  ON public.business_plans FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for blog_posts table
CREATE POLICY "Anyone can view published blog posts" 
  ON public.blog_posts FOR SELECT 
  USING (status = 'published' OR (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  ));

CREATE POLICY "Admins can insert blog posts" 
  ON public.blog_posts FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update blog posts" 
  ON public.blog_posts FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete blog posts" 
  ON public.blog_posts FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for purchases table
CREATE POLICY "Users can view their own purchases" 
  ON public.purchases FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" 
  ON public.purchases FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own purchases" 
  ON public.purchases FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update purchases" 
  ON public.purchases FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for bookmarks table
CREATE POLICY "Users can view their own bookmarks" 
  ON public.bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" 
  ON public.bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for reading_progress table
CREATE POLICY "Users can view their own reading progress" 
  ON public.reading_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading progress" 
  ON public.reading_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress" 
  ON public.reading_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for activity_logs table
CREATE POLICY "Users can view their own activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert activity logs" 
  ON public.activity_logs FOR INSERT 
  WITH CHECK (true);
