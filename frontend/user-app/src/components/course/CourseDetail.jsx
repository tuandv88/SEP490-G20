/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import Layout from '@/layouts/layout'
import {
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  FileText,
  Download,
  Smartphone,
  BadgeCheck,
  Users,
  Youtube,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import { NotFound } from '@/pages'
import ErrorPage from '@/pages/ErrorPage'
import { LearningAPI } from '@/services/api/learningApi'
import CourseDetailLoading from '../loading/CourseDetailLoading'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'
import useStore from '@/data/store'

export default function CourseDetail() {
  const [expandedSections, setExpandedSections] = useState([0])
  const [courseDetail, setCourseDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const setSelectedCourse = useStore((state) => state.setSelectedCourse)


  const toggleSection = (index) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const handleLearningCourse = (courseId) => {
    navigate(AUTHENTICATION_ROUTERS.LEARNINGSPACE.replace(':id', courseId).replace(':lectureId', '30aadbe3-779b-4723-974e-af9e370abfb0'))
  }

  useEffect(() => {
    setSelectedCourse(id)
    window.scrollTo(0, 0)
  }, [])

  const feedbackData = {
    averageRating: 4.9,
    totalReviews: 202,
    ratingDistribution: [
      { stars: 5, percentage: 88 },
      { stars: 4, percentage: 11 },
      { stars: 3, percentage: 0 },
      { stars: 2, percentage: 0 },
      { stars: 1, percentage: 0 }
    ],
    reviews: [
      { name: 'Le Tran M.', rating: 5, date: '2 tuần trước', comment: 'Cơ bản dễ hiểu' },
      { name: 'Vu D.', rating: 5, date: '1 tháng trước', comment: 'Các bài giảng của thầy quá chi tiết và dễ hiểu' },
      { name: 'Trần Trọng Y.', rating: 5, date: '3 tháng trước', comment: 'tuyệt vời' },
      { name: 'Nguyen Tan T.', rating: 5, date: '3 tháng trước', comment: 'Thật sự chất lượng !!! Legit 100%' }
    ]
  }

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true)
      setError(false)
      try {
        const data = await LearningAPI.getCourseDetails(id)
        setCourseDetail(data)
      } catch (error) {
        console.error('Error fetching course detail:', error)
        if (error.response) {
          if (error.response.status >= 500) {
            setError(true)
          } else if (error.response.status === 404) {
            setCourseDetail(null)
          }
        } else {
          setError(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetail()
  }, [id])

  if (error) {
    return <ErrorPage />
  }

  if (!courseDetail && !loading) {
    return <NotFound mess="We can't find this course. Please check the link or search for other courses." />
  }

  return (
    <Layout>
      {loading ? (
        <CourseDetailLoading />
      ) : (
        <div className='min-h-screen bg-gray-100 p-4 mt-[96px]'>
          <div className='max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Left Column - Course Content */}
              <div className='md:col-span-1 p-6 border-r'>
                <h2 className='text-2xl font-bold mb-4'>{courseDetail?.courseDetailsDto?.courseDto?.title}</h2>
                <div className='mb-3'>
                  <span className=' bg-purple-600 text-white text-sm font-semibold px-2 py-1 rounded mb-5'>
                    Course Level: {courseDetail?.courseDetailsDto?.courseDto?.courseLevel}
                  </span>
                </div>
                <div className='text-sm text-gray-600 mb-4'>
                  {courseDetail?.courseDetailsDto?.chapterDetailsDtos?.length} sections • 128 lectures •{' '}
                  {courseDetail?.courseDetailsDto?.courseDto?.timeEstimation}h total length
                </div>
                <div className='space-y-2'>
                  {courseDetail?.courseDetailsDto?.chapterDetailsDtos.map((chapter, index) => (
                    <div key={chapter.chapterDto.id}>
                      <button
                        className='flex justify-between items-center w-full text-left py-2 hover:bg-gray-100 rounded transition-colors'
                        onClick={() => toggleSection(index)}
                      >
                        <span className='font-medium'>{chapter.chapterDto.title}</span>
                        {expandedSections.includes(index) ? (
                          <ChevronDown className='w-5 h-5 text-gray-500' />
                        ) : (
                          <ChevronRight className='w-5 h-5 text-gray-500' />
                        )}
                      </button>
                      {expandedSections.includes(index) && chapter.lectureDtos.length > 0 && (
                        <div className='ml-4 mt-2 space-y-2'>
                          {chapter.lectureDtos.map((lecture) => (
                            <div key={lecture.id}>
                              <div className='flex justify-between items-center mb-1'>
                                <span className='text-sm'>{lecture.title}</span>
                                <span className='text-xs text-gray-500'>{lecture.timeEstimation} mins</span>
                              </div>
                              <div className='w-full bg-gray-200 rounded-full h-1'>
                                <div
                                  className='bg-purple-600 h-1 rounded-full'
                                  style={{ width: `${lecture.point}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className='md:col-span-2 gridgap-4 mt-8'>
                <div className='max-w-3xl mx-auto'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    {/* Publisher Information */}
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                      <h3 className='font-bold mb-4'>Publisher</h3>
                      <div className='flex items-center mb-4'>
                        <img
                          src='https://static1.cafeland.vn/cafeautoData/upload/tintuc/thitruong/2021/01/tuan-02/elonmusk2020-1610108461.jpg'
                          alt='Elon Musk'
                          className='w-12 h-12 rounded-full mr-4 object-cover'
                        />
                        <div>
                          <div className='font-medium'>ICODER VN</div>
                          <div className='text-sm text-gray-600'>3D Artist</div>
                        </div>
                      </div>
                      <p className='text-sm mb-4'>
                        Hey! Learn Java programming from basic to advanced, direct practice and become a professional
                        programmer with us!
                      </p>
                      <div className='text-sm space-y-2'>
                        <div className='flex items-center'>
                          <Star className='w-4 h-4 mr-2 text-yellow-400' />
                          <span>4.8 Instructor rating</span>
                        </div>
                        <div className='flex items-center'>
                          <BadgeCheck className='w-4 h-4 mr-2 text-gray-300' />
                          <span>889 Reviews</span>
                        </div>
                        <div className='flex items-center'>
                          <Users className='w-4 h-4 mr-2 text-gray-300' />
                          <span>4,887 Students</span>
                        </div>
                        <div className='flex items-center'>
                          <Youtube className='w-4 h-4 mr-2 text-gray-300' />
                          <span>6 Courses</span>
                        </div>
                      </div>
                    </div>

                    {/* Course Information and CTA */}
                    <div className='shadow-xl p-6 rounded-lg'>
                      <div className='mb-4'>
                        <span className='text-3xl font-bold'>${courseDetail?.courseDetailsDto?.courseDto?.price}</span>
                        <span className='text-lg line-through text-gray-500 ml-2'>$99.99</span>
                        <span className='ml-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded'>
                          60% OFF
                        </span>
                      </div>
                      <button
                        onClick={() => handleLearningCourse(id)}
                        className='w-full mb-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
                      >
                        Learning Now
                      </button>
                      <button className='w-full mb-4 border border-purple-600 text-purple-600 font-bold py-2 px-4 rounded hover:bg-purple-100'>
                        Buy now
                      </button>
                      <div className='text-center text-sm mb-4'>30-day money-back guarantee</div>
                      <div className='space-y-2 text-sm'>
                        <div className='font-bold'>Course includes:</div>
                        <div className='flex items-center'>
                          <Clock className='w-4 h-4 mr-2' />
                          <span>25 hours on-demand video</span>
                        </div>
                        <div className='flex items-center'>
                          <FileText className='w-4 h-4 mr-2' />
                          <span>6 articles</span>
                        </div>
                        <div className='flex items-center'>
                          <Download className='w-4 h-4 mr-2' />
                          <span>8 downloadable resources</span>
                        </div>
                        <div className='flex items-center'>
                          <Smartphone className='w-4 h-4 mr-2' />
                          <span>Mobile version</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Banner */}
                  <div className='relative w-full aspect-video bg-purple-900 rounded-lg overflow-hidden mb-8'>
                    <img
                      src={courseDetail?.courseDetailsDto?.courseDto?.imageUrl}
                      alt='Blender 3D Fundamentals'
                      className='w-[800] h-[450] object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent'></div>
                    <div className='absolute bottom-0 left-0 p-6 text-white'>
                      <h2 className='text-3xl font-bold mb-2'>
                        {courseDetail?.courseDetailsDto?.courseDto?.title.toUpperCase()}
                      </h2>
                      <p className='text-lg'>{courseDetail?.courseDetailsDto?.courseDto?.headline}</p>
                    </div>
                  </div>

                  {/* Course Description */}
                  <div className='prose prose-invert
                   text-black max-w-none mb-8 bg-[#dae4f3] p-6 rounded-lg shadow-lg
                '>
                    <h2>Prerequisites</h2>
                    <ReactMarkdown>{courseDetail?.courseDetailsDto?.courseDto?.prerequisites}</ReactMarkdown>

                    <h2>Target Audiences</h2>
                    <ReactMarkdown>{courseDetail?.courseDetailsDto?.courseDto?.targetAudiences}</ReactMarkdown>

                    <h2>Objectives</h2>
                    <ReactMarkdown>{courseDetail?.courseDetailsDto?.courseDto?.objectives}</ReactMarkdown>

                    <h2>Description</h2>
                    <ReactMarkdown>{courseDetail?.courseDetailsDto?.courseDto?.description}</ReactMarkdown>
                  </div>

                  {/* Feedback Section */}
                  <FeedbackSection feedbackData={feedbackData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

const FeedbackSection = ({ feedbackData }) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-lg mb-5'>
      <h2 className='text-2xl font-bold mb-4'>Đánh giá</h2>
      <div className='flex items-center mb-6'>
        <div className='text-5xl font-bold mr-4'>{feedbackData.averageRating}</div>
        <div>
          <Star rating={Math.round(feedbackData.averageRating)} />
          <div className='text-sm text-gray-600'>({feedbackData.totalReviews} đánh giá)</div>
        </div>
      </div>
      <div className='space-y-2 mb-6'>
        {feedbackData.ratingDistribution.map((item) => (
          <div key={item.stars} className='flex items-center'>
            <div className='w-12 text-sm'>{item.stars} sao</div>
            <div className='flex-grow mx-2 bg-gray-200 rounded-full h-2'>
              <div className='bg-yellow-400 h-2 rounded-full' style={{ width: `${item.percentage}%` }}></div>
            </div>
            <div className='w-12 text-sm text-right'>{item.percentage}%</div>
          </div>
        ))}
      </div>
      <div className='space-y-4'>
        {feedbackData.reviews.map((review, index) => (
          <div key={index} className='border-b pb-4 last:border-b-0'>
            <div className='flex items-center mb-2'>
              <div className='w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center'>
                {review.name.charAt(0)}
              </div>
              <div>
                <div className='font-medium'>{review.name}</div>
                <div className='flex items-center'>
                  <Star rating={review.rating} />
                  <span className='text-sm text-gray-600 ml-2'>{review.date}</span>
                </div>
              </div>
            </div>
            <p className='text-gray-700'>{review.comment}</p>
            <div className='flex items-center mt-2 text-sm text-gray-600'>
              <button className='flex items-center mr-4'>
                <ThumbsUp className='w-4 h-4 mr-1' />
                Hữu ích
              </button>
              <button className='flex items-center'>
                <ThumbsDown className='w-4 h-4 mr-1' />
                Không hữu ích
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className='mt-4 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-100'>
        Hiển thị tất cả đánh giá
      </button>
    </div>
  )
}
