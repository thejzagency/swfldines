import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Utensils, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Restaurant } from '../types';

interface HeroProps {
  onListRestaurant?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onListRestaurant }) => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      const { data } = await supabase
        .from('restaurants')
        .select('*')
        .eq('status', 'active')
        .in('listing_type', ['premium', 'premium_plus'])
        .limit(5);

      if (data) {
        setFeaturedRestaurants(data);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  useEffect(() => {
    if (featuredRestaurants.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredRestaurants.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredRestaurants.length]);

  const currentRestaurant = featuredRestaurants[currentIndex];

  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentRestaurant?.images?.[0] || "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1600"}
          alt="Beautiful waterfront dining in Southwest Florida"
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Southwest Florida's
            <span className="block text-blue-400">Best Restaurants</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            From Naples to Fort Myers, find your next favorite dining experience in paradise
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">200+</div>
              <div className="text-blue-200">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10+</div>
              <div className="text-blue-200">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.5★</div>
              <div className="text-blue-200">Average Rating</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center">
              <Search className="h-5 w-5 mr-2" />
              Explore Restaurants
            </button>
            <button
              onClick={onListRestaurant}
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
            >
              <Utensils className="h-5 w-5 mr-2" />
              Add Your Restaurant
            </button>
          </div>

          {/* Featured Restaurant Badge */}
          {currentRestaurant && (
            <div className="mt-8 inline-flex items-center bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg px-4 py-3">
              <Crown className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-white text-sm">
                Featured: <span className="font-semibold">{currentRestaurant.name}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="relative bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Curated by locals who know Southwest Florida's dining scene inside and out
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">
                Every restaurant is carefully selected to ensure exceptional dining experiences
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Utensils className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Always Fresh</h3>
              <p className="text-gray-600">
                Updated daily with the latest restaurant information and seasonal menus
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;