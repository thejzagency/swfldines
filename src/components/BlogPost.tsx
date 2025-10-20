import React from 'react';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface BlogPostProps {
  postId: string;
  onBack: () => void;
}

export default function BlogPost({ postId, onBack }: BlogPostProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Blog
      </button>

      <article className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Top 10 Waterfront Restaurants in Fort Myers
        </h1>

        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-8">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            SW Florida Dines
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            March 15, 2024
          </div>
        </div>

        <img
          src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Waterfront dining"
          className="w-full h-96 object-cover rounded-lg mb-8"
        />

        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 mb-6">
            Fort Myers offers some of the most spectacular waterfront dining experiences in Southwest Florida.
            From casual dockside eateries to upscale restaurants with panoramic views, there's something for
            every taste and occasion.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Waterfront Dining?</h2>
          <p className="text-gray-600 mb-6">
            There's something magical about enjoying a great meal while watching boats glide by and the sun
            set over the water. Fort Myers' unique location along the Caloosahatchee River and Gulf of
            Mexico provides the perfect backdrop for memorable dining experiences.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Top Picks</h2>
          <p className="text-gray-600 mb-6">
            We've compiled a list of the best waterfront restaurants that combine exceptional food,
            stunning views, and outstanding service. Whether you're celebrating a special occasion or
            just looking for a great meal with a view, these restaurants won't disappoint.
          </p>
        </div>
      </article>
    </div>
  );
}
