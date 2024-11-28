/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import Layout from '@/layouts/layout'
import { useEffect, useState } from 'react'
import { Star, Clock, Users, Trophy, ChevronRight, Cookie } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import CourseLoading from '@/components/loading/CourseLoading'
import CourseItem from '@/components/courses/CourseItem'
import { LearningAPI } from '@/services/api/learningApi'
import { AlgorithmCard } from '@/components/problem/AlgorithmCard'
import { ProblemSection } from '@/components/problem/ProblemSection'
import { CourseCarousel } from '@/components/courses/CourseCarousel'
import authServiceInstance from '@/oidc/AuthService'
import SurveyModal from '@/components/surrvey/SurveyModal'
import AssessmentPrompt from '@/components/surrvey/AssessmentPromptProps'
import QuizModal from '@/components/surrvey/QuizModal'
import QuizPopup from '@/components/quiz/QuizPopup'
import { QuizAPI } from '@/services/api/quizApi'
import { UserAPI } from '@/services/api/userApi'

export const algorithms = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Find two numbers in an array that add up to a target sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    likes: 452,
    submissions: 1250,
    successRate: 85
  },
  {
    id: '2',
    title: 'Binary Tree Level Order Traversal',
    description: 'Traverse a binary tree in level order (breadth-first search)',
    difficulty: 'Medium',
    category: 'Trees',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    likes: 328,
    submissions: 850,
    successRate: 72
  },
  {
    id: '3',
    title: 'Merge K Sorted Lists',
    description: 'Merge k sorted linked lists into one sorted linked list',
    difficulty: 'Hard',
    category: 'Linked Lists',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(n)',
    likes: 275,
    submissions: 620,
    successRate: 65
  }
]

const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 rounded ${className}`} {...props}>
    {children}
  </button>
)

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>
    {children}
  </div>
)

const Avatar = ({ src, alt, className, ...props }) => (
  <img src={src} alt={alt} className={`rounded-full ${className}`} {...props} />
)

function HomePage() {
  const [email, setEmail] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  const [isSurveyOpen, setIsSurveyOpen] = useState(false)
  const [isAssessmentPromptOpen, setIsAssessmentPromptOpen] = useState(false)
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [quizAssessment, setQuizAssessment] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await authServiceInstance.getUser()
        if (user) {
          setUserInfo(user.profile)
          // Kiểm tra điều kiện để hiển thị survey
          if (user.profile.issurvey === 'false') {
            setTimeout(() => {
              setIsSurveyOpen(true)
              // updateSurveyStatus()
            }, 3000)
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    fetchUserInfo()
  }, [])

  async function updateSurveyStatus() {
    try {
      await UserAPI.changeSurveyStatus(userInfo.id)
    } catch (error) {
      console.error('Error updating survey status:', error)
    }
  }

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true)
      setError(false)
      try {
        const data = await LearningAPI.getCourseList(1, 20)
        setCourses(data?.courseDtos?.data)
      } catch (error) {
        console.error('Error fetching course detail:', error)
        if (error.response) {
          if (error.response.status >= 500) {
            setError(true)
          } else if (error.response.status === 404) {
            setCourses(null)
          }
        } else {
          setError(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetail()
  }, [])

  useEffect(() => {
    const fetchQuizAssessment = async () => {
      try {
        const data = await QuizAPI.getQuizAssessment()
        setQuizAssessment(data.quiz)
      } catch (error) {
        console.error('Error fetching quiz assessment:', error)
      }
    }

    fetchQuizAssessment()
  }, [])

  const handleSurveySubmit = (data) => {
    // console.log('Survey submitted:', data)
    setIsSurveyOpen(false)
    setIsAssessmentPromptOpen(true)
  }

  const handleAssessmentAccept = () => {
    setIsAssessmentPromptOpen(false)
    setIsQuizOpen(true)
  }

  const handleAssessmentDecline = () => {
    setIsAssessmentPromptOpen(false)
    //updateUserFirstLogin()
  }

  const handleQuizComplete = (score) => {
    console.log('Quiz completed with score:', score)
    setIsQuizOpen(false)
    //updateUserFirstLogin()
  }

  return (
    <>
      <Layout>
        <div className='flex flex-col min-h-screen pt-12'>
          {/* Hero Section */}
          <section className='py-12 text-white bg-gradient-to-r from-green-500 to-green-700 md:py-20'>
            <div className='container px-4 mx-auto'>
              <div className='flex flex-col items-center justify-between md:flex-row'>
                <div className='mb-8 md:w-1/2 md:mb-0'>
                  <h1 className='mb-4 text-3xl font-bold md:text-4xl lg:text-6xl'>Học tập và Thi đấu Trực tuyến</h1>
                  <p className='mb-6 text-lg md:text-xl'>
                    Nâng cao kiến thức và kỹ năng của bạn với các khóa học chất lượng cao và thử thách bản thân trong
                    các cuộc thi hấp dẫn.
                  </p>
                  <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
                    <Button className='text-green-300 bg-white hover:bg-blue-100'>Khám phá khóa học</Button>
                    <Button className='border border-white hover:bg-red-600'>Tham gia cuộc thi</Button>
                  </div>
                </div>
                <div className='md:w-5/11'>
                  <img
                    src='https://s3-sgn09.fptcloud.com/codelearnstorage/Upload/Blog/top-5-trang-web-day-lap-trinh-mien-phi-63727982616.0848.jpg?height=300&width=500'
                    alt='Students learning online'
                    className='w-full h-auto rounded-lg shadow-lg'
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Featured Courses Section */}
          <section className='py-12 md:py-20'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-8 text-2xl font-bold text-center md:text-3xl md:mb-10'>Featured Courses</h2>
              {loading ? <CourseLoading></CourseLoading> : <CourseCarousel courses={courses} />}
              <div className='mt-8 text-center md:mt-10'>
                <Button onClick={() => navigate(AUTHENTICATION_ROUTERS.COURSELIST)} className='border border-green-500 hover:bg-blue-50'>
                  View All Courses
                  <ChevronRight className='inline-block ml-2' />
                </Button>
              </div>
            </div>
          </section>

          <section className='py-12 md:py-20'>
            <div className='container px-4 mx-auto'>
              <ProblemSection />
            </div>
          </section>

          {/* Testimonials Section */}
          <section className='py-12 md:py-20'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-8 text-2xl font-bold text-center md:text-3xl md:mb-10'>Học viên nói gì về chúng tôi</h2>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8'>
                {[1, 2, 3].map((testimonial) => (
                  <Card key={testimonial} className='p-6'>
                    <div className='flex items-center mb-4'>
                      <Avatar
                        src={`https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?height=40&width=40&text=User+${testimonial}`}
                        alt={`User ${testimonial}`}
                        className='w-10 h-10 mr-4'
                      />
                      <div>
                        <p className='font-semibold'>Học viên {testimonial}</p>
                        <p className='text-sm text-gray-600'>Khóa học: React Nâng cao</p>
                      </div>
                    </div>
                    <p className='text-sm italic md:text-base'>
                      &quot;Tôi đã học được rất nhiều từ khóa học này. Giảng viên rất nhiệt tình và kiến thức được
                      truyền đạt rất dễ hiểu.&quot;
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
        <Link to={AUTHENTICATION_ROUTERS.HOME}></Link>

        <SurveyModal
          isOpen={isSurveyOpen}
          onClose={() => {
            setIsSurveyOpen(false)
            // updateUserFirstLogin()
          }}
          onSubmit={handleSurveySubmit}
        />

        <AssessmentPrompt
          isOpen={isAssessmentPromptOpen}
          onClose={() => {
            setIsAssessmentPromptOpen(false)
            // updateUserFirstLogin()
          }}
          onAccept={handleAssessmentAccept}
          onDecline={handleAssessmentDecline}
        />

        <QuizModal
          isOpen={isQuizOpen}
          onClose={() => {
            setIsQuizOpen(false)
            // updateUserFirstLogin()
          }}
          onComplete={handleQuizComplete}
          quiz={quizAssessment}
        />

        {/* <QuizPopup quiz={quizData.quiz} answer={quizData.answer} onComplete={() => handleQuizComplete()} /> */}
      </Layout>
    </>
  )
}
export default HomePage
