import React from 'react';
import ListingTierComparison from '../components/ListingTierComparison';

export function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-blue-600">
              SW Florida Dines
            </a>
          </div>
        </div>
      </div>

      <ListingTierComparison />
    </div>
  );
}