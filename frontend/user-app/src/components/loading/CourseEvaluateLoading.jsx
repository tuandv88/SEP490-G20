import React from 'react';

export function CourseEvaluateLoading() {
  return (
    <div className="space-y-6">
      {/* Title Skeleton */}
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />

      {/* Summary Box Skeleton */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Average Rating */}
          <div className="w-full md:w-1/2 animate-pulse">
            <div className="h-16 w-24 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>

          {/* Rating Bars */}
          <div className="w-full md:w-1/2 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 animate-pulse">
                <div className="w-full h-2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 border animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-full bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}