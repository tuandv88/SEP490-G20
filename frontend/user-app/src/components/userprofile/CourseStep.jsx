import React from 'react'
import { Clock, DollarSign, Eye } from 'lucide-react'
import { format } from 'date-fns'

export default function CourseStep({ step, index, course }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full font-medium">
          {index + 1}
        </div>
        <div>
          <h5 className="font-medium">{course?.title || `Course ${step.courseId}`}</h5>
          <p className="text-sm text-gray-600 mb-1">{course?.headline || ''}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {course?.timeEstimation || ''} hours
            </span>
            <span>•</span>
            <span>
              <DollarSign size={14} />           
            </span>
            <span>{course?.price === 0 ? 'Free' : course?.price}</span>
          </div>
        </div>
      </div>
      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-500 transition-colors">
        <Eye size={16} />
        View
      </button>
    </div>
  )
}
