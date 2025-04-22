-- Fix for the specific query error with purchases, users, and book_summaries

-- 1. First, let's check if the tables exist
DO $$
BEGIN
  -- Create users table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    CREATE TABLE public.users (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
    );
  END IF;

  -- Create book_summaries table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_summaries') THEN
    CREATE TABLE public.book_summaries (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT,
      content TEXT,
      category_id UUID,
      cover_image TEXT,
      read_time TEXT,
      price DECIMAL(10, 2) DEFAULT 0,
      is_free BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
    );
  END IF;
END
$$;

-- 2. Now fix the purchases table with explicit foreign keys and proper naming
DO $$
BEGIN
  -- Drop the purchases table if it exists
  DROP TABLE IF EXISTS public.purchases CASCADE;
  
  -- Create the purchases table with explicit foreign keys
  CREATE TABLE public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('book-summary', 'business-plan')),
    item_id UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    
    -- Add explicit foreign key constraint to users
    CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) 
      REFERENCES public.users(id) ON DELETE CASCADE,
      
    -- Add unique constraint
    CONSTRAINT purchases_user_item_unique UNIQUE(user_id, item_type, item_id)
  );
  
  -- Add indexes
  CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
  CREATE INDEX idx_purchases_item ON public.purchases(item_type, item_id);
  CREATE INDEX idx_purchases_created_at ON public.purchases(created_at DESC);
END
$$;

-- 3. Enable RLS and create policies
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
CREATE POLICY "Users can view their own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id OR 
                   EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can insert their own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update purchases" ON public.purchases
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete purchases" ON public.purchases
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 4. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchases TO authenticated;

-- 5. Create a view that explicitly joins the tables
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
        'cover_image', bs.cover_image
      )
    ELSE NULL
  END AS book_summary
FROM
  public.purchases p
LEFT JOIN
  public.users u ON p.user_id = u.id
LEFT JOIN
  public.book_summaries bs ON p.item_type = 'book-summary' AND p.item_id = bs.id;

-- Grant permissions on the view
GRANT SELECT ON public.purchase_details TO authenticated;

-- 6. Insert sample data to test the relationships
-- Insert admin user if not exists
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

-- Insert sample book summary
INSERT INTO public.book_summaries (id, title, author, description, cover_image, read_time, price, is_free)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Sample Book', 'Sample Author', 'Sample Description', 
   'https://example.com/cover.jpg', '15 min', 9.99, false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample purchase
INSERT INTO public.purchases (user_id, item_type, item_id, amount, status)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'book-summary', '11111111-1111-1111-1111-111111111111', 9.99, 'completed')
ON CONFLICT (user_id, item_type, item_id) DO NOTHING;

-- 7. Force refresh the schema cache
NOTIFY pgrst, 'reload schema';
