/*
  # Force Schema Cache Reload for Blog Posts

  1. Changes
    - Add a comment to the blog_posts table to force PostgREST to reload the schema cache
    - This is a workaround for the schema cache not updating after table creation

  2. Purpose
    - Forces Supabase's REST API layer to recognize the blog_posts table
*/

COMMENT ON TABLE blog_posts IS 'Blog posts for SW Florida Dines - stores articles and restaurant guides';

-- Also ensure the table is in the public schema and visible
ALTER TABLE IF EXISTS blog_posts OWNER TO postgres;

-- Grant necessary permissions
GRANT ALL ON blog_posts TO postgres;
GRANT SELECT ON blog_posts TO anon;
GRANT ALL ON blog_posts TO authenticated;
GRANT ALL ON blog_posts TO service_role;