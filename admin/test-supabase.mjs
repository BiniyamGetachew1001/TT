import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ygamcvlfdxawhirwugcd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnYW1jdmxmZHhhd2hpcnd1Z2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDIzNjQsImV4cCI6MjA2MDAxODM2NH0.Mdb42Wtpe9SPm4N2YpKRgKmachbGFlYfRVTbrTV822M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    // Test the connection by getting the current timestamp
    console.log('Testing connection to Supabase...');

    // Try a simple query to check if we can connect
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error connecting to Supabase:', error);
      return;
    }

    console.log('Successfully connected to Supabase!');
    console.log('Public tables:', data);

    // Try to create a test table
    console.log('Checking if we can create a table...');

    try {
      const { error: createError } = await supabase
        .rpc('create_test_table');

      if (createError) {
        console.log('Could not create test table. This is expected if the function does not exist.');
        console.log('Error:', createError.message);
      } else {
        console.log('Successfully created test table!');
      }
    } catch (err) {
      console.log('Error creating test table:', err.message);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testSupabaseConnection();
