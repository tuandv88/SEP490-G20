import React, { useEffect, useState } from 'react'
import { BookOpen, Clock, GraduationCap, Trophy, Star } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { StatsCard } from './StatsCard'
import { CourseAPI } from '@/services/api/courseApi'
import { UserAPI } from '@/services/api/userApi'
import LearningDashBoardLoading from '@/components/loading/LearningDashBoardLoading'

export function LearningDashboard() {
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [userPoint, setUserPoint] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch enrolled courses và user point song song
        const [enrolledCourses, pointData] = await Promise.all([
          CourseAPI.getUserEnrollments(1, 10),
          UserAPI.getUserPoint()
        ])

        console.log(enrolledCourses)
        console.log(pointData)
        const coursesWithProgress = await Promise.all(
          enrolledCourses.courseDtos.data.map(async (course) => {
            try {
              const courseProgress = await CourseAPI.getCourseProgress(course.courseId)
              const currentLecture = courseProgress.progress.find((lecture) => lecture.isCurrent)
              return {
                ...course,
                currentLectureId: currentLecture ? currentLecture.lectureId : null
              }
            } catch (error) {
              console.error(`Lỗi khi lấy tiến trình cho khóa học ${course.courseId}:`, error)
              return { ...course, currentLectureId: null }
            }
          })
        )
   
        setCourses(coursesWithProgress)
        setUserPoint(pointData.totalPoints)

        // Tính toán thống kê
        const totalCourses = coursesWithProgress.length
        const inProgress = coursesWithProgress.filter((course) => course.status === 'InProgress').length
        const completed = coursesWithProgress.filter((course) => course.status === 'Completed').length
        
        setStats([
          {
            icon: BookOpen,
            label: 'Your Courses',
            value: totalCourses,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
          },
          {
            icon: Clock,
            label: 'In Progress',
            value: inProgress,
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
          },
          {
            icon: Star,
            label: 'Completed',
            value: completed,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
          },
          {
            icon: Trophy,
            label: 'Total Points',
            value: pointData.totalPoints,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
          }
        ])
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LearningDashBoardLoading />
  }

  return (
    <div className='space-y-6 mt-6'>
      <div className='grid grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>In Progress</h2>
        {courses.filter((course) => course.status === 'InProgress').length > 0 ? (
          <div className='space-y-4'>
            {courses
              .filter((course) => course.status === 'InProgress')
              .map((course) => (
                <CourseCard key={course.courseId} course={course} />
              ))}
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow p-8'>
            <div className='flex flex-col items-center justify-center text-center'>
              <div className='w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4'>
                <GraduationCap className='w-8 h-8 text-blue-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>No courses</h3>
              <p className='text-sm text-gray-600 max-w-sm'>
                You haven't joined any courses in progress. Explore our courses to start your learning journey.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Khóa học đã hoàn thành */}
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Completed</h2>
        {courses.filter((course) => course.status === 'Completed').length > 0 ? (
          <div className='space-y-4'>
            {courses
              .filter((course) => course.status === 'Completed')
              .map((course) => (
                <CourseCard key={course.courseId} course={course} />
              ))}
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow p-8'>
            <div className='flex flex-col items-center justify-center text-center'>
              <div className='w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4'>
                <GraduationCap className='w-8 h-8 text-blue-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>No courses</h3>
              <p className='text-sm text-gray-600 max-w-sm'>
                You haven't completed any courses. Keep learning to achieve your goals!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
