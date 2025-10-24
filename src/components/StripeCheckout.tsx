import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { env } from '../config/env';

interface StripeCheckoutProps {
  user: any;
  restaurantId?: string;
}

const PLANS = {
  featured: {
    name: 'Featured',
    price: '$29',
    period: '/month',
    features: [
      'Everything in Free',
      '5 photo gallery images',
      'Full description section',
      'Website & social media links',
      'Menu URL link',
      'Featured badge display',
      'Priority in search results'
    ]
  },
  premium: {
    name: 'Premium',
    price: '$59',
    period: '/month',
    features: [
      'Everything in Featured',
      '15 photo gallery images',
      'Features/amenities section',
      'Visitor analytics dashboard',
      'Click & engagement tracking',
      '30-day performance history',
      'Enhanced search visibility'
    ]
  },
  premium_plus: {
    name: 'Spotlight',
    price: '$99',
    period: '/month',
    features: [
      'Everything in Premium',
      'Unlimited photo gallery',
      'Top search placement',
      'Homepage featured spot',
      'Advanced analytics',
      '90-day performance history',
      'Detailed click breakdown',
      'Priority support'
    ]
  }
};

export default function StripeCheckout({ user, restaurantId }: StripeCheckoutProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (planType: string) => {
    try {
      setLoading(planType);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('Please sign in to continue');
      }

      const response = await fetch(
        `${env.supabaseUrl}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'apikey': env.supabaseAnonKey
          },
          body: JSON.stringify({
            planType,
            restaurantId
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Your Listing</h2>
      <p className="text-gray-600 mb-8">
        Choose a premium plan to unlock enhanced features for your restaurant listing.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div
            key={key}
            className={`border rounded-lg p-6 ${
              key === 'premium' ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            }`}
          >
            {key === 'premium' && (
              <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full mb-4">
                MOST POPULAR
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-600">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(key)}
              disabled={loading !== null}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                key === 'premium'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {loading === key ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Select Plan'
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
