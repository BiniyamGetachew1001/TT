# Setting Up the Database for TilkTibeb Admin Panel

This guide will walk you through the process of setting up the database for the TilkTibeb admin panel.

## Prerequisites

- A Supabase account
- Access to the Supabase project

## Step 1: Access the SQL Editor

1. Log in to your Supabase account
2. Select your project
3. Go to the SQL Editor (in the left sidebar)
4. Click "New Query"

## Step 2: Create the Database Tables

Copy and paste the following SQL code into the SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);
```

Click "Run" to execute the SQL code.

## Step 3: Using External Images for Blog Posts

The admin panel uses external image URLs for blog post cover images instead of uploading images to Supabase Storage. This approach saves storage space on your Supabase account.

### How to Use External Images

1. Upload your image to any image hosting service like:
   - Imgur (https://imgur.com/)
   - Cloudinary (https://cloudinary.com/)
   - ImgBB (https://imgbb.com/)
   - Or use stock photos from Unsplash (https://unsplash.com/)

2. Copy the direct image URL (usually ends with .jpg, .png, etc.)

3. When creating or editing a blog post, paste the URL into the "Cover Image URL" field

### Benefits of Using External Images

- **Save Storage Space**: You don't use up your Supabase Storage quota (500MB on the free tier)
- **Better Performance**: Images can be served from optimized CDNs
- **More Flexibility**: You can use any image hosting service you prefer

## Step 4: Create an Admin User

Create an admin user by running the following SQL code:

```sql
-- Create an admin user
INSERT INTO public.users (id, email, name, role, status)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'Admin User', 'admin', 'active')
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    status = EXCLUDED.status;
```

Click "Run" to execute the SQL code.

## Step 5: Create a Test Blog Post

You can create a test blog post by running the following SQL code:

```sql
INSERT INTO public.blog_posts (
  title,
  excerpt,
  content,
  category,
  tags,
  status,
  author_id,
  cover_image
)
VALUES (
  'Test Blog Post',
  'This is a test blog post created via SQL.',
  '<p>This is the content of the test blog post.</p>',
  'Technology',
  ARRAY['test', 'sql'],
  'draft',
  '00000000-0000-0000-0000-000000000000',  -- Use the admin user ID
  NULL
);
```

Click "Run" to execute the SQL code.

## Step 6: Verify the Setup

1. Go to the Table Editor (in the left sidebar)
2. Select the "blog_posts" table
3. You should see the test blog post you created

## Troubleshooting

If you encounter any issues, check the following:

1. Make sure you have the necessary permissions to create tables and policies
2. Check for any syntax errors in the SQL code
3. Verify that the tables were created successfully by checking the Table Editor

## Next Steps

Now that you have set up the database, you can start using the admin panel to manage your blog posts, book summaries, business plans, users, and purchases.
