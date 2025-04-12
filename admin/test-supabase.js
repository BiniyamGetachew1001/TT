const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://ygamcvlfdxawhirwugcd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnYW1jdmxmZHhhd2hpcnd1Z2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDIzNjQsImV4cCI6MjA2MDAxODM2NH0.Mdb42Wtpe9SPm4N2YpKRgKmachbGFlYfRVTbrTV822M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    // Test the connection by getting the current timestamp
    console.log('Testing connection to Supabase...');

    // Try a simple query to check if we can connect
    const { data, error } = await supabase
      .from('pg_tables')
      .select('schemaname, tablename')
      .eq('schemaname', 'public')
      .limit(5);

    if (error) {
      console.error('Error connecting to Supabase:', error);
      return;
    }

    console.log('Successfully connected to Supabase!');
    console.log('Public tables:', data);

    // Get a list of tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('Error getting tables:', tablesError);
      return;
    }

    console.log('Tables in the public schema:');
    tables.forEach((table) => {
      console.log(`- ${table.table_name}`);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testSupabaseConnection();
