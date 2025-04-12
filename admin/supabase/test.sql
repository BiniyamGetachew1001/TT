-- Test SQL query to check if MCP is working
SELECT current_timestamp as server_time;

-- Check if our tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
