-- First, remove duplicates keeping only one copy of each book by title
DELETE FROM book_summaries a USING book_summaries b
WHERE a.id > b.id AND a.title = b.title;

-- Now insert the remaining business plans
INSERT INTO business_plans (title, industry, description, author, read_time, price, key_features)
VALUES 
(
    'E-commerce Platform Business Plan',
    'Technology',
    'A comprehensive business plan for launching an e-commerce platform with advanced features.',
    'Business Strategy Experts',
    '15 min read',
    29.99,
    ARRAY['Market analysis', 'Financial projections', 'Marketing strategy', 'Technical requirements']
),
(
    'Restaurant Business Plan',
    'Food & Beverage',
    'Detailed business plan for opening a modern restaurant in an urban area.',
    'Restaurant Consultants',
    '20 min read',
    34.99,
    ARRAY['Location analysis', 'Menu planning', 'Staffing requirements', 'Financial forecasts']
);

-- Verify the data
SELECT 'Book Summaries:' as table_name;
SELECT * FROM book_summaries;

SELECT 'Business Plans:' as table_name;
SELECT * FROM business_plans; 