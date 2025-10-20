/*
  # Fix Restaurant Claim Policy - Final Fix
  
  ## Problem
  The WITH CHECK clause evaluates the row AFTER the update, not before.
  When claiming a restaurant:
  - Before update: owner_id = NULL (passes USING clause)
  - After update: owner_id = user_id (fails WITH CHECK because owner_id is no longer NULL)
  
  ## Solution
  The WITH CHECK should verify that the new owner_id matches the authenticated user,
  regardless of what the old owner_id was.
  
  ## Changes
  - Drop existing update policy
  - Create new policy where WITH CHECK only verifies auth.uid() = owner_id
    (meaning after the update, the owner must be the authenticated user)
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can update own or claim unclaimed restaurants" ON restaurants;

-- Create new policy with correct logic
CREATE POLICY "Users can update own or claim unclaimed restaurants"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (
    -- Can update if they already own it OR if it's unclaimed
    (auth.uid() = owner_id) OR (owner_id IS NULL)
  )
  WITH CHECK (
    -- After update, they must be the owner
    auth.uid() = owner_id
  );
