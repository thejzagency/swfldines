import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export default function SuccessPage({ onNavigateHome, onNavigateDashboard }: SuccessPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for upgrading your restaurant listing. Your enhanced features are now active.
        </p>
        <div className="space-y-3">
          <button
            onClick={onNavigateDashboard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Go to Dashboard
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
