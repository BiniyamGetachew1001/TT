import { supabase } from '../lib/supabase';

async function insertSampleData() {
  try {
    console.log('Inserting sample data...');

    // Sample book summaries
    const bookSummaries = [
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        description: 'Timeless lessons on wealth, greed, and happiness.',
        category: 'Finance',
        cover_image: 'https://m.media-amazon.com/images/I/71TRB-fEWsL._AC_UF1000,1000_QL80_.jpg',
        read_time: '15 min',
        price: 0,
        content: 'Sample content for The Psychology of Money...'
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
        category: 'Personal Development',
        cover_image: 'https://m.media-amazon.com/images/I/81bGKUa1e0L._AC_UF1000,1000_QL80_.jpg',
        read_time: '20 min',
        price: 9.99,
        content: 'Sample content for Atomic Habits...'
      },
      {
        title: 'Zero to One',
        author: 'Peter Thiel',
        description: 'Notes on Startups, or How to Build the Future.',
        category: 'Entrepreneurship',
        cover_image: 'https://m.media-amazon.com/images/I/71Xygne8+qL._AC_UF1000,1000_QL80_.jpg',
        read_time: '18 min',
        price: 0,
        content: 'Sample content for Zero to One...'
      },
      {
        title: 'Deep Work',
        author: 'Cal Newport',
        description: 'Rules for Focused Success in a Distracted World.',
        category: 'Personal Development',
        cover_image: 'https://m.media-amazon.com/images/I/81ZZn3D9PtL._AC_UF1000,1000_QL80_.jpg',
        read_time: '25 min',
        price: 9.99,
        content: 'Sample content for Deep Work...'
      },
      {
        title: 'The Lean Startup',
        author: 'Eric Ries',
        description: 'How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.',
        category: 'Entrepreneurship',
        cover_image: 'https://m.media-amazon.com/images/I/81-QB7nDh4L._AC_UF1000,1000_QL80_.jpg',
        read_time: '22 min',
        price: 0,
        content: 'Sample content for The Lean Startup...'
      }
    ];

    // Insert book summaries
    const { data: booksData, error: booksError } = await supabase
      .from('book_summaries')
      .insert(bookSummaries)
      .select();

    if (booksError) {
      console.error('Error inserting book summaries:', booksError);
    } else {
      console.log(`Inserted ${booksData.length} book summaries`);
    }

    // Sample business plans
    const businessPlans = [
      {
        title: 'E-commerce Business Plan',
        description: 'Complete business plan for starting an online store.',
        industry: 'E-commerce',
        cover_image: 'https://img.freepik.com/free-vector/gradient-sales-instagram-post-template_23-2149651737.jpg',
        price: 29.99,
        content: 'Sample content for E-commerce Business Plan...',
        author: 'Business Expert',
        read_time: '45 min'
      },
      {
        title: 'Coffee Shop Business Plan',
        description: 'Detailed plan for opening a coffee shop.',
        industry: 'Food & Beverage',
        cover_image: 'https://img.freepik.com/free-vector/flat-design-coffee-shop-template_23-2149482264.jpg',
        price: 19.99,
        content: 'Sample content for Coffee Shop Business Plan...',
        author: 'Cafe Consultant',
        read_time: '35 min'
      },
      {
        title: 'Tech Startup Business Plan',
        description: 'Comprehensive plan for launching a tech startup.',
        industry: 'Technology',
        cover_image: 'https://img.freepik.com/free-vector/gradient-technology-instagram-post-template_23-2149651738.jpg',
        price: 39.99,
        content: 'Sample content for Tech Startup Business Plan...',
        author: 'Tech Entrepreneur',
        read_time: '50 min'
      }
    ];

    // Insert business plans
    const { data: plansData, error: plansError } = await supabase
      .from('business_plans')
      .insert(businessPlans)
      .select();

    if (plansError) {
      console.error('Error inserting business plans:', plansError);
    } else {
      console.log(`Inserted ${plansData.length} business plans`);
    }

    // Create a test user if it doesn't exist
    const testUserEmail = 'test@example.com';
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testUserEmail)
      .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error checking for existing user:', userCheckError);
    }

    if (!existingUser) {
      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: testUserEmail,
        password: 'password123'
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
      } else if (authUser.user) {
        // Insert user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authUser.user.id,
            email: testUserEmail,
            name: 'Test User',
            role: 'user'
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        } else {
          console.log('Created test user');
        }
      }
    }

    console.log('Sample data insertion completed!');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

insertSampleData();
