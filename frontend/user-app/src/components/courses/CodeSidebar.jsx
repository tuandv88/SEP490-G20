import React from 'react'
import { Clock, Calendar, Award } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { CourseAPI } from '@/services/api/courseApi'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'

export function CourseSidebar({ enrolledCourses, firstLectureId }) {

  const { id } = useParams()
  console.log(id)
  console.log(firstLectureId)
  const navigate = useNavigate()


  const handleLearningCourse = () => {
    navigate(AUTHENTICATION_ROUTERS.LEARNINGSPACE.replace(':id', id).replace(':lectureId', firstLectureId))
  }


  const handleEnrollCourse = async () => {
    try {
      const data = await CourseAPI.enrollCourse(id)
      console.log(data)
      //navigate(AUTHENTICATION_ROUTERS.LEARNINGSPACE.replace(':id', id).replace(':lectureId', firstLectureId))
    } catch (error) {
      console.error('Error enrolling course:', error)
    }
  }


  return (
    <div className='space-y-6'>
      {/* Free Course Card */}
      {/* <div className="bg-white rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4">Free of charge</h3>
        <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors mb-4">
          Sign up now
        </button>
        <p className="text-center text-gray-600 text-sm">Join the course for free</p>
      </div> */}

      <div className='bg-white rounded-lg p-6 border'>
        {/* <h3 className='text-xl font-semibold mb-4'>Free of charge</h3> */}
        {enrolledCourses ? (
          <>
            <button onClick={() => handleLearningCourse()} className='w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors mb-4'>
              Learning Now
            </button>
            <p className='text-center text-gray-600 text-sm'>You are learning this course</p>
          </>
        ) : (
          <>
            <button onClick={() => handleEnrollCourse()} className='w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors mb-4'>
              Enroll Now
            </button>
            <p className='text-center text-gray-600 text-sm'>Join the course for free</p>
          </>
        )}
      </div>

      {/* Course Details Card */}
      <div className='bg-white rounded-lg p-6 border space-y-4'>
        <div className='flex items-center gap-2'>
          <span className='text-gray-600'>All levels</span>
        </div>
        <div className='flex items-center gap-2'>
          <Clock className='w-5 h-5 text-gray-500' />
          <span className='text-gray-600'>9 hours 32 minutes Duration</span>
        </div>
        <div className='flex items-center gap-2'>
          <Calendar className='w-5 h-5 text-gray-500' />
          <span className='text-gray-600'>November 11, 2024 Last Updated</span>
        </div>
        <div className='flex items-center gap-2'>
          <Award className='w-5 h-5 text-gray-500' />
          <span className='text-gray-600'>Certificate of Completion</span>
        </div>
      </div>

      {/* Course By Card */}
      <div className='bg-white rounded-lg p-6 border'>
        <h3 className='text-lg font-semibold mb-4'>Course by</h3>

        {/* Instructor */}
        {/* <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 font-bold">
            EL
          </div>
          <div>
            <h4 className="font-medium">elroydevops</h4>
            <p className="text-sm text-gray-600">DevOps Engineer</p>
          </div>
        </div> */}

        {/* Organization */}
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold'>
            IC
          </div>
          <div>
            <h4 className='font-medium'>ICoder.vn</h4>
          </div>
        </div>
      </div>

      {/* Course Materials Card */}
      {/* <div className="bg-white rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Course materials</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-600">Support group:</span>
            <a href="https://fb.com/groups/950551346787852" className="text-blue-500 hover:text-blue-600 break-all">
              https://fb.com/groups/950551346787852
            </a>
          </div>
        </div>
      </div> */}

      {/* Object Card */}
      {/* <div className="bg-white rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Object</h3>
        <ul className="space-y-4 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            <p>You want to become a DevOps Engineer but don't know where to start? You don't have any practical DevOps knowledge?</p>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            <p>Are you a Developer, Sysadmin, Tester, DBA,... wanting to gain more DevOps knowledge to increase your income and stand out from other candidates?</p>
          </li>
        </ul>
      </div> */}
    </div>
  )
}
