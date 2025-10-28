/*
  # Fix Trigger Functions - Use Schema-Qualified Table Names

  1. Problem
    - Triggers work from postgres role but fail from authenticated users
    - Error: "relation email_sequences does not exist"
    - Cause: search_path not including public schema for authenticated users
    
  2. Solution
    - Use fully qualified table names: public.email_sequences
    - Explicitly set search_path in function
    
  3. Security
    - Functions remain SECURITY DEFINER
    - RLS policies still enforced
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS create_claim_reminder_sequence() CASCADE;
DROP FUNCTION IF EXISTS create_upsell_sequence() CASCADE;

-- Recreate with schema-qualified names
CREATE OR REPLACE FUNCTION public.create_claim_reminder_sequence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  first_email_date timestamptz;
BEGIN
  -- Only create sequence if restaurant has an email and is not claimed
  IF NEW.email IS NOT NULL AND NEW.owner_id IS NULL THEN
    -- Schedule first email for 3 days from now
    first_email_date := NOW() + INTERVAL '3 days';
    
    INSERT INTO public.email_sequences (
      restaurant_id,
      sequence_type,
      current_step,
      total_steps,
      status,
      next_email_scheduled_at
    ) VALUES (
      NEW.id,
      'claim_reminder',
      0,
      3,
      'active',
      first_email_date
    );
    
    RAISE NOTICE 'Created claim reminder sequence for restaurant: %', NEW.name;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create email sequence: %', SQLERRM;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_upsell_sequence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  first_email_date timestamptz;
BEGIN
  -- Only create upsell sequence if restaurant was just claimed
  IF NEW.owner_claimed = true AND (OLD.owner_claimed = false OR OLD.owner_claimed IS NULL) THEN
    -- Schedule first upsell email for 7 days after claim
    first_email_date := NOW() + INTERVAL '7 days';
    
    INSERT INTO public.email_sequences (
      restaurant_id,
      sequence_type,
      current_step,
      total_steps,
      status,
      next_email_scheduled_at
    ) VALUES (
      NEW.id,
      'upsell',
      0,
      3,
      'active',
      first_email_date
    );
    
    RAISE NOTICE 'Created upsell sequence for restaurant: %', NEW.name;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create upsell sequence: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate triggers
DROP TRIGGER IF EXISTS on_restaurant_insert ON public.restaurants;
DROP TRIGGER IF EXISTS on_restaurant_claimed ON public.restaurants;

CREATE TRIGGER on_restaurant_insert
  AFTER INSERT ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.create_claim_reminder_sequence();

CREATE TRIGGER on_restaurant_claimed
  AFTER UPDATE ON public.restaurants
  FOR EACH ROW
  WHEN (NEW.owner_claimed = true)
  EXECUTE FUNCTION public.create_upsell_sequence();

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';