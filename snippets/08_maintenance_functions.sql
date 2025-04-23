-- 08_maintenance_functions.sql
-- This snippet creates maintenance functions for database administration

-- Function to clean up old activity logs
CREATE OR REPLACE FUNCTION public.cleanup_old_activity_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.activity_logs
  WHERE created_at < NOW() - (days_to_keep * INTERVAL '1 day');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate database statistics
CREATE OR REPLACE FUNCTION public.get_database_statistics()
RETURNS TABLE (
  table_name TEXT,
  row_count BIGINT,
  total_size_bytes BIGINT,
  index_size_bytes BIGINT,
  total_size_formatted TEXT,
  index_size_formatted TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.tablename::TEXT AS table_name,
    c.reltuples::BIGINT AS row_count,
    pg_total_relation_size(quote_ident(t.tablename))::BIGINT AS total_size_bytes,
    pg_indexes_size(quote_ident(t.tablename))::BIGINT AS index_size_bytes,
    pg_size_pretty(pg_total_relation_size(quote_ident(t.tablename))) AS total_size_formatted,
    pg_size_pretty(pg_indexes_size(quote_ident(t.tablename))) AS index_size_formatted
  FROM
    pg_tables t
  JOIN
    pg_class c ON t.tablename = c.relname
  WHERE
    t.schemaname = 'public'
  ORDER BY
    pg_total_relation_size(quote_ident(t.tablename)) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION public.get_user_activity_summary(user_id_param UUID)
RETURNS TABLE (
  action_type TEXT,
  action_count BIGINT,
  last_action_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    action AS action_type,
    COUNT(*) AS action_count,
    MAX(created_at) AS last_action_date
  FROM
    public.activity_logs
  WHERE
    user_id = user_id_param
  GROUP BY
    action
  ORDER BY
    COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get content popularity metrics
CREATE OR REPLACE FUNCTION public.get_content_popularity()
RETURNS TABLE (
  content_type TEXT,
  content_id UUID,
  title TEXT,
  purchase_count BIGINT,
  bookmark_count BIGINT,
  avg_progress INTEGER,
  popularity_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH purchase_counts AS (
    SELECT
      item_type,
      item_id,
      COUNT(*) AS count
    FROM
      public.purchases
    WHERE
      status = 'completed'
    GROUP BY
      item_type, item_id
  ),
  bookmark_counts AS (
    SELECT
      item_type,
      item_id,
      COUNT(*) AS count
    FROM
      public.bookmarks
    GROUP BY
      item_type, item_id
  ),
  progress_avg AS (
    SELECT
      item_type,
      item_id,
      AVG(progress) AS avg_progress
    FROM
      public.reading_progress
    GROUP BY
      item_type, item_id
  )
  SELECT
    pc.item_type AS content_type,
    pc.item_id AS content_id,
    CASE
      WHEN pc.item_type = 'book-summary' THEN (SELECT title FROM public.book_summaries WHERE id = pc.item_id)
      WHEN pc.item_type = 'business-plan' THEN (SELECT title FROM public.business_plans WHERE id = pc.item_id)
      WHEN pc.item_type = 'blog-post' THEN (SELECT title FROM public.blog_posts WHERE id = pc.item_id)
      ELSE 'Unknown'
    END AS title,
    pc.count AS purchase_count,
    COALESCE(bc.count, 0) AS bookmark_count,
    COALESCE(pa.avg_progress, 0)::INTEGER AS avg_progress,
    (pc.count * 5 + COALESCE(bc.count, 0) * 3 + COALESCE(pa.avg_progress, 0) * 0.1)::NUMERIC AS popularity_score
  FROM
    purchase_counts pc
  LEFT JOIN
    bookmark_counts bc ON pc.item_type = bc.item_type AND pc.item_id = bc.item_id
  LEFT JOIN
    progress_avg pa ON pc.item_type = pa.item_type AND pc.item_id = pa.item_id
  ORDER BY
    popularity_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get revenue statistics
CREATE OR REPLACE FUNCTION public.get_revenue_statistics(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  date_group DATE,
  total_revenue NUMERIC,
  book_summary_revenue NUMERIC,
  business_plan_revenue NUMERIC,
  purchase_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE_TRUNC('day', created_at)::DATE AS date_group,
    SUM(amount)::NUMERIC AS total_revenue,
    SUM(CASE WHEN item_type = 'book-summary' THEN amount ELSE 0 END)::NUMERIC AS book_summary_revenue,
    SUM(CASE WHEN item_type = 'business-plan' THEN amount ELSE 0 END)::NUMERIC AS business_plan_revenue,
    COUNT(*)::BIGINT AS purchase_count
  FROM
    public.purchases
  WHERE
    status = 'completed' AND
    created_at >= NOW() - (days_back * INTERVAL '1 day')
  GROUP BY
    DATE_TRUNC('day', created_at)::DATE
  ORDER BY
    date_group;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
