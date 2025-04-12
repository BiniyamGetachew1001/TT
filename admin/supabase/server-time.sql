-- Create a function to get the server time
CREATE OR REPLACE FUNCTION get_server_time()
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT NOW();
$$;
