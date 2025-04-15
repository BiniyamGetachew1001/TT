-- Additional sample data for testing

-- Sample business plans
INSERT INTO public.business_plans (title, description, industry, cover_image, price)
VALUES
  ('E-commerce Business Plan', 'Complete business plan for starting an online store.', 'E-commerce', 'https://img.freepik.com/free-vector/gradient-sales-instagram-post-template_23-2149651737.jpg', 29.99),
  ('Coffee Shop Business Plan', 'Detailed plan for opening a coffee shop.', 'Food & Beverage', 'https://img.freepik.com/free-vector/flat-design-coffee-shop-template_23-2149482264.jpg', 19.99),
  ('Tech Startup Business Plan', 'Comprehensive plan for launching a tech startup.', 'Technology', 'https://img.freepik.com/free-vector/gradient-technology-instagram-post-template_23-2149651738.jpg', 39.99),
  ('Restaurant Business Plan', 'Complete guide to opening a restaurant.', 'Food & Beverage', 'https://img.freepik.com/free-vector/restaurant-instagram-stories-template_23-2148962553.jpg', 24.99);

-- Sample purchases (these will only work if you have users in your auth.users table)
-- You'll need to replace 'user-id-here' with actual user IDs from your auth.users table
/*
INSERT INTO public.purchases (user_id, item_id, item_type, amount, currency, status, payment_id)
SELECT 
  auth.uid(), 
  id, 
  'book-summary', 
  price, 
  'USD', 
  'completed', 
  'mock-payment-' || id
FROM public.book_summaries
LIMIT 2;
*/
