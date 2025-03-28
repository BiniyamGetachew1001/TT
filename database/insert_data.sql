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
);

-- Verify the insertion
SELECT * FROM book_summaries; 