import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface UserCleanupUtilityProps {
  onBack: () => void;
}

export default function UserCleanupUtility({ onBack }: UserCleanupUtilityProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">User Cleanup Utility</h1>
          <p className="text-gray-600">
            This utility is for administrative purposes only. Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
