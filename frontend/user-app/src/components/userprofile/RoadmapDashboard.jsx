import React, { useEffect, useState } from 'react'
import { BarChart2, BookOpen, Calendar, Layout, ListChecks, PlusCircle } from 'lucide-react'
import CourseStep from './CourseStep'
import { LearningAPI } from '@/services/api/learningApi'
import ChapterLoading from '../loading/ChapterLoading'


const RoadmapDashboard = ({ user }) => {
  const [learningPath, setLearningPath] = useState([])
  const [courseDetails, setCourseDetails] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchLearningPath() {
      try {
        setLoading(true)
        const response = await LearningAPI.getLearningPath()
        console.log('Learning Path Data:', response) 
        setLearningPath(response.learningPathDtos)
      } catch (error) {
        console.error('Error fetching learning path:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLearningPath()
  }, [])

  useEffect(() => {
    async function fetchCoursePreview(courseId) {
      try {
        setLoading(true)
        const response = await LearningAPI.getCoursePreview(courseId)
        setCourseDetails(prevDetails => ({
          ...prevDetails,
          [courseId]: response.course
        }))
      } catch (error) {
        console.error('Error fetching course data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (Array.isArray(learningPath)) {
      const courseIds = new Set()
      learningPath.forEach(path => {
        path.pathSteps.forEach(step => {
          if (!courseDetails[step.courseId]) {
            courseIds.add(step.courseId)
          }
        })
      })

      courseIds.forEach(courseId => fetchCoursePreview(courseId))
    }
  }, [learningPath, user])

  if (loading) {
    return <ChapterLoading />
  }

  return (
    <div className='space-y-6 mt-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Recommended Path</h2>
        <button className='flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
          <PlusCircle className='w-5 h-5 mr-2' />
          Generate Path
        </button>
      </div>

      {Array.isArray(learningPath) && learningPath.length > 0 ? (
        learningPath.map((path) => (
          <div key={path.id} className='bg-white rounded-xl overflow-hidden shadow-lg'>
            <div className='p-6'>
              <div className='mb-6'>
                <h3 className='text-2xl font-bold mb-2'>{path.pathName}</h3>
                <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                  <span className='flex items-center gap-1'>
                    <Calendar size={16} />
                    {new Date(path.startDate).toLocaleDateString()} - {new Date(path.endDate).toLocaleDateString()}
                  </span>
                  <span className='flex items-center gap-1'>
                    <BarChart2 size={16} />
                    {path.status}
                  </span>
                </div>
              </div>

              <div className='mb-8'>
                <h4 className='font-semibold mb-3 flex items-center gap-2'>
                  <ListChecks size={18} className='text-red-500' />
                  Reasons
                </h4>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2 text-gray-600'>
                    <div className='w-1.5 h-1.5 bg-red-500 rounded-full mt-2' />
                    {path.reason}
                  </li>
                </ul>
              </div>

              <div className='space-y-4'>
                <h4 className='font-semibold'>Các bước trong lộ trình</h4>
                {path.pathSteps.map((step, index) => {
                  const course = courseDetails[step.courseId]
                  return (
                    <CourseStep key={step.id} step={step} index={index} course={course} />
                  )
                })}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='text-center text-gray-500 w-full h-full'>No learning paths available.</div>
      )}
    </div>
  )
}

export default React.memo(RoadmapDashboard)
