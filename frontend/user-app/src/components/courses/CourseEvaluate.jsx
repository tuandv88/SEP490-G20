import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { UserAPI } from '@/services/api/userApi';
import { CourseAPI } from '@/services/api/courseApi';
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

export function CourseEvaluate({ courseId }) {
  const [userDetails, setUserDetails] = useState({});
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const fetchReviews = async (pageIndex) => {
    try {
      const data = await CourseAPI.getCourseReviews(courseId, pageIndex, PAGE_SIZE);
      setReviewData(prevData => {
        if (prevData && pageIndex > 1) {
          return {
            ...data,
            courseReviews: {
              ...data.courseReviews,
              reviews: {
                ...data.courseReviews.reviews,
                data: [...prevData.courseReviews.reviews.data, ...data.courseReviews.reviews.data]
              }
            }
          };
        }
        return data;
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [courseId]);

  // Thay đổi hàm generateRatingStats để sử dụng starRatings
  const generateRatingStats = (reviews) => {
    const stats = [];
    for (let i = 5; i >= 1; i--) {
      stats.push({
        stars: i,
        count: reviews.starRatings[i] || 0
      });
    }
    return stats;
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

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchReviews(page + 1);
  };

  if (loading && !reviewData) {
    return <CourseEvaluateLoading />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const { courseReviews } = reviewData;
  const ratingStats = generateRatingStats(courseReviews);
  const hasMoreReviews = courseReviews.reviews.count > courseReviews.reviews.data.length;

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

        {/* Load More Button */}
        {hasMoreReviews && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
}