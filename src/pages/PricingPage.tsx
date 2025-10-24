import React from 'react';
import { SubscriptionPlans } from '../components/subscription/SubscriptionPlans';
import { MetaTags } from '../components/MetaTags';

export function PricingPage() {
  return (
    <>
      <MetaTags
        title="Pricing & Plans - SW Florida Dines | Restaurant Listing Packages"
        description="Choose the perfect listing package for your restaurant. From free basic listings to premium spotlight features. Get more visibility and customers with SW Florida Dines."
        url="https://www.swfldines.com/pricing"
      />
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
      
      <SubscriptionPlans />
    </div>
    </>
  );
}