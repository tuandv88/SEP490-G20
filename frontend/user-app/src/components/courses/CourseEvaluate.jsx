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
      <h2 className="text-2xl font-bold text-primary-text">Student Reviews & Testimonials</h2>

      <div className="bg-primary-light rounded-lg p-6 border border-primary-dark">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Rating Summary */}
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <div className="text-7xl font-bold text-primary-text">{averageRating}</div>
              <RatingStars rating={5} />
              <div className="text-primary-muted mt-2">Total {totalReviews} Reviews</div>
            </div>
          </div>

          {/* Rating Bars */}
          <div className="space-y-3">
            {ratingStats.map(({ stars, count }) => (
              <div key={stars} className="flex items-center gap-2">
                <div className="w-12 text-sm text-primary-muted">{stars} stars</div>
                <div className="flex-1 h-2 bg-primary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-text rounded-full"
                    style={{
                      width: `${(count / totalReviews) * 100}%`
                    }}
                  />
                </div>
                <div className="w-20 text-sm text-primary-muted">{count} reviews</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-primary-light rounded-lg p-6 border border-primary-dark">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-text font-semibold">
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-primary-text">{review.author}</h3>
                    <div className="text-sm text-primary-muted">{review.timeAgo}</div>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
                <p className="mt-3 text-primary-muted">{review.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}