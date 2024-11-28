import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    author: "Dang Huy Nguyen",
    avatar: "DN",
    rating: 5,
    content: "I am addicted to the knowledge that Mr. Manh does so meticulously and with quality, the only problem is that he releases too little hihi. But listening to what you guys say, I immediately understand the practical knowledge so there is not much, right? Always looking forward to your next knowledge.",
    timeAgo: "16 hours ago"
  },
  {
    id: 2,
    author: "Van Soai Phung",
    avatar: "VS",
    rating: 5,
    content: "The easiest Kubernetes course I've ever taken, it's awesome, the knowledge is practical and how to deploy projects. I've applied it to my company and my colleagues also praised me for doing a good job. Mr. Manh teaches with great care. Thank you.",
    timeAgo: "16 hours ago"
  }
];

const ratingStats = [
  { stars: 5, count: 15 },
  { stars: 4, count: 0 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 }
];

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

export function CourseEvaluate() {
  const totalReviews = ratingStats.reduce((acc, curr) => acc + curr.count, 0);
  const averageRating = "5.0";

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Student Reviews & Testimonials</h2>

      <div className="bg-white rounded-lg p-6 border">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Rating Summary */}
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <div className="text-7xl font-bold text-gray-900">{averageRating}</div>
              <RatingStars rating={5} />
              <div className="text-gray-600 mt-2">Total {totalReviews} Reviews</div>
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
                      width: `${(count / totalReviews) * 100}%`
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
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-6 border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.author}</h3>
                    <div className="text-sm text-gray-500">{review.timeAgo}</div>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
                <p className="mt-3 text-gray-700">{review.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}