-- Check and add missing columns to business_plans table
ALTER TABLE public.business_plans 
ADD COLUMN IF NOT EXISTS content TEXT;

ALTER TABLE public.business_plans 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.business_plans 
ADD COLUMN IF NOT EXISTS author TEXT;

ALTER TABLE public.business_plans 
ADD COLUMN IF NOT EXISTS read_time TEXT;

ALTER TABLE public.business_plans 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;

-- Set default values for existing records
UPDATE public.business_plans SET content = '' WHERE content IS NULL;
UPDATE public.business_plans SET description = '' WHERE description IS NULL;
UPDATE public.business_plans SET author = 'Admin' WHERE author IS NULL;
UPDATE public.business_plans SET read_time = '15 min' WHERE read_time IS NULL;
UPDATE public.business_plans SET is_free = false WHERE is_free IS NULL;
