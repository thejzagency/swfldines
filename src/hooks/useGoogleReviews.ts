import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleReview, RestaurantGoogleData } from '../types';

interface UseGoogleReviewsResult {
  reviews: GoogleReview[];
  googleData: RestaurantGoogleData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGoogleReviews = (restaurantId: string, googlePlaceId?: string): UseGoogleReviewsResult => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [googleData, setGoogleData] = useState<RestaurantGoogleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: existingGoogleData } = await supabase
        .from('restaurant_google_data')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .maybeSingle();

      const { data: existingReviews } = await supabase
        .from('google_reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('time', { ascending: false })
        .limit(5);

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const needsRefresh = !existingGoogleData ||
        new Date(existingGoogleData.last_fetched_at) < oneDayAgo;

      if (needsRefresh && googlePlaceId) {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const response = await fetch(
            'https://wiosivnwuqroaoqojlse.supabase.co/functions/v1/fetch-google-reviews',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ restaurantId, googlePlaceId }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setReviews(data.reviews || []);
            if (data.rating) {
              setGoogleData({
                restaurant_id: restaurantId,
                google_place_id: googlePlaceId,
                rating: data.rating,
                user_ratings_total: data.userRatingsTotal,
                last_fetched_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
          } else {
            setReviews(existingReviews || []);
            setGoogleData(existingGoogleData);
          }
        } else {
          setReviews(existingReviews || []);
          setGoogleData(existingGoogleData);
        }
      } else {
        setReviews(existingReviews || []);
        setGoogleData(existingGoogleData);
      }
    } catch (err) {
      console.error('Error fetching Google reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [restaurantId, googlePlaceId]);

  return {
    reviews,
    googleData,
    loading,
    error,
    refetch: fetchReviews,
  };
};
