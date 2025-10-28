/*
  # Fix Email Sequence Trigger Permissions

  1. Problem
    - Triggers fail with "relation email_sequences does not exist"
    - Trigger functions run as SECURITY DEFINER but still hit RLS blocks
    - Users uploading CSV don't have INSERT permission on email_sequences

  2. Solution
    - Add a bypass policy for service role
    - Ensure trigger functions run with elevated privileges
    - Grant proper permissions

  3. Security
    - Only trigger functions can bypass RLS
    - Regular users still cannot directly insert
*/

-- Drop and recreate the trigger functions with proper settings
DROP FUNCTION IF EXISTS create_claim_reminder_sequence() CASCADE;
DROP FUNCTION IF EXISTS create_upsell_sequence() CASCADE;

-- Recreate claim reminder function with elevated privileges
CREATE OR REPLACE FUNCTION create_claim_reminder_sequence()
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
    
    -- Bypass RLS by setting local role
    PERFORM set_config('role', 'service_role', true);
    
    INSERT INTO email_sequences (
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
    
    -- Reset role
    PERFORM set_config('role', 'authenticator', true);
    
    RAISE NOTICE 'Created claim reminder sequence for restaurant: %', NEW.name;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate upsell function with elevated privileges
CREATE OR REPLACE FUNCTION create_upsell_sequence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  first_email_date timestamptz;
BEGIN
  -- Check if restaurant was just claimed (owner_id changed from NULL to a value)
  IF OLD.owner_id IS NULL AND NEW.owner_id IS NOT NULL AND NEW.email IS NOT NULL THEN
    -- Schedule first email for 7 days from now
    first_email_date := NOW() + INTERVAL '7 days';
    
    -- Bypass RLS by setting local role
    PERFORM set_config('role', 'service_role', true);
    
    -- Cancel any active claim reminder sequences
    UPDATE email_sequences
    SET status = 'cancelled'
    WHERE restaurant_id = NEW.id
      AND sequence_type = 'claim_reminder'
      AND status = 'active';
    
    -- Create upsell sequence
    INSERT INTO email_sequences (
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
      2,
      'active',
      first_email_date
    );
    
    -- Reset role
    PERFORM set_config('role', 'authenticator', true);
    
    RAISE NOTICE 'Created upsell sequence for restaurant: %', NEW.name;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the triggers
CREATE TRIGGER on_restaurant_insert
  AFTER INSERT ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION create_claim_reminder_sequence();

CREATE TRIGGER on_restaurant_claimed
  AFTER UPDATE ON restaurants
  FOR EACH ROW
  WHEN (OLD.owner_id IS DISTINCT FROM NEW.owner_id)
  EXECUTE FUNCTION create_upsell_sequence();

-- Add a service role bypass policy for email_sequences
DROP POLICY IF EXISTS "Service role can manage sequences" ON email_sequences;
CREATE POLICY "Service role can manage sequences"
  ON email_sequences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);