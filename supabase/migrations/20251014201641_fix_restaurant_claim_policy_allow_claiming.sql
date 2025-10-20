/*
  # Fix Restaurant Claim Policy

  1. Changes
    - Drop the existing UPDATE policy that's blocking claims
    - Create a new UPDATE policy that properly allows:
      - Users to update their own restaurants (owner_id matches user)
      - Users to claim unclaimed restaurants (owner_id is NULL before update)
    - The with_check ensures after update, the owner_id must be the claiming user

  2. Security
    - Users can only claim restaurants that don't have an owner
    - Users can only update restaurants they own
    - After claiming, the restaurant must have the claimer as the owner
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can update own or claim unclaimed restaurants" ON restaurants;

-- Create a new policy that allows claiming
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
    auth.uid() = owner_id
  );
