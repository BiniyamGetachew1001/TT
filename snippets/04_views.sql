-- 04_views.sql
-- This snippet creates views for easier data access

-- View for purchase details with related information
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

-- View for user content access (what content each user has access to)
CREATE OR REPLACE VIEW public.user_content_access AS
SELECT 
  u.id AS user_id,
  u.email,
  u.name,
  'book-summary' AS content_type,
  bs.id AS content_id,
  bs.title,
  bs.author,
  bs.category,
  p.created_at AS purchased_at,
  p.status AS purchase_status
FROM 
  public.users u
JOIN 
  public.purchases p ON u.id = p.user_id AND p.status = 'completed'
JOIN 
  public.book_summaries bs ON p.item_type = 'book-summary' AND p.item_id = bs.id
UNION ALL
SELECT 
  u.id AS user_id,
  u.email,
  u.name,
  'business-plan' AS content_type,
  bp.id AS content_id,
  bp.title,
  bp.author,
  bp.industry AS category,
  p.created_at AS purchased_at,
  p.status AS purchase_status
FROM 
  public.users u
JOIN 
  public.purchases p ON u.id = p.user_id AND p.status = 'completed'
JOIN 
  public.business_plans bp ON p.item_type = 'business-plan' AND p.item_id = bp.id;

-- View for user bookmarks with content details
CREATE OR REPLACE VIEW public.user_bookmarks_details AS
SELECT 
  b.id AS bookmark_id,
  b.user_id,
  b.item_type,
  b.item_id,
  b.created_at,
  u.email AS user_email,
  u.name AS user_name,
  CASE 
    WHEN b.item_type = 'book-summary' THEN bs.title
    WHEN b.item_type = 'business-plan' THEN bp.title
    WHEN b.item_type = 'blog-post' THEN blog.title
    ELSE NULL
  END AS item_title,
  CASE 
    WHEN b.item_type = 'book-summary' THEN bs.author
    WHEN b.item_type = 'business-plan' THEN bp.author
    WHEN b.item_type = 'blog-post' THEN (SELECT name FROM public.users WHERE id = blog.author_id)
    ELSE NULL
  END AS item_author,
  CASE 
    WHEN b.item_type = 'book-summary' THEN bs.category
    WHEN b.item_type = 'business-plan' THEN bp.industry
    WHEN b.item_type = 'blog-post' THEN blog.category
    ELSE NULL
  END AS item_category
FROM 
  public.bookmarks b
JOIN 
  public.users u ON b.user_id = u.id
LEFT JOIN 
  public.book_summaries bs ON b.item_type = 'book-summary' AND b.item_id = bs.id
LEFT JOIN 
  public.business_plans bp ON b.item_type = 'business-plan' AND b.item_id = bp.id
LEFT JOIN 
  public.blog_posts blog ON b.item_type = 'blog-post' AND b.item_id = blog.id;

-- View for user reading progress with content details
CREATE OR REPLACE VIEW public.user_reading_progress_details AS
SELECT 
  rp.id AS progress_id,
  rp.user_id,
  rp.item_type,
  rp.item_id,
  rp.progress,
  rp.last_read_at,
  rp.created_at,
  rp.updated_at,
  u.email AS user_email,
  u.name AS user_name,
  CASE 
    WHEN rp.item_type = 'book-summary' THEN bs.title
    WHEN rp.item_type = 'business-plan' THEN bp.title
    ELSE NULL
  END AS item_title,
  CASE 
    WHEN rp.item_type = 'book-summary' THEN bs.author
    WHEN rp.item_type = 'business-plan' THEN bp.author
    ELSE NULL
  END AS item_author
FROM 
  public.reading_progress rp
JOIN 
  public.users u ON rp.user_id = u.id
LEFT JOIN 
  public.book_summaries bs ON rp.item_type = 'book-summary' AND rp.item_id = bs.id
LEFT JOIN 
  public.business_plans bp ON rp.item_type = 'business-plan' AND rp.item_id = bp.id;

-- View for admin dashboard statistics
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.users) AS total_users,
  (SELECT COUNT(*) FROM public.users WHERE created_at > NOW() - INTERVAL '30 days') AS new_users_last_30_days,
  (SELECT COUNT(*) FROM public.book_summaries) AS total_book_summaries,
  (SELECT COUNT(*) FROM public.business_plans) AS total_business_plans,
  (SELECT COUNT(*) FROM public.blog_posts) AS total_blog_posts,
  (SELECT COUNT(*) FROM public.blog_posts WHERE status = 'published') AS published_blog_posts,
  (SELECT COUNT(*) FROM public.purchases) AS total_purchases,
  (SELECT COUNT(*) FROM public.purchases WHERE status = 'completed') AS completed_purchases,
  (SELECT COUNT(*) FROM public.purchases WHERE status = 'pending') AS pending_purchases,
  (SELECT COUNT(*) FROM public.purchases WHERE status = 'refunded') AS refunded_purchases,
  (SELECT SUM(amount) FROM public.purchases WHERE status = 'completed') AS total_revenue,
  (SELECT SUM(amount) FROM public.purchases WHERE status = 'completed' AND created_at > NOW() - INTERVAL '30 days') AS revenue_last_30_days;
