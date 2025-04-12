import { supabase } from '../../src/lib/supabase';

async function testSupabaseConnection() {
  try {
    // Test the connection by getting the server time
    const { data, error } = await supabase.rpc('get_server_time');

    if (error) {
      console.error('Error connecting to Supabase:', error);
      return;
    }

    console.log('Successfully connected to Supabase!');
    console.log('Server time:', data);

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
    tables.forEach((table: any) => {
      console.log(`- ${table.table_name}`);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testSupabaseConnection();
