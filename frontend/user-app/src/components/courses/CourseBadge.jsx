import React from 'react';


const badgeColors = {
  Basic: 'bg-green-100 text-green-800',
  Intermediate: 'bg-blue-100 text-blue-800',
  Advanced: 'bg-purple-100 text-purple-800',
  Expert: 'bg-red-100 text-red-800'
};

export const CourseBadge = ({ level }) => (
  <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColors[level]}`}>
    {level}
  </span>
);