-- =============================================
-- Complete Database Schema for Content Platform
-- =============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Core Tables
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Categories table (shared across content types)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Book Summaries table
CREATE TABLE IF NOT EXISTS public.book_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category_id UUID REFERENCES public.categories(id),
  cover_image TEXT,
  read_time TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Business Plans table
CREATE TABLE IF NOT EXISTS public.business_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category_id UUID REFERENCES public.categories(id),
  cover_image TEXT,
  read_time TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  key_features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Blog Posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  author_id UUID REFERENCES public.users(id),
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_free BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =============================================
-- User Interaction Tables
-- =============================================

-- Purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('book-summary', 'business-plan')),
  item_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('book-summary', 'business-plan', 'blog-post')),
  item_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

-- Reading Progress table
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('book-summary', 'business-plan')),
  item_id UUID NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  last_position TEXT,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

-- User Settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  dark_mode BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Activity Logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  item_title TEXT,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =============================================
-- Create Indexes
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_book_summaries_category ON public.book_summaries(category_id);
CREATE INDEX IF NOT EXISTS idx_book_summaries_price ON public.book_summaries(price);
CREATE INDEX IF NOT EXISTS idx_book_summaries_is_free ON public.book_summaries(is_free);
CREATE INDEX IF NOT EXISTS idx_book_summaries_created_at ON public.book_summaries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_business_plans_category ON public.business_plans(category_id);
CREATE INDEX IF NOT EXISTS idx_business_plans_industry ON public.business_plans(industry);
CREATE INDEX IF NOT EXISTS idx_business_plans_price ON public.business_plans(price);
CREATE INDEX IF NOT EXISTS idx_business_plans_is_free ON public.business_plans(is_free);
CREATE INDEX IF NOT EXISTS idx_business_plans_created_at ON public.business_plans(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_free ON public.blog_posts(is_free);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);

-- User interaction indexes
CREATE INDEX IF NOT EXISTS idx_purchases_user ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_item ON public.purchases(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON public.purchases(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_item ON public.bookmarks(item_type, item_id);

CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON public.reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_item ON public.reading_progress(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_last_read ON public.reading_progress(last_read_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_item ON public.activity_logs(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- =============================================
-- Create Views
-- =============================================

-- Purchase Details View
CREATE OR REPLACE VIEW public.purchase_details AS
SELECT
  p.*,
  u.email as user_email,
  u.name as user_name,
  CASE
    WHEN p.item_type = 'book-summary' THEN
      jsonb_build_object(
        'id', bs.id,
        'title', bs.title,
        'author', bs.author,
        'cover_image', bs.cover_image,
        'category_id', bs.category_id
      )
    ELSE NULL
  END AS book_summary,
  CASE
    WHEN p.item_type = 'business-plan' THEN
      jsonb_build_object(
        'id', bp.id,
        'title', bp.title,
        'industry', bp.industry,
        'cover_image', bp.cover_image
      )
    ELSE NULL
  END AS business_plan
FROM
  public.purchases p
LEFT JOIN
  public.users u ON p.user_id = u.id
LEFT JOIN
  public.book_summaries bs ON p.item_type = 'book-summary' AND p.item_id = bs.id
LEFT JOIN
  public.business_plans bp ON p.item_type = 'business-plan' AND p.item_id = bp.id;

-- User Library View
CREATE OR REPLACE VIEW public.user_library AS
SELECT
  u.id as user_id,
  u.email,
  u.name,
  COUNT(DISTINCT p.id) FILTER (WHERE p.item_type = 'book-summary' AND p.status = 'completed') as book_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.item_type = 'business-plan' AND p.status = 'completed') as plan_count,
  COUNT(DISTINCT b.id) as bookmark_count,
  SUM(p.amount) FILTER (WHERE p.status = 'completed') as total_spent
FROM
  public.users u
LEFT JOIN
  public.purchases p ON u.id = p.user_id
LEFT JOIN
  public.bookmarks b ON u.id = b.user_id
GROUP BY
  u.id, u.email, u.name;

-- =============================================
-- Helper Functions
-- =============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM public.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns a resource
CREATE OR REPLACE FUNCTION public.is_owner(resource_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = resource_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', 'user');
  
  -- Create default settings for new user
  INSERT INTO public.settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Create Triggers
-- =============================================

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update timestamp triggers
CREATE TRIGGER update_users_timestamp
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_book_summaries_timestamp
  BEFORE UPDATE ON public.book_summaries
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_business_plans_timestamp
  BEFORE UPDATE ON public.business_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_blog_posts_timestamp
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_reading_progress_timestamp
  BEFORE UPDATE ON public.reading_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_settings_timestamp
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- =============================================
-- Enable Row Level Security
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Create RLS Policies
-- =============================================

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (public.is_admin());

-- Categories policies
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- Content policies
-- Book Summaries
CREATE POLICY "Anyone can view book summaries" ON public.book_summaries
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage book summaries" ON public.book_summaries
  FOR ALL USING (public.is_admin());

-- Business Plans
CREATE POLICY "Anyone can view business plans" ON public.business_plans
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage business plans" ON public.business_plans
  FOR ALL USING (public.is_admin());

-- Blog Posts
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
  FOR ALL USING (public.is_admin());

-- User interaction policies
-- Purchases
CREATE POLICY "Users can view their own purchases" ON public.purchases
  FOR SELECT USING (public.is_owner(user_id) OR public.is_admin());

CREATE POLICY "Users can create their own purchases" ON public.purchases
  FOR INSERT WITH CHECK (public.is_owner(user_id));

CREATE POLICY "Admins can manage all purchases" ON public.purchases
  FOR ALL USING (public.is_admin());

-- Bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT USING (public.is_owner(user_id) OR public.is_admin());

CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks
  FOR ALL USING (public.is_owner(user_id));

-- Reading Progress
CREATE POLICY "Users can view their own reading progress" ON public.reading_progress
  FOR SELECT USING (public.is_owner(user_id) OR public.is_admin());

CREATE POLICY "Users can manage their own reading progress" ON public.reading_progress
  FOR ALL USING (public.is_owner(user_id));

-- Settings
CREATE POLICY "Users can view their own settings" ON public.settings
  FOR SELECT USING (public.is_owner(user_id) OR public.is_admin());

CREATE POLICY "Users can manage their own settings" ON public.settings
  FOR ALL USING (public.is_owner(user_id));

-- Activity Logs
CREATE POLICY "Admins can view all activity logs" ON public.activity_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Anyone can create activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (true);

-- =============================================
-- Grant Permissions
-- =============================================

-- Grant permissions to anonymous users (public access)
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.book_summaries TO anon;
GRANT SELECT ON public.business_plans TO anon;
GRANT SELECT ON public.blog_posts TO anon;

-- Grant permissions to authenticated users
GRANT SELECT ON public.categories TO authenticated;
GRANT SELECT ON public.book_summaries TO authenticated;
GRANT SELECT ON public.business_plans TO authenticated;
GRANT SELECT ON public.blog_posts TO authenticated;
GRANT SELECT ON public.purchase_details TO authenticated;
GRANT SELECT ON public.user_library TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchases TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;

-- =============================================
-- Insert Sample Data
-- =============================================

-- Insert categories
INSERT INTO public.categories (name, description)
VALUES
  ('Personal Development', 'Books and resources for personal growth'),
  ('Finance', 'Financial literacy and wealth building'),
  ('Entrepreneurship', 'Starting and growing businesses'),
  ('Technology', 'Tech trends and innovations'),
  ('Food & Beverage', 'Food and beverage business resources')
ON CONFLICT (name) DO NOTHING;

-- Create admin user if it doesn't exist
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@example.com', '{"name":"Admin User"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, name, role)
VALUES  
  ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'Admin User', 'admin') 
ON CONFLICT (id) DO UPDATE  
SET email = EXCLUDED.email, 
    name = EXCLUDED.name, 
    role = EXCLUDED.role;

-- Insert sample book summaries
INSERT INTO public.book_summaries (title, author, description, category_id, cover_image, read_time, price, is_free)
VALUES 
  ('The Psychology of Money', 'Morgan Housel', 'Timeless lessons on wealth, greed, and happiness.', 
   (SELECT id FROM public.categories WHERE name = 'Finance'), 
   'https://m.media-amazon.com/images/I/71TRB-fEWsL._AC_UF1000,1000_QL80_.jpg', '15 min', 0, true),
  
  ('Atomic Habits', 'James Clear', 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', 
   (SELECT id FROM public.categories WHERE name = 'Personal Development'), 
   'https://m.media-amazon.com/images/I/81bGKUa1e0L._AC_UF1000,1000_QL80_.jpg', '20 min', 9.99, false)
ON CONFLICT DO NOTHING;

-- Insert sample business plans
INSERT INTO public.business_plans (title, description, industry, category_id, cover_image, price, is_free)
VALUES 
  ('E-commerce Business Plan', 'Complete business plan for starting an online store.', 
   'E-commerce', (SELECT id FROM public.categories WHERE name = 'Entrepreneurship'), 
   'https://img.freepik.com/free-vector/gradient-sales-instagram-post-template_23-2149651737.jpg', 29.99, false),
  
  ('Coffee Shop Business Plan', 'Detailed plan for opening a coffee shop.', 
   'Food & Beverage', (SELECT id FROM public.categories WHERE name = 'Food & Beverage'), 
   'https://img.freepik.com/free-vector/flat-design-coffee-shop-template_23-2149482264.jpg', 19.99, false)
ON CONFLICT DO NOTHING;

-- Insert sample blog post
INSERT INTO public.blog_posts (
  title,
  excerpt,
  content,
  category_id,
  tags,
  status,
  author_id,
  cover_image,
  is_free
)
VALUES (
  'Getting Started with Content Management',
  'Learn how to effectively manage your content with our platform.',
  '<p>This is a comprehensive guide to content management using our platform. Follow these steps to get started...</p>',
  (SELECT id FROM public.categories WHERE name = 'Technology'),
  ARRAY['content', 'management', 'guide'],
  'published',
  '00000000-0000-0000-0000-000000000000',
  'https://img.freepik.com/free-vector/content-management-system-concept-illustration_114360-8013.jpg',
  true
)
ON CONFLICT DO NOTHING;

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog_images', 'blog_images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read blog images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog_images');

-- Allow authenticated users to upload blog images
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog_images');
