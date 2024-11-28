import React from 'react';

export function CourseHeaderSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-5 h-5 bg-gray-200 rounded-full" />
        ))}
        <div className="w-32 h-4 bg-gray-200 rounded" />
      </div>
      
      <div className="flex justify-between items-start">
        <div className="w-96 h-8 bg-gray-200 rounded" />
        <div className="flex gap-4">
          <div className="w-24 h-6 bg-gray-200 rounded" />
          <div className="w-24 h-6 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="w-32 h-6 bg-gray-200 rounded-full" />
    </div>
  );
}