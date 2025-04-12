-- Create an admin user
INSERT INTO public.users (id, email, name, role, status)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'Admin User', 'admin', 'active')
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    status = EXCLUDED.status;

-- Update existing blog posts to use this admin user
UPDATE public.blog_posts
SET author_id = '00000000-0000-0000-0000-000000000000'
WHERE author_id IS NULL;
