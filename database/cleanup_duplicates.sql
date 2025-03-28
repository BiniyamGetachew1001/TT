-- Remove duplicates from business_plans table
DELETE FROM business_plans a USING business_plans b
WHERE a.id > b.id AND a.title = b.title;

-- Verify the cleaned up data
SELECT 'Business Plans after cleanup:' as table_name;
SELECT * FROM business_plans ORDER BY title;

SELECT 'Book Summaries:' as table_name;
SELECT * FROM book_summaries ORDER BY title; 