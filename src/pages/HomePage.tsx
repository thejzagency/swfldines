import React from 'react';
import { useAuth } from '../hooks/useAuth';
import SubscriptionStatus from '../components/SubscriptionStatus';
import ListingTierComparison from '../components/ListingTierComparison';
import { LogOut, User } from 'lucide-react';

export function HomePage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-blue-600">SW Florida Dines</h1>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to SW Florida Dines
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the best restaurants in Southwest Florida and boost your restaurant's visibility with our premium listing options.
          </p>
        </div>

        {user && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Subscription</h3>
            <SubscriptionStatus />
          </div>
        )}

        {/* Subscription Plans */}
        <ListingTierComparison />
      </main>
    </div>
  );
}