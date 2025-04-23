-- 03_functions_and_triggers.sql
-- This snippet creates functions and triggers for the database

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', 'User'), 'user');
  
  -- Log the activity
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
  VALUES (new.id, 'user_created', 'users', new.id, json_build_object('email', new.email));
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log content creation
CREATE OR REPLACE FUNCTION public.log_content_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
  VALUES (
    auth.uid(), 
    'content_created', 
    TG_TABLE_NAME, 
    NEW.id, 
    json_build_object('title', NEW.title)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for content creation logging
CREATE TRIGGER on_book_summary_created
  AFTER INSERT ON public.book_summaries
  FOR EACH ROW EXECUTE FUNCTION public.log_content_creation();

CREATE TRIGGER on_business_plan_created
  AFTER INSERT ON public.business_plans
  FOR EACH ROW EXECUTE FUNCTION public.log_content_creation();

CREATE TRIGGER on_blog_post_created
  AFTER INSERT ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.log_content_creation();

-- Function to log content updates
CREATE OR REPLACE FUNCTION public.log_content_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
  VALUES (
    auth.uid(), 
    'content_updated', 
    TG_TABLE_NAME, 
    NEW.id, 
    json_build_object('title', NEW.title)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for content update logging
CREATE TRIGGER on_book_summary_updated
  AFTER UPDATE ON public.book_summaries
  FOR EACH ROW EXECUTE FUNCTION public.log_content_update();

CREATE TRIGGER on_business_plan_updated
  AFTER UPDATE ON public.business_plans
  FOR EACH ROW EXECUTE FUNCTION public.log_content_update();

CREATE TRIGGER on_blog_post_updated
  AFTER UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.log_content_update();

-- Function to log purchase creation
CREATE OR REPLACE FUNCTION public.log_purchase_creation()
RETURNS TRIGGER AS $$
DECLARE
  item_title TEXT;
BEGIN
  -- Get the title of the purchased item
  IF NEW.item_type = 'book-summary' THEN
    SELECT title INTO item_title FROM public.book_summaries WHERE id = NEW.item_id;
  ELSIF NEW.item_type = 'business-plan' THEN
    SELECT title INTO item_title FROM public.business_plans WHERE id = NEW.item_id;
  END IF;

  -- Log the purchase
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
  VALUES (
    NEW.user_id, 
    'purchase_created', 
    'purchases', 
    NEW.id, 
    json_build_object(
      'item_type', NEW.item_type,
      'item_id', NEW.item_id,
      'item_title', item_title,
      'amount', NEW.amount,
      'status', NEW.status
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for purchase creation logging
CREATE TRIGGER on_purchase_created
  AFTER INSERT ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.log_purchase_creation();

-- Function to log purchase status updates
CREATE OR REPLACE FUNCTION public.log_purchase_status_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status <> NEW.status THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
      NEW.user_id, 
      'purchase_status_updated', 
      'purchases', 
      NEW.id, 
      json_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for purchase status update logging
CREATE TRIGGER on_purchase_status_updated
  AFTER UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.log_purchase_status_update();
