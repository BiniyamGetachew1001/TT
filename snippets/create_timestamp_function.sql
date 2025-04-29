-- Create a simple function to get the current timestamp
-- This is used for connection health checks
CREATE OR REPLACE FUNCTION get_timestamp()
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE SQL
AS $$
  SELECT NOW();
$$;

-- Create a function to create the timestamp function
-- This is used as a fallback if the get_timestamp function doesn't exist
CREATE OR REPLACE FUNCTION create_timestamp_function()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE '
    CREATE OR REPLACE FUNCTION get_timestamp()
    RETURNS TIMESTAMP WITH TIME ZONE
    LANGUAGE SQL
    AS $inner$
      SELECT NOW();
    $inner$;
  ';
END;
$$;
