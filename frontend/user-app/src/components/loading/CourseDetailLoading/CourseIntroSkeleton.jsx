import React from 'react';

export function CourseIntroSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 border space-y-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="w-48 h-6 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-3/4 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}