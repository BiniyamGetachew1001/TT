-- 06_sample_data.sql
-- This snippet inserts sample data for testing

-- Insert sample users
INSERT INTO public.users (id, email, name, role, status, created_at, last_login)
VALUES
  (uuid_generate_v4(), 'admin@example.com', 'Admin User', 'admin', 'active', NOW(), NOW()),
  (uuid_generate_v4(), 'user1@example.com', 'John Doe', 'user', 'active', NOW(), NOW()),
  (uuid_generate_v4(), 'user2@example.com', 'Jane Smith', 'user', 'active', NOW(), NOW()),
  (uuid_generate_v4(), 'user3@example.com', 'Bob Johnson', 'user', 'active', NOW(), NOW()),
  (uuid_generate_v4(), 'user4@example.com', 'Alice Brown', 'user', 'active', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample book summaries
INSERT INTO public.book_summaries (title, author, description, content, cover_image, read_time, category, price)
VALUES
  (
    'The 7 Habits of Highly Effective People', 
    'Stephen R. Covey', 
    'A powerful guide to personal and professional effectiveness through principle-centered leadership.',
    'This is a sample content for the book summary. It would contain the full summary text with key insights and takeaways from the book.',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop',
    '15 minutes',
    'Personal Development',
    9.99
  ),
  (
    'Atomic Habits', 
    'James Clear', 
    'An easy and proven way to build good habits and break bad ones.',
    'This is a sample content for the book summary. It would contain the full summary text with key insights and takeaways from the book.',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop',
    '12 minutes',
    'Productivity',
    9.99
  ),
  (
    'Think and Grow Rich', 
    'Napoleon Hill', 
    'A classic guide to personal development and self-improvement.',
    'This is a sample content for the book summary. It would contain the full summary text with key insights and takeaways from the book.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=300&auto=format&fit=crop',
    '18 minutes',
    'Wealth',
    0.00
  ),
  (
    'Good to Great', 
    'Jim Collins', 
    'Why some companies make the leap and others don't.',
    'This is a sample content for the book summary. It would contain the full summary text with key insights and takeaways from the book.',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop',
    '20 minutes',
    'Business',
    9.99
  ),
  (
    'The Lean Startup', 
    'Eric Ries', 
    'How today's entrepreneurs use continuous innovation to create radically successful businesses.',
    'This is a sample content for the book summary. It would contain the full summary text with key insights and takeaways from the book.',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=300&auto=format&fit=crop',
    '15 minutes',
    'Entrepreneurship',
    9.99
  );

-- Insert sample business plans
INSERT INTO public.business_plans (title, industry, description, content, cover_image, author, read_time, price)
VALUES
  (
    'Coffee Shop Business Plan', 
    'Food & Beverage', 
    'A comprehensive business plan for starting a specialty coffee shop in an urban area.',
    'This is a sample content for the business plan. It would contain the full business plan with market analysis, financial projections, and operational details.',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=300&auto=format&fit=crop',
    'Business Experts Team',
    '25 minutes',
    19.99
  ),
  (
    'E-commerce Clothing Store', 
    'Retail', 
    'A detailed plan for launching an online clothing store targeting young professionals.',
    'This is a sample content for the business plan. It would contain the full business plan with market analysis, financial projections, and operational details.',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=300&auto=format&fit=crop',
    'Retail Strategy Group',
    '22 minutes',
    19.99
  ),
  (
    'Mobile App Development Agency', 
    'Technology', 
    'A business plan for starting a mobile app development agency specializing in iOS and Android applications.',
    'This is a sample content for the business plan. It would contain the full business plan with market analysis, financial projections, and operational details.',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=300&auto=format&fit=crop',
    'Tech Ventures Inc.',
    '30 minutes',
    0.00
  ),
  (
    'Fitness Studio Business Plan', 
    'Health & Wellness', 
    'A comprehensive plan for opening a boutique fitness studio offering personalized training programs.',
    'This is a sample content for the business plan. It would contain the full business plan with market analysis, financial projections, and operational details.',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=300&auto=format&fit=crop',
    'Fitness Business Consultants',
    '28 minutes',
    19.99
  ),
  (
    'Sustainable Agriculture Farm', 
    'Agriculture', 
    'A business plan for establishing a sustainable farm using organic farming practices.',
    'This is a sample content for the business plan. It would contain the full business plan with market analysis, financial projections, and operational details.',
    'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=300&auto=format&fit=crop',
    'Green Earth Advisors',
    '35 minutes',
    19.99
  );

-- Get admin user ID
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM public.users WHERE email = 'admin@example.com' LIMIT 1;

  -- Insert sample blog posts
  INSERT INTO public.blog_posts (title, content, category, status, published_at, author_id, cover_image, excerpt, tags)
  VALUES
    (
      '10 Essential Business Books Every Entrepreneur Should Read', 
      'This is a sample content for the blog post. It would contain the full article text with formatting, images, and other elements.',
      'Business',
      'published',
      NOW() - INTERVAL '10 days',
      admin_id,
      'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=300&auto=format&fit=crop',
      'Discover the must-read business books that have shaped successful entrepreneurs around the world.',
      ARRAY['books', 'entrepreneurship', 'business']
    ),
    (
      'How to Create a Successful Business Plan in 7 Steps', 
      'This is a sample content for the blog post. It would contain the full article text with formatting, images, and other elements.',
      'Entrepreneurship',
      'published',
      NOW() - INTERVAL '7 days',
      admin_id,
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop',
      'Learn the essential steps to crafting a business plan that will help you secure funding and guide your business to success.',
      ARRAY['business plan', 'startup', 'planning']
    ),
    (
      'The Psychology of Habit Formation: Building Better Routines', 
      'This is a sample content for the blog post. It would contain the full article text with formatting, images, and other elements.',
      'Personal Development',
      'published',
      NOW() - INTERVAL '5 days',
      admin_id,
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=300&auto=format&fit=crop',
      'Understand the science behind habits and learn practical strategies to build positive routines that stick.',
      ARRAY['habits', 'psychology', 'productivity']
    ),
    (
      'Financial Planning for Small Business Owners', 
      'This is a sample content for the blog post. It would contain the full article text with formatting, images, and other elements.',
      'Finance',
      'published',
      NOW() - INTERVAL '3 days',
      admin_id,
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=300&auto=format&fit=crop',
      'Essential financial planning strategies to help small business owners manage cash flow and plan for growth.',
      ARRAY['finance', 'small business', 'planning']
    ),
    (
      'Upcoming Business Trends for 2023', 
      'This is a sample content for the blog post. It would contain the full article text with formatting, images, and other elements.',
      'Business',
      'draft',
      NULL,
      admin_id,
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop',
      'A look at the emerging business trends that will shape the market in the coming year.',
      ARRAY['trends', 'business', 'future']
    );
END $$;

-- Insert sample purchases
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
  book1_id UUID;
  book2_id UUID;
  book3_id UUID;
  business1_id UUID;
  business2_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO user1_id FROM public.users WHERE email = 'user1@example.com' LIMIT 1;
  SELECT id INTO user2_id FROM public.users WHERE email = 'user2@example.com' LIMIT 1;
  SELECT id INTO user3_id FROM public.users WHERE email = 'user3@example.com' LIMIT 1;
  
  -- Get book summary IDs
  SELECT id INTO book1_id FROM public.book_summaries WHERE title = 'The 7 Habits of Highly Effective People' LIMIT 1;
  SELECT id INTO book2_id FROM public.book_summaries WHERE title = 'Atomic Habits' LIMIT 1;
  SELECT id INTO book3_id FROM public.book_summaries WHERE title = 'Think and Grow Rich' LIMIT 1;
  
  -- Get business plan IDs
  SELECT id INTO business1_id FROM public.business_plans WHERE title = 'Coffee Shop Business Plan' LIMIT 1;
  SELECT id INTO business2_id FROM public.business_plans WHERE title = 'E-commerce Clothing Store' LIMIT 1;
  
  -- Insert purchases
  INSERT INTO public.purchases (user_id, item_type, item_id, amount, currency, status, payment_id, created_at)
  VALUES
    (user1_id, 'book-summary', book1_id, 9.99, 'USD', 'completed', 'pay_' || md5(random()::text), NOW() - INTERVAL '30 days'),
    (user1_id, 'book-summary', book2_id, 9.99, 'USD', 'completed', 'pay_' || md5(random()::text), NOW() - INTERVAL '25 days'),
    (user1_id, 'business-plan', business1_id, 19.99, 'USD', 'completed', 'pay_' || md5(random()::text), NOW() - INTERVAL '20 days'),
    (user2_id, 'book-summary', book2_id, 9.99, 'USD', 'completed', 'pay_' || md5(random()::text), NOW() - INTERVAL '15 days'),
    (user2_id, 'business-plan', business2_id, 19.99, 'USD', 'pending', 'pay_' || md5(random()::text), NOW() - INTERVAL '10 days'),
    (user3_id, 'book-summary', book3_id, 0.00, 'USD', 'completed', 'pay_' || md5(random()::text), NOW() - INTERVAL '5 days'),
    (user3_id, 'book-summary', book1_id, 9.99, 'USD', 'refunded', 'pay_' || md5(random()::text), NOW() - INTERVAL '3 days');
    
  -- Insert bookmarks
  INSERT INTO public.bookmarks (user_id, item_type, item_id, created_at)
  VALUES
    (user1_id, 'book-summary', book1_id, NOW() - INTERVAL '29 days'),
    (user1_id, 'book-summary', book2_id, NOW() - INTERVAL '24 days'),
    (user2_id, 'book-summary', book2_id, NOW() - INTERVAL '14 days'),
    (user3_id, 'book-summary', book3_id, NOW() - INTERVAL '4 days');
    
  -- Insert reading progress
  INSERT INTO public.reading_progress (user_id, item_type, item_id, progress, last_read_at, created_at, updated_at)
  VALUES
    (user1_id, 'book-summary', book1_id, 75, NOW() - INTERVAL '15 days', NOW() - INTERVAL '29 days', NOW() - INTERVAL '15 days'),
    (user1_id, 'book-summary', book2_id, 30, NOW() - INTERVAL '10 days', NOW() - INTERVAL '24 days', NOW() - INTERVAL '10 days'),
    (user1_id, 'business-plan', business1_id, 50, NOW() - INTERVAL '5 days', NOW() - INTERVAL '19 days', NOW() - INTERVAL '5 days'),
    (user2_id, 'book-summary', book2_id, 100, NOW() - INTERVAL '7 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '7 days'),
    (user3_id, 'book-summary', book3_id, 25, NOW() - INTERVAL '2 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days');
END $$;
