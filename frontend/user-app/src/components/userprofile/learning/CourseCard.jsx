import React from 'react';


export function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex space-x-4">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-48 h-32 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <div className="flex items-center">
              {'★'.repeat(Math.floor(course.rating))}
              <span className="ml-1 text-gray-600">{course.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Số bài đã hoàn thành: {course.progress} của {course.total} bài-học
          </p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(course.progress / course.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((course.progress / course.total) * 100)}% Hoàn thành
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}