import { Button } from '@/components/ui/button'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'
import { Play } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FeedbackModal } from '../feedback/FeedbackModal'

export function CourseCard({ course }) {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFeedbackSuccess, setIsFeedbackSuccess] = useState(false)

  const handleContinueLearning = () => {
    navigate(
      AUTHENTICATION_ROUTERS.LEARNINGSPACE.replace(':id', course.courseId).replace(
        ':lectureId',
        course.currentLectureId === null ? course.firstLectureId : course.currentLectureId
      )
    )
  }

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <div className='flex space-x-4'>
        <img src={course.imageUrl} alt={course.title} className='w-48 h-32 object-cover rounded-lg' />
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>{course.title}</h3>
          </div>
          <p className='text-sm text-gray-600 mt-2'>{course.headline}</p>
          <div className='mt-4'>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-primaryButton h-2 rounded-full'
                style={{ width: `${course.completionPercentage}%` }}
              ></div>
            </div>
            <p className='text-sm text-gray-500 mt-1'>{Math.round(course.completionPercentage)}% Completed</p>
          </div>
          {/* Thêm nút hành động */}
          <div className='mt-4 flex items-center gap-2'>
            {course.status === 'InProgress' && (
              <>
                <Button
                  onClick={handleContinueLearning}
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primaryButton rounded-md hover:bg-[#3e80c1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryButton'
                >
                  <Play className='w-4 h-4 mr-2' />
                  Continue Learning
                </Button>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primaryButton rounded-md hover:bg-[#3e80c1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryButton'
                >
                  Feedback
                </Button>
              </>
            )}
            {course.status === 'Completed' && (
              <>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primaryButton rounded-md hover:bg-[#3e80c1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryButton'
                >
                  Feedback
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <FeedbackModal
        courseId={course.courseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setIsFeedbackSuccess={setIsFeedbackSuccess}
        existingRating={course.rating !== -1 ? course.rating : undefined}
        existingFeedback={course.rating !== -1 ? course.feedback : undefined}
        readOnly={course.rating !== -1}
      />
    </div>
  )
}
