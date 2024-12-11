import React, { useState, useEffect } from 'react';
import { Trophy, Medal } from 'lucide-react';

const LeaderboardLoading = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <div className="h-8 w-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>

      {/* Skeleton Items */}
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-4">
            {/* Position/Medal */}
            <div className="w-8 flex justify-center">
              {index < 3 ? (
                <div className={`w-6 h-6 rounded-full bg-gray-200 animate-pulse`}></div>
              ) : (
                <div className="w-6 text-gray-200 animate-pulse">#{index + 1}</div>
              )}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>

            {/* Name and Problems */}
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Points */}
          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default LeaderboardLoading
