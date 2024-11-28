import React, { useState } from 'react';
import { Clock, DollarSign, ChevronRight, BookOpen, Target, X } from 'lucide-react';


export default function CourseStep({ step, index, course }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-lg">{course?.title || 'Course Title'}</h4>
              <p className="text-gray-600 text-sm mb-2">{course?.headline || 'Course Headline'}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium text-sm"
            >
              View <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {course?.timeEstimation || 'N/A'} hours
            </span>
            <span className="flex items-center gap-1">
              <DollarSign size={16} />
              ${course?.price || 'Free'}
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{course?.title || 'Course Title'}</h3>
                  <p className="text-gray-600">{course?.headline || 'Course Headline'}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock size={18} />
                    Duration
                  </span>
                  <p className="font-semibold">{course?.timeEstimation || 'N/A'} hours</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="flex items-center gap-2 text-gray-600 mb-2">
                    <DollarSign size={18} />
                    Price
                  </span>
                  <p className="font-semibold">${course?.price || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <BookOpen size={18} className="text-red-500" />
                    Course Description
                  </h4>
                  <p className="text-gray-600">{course?.description || 'No description available.'}</p>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Target size={18} className="text-red-500" />
                    Topics Covered
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {course?.chapters?.map((chapter, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        {chapter.title}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Skills You'll Gain</h4>
                  <div className="flex flex-wrap gap-2">
                    {course?.objectives?.split('\n').map((objective, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                      >
                        {objective}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}