import React from 'react';

export function CourseContentSkeleton() {
  return (
    <div className="mt-8 animate-pulse">
      <div className="w-48 h-8 bg-gray-200 rounded mb-4" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
              <div className="w-64 h-6 bg-gray-200 rounded" />
              <div className="w-5 h-5 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}