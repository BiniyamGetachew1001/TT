-- Create policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for blog_posts table
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');
  
CREATE POLICY "Authors can view their own blog posts" ON public.blog_posts
  FOR SELECT USING (auth.uid() = author_id);
  
CREATE POLICY "Admins can view all blog posts" ON public.blog_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Authors can update their own blog posts" ON public.blog_posts
  FOR UPDATE USING (auth.uid() = author_id);
  
CREATE POLICY "Admins can update all blog posts" ON public.blog_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Authors can insert blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);
  
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Authors can delete their own blog posts" ON public.blog_posts
  FOR DELETE USING (auth.uid() = author_id);
  
CREATE POLICY "Admins can delete all blog posts" ON public.blog_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for book_summaries table
CREATE POLICY "Anyone can view book summaries" ON public.book_summaries
  FOR SELECT USING (true);
  
CREATE POLICY "Admins can insert book summaries" ON public.book_summaries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );
  
CREATE POLICY "Admins can update book summaries" ON public.book_summaries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );
  
CREATE POLICY "Admins can delete book summaries" ON public.book_summaries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for business_plans table
CREATE POLICY "Anyone can view business plans" ON public.business_plans
  FOR SELECT USING (true);
  
CREATE POLICY "Admins can insert business plans" ON public.business_plans
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );
  
CREATE POLICY "Admins can update business plans" ON public.business_plans
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );
  
CREATE POLICY "Admins can delete business plans" ON public.business_plans
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for purchases table
CREATE POLICY "Users can view their own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Admins can view all purchases" ON public.purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );
  
CREATE POLICY "Users can insert their own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Admins can update purchases" ON public.purchases
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for bookmarks table
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for settings table
CREATE POLICY "Anyone can view settings" ON public.settings
  FOR SELECT USING (true);
  
CREATE POLICY "Admins can update settings" ON public.settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );
