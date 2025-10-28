/*
  MANUAL MIGRATION FOR PRODUCTION DATABASE
  Database: wiosivnwuqroaoqojlse

  INSTRUCTIONS:
  1. Go to https://supabase.com/dashboard/project/wiosivnwuqroaoqojlse
  2. Click "SQL Editor" in the left sidebar
  3. Click "New Query"
  4. Copy and paste this ENTIRE file
  5. Click "Run" or press Cmd/Ctrl + Enter

  This migration includes:
  - Email sequences table
  - Trigger functions with schema-qualified names
  - RLS policies
  - All necessary indexes
*/

-- ============================================================================
-- EMAIL SEQUENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.email_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  sequence_type text NOT NULL CHECK (sequence_type IN ('claim_reminder', 'upsell')),
  current_step integer NOT NULL DEFAULT 0,
  total_steps integer NOT NULL DEFAULT 3,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  next_email_scheduled_at timestamptz,
  last_email_sent_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES FOR EMAIL_SEQUENCES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can manage sequences" ON public.email_sequences;
DROP POLICY IF EXISTS "System can manage email sequences" ON public.email_sequences;
DROP POLICY IF EXISTS "Admins can view all email sequences" ON public.email_sequences;

-- Service role has full access
CREATE POLICY "Service role can manage sequences"
  ON public.email_sequences FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can insert/update (for triggers)
CREATE POLICY "System can manage email sequences"
  ON public.email_sequences FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can view sequences
CREATE POLICY "Admins can view all email sequences"
  ON public.email_sequences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_email_sequences_restaurant_id
  ON public.email_sequences(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_email_sequences_status
  ON public.email_sequences(status);

CREATE INDEX IF NOT EXISTS idx_email_sequences_next_scheduled
  ON public.email_sequences(next_email_scheduled_at)
  WHERE status = 'active';

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.create_claim_reminder_sequence() CASCADE;
DROP FUNCTION IF EXISTS public.create_upsell_sequence() CASCADE;

-- Function to create claim reminder sequence
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

-- Function to create upsell sequence
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

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_restaurant_insert ON public.restaurants;
DROP TRIGGER IF EXISTS on_restaurant_claimed ON public.restaurants;

-- Trigger for new restaurant inserts
CREATE TRIGGER on_restaurant_insert
  AFTER INSERT ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.create_claim_reminder_sequence();

-- Trigger for restaurant claims
CREATE TRIGGER on_restaurant_claimed
  AFTER UPDATE ON public.restaurants
  FOR EACH ROW
  WHEN (NEW.owner_claimed = true)
  EXECUTE FUNCTION public.create_upsell_sequence();

-- ============================================================================
-- FORCE SCHEMA CACHE RELOAD
-- ============================================================================

NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- VERIFICATION QUERIES (run these after to verify)
-- ============================================================================

-- Check if table exists
-- SELECT EXISTS (
--   SELECT 1 FROM information_schema.tables
--   WHERE table_name = 'email_sequences'
-- );

-- Check if triggers exist
-- SELECT tgname, tgenabled
-- FROM pg_trigger
-- WHERE tgrelid = 'public.restaurants'::regclass
-- AND tgname IN ('on_restaurant_insert', 'on_restaurant_claimed');

-- Check if policies exist
-- SELECT policyname, cmd
-- FROM pg_policies
-- WHERE tablename = 'email_sequences';
