-- Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_email TEXT,
    action TEXT NOT NULL,
    item_type TEXT NOT NULL,
    item_id UUID NOT NULL,
    item_title TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Add foreign key constraints if needed
    -- FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_item_type_item_id ON public.activity_logs(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- Add RLS policies
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy for admins to see all logs
CREATE POLICY "Admins can see all activity logs"
ON public.activity_logs
FOR SELECT
USING (
    auth.role() = 'authenticated' AND (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    )
);

-- Policy for admins to insert logs
CREATE POLICY "Admins can insert activity logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' AND (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    )
);

-- Grant permissions
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.activity_logs_id_seq TO authenticated;

-- Add comment
COMMENT ON TABLE public.activity_logs IS 'Stores activity logs for content management actions';
