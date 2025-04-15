-- Create book_summaries table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Book summaries policies
CREATE POLICY "Anyone can view book summaries" ON public.book_summaries
  FOR SELECT USING (true);

-- Purchases policies
CREATE POLICY "Users can view their own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample data for book summaries
INSERT INTO public.book_summaries (title, author, description, category, cover_image, read_time, price)
VALUES
  ('The Psychology of Money', 'Morgan Housel', 'Timeless lessons on wealth, greed, and happiness.', 'Finance', 'https://m.media-amazon.com/images/I/71TRB-fEWsL._AC_UF1000,1000_QL80_.jpg', '15 min', 0),
  ('Atomic Habits', 'James Clear', 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', 'Personal Development', 'https://m.media-amazon.com/images/I/81bGKUa1e0L._AC_UF1000,1000_QL80_.jpg', '20 min', 9.99),
  ('Zero to One', 'Peter Thiel', 'Notes on Startups, or How to Build the Future.', 'Entrepreneurship', 'https://m.media-amazon.com/images/I/71Xygne8+qL._AC_UF1000,1000_QL80_.jpg', '18 min', 0),
  ('Deep Work', 'Cal Newport', 'Rules for Focused Success in a Distracted World.', 'Personal Development', 'https://m.media-amazon.com/images/I/81ZZn3D9PtL._AC_UF1000,1000_QL80_.jpg', '25 min', 9.99),
  ('The Lean Startup', 'Eric Ries', 'How Today''s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.', 'Entrepreneurship', 'https://m.media-amazon.com/images/I/81-QB7nDh4L._AC_UF1000,1000_QL80_.jpg', '22 min', 0);