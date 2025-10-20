/*
  # Add Missing Columns to Stripe Subscriptions

  1. Changes
    - Add user_id column (references auth.users)
    - Add restaurant_id column (references restaurants)
    - Add plan_type column for tracking subscription tier

  2. Notes
    - Uses DO block to check if columns exist before adding
    - Existing subscriptions will have NULL values for new columns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE stripe_subscriptions ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'restaurant_id'
  ) THEN
    ALTER TABLE stripe_subscriptions ADD COLUMN restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'plan_type'
  ) THEN
    ALTER TABLE stripe_subscriptions ADD COLUMN plan_type text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_user_id ON stripe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_restaurant_id ON stripe_subscriptions(restaurant_id);
