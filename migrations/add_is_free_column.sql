-- Add is_free column to book_summaries table
ALTER TABLE public.book_summaries 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;

-- Add is_free column to business_plans table
ALTER TABLE public.business_plans 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;

-- Add is_free column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;

-- Update existing records to set is_free to false
UPDATE public.book_summaries SET is_free = false WHERE is_free IS NULL;
UPDATE public.business_plans SET is_free = false WHERE is_free IS NULL;
UPDATE public.blog_posts SET is_free = false WHERE is_free IS NULL;

-- Add indexes for faster filtering
CREATE INDEX IF NOT EXISTS idx_book_summaries_is_free ON public.book_summaries(is_free);
CREATE INDEX IF NOT EXISTS idx_business_plans_is_free ON public.business_plans(is_free);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_free ON public.blog_posts(is_free);
