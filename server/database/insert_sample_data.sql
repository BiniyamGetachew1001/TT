-- Add sample book summaries
INSERT INTO book_summaries (title, author, description, category, read_time, summary, key_points)
VALUES 
(
    'The Psychology of Money',
    'Morgan Housel',
    'Timeless lessons on wealth, greed, and happiness',
    'Finance',
    '15 min read',
    'A collection of 19 short stories exploring the strange ways people think about money and how to make better financial decisions.',
    ARRAY['Wealth is what you don''t see', 'Saving is more important than investing', 'Money''s greatest value is control over time']
),
(
    'Atomic Habits',
    'James Clear',
    'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    'Self-Development',
    '12 min read',
    'A comprehensive guide on how to change your habits and get 1% better every day.',
    ARRAY['Small habits make a big difference', 'Focus on systems instead of goals', 'Identity change is the key to habit change']
),
(
    'Zero to One',
    'Peter Thiel',
    'Notes on Startups, or How to Build the Future',
    'Business',
    '18 min read',
    'Peter Thiel''s advice on building valuable companies and creating new things.',
    ARRAY['Better to be bold than trivial', 'Competition destroys profits', 'The best startup ideas look like bad ideas at first']
);

-- Add sample business plans
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