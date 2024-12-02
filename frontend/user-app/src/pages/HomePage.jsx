/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import Layout from '@/layouts/layout'
import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import CourseLoading from '@/components/loading/CourseLoading'
import { ProblemSection } from '@/components/problem/ProblemSection'
import { CourseCarousel } from '@/components/courses/CourseCarousel'
import authServiceInstance from '@/oidc/AuthService'
import SurveyModal from '@/components/surrvey/SurveyModal'
import AssessmentPrompt from '@/components/surrvey/AssessmentPromptProps'
import QuizModal from '@/components/surrvey/QuizModal'

import { QuizAPI } from '@/services/api/quizApi'
import { UserAPI } from '@/services/api/userApi'
import { CourseAPI } from '@/services/api/courseApi'

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
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [isSurveyOpen, setIsSurveyOpen] = useState(false)
  const [isAssessmentPromptOpen, setIsAssessmentPromptOpen] = useState(false)
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [quizAssessment, setQuizAssessment] = useState(null)
  const [isLoadedQuizAssessment, setIsLoadedQuizAssessment] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuizAssessment = async () => {
      try {
        setLoading(true)
        if (userInfo) {
          const data = await QuizAPI.getQuizAssessment()
          setQuizAssessment(data.quiz)
          setIsLoadedQuizAssessment(true)
        }
      } catch (error) {
        console.error('Error fetching quiz assessment:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizAssessment()
  }, [userInfo])

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await authServiceInstance.getUser()
        if (user) {
          setUserInfo(user.profile)
          // Kiểm tra điều kiện để hiển thị survey
          const isSurveyCompleted = localStorage.getItem('isSurveyCompleted')
          if (isSurveyCompleted !== 'true' && user.profile.issurvey === 'false') {
            updateSurveyStatus()
            setIsSurveyOpen(true)
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }
    fetchUserInfo()
  }, [isSurveyOpen, isLoadedQuizAssessment])

  async function updateSurveyStatus() {
    try {
      await UserAPI.changeSurveyStatus(userInfo.sub)
      authServiceInstance.refreshToken()
      localStorage.setItem('isSurveyCompleted', 'true')
    } catch (error) {
      console.error('Error updating survey status:', error)
    }
  }

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true)
      setError(false)
      try {
        const data = await CourseAPI.getCoursePopular(1, 5)
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

  if (loading) {
    return null
  }

  return (
    <>
      <Layout>
        <div className='flex flex-col min-h-screen pt-12'>
          {/* Hero Section */}
          <section className='py-12 text-white bg-gradient-to-r from-primaryButton to-primaryButton md:py-20'>
            <div className='container px-4 mx-auto'>
              <div className='flex flex-col items-center justify-between md:flex-row'>
                <div className='mb-8 md:w-1/2 md:mb-0'>
                  <h1 className='mb-4 text-3xl font-bold md:text-4xl lg:text-6xl'>
                    Learning and Practicing Algorithms
                  </h1>
                  <p className='mb-6 text-lg md:text-xl'>
                    Enhance your knowledge and skills with high-quality courses and challenge yourself with engaging
                    algorithms.
                  </p>
                  <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
                    <Button className='text-black bg-white hover:bg-blue-100'>Explore courses</Button>
                    <Button className='border border-white hover:bg-red-600'>Participate in the algorithm</Button>
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
                <Button
                  onClick={() => navigate(AUTHENTICATION_ROUTERS.COURSELIST)}
                  className='border border-primaryButton hover:bg-primaryButton hover:text-white'
                >
                  View All Courses
                  <ChevronRight className='inline-block ml-2' />
                </Button>
              </div>
            </div>
          </section>

          <section className='py-12 md:py-20'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-8 text-2xl font-bold text-center md:text-3xl md:mb-10'>Featured Courses</h2>
              <ProblemSection />
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
            //updateUserFirstLogin()
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
