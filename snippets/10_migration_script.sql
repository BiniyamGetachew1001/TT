-- 10_migration_script.sql
-- This snippet provides a complete migration script to set up the database from scratch

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.reading_progress CASCADE;
DROP TABLE IF EXISTS public.bookmarks CASCADE;
DROP TABLE IF EXISTS public.purchases CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.business_plans CASCADE;
DROP TABLE IF EXISTS public.book_summaries CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book_summaries table
CREATE TABLE public.book_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  read_time TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_plans table
CREATE TABLE public.business_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT NOT NULL,
  read_time TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES public.users(id),
  cover_image TEXT,
  excerpt TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Create reading_progress table
CREATE TABLE public.reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON public.users (email);
CREATE INDEX idx_users_role ON public.users (role);
CREATE INDEX idx_users_status ON public.users (status);
CREATE INDEX idx_users_created_at ON public.users (created_at);

CREATE INDEX idx_book_summaries_title ON public.book_summaries (title);
CREATE INDEX idx_book_summaries_author ON public.book_summaries (author);
CREATE INDEX idx_book_summaries_category ON public.book_summaries (category);
CREATE INDEX idx_book_summaries_price ON public.book_summaries (price);
CREATE INDEX idx_book_summaries_created_at ON public.book_summaries (created_at);

CREATE INDEX idx_business_plans_title ON public.business_plans (title);
CREATE INDEX idx_business_plans_industry ON public.business_plans (industry);
CREATE INDEX idx_business_plans_author ON public.business_plans (author);
CREATE INDEX idx_business_plans_price ON public.business_plans (price);
CREATE INDEX idx_business_plans_created_at ON public.business_plans (created_at);

CREATE INDEX idx_blog_posts_title ON public.blog_posts (title);
CREATE INDEX idx_blog_posts_category ON public.blog_posts (category);
CREATE INDEX idx_blog_posts_status ON public.blog_posts (status);
CREATE INDEX idx_blog_posts_author_id ON public.blog_posts (author_id);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts (published_at);
CREATE INDEX idx_blog_posts_created_at ON public.blog_posts (created_at);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN (tags);

CREATE INDEX idx_purchases_user_id ON public.purchases (user_id);
CREATE INDEX idx_purchases_item_type ON public.purchases (item_type);
CREATE INDEX idx_purchases_item_id ON public.purchases (item_id);
CREATE INDEX idx_purchases_status ON public.purchases (status);
CREATE INDEX idx_purchases_created_at ON public.purchases (created_at);
CREATE INDEX idx_purchases_user_id_status ON public.purchases (user_id, status);
CREATE INDEX idx_purchases_item_type_item_id ON public.purchases (item_type, item_id);

CREATE INDEX idx_bookmarks_user_id ON public.bookmarks (user_id);
CREATE INDEX idx_bookmarks_item_type ON public.bookmarks (item_type);
CREATE INDEX idx_bookmarks_item_id ON public.bookmarks (item_id);
CREATE INDEX idx_bookmarks_created_at ON public.bookmarks (created_at);
CREATE INDEX idx_bookmarks_user_id_item_type ON public.bookmarks (user_id, item_type);

CREATE INDEX idx_reading_progress_user_id ON public.reading_progress (user_id);
CREATE INDEX idx_reading_progress_item_type ON public.reading_progress (item_type);
CREATE INDEX idx_reading_progress_item_id ON public.reading_progress (item_id);
CREATE INDEX idx_reading_progress_last_read_at ON public.reading_progress (last_read_at);
CREATE INDEX idx_reading_progress_user_id_item_type ON public.reading_progress (user_id, item_type);

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs (user_id);
CREATE INDEX idx_activity_logs_action ON public.activity_logs (action);
CREATE INDEX idx_activity_logs_entity_type ON public.activity_logs (entity_type);
CREATE INDEX idx_activity_logs_entity_id ON public.activity_logs (entity_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs (created_at);
CREATE INDEX idx_activity_logs_user_id_action ON public.activity_logs (user_id, action);
CREATE INDEX idx_activity_logs_entity_type_entity_id ON public.activity_logs (entity_type, entity_id);

-- Create views
CREATE OR REPLACE VIEW public.purchase_details AS
SELECT 
  p.id,
  p.user_id,
  p.item_type,
  p.item_id,
  p.amount,
  p.currency,
  p.status,
  p.payment_id,
  p.created_at,
  u.email AS user_email,
  u.name AS user_name,
  CASE 
    WHEN p.item_type = 'book-summary' THEN bs.title
    WHEN p.item_type = 'business-plan' THEN bp.title
    ELSE NULL
  END AS item_title,
  CASE 
    WHEN p.item_type = 'book-summary' THEN bs.author
    WHEN p.item_type = 'business-plan' THEN bp.author
    ELSE NULL
  END AS item_author,
  CASE 
    WHEN p.item_type = 'book-summary' THEN bs.category
    WHEN p.item_type = 'business-plan' THEN bp.industry
    ELSE NULL
  END AS item_category
FROM 
  public.purchases p
LEFT JOIN 
  public.users u ON p.user_id = u.id
LEFT JOIN 
  public.book_summaries bs ON p.item_type = 'book-summary' AND p.item_id = bs.id
LEFT JOIN 
  public.business_plans bp ON p.item_type = 'business-plan' AND p.item_id = bp.id;

-- Create admin user
INSERT INTO public.users (id, email, name, role, status)
VALUES (
  uuid_generate_v4(),
  'admin@example.com',
  'Admin User',
  'admin',
  'active'
)
ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create basic policies
-- Users table policies
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" 
  ON public.users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Book summaries policies
CREATE POLICY "Anyone can view book summaries" 
  ON public.book_summaries FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage book summaries" 
  ON public.book_summaries 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Business plans policies
CREATE POLICY "Anyone can view business plans" 
  ON public.business_plans FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage business plans" 
  ON public.business_plans 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts" 
  ON public.blog_posts FOR SELECT 
  USING (status = 'published' OR (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  ));

CREATE POLICY "Admins can manage blog posts" 
  ON public.blog_posts 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Purchases policies
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

-- Bookmarks policies
CREATE POLICY "Users can manage their own bookmarks" 
  ON public.bookmarks 
  USING (auth.uid() = user_id);

-- Reading progress policies
CREATE POLICY "Users can manage their own reading progress" 
  ON public.reading_progress 
  USING (auth.uid() = user_id);

-- Activity logs policies
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
