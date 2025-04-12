-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Book Summaries table
CREATE TABLE book_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    read_time TEXT,
    category TEXT,
    summary TEXT,
    key_points TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Business Plans table
CREATE TABLE business_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    industry TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    author TEXT,
    read_time TEXT,
    price DECIMAL(10,2),
    sections JSONB,
    key_features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Bookmarks table
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    type TEXT NOT NULL,
    item_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, type, item_id)
);

-- Add some sample data
INSERT INTO book_summaries (title, author, description, category, read_time, summary, key_points)
VALUES (
    'The Psychology of Money',
    'Morgan Housel',
    'Timeless lessons on wealth, greed, and happiness',
    'Finance',
    '15 min read',
    'A collection of 19 short stories exploring the strange ways people think about money and how to make better financial decisions.',
    ARRAY['Wealth is what you don''t see', 'Saving is more important than investing', 'Money''s greatest value is control over time']
); 