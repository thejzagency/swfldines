import React from 'react';
import { Star, User } from 'lucide-react';
import { GoogleReview, RestaurantGoogleData } from '../types';

interface GoogleReviewsProps {
  reviews: GoogleReview[];
  googleData: RestaurantGoogleData | null;
  loading?: boolean;
}

const GoogleReviews: React.FC<GoogleReviewsProps> = ({ reviews, googleData, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Google Reviews</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!googleData && reviews.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Google Reviews</h3>
        {googleData && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold text-gray-900">
                {googleData.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              ({googleData.user_ratings_total.toLocaleString()} reviews)
            </span>
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-start gap-3">
                {review.author_photo_url ? (
                  <img
                    src={review.author_photo_url}
                    alt={review.author_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{review.author_name}</h4>
                    <span className="text-sm text-gray-500">
                      {review.relative_time_description}
                    </span>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  {review.text && (
                    <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">No reviews available yet.</p>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <img
          src="https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png"
          alt="Google"
          className="h-4 w-4"
        />
        <span>Powered by Google</span>
      </div>
    </div>
  );
};

export default GoogleReviews;
