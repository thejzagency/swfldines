import React, { useState, useEffect } from 'react';
import { Utensils, User, LogOut, Settings, Building } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useRestaurants } from './hooks/useRestaurants';
import { Restaurant } from './types';
import { EmailService } from './utils/emailService';

// Components
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import RestaurantGrid from './components/RestaurantGrid';
import RestaurantModal from './components/RestaurantModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import RestaurantDashboard from './components/RestaurantDashboard';
import About from './components/About';
import Contact from './components/Contact';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Footer from './components/Footer';
import ListingTierComparison from './components/ListingTierComparison';
import UserCleanupUtility from './components/UserCleanupUtility';
import StripeCheckout from './components/StripeCheckout';
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import SubscriptionStatus from './components/SubscriptionStatus';
import AddRestaurantForm from './components/AddRestaurantForm';

interface FilterOptions {
  cuisine: string;
  priceRange: string;
  city: string;
  features: string[];
}

function App() {
  // State management
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddRestaurantFormOpen, setIsAddRestaurantFormOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    cuisine: '',
    priceRange: '',
    city: '',
    features: []
  });
  const [selectedBlogPost, setSelectedBlogPost] = useState<string | null>(null);

  // Handle URL-based navigation for Stripe success/cancel
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) {
      setCurrentPage('success');
    } else if (window.location.pathname === '/cancel') {
      setCurrentPage('cancel');
    }
  }, []);

  // Use the restaurants hook
  const { restaurants, loading: restaurantsLoading, error: restaurantsError, refetch } = useRestaurants();

  // Check authentication
  const checkAuth = async () => {
    try {
      console.log('🔐 Checking authentication...');
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('❌ Auth error:', error);
        throw error;
      }

      console.log('👤 User:', user?.email || 'Not logged in');
      setUser(user);

      if (user) {
        console.log('🔍 Fetching profile for user:', user.id);
        // Fetch user profile with timeout
        const profilePromise = supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );

        const { data: profile, error: profileError } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        if (profileError) {
          console.error('❌ Profile error:', profileError);
        } else if (profile) {
          console.log('✅ Profile loaded:', profile.role);
          setUserProfile(profile);
        } else {
          console.warn('⚠️ No profile found for user');
        }
      }

      console.log('🏁 Auth check complete');
    } catch (error) {
      console.error('❌ Auth check failed:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  // Initialize app
  useEffect(() => {
    console.log('🚀 App initializing...');
    checkAuth();

    // Set up auth listener
    console.log('👂 Setting up auth listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        checkAuth();
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  // Filter restaurants
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = !searchTerm || 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCuisine = !filters.cuisine || restaurant.cuisine_type === filters.cuisine;
    const matchesPrice = !filters.priceRange || restaurant.price_range === filters.priceRange;
    const matchesCity = !filters.city || restaurant.city === filters.city;
    const matchesFeatures = filters.features.length === 0 || 
      filters.features.some(feature => restaurant.features.includes(feature));

    return matchesSearch && matchesCuisine && matchesPrice && matchesCity && matchesFeatures;
  });

  // Event handlers
  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsRestaurantModalOpen(true);
  };

  const handleClaimRestaurant = async (restaurantId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      console.log('🏢 Claiming restaurant:', restaurantId);
      console.log('👤 User ID:', user.id);

      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔑 Session exists:', !!session);
      console.log('🔑 Session user:', session?.user?.id);

      if (!session) {
        alert('Your session has expired. Please log in again.');
        setIsAuthModalOpen(true);
        return;
      }

      // Direct database update
      const { data, error } = await supabase
        .from('restaurants')
        .update({
          owner_id: user.id,
          owner_claimed: true,
          status: 'pending'
        })
        .eq('id', restaurantId)
        .select();

      console.log('📊 Update result:', { data, error });

      if (error) {
        console.error('❌ Claim error:', error);
        alert(`Failed to claim restaurant: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        console.error('⚠️ No rows updated - RLS policy might be blocking the update');
        alert('Failed to claim restaurant. The restaurant may already be claimed or there was a permissions error.');
        return;
      }

      const claimedRestaurant = data[0];

      await EmailService.notifyAdminRestaurantClaimed(
        claimedRestaurant.name,
        user.email || '',
        claimedRestaurant.id
      );

      await EmailService.startUpsellSequence(claimedRestaurant.id);

      alert('Restaurant claim submitted successfully! Your claim is pending admin approval. You will be notified once approved.');
      setIsRestaurantModalOpen(false);
      refetch();
    } catch (error: any) {
      console.error('💥 Unexpected error:', error);
      alert(`Unexpected error: ${error.message || 'Please try again.'}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setCurrentPage('home');
  };

  const handleBlogPostClick = (postId: string) => {
    console.log('Blog post clicked:', postId);
    setSelectedBlogPost(postId);
    setCurrentPage('blog-post');
  };

  const handleBackToBlog = () => {
    setSelectedBlogPost(null);
    setCurrentPage('blog');
  };

  // Loading state
  const isLoading = authLoading || restaurantsLoading;

  console.log('🔄 App still loading - Auth:', authLoading, 'Restaurants:', restaurantsLoading);
  console.log('🎯 App render state:', {
    authLoading,
    restaurantsLoading,
    isLoading,
    currentPage,
    restaurantCount: restaurants.length,
    userEmail: user?.email || 'Not logged in',
    userRole: userProfile?.role || 'No role'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SW Florida Dines...</p>
          <p className="text-sm text-gray-500 mt-2">
            Auth: {authLoading ? 'Loading...' : 'Ready'} | 
            Restaurants: {restaurantsLoading ? 'Loading...' : 'Ready'}
          </p>
        </div>
      </div>
    );
  }

  if (restaurantsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-6">{restaurantsError}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Special pages that don't need the main layout
  if (currentPage === 'admin' && userProfile?.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  if (currentPage === 'restaurant-dashboard' && user) {
    return <RestaurantDashboard user={user} onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'user-cleanup') {
    return <UserCleanupUtility onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'blog-post' && selectedBlogPost) {
    return <BlogPost postId={selectedBlogPost} onBack={handleBackToBlog} />;
  }

  if (currentPage === 'success') {
    return (
      <SuccessPage 
        onNavigateHome={() => setCurrentPage('home')}
        onNavigateDashboard={() => setCurrentPage('restaurant-dashboard')}
      />
    );
  }

  if (currentPage === 'cancel') {
    return (
      <CancelPage 
        onNavigateHome={() => setCurrentPage('home')}
        onNavigatePricing={() => setCurrentPage('pricing')}
      />
    );
  }

  // Main app layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Utensils className="h-8 w-8" />
              <div className="text-left">
                <div className="text-xl font-bold">SW Florida Dines</div>
                <div className="text-xs text-gray-500">Restaurant Directory</div>
              </div>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setCurrentPage('home')}
                className={`font-medium transition-colors ${
                  currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Directory
              </button>
              <button
                onClick={() => {
                  if (user) {
                    setIsAddRestaurantFormOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Add Restaurant
              </button>
              <button
                onClick={() => setCurrentPage('about')}
                className={`font-medium transition-colors ${
                  currentPage === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setCurrentPage('blog')}
                className={`font-medium transition-colors ${
                  currentPage === 'blog' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Blog
              </button>
              <button
                onClick={() => setCurrentPage('pricing')}
                className={`font-medium transition-colors ${
                  currentPage === 'pricing' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Pricing
              </button>
              <button
                onClick={() => setCurrentPage('contact')}
                className={`font-medium transition-colors ${
                  currentPage === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <SubscriptionStatus user={user} />
                  {userProfile?.role === 'admin' && (
                    <button
                      onClick={() => setCurrentPage('admin')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentPage('restaurant-dashboard')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    My Restaurants
                  </button>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentPage === 'home' && (
          <>
            <Hero
              onListRestaurant={() => {
                if (user) {
                  setIsAddRestaurantFormOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Search Bar */}
              <div className="mb-8">
                <div className="max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder="Search restaurants, cuisine, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>
              </div>

              <FilterBar onFilterChange={setFilters} />
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 ? 's' : ''} Found
                  </h2>
                </div>
                
                <RestaurantGrid
                  restaurants={filteredRestaurants}
                  onRestaurantClick={handleRestaurantClick}
                  loading={restaurantsLoading}
                />
              </div>
            </div>
          </>
        )}

        {currentPage === 'about' && <About />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'blog' && <Blog onPostClick={handleBlogPostClick} />}
        {currentPage === 'privacy' && <PrivacyPolicy />}
        {currentPage === 'terms' && <TermsOfService />}
        {currentPage === 'pricing' && (
          <div className="space-y-8">
            <ListingTierComparison />
            {user && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <StripeCheckout user={user} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Modals */}
      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={isRestaurantModalOpen}
        onClose={() => setIsRestaurantModalOpen(false)}
        onClaimRestaurant={handleClaimRestaurant}
        user={user}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      />

      <AddRestaurantForm
        isOpen={isAddRestaurantFormOpen}
        onClose={() => {
          setIsAddRestaurantFormOpen(false);
          refetch();
        }}
        user={user}
      />
    </div>
  );
}

export default App;