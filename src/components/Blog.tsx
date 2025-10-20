import React from 'react';
import { Calendar, User } from 'lucide-react';

interface BlogProps {
  onPostClick: (postId: string) => void;
}

const blogPosts = [
  {
    id: '1',
    title: 'Top 10 Waterfront Restaurants in Fort Myers',
    excerpt: 'Discover the best dining experiences with stunning water views...',
    author: 'SW Florida Dines',
    date: '2024-03-15',
    image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Naples Fine Dining Guide',
    excerpt: 'Explore the upscale dining scene in Naples with our comprehensive guide...',
    author: 'SW Florida Dines',
    date: '2024-03-10',
    image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'Best Breakfast Spots in Cape Coral',
    excerpt: 'Start your day right at these amazing breakfast restaurants...',
    author: 'SW Florida Dines',
    date: '2024-03-05',
    image: 'https://images.pexels.com/photos/1268558/pexels-photo-1268558.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export default function Blog({ onPostClick }: BlogProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600">
          Restaurant news, guides, and insights from Southwest Florida
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => onPostClick(post.id)}
            className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
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
                  {post.date}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
