/*
  # Create function to get published blog posts
  
  This function bypasses PostgREST schema cache issues by creating a direct database function
  that can be called via RPC.
  
  1. Function
    - `get_published_blog_posts()` - Returns all published blog posts ordered by publish date
  
  2. Security
    - Function is accessible to anon role
    - SECURITY DEFINER to bypass RLS (but still only returns published posts)
*/

CREATE OR REPLACE FUNCTION get_published_blog_posts()
RETURNS TABLE (
  id uuid,
  title text,
  excerpt text,
  author text,
  published_at timestamptz,
  image_url text
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.excerpt,
    bp.author,
    bp.published_at,
    bp.image_url
  FROM blog_posts bp
  WHERE bp.status = 'published'
  ORDER BY bp.published_at DESC;
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION get_published_blog_posts() TO anon;
GRANT EXECUTE ON FUNCTION get_published_blog_posts() TO authenticated;