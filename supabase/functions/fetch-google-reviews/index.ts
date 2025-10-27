import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface GooglePlaceDetailsResponse {
  result?: {
    place_id: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: Array<{
      author_name: string;
      author_url?: string;
      profile_photo_url?: string;
      rating: number;
      relative_time_description: string;
      text: string;
      time: number;
    }>;
  };
  status: string;
  error_message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { restaurantId, googlePlaceId } = await req.json();

    if (!restaurantId || !googlePlaceId) {
      return new Response(
        JSON.stringify({ error: 'Restaurant ID and Google Place ID are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if we have recent data (less than 24 hours old)
    const { data: existingData } = await supabase
      .from('restaurant_google_data')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .single();

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (existingData && new Date(existingData.last_fetched_at) > oneDayAgo) {
      // Return cached data
      const { data: reviews } = await supabase
        .from('google_reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('time', { ascending: false })
        .limit(5);

      return new Response(
        JSON.stringify({
          cached: true,
          rating: existingData.rating,
          userRatingsTotal: existingData.user_ratings_total,
          reviews: reviews || [],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch fresh data from Google Places API
    const placesUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=place_id,rating,user_ratings_total,reviews&key=${googleApiKey}`;

    const placesResponse = await fetch(placesUrl);
    const placesData: GooglePlaceDetailsResponse = await placesResponse.json();

    if (placesData.status !== 'OK' || !placesData.result) {
      return new Response(
        JSON.stringify({ error: `Google API error: ${placesData.status}`, message: placesData.error_message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { rating, user_ratings_total, reviews } = placesData.result;

    // Upsert restaurant Google data
    await supabase
      .from('restaurant_google_data')
      .upsert({
        restaurant_id: restaurantId,
        google_place_id: googlePlaceId,
        rating: rating || null,
        user_ratings_total: user_ratings_total || 0,
        last_fetched_at: now.toISOString(),
        updated_at: now.toISOString(),
      }, { onConflict: 'restaurant_id' });

    // Delete old reviews for this restaurant
    await supabase
      .from('google_reviews')
      .delete()
      .eq('restaurant_id', restaurantId);

    // Insert new reviews (limit to 5 most recent)
    if (reviews && reviews.length > 0) {
      const reviewsToInsert = reviews.slice(0, 5).map(review => ({
        restaurant_id: restaurantId,
        google_place_id: googlePlaceId,
        author_name: review.author_name,
        author_photo_url: review.profile_photo_url || null,
        rating: review.rating,
        text: review.text || null,
        time: review.time,
        relative_time_description: review.relative_time_description,
      }));

      await supabase
        .from('google_reviews')
        .insert(reviewsToInsert);
    }

    // Fetch and return the newly stored data
    const { data: newReviews } = await supabase
      .from('google_reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('time', { ascending: false });

    return new Response(
      JSON.stringify({
        cached: false,
        rating: rating || null,
        userRatingsTotal: user_ratings_total || 0,
        reviews: newReviews || [],
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});