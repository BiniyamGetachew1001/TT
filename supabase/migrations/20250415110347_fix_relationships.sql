-- Fix the relationship between purchases and book_summaries

-- First, let's modify our query approach to use a different join syntax
-- Instead of using the foreign key relationship directly, we'll create a view

CREATE OR REPLACE VIEW purchase_details AS
SELECT
  p.*,
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
  purchases p
LEFT JOIN
  book_summaries bs ON p.item_type = 'book-summary' AND p.item_id::uuid = bs.id
LEFT JOIN
  business_plans bp ON p.item_type = 'business-plan' AND p.item_id::uuid = bp.id;

-- Create RLS policy for the view
ALTER VIEW purchase_details OWNER TO postgres;
GRANT SELECT ON purchase_details TO anon, authenticated, service_role;

-- Create a policy to allow users to view their own purchase details
CREATE POLICY "Users can view their own purchase details" ON purchases
  FOR SELECT USING (auth.uid() = user_id);