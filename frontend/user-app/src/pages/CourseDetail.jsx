import { CourseSidebar } from '@/components/courses/CodeSidebar'
import { CourseContent } from '@/components/courses/CourseContent'
import { CourseEvaluate } from '@/components/courses/CourseEvaluate'
import { CourseIntro } from '@/components/courses/CourseIntro'
import Layout from '@/layouts/layout'
import { BookmarkPlus, Cookie, Share2, Star } from 'lucide-react'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import ErrorPage from './ErrorPage'
import NotFound from './NotFound'
import { CourseAPI } from '@/services/api/courseApi'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'
import { useNavigate, useParams } from 'react-router-dom'
import useStore from '@/data/store'
import { LearningAPI } from '@/services/api/learningApi'
import { LoadingState } from '@/components/loading/CourseDetailLoading/LoadingState'
import Cookies from 'js-cookie'
import ChapterLoading from '@/components/loading/ChapterLoading'

function CourseDetail() {
  const [activeTab, setActiveTab] = useState('introduce')
  const [courseDetail, setCourseDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const setSelectedCourse = useStore((state) => state.setSelectedCourse)
  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [reviewData, setReviewData] = useState(null)

  useEffect(() => {
    setSelectedCourse(id)    
  }, [])



  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true)
      setError(false)
      try {
        const [courseData, enrolledData, reviewData] = await Promise.all([
          LearningAPI.getCoursePreview(id),
          CourseAPI.getEnrolledCourses(id),
          CourseAPI.getCourseReviews(id, 1, 20)
        ])
        setCourseDetail(courseData)     
        setEnrolledCourses(enrolledData.enrollmentInfo)   
        setReviewData(reviewData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [id])

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  if (error) {
    return <ErrorPage />
  }

  if (!courseDetail && !loading) {
    return <NotFound mess="We can't find this course. Please check the link or search for other courses." />
  }

  return (
    <Layout>
      {loading ? (
        <LoadingState />
      ) : (
        <div className='min-h-screen bg-gray-50 mt-[70px]'>
          {/* Header */}
          <div className='max-w-7xl mx-auto px-4 py-8'>
            <div className='flex flex-col gap-4'>
              {/* Rating and Title */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                  ))}
                  <span className='text-gray-600'>{reviewData?.courseReviews?.averageRating.toFixed(1)} ({reviewData?.courseReviews?.totalReviews} Reviews)</span>
                </div>

                <div className='flex justify-between items-start'>
                  <h1 className='text-3xl font-bold text-gray-900'>{courseDetail?.course?.title}</h1>
                  <div className='flex gap-4'>
                    <button className='flex items-center gap-2 text-gray-600 hover:text-gray-900'>
                      <Share2 className='w-5 h-5' />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <span className='bg-purple-600 text-white text-sm font-semibold px-2 py-1 rounded mb-5'>
                    Course Level: {courseDetail?.course?.courseLevel}
                  </span>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6'>
                {/* Course Content - Left Side */}
                <div className='lg:col-span-2 space-y-8'>
                  {/* Course Image */}
                  <div className='relative aspect-video rounded-xl overflow-hidden '>
                    <img
                      src={courseDetail?.course?.imageUrl}
                      alt='Blender 3D Fundamentals'
                      className='w-full h-full object-cover '
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent'></div>
                    <div className='absolute bottom-0 left-0 p-6 text-white'>
                      <h2 className='text-3xl font-bold mb-2'>{courseDetail?.course?.title.toUpperCase()}</h2>
                      <p className='text-lg'>{courseDetail?.course?.headline}</p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className='border-b'>
                    <div className='flex gap-8'>
                      <button
                        className={`px-4 py-2 ${
                          activeTab === 'introduce'
                            ? 'text-red-500 border-b-2 border-red-500 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('introduce')}
                      >
                        Introduce
                      </button>
                      <button
                        className={`px-4 py-2 ${
                          activeTab === 'evaluate'
                            ? 'text-red-500 border-b-2 border-red-500 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('evaluate')}
                      >
                        Evaluate
                      </button>
                    </div>
                  </div>
                          
                  {/* Tab Content */}
                  <div>
                    {activeTab === 'introduce' ? (
                      <>
                        <CourseIntro courseDetail={courseDetail?.course} />
                        <CourseContent chapters={courseDetail?.course?.chapters} />
                      </>
                    ) : (
                      <CourseEvaluate reviewData={reviewData} />
                    )}
                  </div>
                </div>

                {/* Sidebar - Right Side */}
                <div className='lg:col-span-1'>
                  <CourseSidebar enrolledCourses={enrolledCourses} courseDetail={courseDetail} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default CourseDetail
