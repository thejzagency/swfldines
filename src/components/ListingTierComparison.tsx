import React from 'react';
import { Check } from 'lucide-react';

export default function ListingTierComparison() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic directory listing',
        'Restaurant name & address',
        'Cuisine type display',
        'Phone & email contact',
        'Business hours',
        'Standard search results'
      ]
    },
    {
      name: 'Featured',
      price: '$29',
      period: 'per month',
      priceId: 'price_1S6H4HGMtBdGqLf3YTPzUtzF',
      features: [
        'Everything in Free',
        'Photo gallery (up to 5 images)',
        'Full description section',
        'Website & social media links',
        'Menu image upload',
        'Featured listing badge',
        'Boosted in search results'
      ]
    },
    {
      name: 'Premium',
      price: '$59',
      period: 'per month',
      priceId: 'price_1S6H4zGMtBdGqLf3yIbZ572d',
      popular: true,
      features: [
        'Everything in Featured',
        'Photo gallery (up to 15 images)',
        'Video showcase (1 video)',
        'Priority placement in search',
        'Homepage featured rotation',
        'Monthly visitor analytics',
        'Click & view tracking'
      ]
    },
    {
      name: 'Spotlight',
      price: '$99',
      period: 'per month',
      priceId: 'price_1S6H5oGMtBdGqLf3O3L2mvrY',
      features: [
        'Everything in Premium',
        'Unlimited photo gallery',
        'Video showcase (up to 3 videos)',
        'Top 3 search placement',
        'Homepage hero rotation',
        'Automatic blog feature',
        'Advanced analytics dashboard',
        '90-day performance history'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Listing Tiers</h1>
        <p className="text-xl text-gray-600">
          Choose the perfect plan for your restaurant
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`bg-white rounded-lg shadow-sm p-8 ${
              tier.popular ? 'ring-2 ring-blue-600' : ''
            }`}
          >
            {tier.popular && (
              <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
              <span className="text-gray-500 ml-2">{tier.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-lg font-semibold ${
                tier.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
