-- Fix the relationship between purchases and users
-- This script will ensure the foreign key relationship is properly established

-- First, check if the foreign key constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'purchases_user_id_fkey' 
    AND table_name = 'purchases'
  ) THEN
    -- Add the foreign key constraint if it doesn't exist
    ALTER TABLE public.purchases
    ADD CONSTRAINT purchases_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id);
  END IF;
END
$$;

-- Create or replace the purchase_details view to include user information
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
        'category', bs.category
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
  public.book_summaries bs ON p.item_type = 'book-summary' AND p.item_id::uuid = bs.id
LEFT JOIN
  public.business_plans bp ON p.item_type = 'business-plan' AND p.item_id::uuid = bp.id;

-- Ensure proper permissions on the view
ALTER VIEW public.purchase_details OWNER TO postgres;
GRANT SELECT ON public.purchase_details TO anon, authenticated, service_role;

-- Ensure RLS policies are in place
CREATE POLICY IF NOT EXISTS "Users can view their own purchases" 
ON public.purchases
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own purchases" 
ON public.purchases
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all purchases" 
ON public.purchases
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
