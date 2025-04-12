import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ygamcvlfdxawhirwugcd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnYW1jdmxmZHhhd2hpcnd1Z2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDIzNjQsImV4cCI6MjA2MDAxODM2NH0.Mdb42Wtpe9SPm4N2YpKRgKmachbGFlYfRVTbrTV822M';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: string;
  published_at: string | null;
  author_id: string;
  cover_image: string;
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
