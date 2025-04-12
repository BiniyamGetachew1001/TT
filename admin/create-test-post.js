const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://ygamcvlfdxawhirwugcd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnYW1jdmxmZHhhd2hpcnd1Z2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDIzNjQsImV4cCI6MjA2MDAxODM2NH0.Mdb42Wtpe9SPm4N2YpKRgKmachbGFlYfRVTbrTV822M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestBlogPost() {
  try {
    console.log('Creating test blog post...');
    
    // Create a test blog post
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: 'Test Blog Post',
          excerpt: 'This is a test blog post created via the API.',
          content: '<p>This is the content of the test blog post.</p>',
          category: 'Technology',
          tags: ['test', 'api'],
          status: 'draft',
          author_id: null, // We don't have a user yet
          cover_image: null
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating blog post:', error);
      return;
    }
    
    console.log('Blog post created successfully:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createTestBlogPost();
