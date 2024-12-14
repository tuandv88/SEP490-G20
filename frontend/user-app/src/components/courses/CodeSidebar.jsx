import React, { useContext, useEffect, useState } from 'react'
import { Clock, Calendar, Award, ShoppingCart, PlayCircle, GraduationCap } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { CourseAPI } from '@/services/api/courseApi'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'
import { UserContext } from '@/contexts/UserContext'
import authServiceInstance from '@/oidc/AuthService'
import { format } from 'date-fns'
import { CourseCountdownDetail } from './CourseCountdownDetail'

export function CourseSidebar({ enrolledCourses, courseDetail }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [firstLectureId, setFirstLectureId] = useState(null)
  const [isCountdownComplete, setIsCountdownComplete] = useState(false)

  useEffect(() => {
    const fetchCourseData = async () => {
      if (user) {
        try {
          const courseProgress = await CourseAPI.getCourseProgress(id)
          const currentLecture = courseProgress.progress.find((lecture) => lecture.isCurrent)
          setFirstLectureId(currentLecture ? currentLecture.lectureId : courseDetail.course.chapters[0].lectures[0].id)
        } catch (error) {
          console.error('Error fetching course progress:', error)
        }
      } else {
        console.log('User not logged in, skipping course progress fetch.')
      }
    }

    fetchCourseData()
  }, [id, user])

  useEffect(() => {
    if (courseDetail.course.scheduledPublishDate) {
      const now = new Date().getTime()
      const scheduleDate = new Date(courseDetail.course.scheduledPublishDate).getTime()
      setIsCountdownComplete(now >= scheduleDate)
    }
  }, [courseDetail.course.scheduledPublishDate])

  const handleLearningCourse = () => {
    navigate(AUTHENTICATION_ROUTERS.LEARNINGSPACE.replace(':id', id).replace(':lectureId', firstLectureId))
  }

  const handleEnrollCourse = async () => {
    if (!user) {
      try {
        await authServiceInstance.login()
      } catch (error) {
        console.error('Error during login:', error)
      }
    } else {
      try {
        const data = await CourseAPI.enrollCourse(id)
        navigate(AUTHENTICATION_ROUTERS.LEARNINGSPACE.replace(':id', id).replace(':lectureId', firstLectureId))
      } catch (error) {
        console.error('Error enrolling course:', error)
      }
    }
  }

  const handlePayment = async () => {
    if (!user) {
      try {
        await authServiceInstance.login()
      } catch (error) {
        console.error('Error during login:', error)
      }
    } else {
      navigate(AUTHENTICATION_ROUTERS.PAYMENT.replace(':id', id), {
        state: {
          courseId: id,
          price: courseDetail.course.price
        }
      })
    }
  }

  const handleCountdownEnd = () => {
    setIsCountdownComplete(true)
  }

  const convertToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} hours ${remainingMinutes} minutes`
  }

  console.log('Zo')

  const renderEnrollOrPurchaseButton = () => {
    if (courseDetail.course.price === 0) {
      return (
        <>
          <button
            onClick={() => handleEnrollCourse()}
            className='w-full group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]'
          >
            <div className='absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-300'></div>
            <div className='flex items-center justify-center gap-2'>
              <GraduationCap className='w-5 h-5 animate-bounce' />
              <span>Enroll Now</span>
            </div>
            <div className='absolute inset-0 -z-10 bg-gradient-to-br from-red-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </button>
          <p className='text-center text-gray-600 text-sm mt-2'>Join the course for free</p>
        </>
      )
    } else {
      return (
        <>
          <button
            onClick={() => handlePayment()}
            className='group relative w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 rounded-xl 
           font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 
           flex items-center justify-center gap-3 shadow-lg hover:shadow-xl
           transform hover:-translate-y-0.5 overflow-hidden'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            <ShoppingCart className='w-5 h-5 relative z-10 transition-transform group-hover:scale-110' />
            <span className='text-lg relative z-10'>Purchase Course</span>
          </button>
          <div className='mt-2 text-center'>
            <div className='flex flex-col items-center justify-center'>
              <span className='text-gray-600 text-sm uppercase tracking-wide mb-1'>Course Price</span>
              <div className='text-4xl font-bold text-primaryButton mb-2'>${courseDetail.course.price.toFixed(2)}</div>
            </div>
          </div>
        </>
      )
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
        {enrolledCourses ? (
          <>
            <button
              onClick={() => handleLearningCourse()}
              className='w-full group relative overflow-hidden bg-gradient-to-r from-emerald-400 to-teal-500 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]'
            >
              <div className='absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-300'></div>
              <div className='relative flex items-center justify-center gap-2 text-white'>
                <PlayCircle className='w-5 h-5 group-hover:animate-pulse' />
                <span>Learning Now</span>
              </div>
              <div className='absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </button>
            <p className='text-center text-gray-600 text-sm mt-2'>You are learning this course</p>
          </>
        ) : (
          <>
            {courseDetail.course.scheduledPublishDate && !isCountdownComplete ? (
              <CourseCountdownDetail
                scheduledDate={courseDetail.course.scheduledPublishDate}
                onCountdownEnd={handleCountdownEnd}
              />
            ) : (
              renderEnrollOrPurchaseButton()
            )}
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
          <span className='text-gray-600'>
            Time Estimate: {convertToHoursAndMinutes(courseDetail?.course?.timeEstimation)}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Calendar className='w-5 h-5 text-gray-500' />
          <span className='text-gray-600'>
            {format(new Date(courseDetail?.course?.lastModified), 'MMMM dd, yyyy')} Last Updated
          </span>
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
