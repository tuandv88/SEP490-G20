import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { UserAPI } from '@/services/api/userApi';
import { formatDistanceToNow } from 'date-fns';
import { CourseEvaluateLoading } from '../loading/CourseEvaluateLoading';

function RatingStars({ rating }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-primary-muted'
          }`}
        />
      ))}
    </div>
  );
}

export function CourseEvaluate({ reviewData }) {
  const [userDetails, setUserDetails] = useState({});

  // Tạo mảng thống kê rating từ 1-5 sao
  const generateRatingStats = (reviews) => {
    const stats = Array(5).fill(0);
    reviews.data.forEach(review => {
      stats[review.rating - 1]++;
    });
    return stats.map((count, index) => ({
      stars: 5 - index,
      count
    }));
  };

  // Fetch user details cho mỗi review
  const fetchUserDetails = async (reviews) => {
    try {
      const userPromises = reviews.data.map(review => 
        UserAPI.getUserById(review.submittedBy)
      );
      const users = await Promise.all(userPromises);
      
      const userMap = {};
      users.forEach(user => {
        userMap[user.id] = user;
      });
      
      setUserDetails(userMap);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    if (reviewData?.courseReviews?.reviews?.data?.length > 0) {
      fetchUserDetails(reviewData.courseReviews.reviews);
    }
  }, [reviewData]);

  if (reviewData.loading) {
    return <CourseEvaluateLoading />;
  }

  if (reviewData.error) {
    return <div className="text-red-500">{reviewData.error}</div>;
  }

  const { courseReviews } = reviewData;
  const ratingStats = generateRatingStats(courseReviews.reviews);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Student Reviews & Testimonials</h2>

      <div className="bg-white rounded-lg p-6 border">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Rating Summary */}
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <div className="text-7xl font-bold text-gray-900">
                {courseReviews.averageRating.toFixed(1)}
              </div>
              <RatingStars rating={Math.round(courseReviews.averageRating)} />
              <div className="text-gray-600 mt-2">
                Total {courseReviews.totalReviews} Reviews
              </div>
            </div>
          </div>

          {/* Rating Bars */}
          <div className="space-y-3">
            {ratingStats.map(({ stars, count }) => (
              <div key={stars} className="flex items-center gap-2">
                <div className="w-12 text-sm text-gray-600">{stars} stars</div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${courseReviews.totalReviews ? (count / courseReviews.totalReviews) * 100 : 0}%`
                    }}
                  />
                </div>
                <div className="w-20 text-sm text-gray-600">{count} reviews</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {courseReviews.reviews.data.map((review, index) => {
          const userDetail = userDetails[review.submittedBy] || {};
          const fullName = userDetail.firstName && userDetail.lastName 
            ? `${userDetail.firstName} ${userDetail.lastName}`
            : `User ${review.submittedBy.slice(0, 8)}`;
          
          return (
            <div key={index} className="bg-white rounded-lg p-6 border">
              <div className="flex items-start gap-4">
                {userDetail.urlProfilePicture ? (
                  <img 
                    src={userDetail.urlProfilePicture}
                    alt={fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
                    {(userDetail.firstName?.[0] || '') + (userDetail.lastName?.[0] || '')}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{fullName}</h3>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(review.dateSubmitted), { addSuffix: true })}
                      </div>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="mt-3 text-gray-700">{review.feedback}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}