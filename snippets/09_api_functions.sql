-- 09_api_functions.sql
-- This snippet creates API functions for frontend use

-- Function to get user's purchased content
CREATE OR REPLACE FUNCTION public.get_user_purchases(user_id_param UUID)
RETURNS TABLE (
  purchase_id UUID,
  item_type TEXT,
  item_id UUID,
  title TEXT,
  author TEXT,
  category TEXT,
  cover_image TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE,
  amount NUMERIC,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS purchase_id,
    p.item_type,
    p.item_id,
    CASE
      WHEN p.item_type = 'book-summary' THEN bs.title
      WHEN p.item_type = 'business-plan' THEN bp.title
      ELSE 'Unknown'
    END AS title,
    CASE
      WHEN p.item_type = 'book-summary' THEN bs.author
      WHEN p.item_type = 'business-plan' THEN bp.author
      ELSE 'Unknown'
    END AS author,
    CASE
      WHEN p.item_type = 'book-summary' THEN bs.category
      WHEN p.item_type = 'business-plan' THEN bp.industry
      ELSE 'Unknown'
    END AS category,
    CASE
      WHEN p.item_type = 'book-summary' THEN bs.cover_image
      WHEN p.item_type = 'business-plan' THEN bp.cover_image
      ELSE NULL
    END AS cover_image,
    p.created_at AS purchase_date,
    p.amount,
    p.status
  FROM
    public.purchases p
  LEFT JOIN
    public.book_summaries bs ON p.item_type = 'book-summary' AND p.item_id = bs.id
  LEFT JOIN
    public.business_plans bp ON p.item_type = 'business-plan' AND p.item_id = bp.id
  WHERE
    p.user_id = user_id_param
  ORDER BY
    p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has purchased an item
CREATE OR REPLACE FUNCTION public.has_user_purchased(
  user_id_param UUID,
  item_type_param TEXT,
  item_id_param UUID
) RETURNS BOOLEAN AS $$
DECLARE
  has_purchased BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.purchases
    WHERE
      user_id = user_id_param AND
      item_type = item_type_param AND
      item_id = item_id_param AND
      status = 'completed'
  ) INTO has_purchased;
  
  RETURN has_purchased;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's bookmarks with content details
CREATE OR REPLACE FUNCTION public.get_user_bookmarks(user_id_param UUID)
RETURNS TABLE (
  bookmark_id UUID,
  item_type TEXT,
  item_id UUID,
  title TEXT,
  author TEXT,
  category TEXT,
  cover_image TEXT,
  bookmark_date TIMESTAMP WITH TIME ZONE,
  progress INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id AS bookmark_id,
    b.item_type,
    b.item_id,
    CASE
      WHEN b.item_type = 'book-summary' THEN bs.title
      WHEN b.item_type = 'business-plan' THEN bp.title
      WHEN b.item_type = 'blog-post' THEN blog.title
      ELSE 'Unknown'
    END AS title,
    CASE
      WHEN b.item_type = 'book-summary' THEN bs.author
      WHEN b.item_type = 'business-plan' THEN bp.author
      WHEN b.item_type = 'blog-post' THEN (SELECT name FROM public.users WHERE id = blog.author_id)
      ELSE 'Unknown'
    END AS author,
    CASE
      WHEN b.item_type = 'book-summary' THEN bs.category
      WHEN b.item_type = 'business-plan' THEN bp.industry
      WHEN b.item_type = 'blog-post' THEN blog.category
      ELSE 'Unknown'
    END AS category,
    CASE
      WHEN b.item_type = 'book-summary' THEN bs.cover_image
      WHEN b.item_type = 'business-plan' THEN bp.cover_image
      WHEN b.item_type = 'blog-post' THEN blog.cover_image
      ELSE NULL
    END AS cover_image,
    b.created_at AS bookmark_date,
    COALESCE(rp.progress, 0) AS progress
  FROM
    public.bookmarks b
  LEFT JOIN
    public.book_summaries bs ON b.item_type = 'book-summary' AND b.item_id = bs.id
  LEFT JOIN
    public.business_plans bp ON b.item_type = 'business-plan' AND b.item_id = bp.id
  LEFT JOIN
    public.blog_posts blog ON b.item_type = 'blog-post' AND b.item_id = blog.id
  LEFT JOIN
    public.reading_progress rp ON b.user_id = rp.user_id AND b.item_type = rp.item_type AND b.item_id = rp.item_id
  WHERE
    b.user_id = user_id_param
  ORDER BY
    b.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle bookmark status
CREATE OR REPLACE FUNCTION public.toggle_bookmark(
  user_id_param UUID,
  item_type_param TEXT,
  item_id_param UUID
) RETURNS BOOLEAN AS $$
DECLARE
  bookmark_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.bookmarks
    WHERE
      user_id = user_id_param AND
      item_type = item_type_param AND
      item_id = item_id_param
  ) INTO bookmark_exists;
  
  IF bookmark_exists THEN
    -- Remove bookmark
    DELETE FROM public.bookmarks
    WHERE
      user_id = user_id_param AND
      item_type = item_type_param AND
      item_id = item_id_param;
    
    RETURN FALSE;
  ELSE
    -- Add bookmark
    INSERT INTO public.bookmarks (user_id, item_type, item_id)
    VALUES (user_id_param, item_type_param, item_id_param);
    
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update reading progress
CREATE OR REPLACE FUNCTION public.update_reading_progress(
  user_id_param UUID,
  item_type_param TEXT,
  item_id_param UUID,
  progress_param INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  progress_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.reading_progress
    WHERE
      user_id = user_id_param AND
      item_type = item_type_param AND
      item_id = item_id_param
  ) INTO progress_exists;
  
  IF progress_exists THEN
    -- Update existing progress
    UPDATE public.reading_progress
    SET
      progress = progress_param,
      last_read_at = NOW(),
      updated_at = NOW()
    WHERE
      user_id = user_id_param AND
      item_type = item_type_param AND
      item_id = item_id_param;
  ELSE
    -- Create new progress record
    INSERT INTO public.reading_progress (user_id, item_type, item_id, progress)
    VALUES (user_id_param, item_type_param, item_id_param, progress_param);
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search content across all types
CREATE OR REPLACE FUNCTION public.search_content(search_query TEXT)
RETURNS TABLE (
  item_type TEXT,
  item_id UUID,
  title TEXT,
  author TEXT,
  category TEXT,
  description TEXT,
  cover_image TEXT,
  price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  -- Search book summaries
  SELECT
    'book-summary' AS item_type,
    id AS item_id,
    title,
    author,
    category,
    description,
    cover_image,
    price,
    created_at
  FROM
    public.book_summaries
  WHERE
    title ILIKE '%' || search_query || '%' OR
    author ILIKE '%' || search_query || '%' OR
    category ILIKE '%' || search_query || '%' OR
    description ILIKE '%' || search_query || '%'
  
  UNION ALL
  
  -- Search business plans
  SELECT
    'business-plan' AS item_type,
    id AS item_id,
    title,
    author,
    industry AS category,
    description,
    cover_image,
    price,
    created_at
  FROM
    public.business_plans
  WHERE
    title ILIKE '%' || search_query || '%' OR
    author ILIKE '%' || search_query || '%' OR
    industry ILIKE '%' || search_query || '%' OR
    description ILIKE '%' || search_query || '%'
  
  UNION ALL
  
  -- Search blog posts
  SELECT
    'blog-post' AS item_type,
    id AS item_id,
    title,
    (SELECT name FROM public.users WHERE id = author_id) AS author,
    category,
    excerpt AS description,
    cover_image,
    0::NUMERIC AS price,
    created_at
  FROM
    public.blog_posts
  WHERE
    status = 'published' AND
    (
      title ILIKE '%' || search_query || '%' OR
      category ILIKE '%' || search_query || '%' OR
      excerpt ILIKE '%' || search_query || '%' OR
      content ILIKE '%' || search_query || '%' OR
      EXISTS (
        SELECT 1
        FROM unnest(tags) tag
        WHERE tag ILIKE '%' || search_query || '%'
      )
    )
  
  ORDER BY
    CASE
      WHEN title ILIKE '%' || search_query || '%' THEN 1
      WHEN author ILIKE '%' || search_query || '%' THEN 2
      WHEN category ILIKE '%' || search_query || '%' THEN 3
      ELSE 4
    END,
    created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
