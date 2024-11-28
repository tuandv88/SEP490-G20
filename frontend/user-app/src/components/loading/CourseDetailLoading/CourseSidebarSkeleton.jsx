import React from 'react';

export function CourseSidebarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Pricing Card */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        </div>

        <div className="text-center mb-6">
          <div className="w-32 h-10 bg-gray-200 rounded mx-auto" />
          <div className="w-24 h-4 bg-gray-200 rounded mx-auto mt-2" />
        </div>

        <div className="w-full h-12 bg-gray-200 rounded-lg mb-6" />

        <div className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded-full" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Course Details Card */}
      <div className="bg-white rounded-lg p-6 border space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="flex-1 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Course By Card */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="w-32 h-6 bg-gray-200 rounded mb-4" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div>
            <div className="w-24 h-5 bg-gray-200 rounded mb-2" />
            <div className="w-32 h-4 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="w-24 h-5 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}