import React from 'react';
import { XCircle } from 'lucide-react';

interface CancelPageProps {
  onNavigateHome: () => void;
  onNavigatePricing: () => void;
}

export default function CancelPage({ onNavigateHome, onNavigatePricing }: CancelPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="space-y-3">
          <button
            onClick={onNavigatePricing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            View Pricing Again
          </button>
          <button
            onClick={onNavigateHome}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
