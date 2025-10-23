/*
  # Fix Blog Posts Public Access for All Users

  1. Changes
    - Drop and recreate the public SELECT policy to target both anon and authenticated roles
    - This ensures both unauthenticated and authenticated users can view published blog posts

  2. Security
    - Policy targets both 'anon' and 'authenticated' roles for public access
    - Only published posts are visible
*/

DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');