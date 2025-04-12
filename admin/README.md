# TilkTibeb Admin Panel

This is the admin panel for the TilkTibeb platform, which allows you to manage blog posts, book summaries, business plans, users, and purchases.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5174
   ```

## Features

### Blog Post Management

The blog post management feature allows you to:

- View all blog posts with filtering and sorting
- Create new blog posts
- Edit existing blog posts
- Delete blog posts
- Upload images for blog posts
- Publish/unpublish blog posts

#### Database Schema

The blog posts are stored in the `blog_posts` table with the following structure:

```sql
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES public.users NOT NULL,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);
```

#### Cover Images

The admin panel now uses external image URLs for blog post cover images instead of uploading images to Supabase Storage. This approach has several benefits:

- **Save Storage Space**: You don't use up your Supabase Storage quota (500MB on the free tier)
- **Better Performance**: Images can be served from optimized CDNs
- **More Flexibility**: You can use any image hosting service you prefer

##### Recommended Image Hosting Services

1. **Imgur**: Free image hosting with a simple interface
2. **Cloudinary**: Offers a free tier with image optimization features
3. **ImgBB**: Simple free image hosting
4. **Unsplash**: Free high-quality stock photos

##### How to Use External Images

1. Upload your image to any image hosting service
2. Copy the direct image URL (usually ends with .jpg, .png, etc.)
3. Paste the URL into the "Cover Image URL" field in the blog post form

## Supabase Setup

Before using the admin panel, you need to set up your Supabase project:

1. Create a new Supabase project
2. Follow the instructions in the `SETUP.md` file to create the database tables and storage bucket

For a more comprehensive setup, you can run the SQL scripts in the `supabase` directory:
   - `schema.sql`: Creates the database tables
   - `policies.sql`: Sets up Row Level Security (RLS) policies
   - `functions.sql`: Creates database functions and triggers
   - `storage.sql`: Sets up storage buckets and policies

## Troubleshooting

### Error: Could not find a relationship between 'blog_posts' and 'author_id'

This error occurs when you try to use a foreign key relationship that doesn't exist yet. To fix this:

1. Make sure you have created the database tables as described in the `SETUP.md` file
2. If you're still seeing the error, try refreshing the page

### Error: The blog_posts table does not exist

This error occurs when the `blog_posts` table hasn't been created yet. To fix this:

1. Follow the instructions in the `SETUP.md` file to create the database tables

### Error: Failed to upload image

This error occurs when you try to upload an image but the storage bucket doesn't exist or you don't have the necessary permissions. To fix this:

1. Make sure you have created the storage bucket as described in the `SETUP.md` file
2. Check that you have set up the storage policies correctly

## MCP Integration

This project uses the Model Context Protocol (MCP) for Supabase integration. The MCP configuration is in the `.vscode/mcp.json` file.

To use MCP:

1. Open Copilot Chat in Visual Studio Code
2. Switch to "Agent" mode
3. Tap the tool icon to confirm the MCP tools are available
4. When prompted, enter your Supabase personal access token

## API Services

The API services for interacting with the Supabase database are located in the `src/services/api` directory:

- `blogPostsApi.ts`: API for blog posts
- `bookSummariesApi.ts`: API for book summaries
- `businessPlansApi.ts`: API for business plans
- `usersApi.ts`: API for users
- `purchasesApi.ts`: API for purchases
- `settingsApi.ts`: API for settings

## Next Steps

- Implement book summaries management
- Implement business plans management
- Implement user management
- Implement purchases management
- Add analytics dashboard
