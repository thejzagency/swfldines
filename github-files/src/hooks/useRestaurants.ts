import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Restaurant } from '../types';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    try {
      console.log('🔍 Fetching restaurants from Supabase...');
      console.log('📡 Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing');
      console.log('🔑 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Restaurant fetch error:', fetchError);
        throw fetchError;
      }

      console.log('✅ Restaurants fetched successfully:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('📋 Sample restaurant:', data[0].name);
      }

      setRestaurants(data || []);
      
    } catch (err) {
      console.error('❌ Error in fetchRestaurants:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
    } finally {
      console.log('🏁 Restaurant fetch complete, setting loading to false');
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchRestaurants();
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return {
    restaurants,
    loading,
    error,
    refetch
  };
};