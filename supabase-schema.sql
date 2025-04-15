-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book Summaries table
CREATE TABLE IF NOT EXISTS public.book_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  cover_image TEXT,
  read_time TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Plans table
CREATE TABLE IF NOT EXISTS public.business_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  industry TEXT,
  cover_image TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES public.users(id),
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reading Progress table
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  book_id UUID NOT NULL REFERENCES public.book_summaries(id),
  progress INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Sample data for book summaries
INSERT INTO public.book_summaries (title, author, description, category, cover_image, read_time, price, is_featured)
VALUES
  ('The Psychology of Money', 'Morgan Housel', 'Timeless lessons on wealth, greed, and happiness.', 'Finance', 'https://m.media-amazon.com/images/I/71TRB-fEWsL._AC_UF1000,1000_QL80_.jpg', '15 min', 0, true),
  ('Atomic Habits', 'James Clear', 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', 'Personal Development', 'https://m.media-amazon.com/images/I/81bGKUa1e0L._AC_UF1000,1000_QL80_.jpg', '20 min', 9.99, false),
  ('Zero to One', 'Peter Thiel', 'Notes on Startups, or How to Build the Future.', 'Entrepreneurship', 'https://m.media-amazon.com/images/I/71Xygne8+qL._AC_UF1000,1000_QL80_.jpg', '18 min', 0, true),
  ('Deep Work', 'Cal Newport', 'Rules for Focused Success in a Distracted World.', 'Personal Development', 'https://m.media-amazon.com/images/I/81ZZn3D9PtL._AC_UF1000,1000_QL80_.jpg', '25 min', 9.99, false),
  ('The Lean Startup', 'Eric Ries', 'How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.', 'Entrepreneurship', 'https://m.media-amazon.com/images/I/81-QB7nDh4L._AC_UF1000,1000_QL80_.jpg', '22 min', 0, false),
  ('Thinking, Fast and Slow', 'Daniel Kahneman', 'A detailed exploration of the two systems that drive the way we think.', 'Psychology', 'https://m.media-amazon.com/images/I/61fdrEuPJwL._AC_UF1000,1000_QL80_.jpg', '30 min', 9.99, true);

-- Sample data for business plans
INSERT INTO public.business_plans (title, description, industry, cover_image, price, is_featured)
VALUES
  ('E-commerce Business Plan', 'Complete business plan for starting an online store.', 'E-commerce', 'https://img.freepik.com/free-vector/gradient-sales-instagram-post-template_23-2149651737.jpg', 29.99, true),
  ('Coffee Shop Business Plan', 'Detailed plan for opening a coffee shop.', 'Food & Beverage', 'https://img.freepik.com/free-vector/flat-design-coffee-shop-template_23-2149482264.jpg', 19.99, false),
  ('Tech Startup Business Plan', 'Comprehensive plan for launching a tech startup.', 'Technology', 'https://img.freepik.com/free-vector/gradient-technology-instagram-post-template_23-2149651738.jpg', 39.99, true),
  ('Restaurant Business Plan', 'Complete guide to opening a restaurant.', 'Food & Beverage', 'https://img.freepik.com/free-vector/restaurant-instagram-stories-template_23-2148962553.jpg', 24.99, false);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Book summaries policies
CREATE POLICY "Anyone can view book summaries" ON public.book_summaries
  FOR SELECT USING (true);

CREATE POLICY "Admin users can insert book summaries" ON public.book_summaries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin users can update book summaries" ON public.book_summaries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin users can delete book summaries" ON public.book_summaries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Business plans policies
CREATE POLICY "Anyone can view business plans" ON public.business_plans
  FOR SELECT USING (true);

-- Purchases policies
CREATE POLICY "Users can view their own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Reading progress policies
CREATE POLICY "Users can view their own reading progress" ON public.reading_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading progress" ON public.reading_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress" ON public.reading_progress
  FOR UPDATE USING (auth.uid() = user_id);
