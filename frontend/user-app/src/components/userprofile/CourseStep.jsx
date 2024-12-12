import React from 'react'
import { Clock, DollarSign, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'
import { useNavigate } from 'react-router-dom'

const formatTimeEstimation = (minutes) => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} min`;
  } else if (remainingMinutes === 0) {
    return `${hours} hours`;
  } else {
    return `${hours} hours ${remainingMinutes} min`;
  }
};

export default function CourseStep({ step, index, course }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full font-medium">
            {index + 1}
          </div>
          <div className="flex-1">
            <h5 className="font-medium">{course?.title || `Course ${step.courseId}`}</h5>
            <p className="text-sm text-gray-600 mb-1">{course?.headline || ''}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatTimeEstimation(course?.timeEstimation)}
              </span>
              <span>•</span>
              <span>
                <DollarSign size={14} />           
              </span>
              <span>{course?.price === 0 ? 'Free' : course?.price}</span>
            </div>
            
            {/* Hiển thị thanh tiến độ nếu khóa học đã được đăng ký */}
            {course?.status && course.status !== 'NotEnrolled' && (
              <div className='mt-4'>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-primaryButton h-2 rounded-full'
                    style={{ width: `${course.completionPercentage}%` }}
                  ></div>
                </div>
                <p className='text-sm text-gray-500 mt-1'>
                  {Math.round(course.completionPercentage)}% Completed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <button onClick={() => navigate(AUTHENTICATION_ROUTERS.COURSEDETAIL.replace(':id', course?.id))} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-500 transition-colors">
        <Eye size={16} />
        View
      </button>
    </div>
  )
}
