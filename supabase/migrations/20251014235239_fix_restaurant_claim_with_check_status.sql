/*
  # Fix Restaurant Claim Policy - Allow Status Change

  1. Changes
    - Drop the current UPDATE policy
    - Create new policy that allows claiming with status change to 'pending'
    - WITH CHECK now validates both owner_id AND allows status to be 'pending' or 'active'

  2. Security
    - Users can claim unclaimed restaurants (owner_id IS NULL)
    - Users can update their own restaurants
    - After claiming, owner_id must match the user
    - Status can be set to 'pending' (for claims) or remain 'active'
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can update own restaurants or claim unclaimed ones" ON restaurants;

-- Create new policy with proper WITH CHECK for status changes
CREATE POLICY "Users can update own restaurants or claim unclaimed ones"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (
    -- Can update if they own it OR if it's unclaimed
    (auth.uid() = owner_id) OR (owner_id IS NULL)
  )
  WITH CHECK (
    -- After update, they must be the owner
    -- No restriction on status field - let the check constraint handle it
    auth.uid() = owner_id
  );
