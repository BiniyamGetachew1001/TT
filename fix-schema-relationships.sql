-- Fix the relationship between purchases and users

-- First, check if the purchases table exists and drop it if necessary
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'purchases') THEN
    -- Drop existing foreign key constraints if they exist
    ALTER TABLE IF EXISTS public.purchases DROP CONSTRAINT IF EXISTS purchases_user_id_fkey;
    
    -- We'll recreate the table with proper constraints
    DROP TABLE IF EXISTS public.purchases;
  END IF;
END
$$;

-- Recreate the purchases table with explicit foreign key constraint
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('book-summary', 'business-plan')),
  item_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  UNIQUE(user_id, item_type, item_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchases_user ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_item ON public.purchases(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON public.purchases(created_at DESC);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can create their own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all purchases" ON public.purchases
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchases TO authenticated;

-- Recreate the purchase_details view
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

-- Grant permissions on the view
GRANT SELECT ON public.purchase_details TO authenticated;

-- Refresh the schema cache (this is a workaround that might help)
NOTIFY pgrst, 'reload schema';
