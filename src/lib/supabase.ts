import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ygamcvlfdxawhirwugcd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnYW1jdmxmZHhhd2hpcnd1Z2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDIzNjQsImV4cCI6MjA2MDAxODM2NH0.Mdb42Wtpe9SPm4N2YpKRgKmachbGFlYfRVTbrTV822M';

// For development, we'll use a service role key to bypass RLS
// In production, this should be replaced with proper authentication
const isDevelopment = process.env.NODE_ENV !== 'production';

// Create the standard client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create a bypass client for admin operations that would otherwise be blocked by RLS
// This is for development only and should be properly secured in production
export const adminSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Types for your database tables
export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  created_at: string;
  last_login: string;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  published_at: string | null; // When the post was or will be published
  scheduled_for?: string | null; // Date/time when the post should be published
  author_id?: string;
  cover_image: string;
  excerpt?: string;
  tags?: string[];
  is_free: boolean;
  created_at: string;
  updated_at: string;
};

export type BookSummary = {
  id: string;
  title: string;
  author: string;
  description: string;
  content: string;
  cover_image: string;
  read_time: string;
  category: string;
  price: number;
  is_free: boolean;
  created_at: string;
  updated_at: string;
};

export type BusinessPlan = {
  id: string;
  title: string;
  industry: string;
  description: string;
  content: string;
  cover_image: string;
  author: string;
  read_time: string;
  price: number;
  is_free: boolean;
  created_at: string;
  updated_at: string;
};

export type Purchase = {
  id: string;
  user_id: string;
  item_type: string;
  item_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_id: string;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  user_id?: string;
  user_email?: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'archive' | 'schedule';
  item_type: 'book-summary' | 'business-plan' | 'blog-post' | 'purchase';
  item_id: string;
  item_title?: string;
  details?: string;
  created_at: string;
};
