/*
  # Fix Restaurant Claim Policy
  
  ## Problem
  The current policy allows updating unclaimed restaurants (owner_id IS NULL) 
  but the WITH CHECK clause requires auth.uid() = owner_id, which fails when
  owner_id is NULL.
  
  ## Solution
  Update the WITH CHECK clause to allow setting owner_id to the current user
  when claiming an unclaimed restaurant.
  
  ## Changes
  - Drop existing update policy
  - Create new policy that allows:
    1. Owners to update their own restaurants
    2. Anyone to claim unclaimed restaurants by setting owner_id to themselves
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can update own or claim unclaimed restaurants" ON restaurants;

-- Create new policy with correct WITH CHECK clause
CREATE POLICY "Users can update own or claim unclaimed restaurants"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING ((auth.uid() = owner_id) OR (owner_id IS NULL))
  WITH CHECK (
    -- Allow if they already own it, OR if they're claiming an unclaimed restaurant
    (auth.uid() = owner_id) OR 
    (owner_id IS NULL AND auth.uid() IS NOT NULL)
  );
