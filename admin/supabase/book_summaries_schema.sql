-- Create book_summaries table
CREATE TABLE IF NOT EXISTS public.book_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  read_time TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_book_summaries_updated_at
BEFORE UPDATE ON public.book_summaries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample book summary
INSERT INTO public.book_summaries (
  title,
  author,
  description,
  content,
  cover_image,
  read_time,
  category,
  price,
  status
) VALUES (
  'The Psychology of Money',
  'Morgan Housel',
  'Timeless lessons on wealth, greed, and happiness. The book explores the strange ways people think about money and teaches you how to make better sense of one of life''s most important topics.',
  '<h2>Key Insights</h2><p>The book explores the psychology behind financial decisions and how our personal experiences, biases, and emotions influence our relationship with money.</p><h2>Chapter Summaries</h2><p>Chapter 1: The book begins by explaining that financial success is not a hard science. It''s a soft skill where how you behave is more important than what you know.</p><p>Chapter 2: Luck and risk play a huge role in life and financial success, but we often overlook their importance.</p><p>Chapter 3: The author discusses the concept of "reasonable" versus "rational" financial decisions, arguing that what seems reasonable to you might not be mathematically rational.</p>',
  'https://m.media-amazon.com/images/I/71J3+5lrCDL._AC_UF1000,1000_QL80_.jpg',
  '15 minutes',
  'Finance',
  9.99,
  'published'
);
