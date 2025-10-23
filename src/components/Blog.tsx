import React, { useEffect, useState } from 'react';
import { Calendar, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MetaTags } from './MetaTags';

interface BlogProps {
  onPostClick: (postId: string) => void;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  published_at: string;
  image_url: string;
}

export default function Blog({ onPostClick }: BlogProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      console.log('Fetching blog posts via Edge Function...');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/get-blog-posts`;

      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Blog posts from Edge Function:', data?.length || 0, 'posts');
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title="Blog - SW Florida Dines | Restaurant News & Guides"
        description="Restaurant news, guides, and dining insights from Southwest Florida. Discover the best places to eat in Naples, Fort Myers, Cape Coral and beyond."
        url="https://www.swfldines.com/blog"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600">
          Restaurant news, guides, and insights from Southwest Florida
        </p>
      </div>

      {blogPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onPostClick(post.id)}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
