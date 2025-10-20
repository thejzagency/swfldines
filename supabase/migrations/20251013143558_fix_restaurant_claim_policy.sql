/*
  # Fix Restaurant Claim RLS Policy

  This migration fixes the issue where users cannot claim unclaimed restaurants.
  
  ## Changes
  - Drop the existing "Users can update own restaurants" policy
  - Create a new policy that allows:
    1. Owners to update their own restaurants
    2. Authenticated users to claim unclaimed restaurants (where owner_id IS NULL)
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Users can update own restaurants" ON restaurants;

-- Create new policy that allows claiming unclaimed restaurants
CREATE POLICY "Users can update own or claim unclaimed restaurants"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id OR owner_id IS NULL)
  WITH CHECK (auth.uid() = owner_id);
