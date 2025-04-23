-- 05_indexes.sql
-- This snippet creates indexes to improve query performance

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users (status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users (created_at);

-- Indexes for book_summaries table
CREATE INDEX IF NOT EXISTS idx_book_summaries_title ON public.book_summaries (title);
CREATE INDEX IF NOT EXISTS idx_book_summaries_author ON public.book_summaries (author);
CREATE INDEX IF NOT EXISTS idx_book_summaries_category ON public.book_summaries (category);
CREATE INDEX IF NOT EXISTS idx_book_summaries_price ON public.book_summaries (price);
CREATE INDEX IF NOT EXISTS idx_book_summaries_created_at ON public.book_summaries (created_at);

-- Indexes for business_plans table
CREATE INDEX IF NOT EXISTS idx_business_plans_title ON public.business_plans (title);
CREATE INDEX IF NOT EXISTS idx_business_plans_industry ON public.business_plans (industry);
CREATE INDEX IF NOT EXISTS idx_business_plans_author ON public.business_plans (author);
CREATE INDEX IF NOT EXISTS idx_business_plans_price ON public.business_plans (price);
CREATE INDEX IF NOT EXISTS idx_business_plans_created_at ON public.business_plans (created_at);

-- Indexes for blog_posts table
CREATE INDEX IF NOT EXISTS idx_blog_posts_title ON public.blog_posts (title);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts (status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts (published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts (created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.blog_posts USING GIN (tags);

-- Indexes for purchases table
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases (user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_item_type ON public.purchases (item_type);
CREATE INDEX IF NOT EXISTS idx_purchases_item_id ON public.purchases (item_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases (status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON public.purchases (created_at);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id_status ON public.purchases (user_id, status);
CREATE INDEX IF NOT EXISTS idx_purchases_item_type_item_id ON public.purchases (item_type, item_id);

-- Indexes for bookmarks table
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_item_type ON public.bookmarks (item_type);
CREATE INDEX IF NOT EXISTS idx_bookmarks_item_id ON public.bookmarks (item_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON public.bookmarks (created_at);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id_item_type ON public.bookmarks (user_id, item_type);

-- Indexes for reading_progress table
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_item_type ON public.reading_progress (item_type);
CREATE INDEX IF NOT EXISTS idx_reading_progress_item_id ON public.reading_progress (item_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_last_read_at ON public.reading_progress (last_read_at);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id_item_type ON public.reading_progress (user_id, item_type);

-- Indexes for activity_logs table
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs (action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON public.activity_logs (entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_id ON public.activity_logs (entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id_action ON public.activity_logs (user_id, action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type_entity_id ON public.activity_logs (entity_type, entity_id);
