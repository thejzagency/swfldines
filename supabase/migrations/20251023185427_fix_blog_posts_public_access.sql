/*
  # Fix Blog Posts Public Access

  1. Changes
    - Drop and recreate the public SELECT policy to explicitly target anon role
    - This ensures unauthenticated users can view published blog posts

  2. Security
    - Policy specifically targets 'anon' role for public access
    - Only published posts are visible to anonymous users
*/

DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon
  USING (status = 'published');