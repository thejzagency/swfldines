import React from 'react';
import { MapPin, Users, Star } from 'lucide-react';
import { MetaTags } from './MetaTags';

export default function About() {
  return (
    <>
      <MetaTags
        title="About Us - SW Florida Dines | Restaurant Directory"
        description="Learn about SW Florida Dines, your comprehensive guide to discovering the best restaurants in Southwest Florida. Built by locals, for locals and visitors alike."
        url="https://www.swfldines.com/about"
      />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About SW Florida Dines</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your comprehensive guide to discovering the best restaurants in Southwest Florida
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Local Focus</h3>
          <p className="text-gray-600">
            Covering restaurants across Lee, Collier, and Charlotte counties
          </p>
        </div>

        <div className="text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
          <p className="text-gray-600">
            Built by locals, for locals and visitors alike
          </p>
        </div>

        <div className="text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Quality First</h3>
          <p className="text-gray-600">
            Only the best restaurants make it to our directory
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          SW Florida Dines was created to help residents and visitors discover the incredible
          dining scene in Southwest Florida. Whether you're looking for waterfront dining in
          Fort Myers, upscale Italian in Naples, or authentic Cuban food in Cape Coral, we're
          here to help you find your next great meal.
        </p>
      </div>
    </div>
    </>
  );
}
