/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import Layout from '@/layouts/layout'
import { useEffect, useReducer, useState, useCallback } from 'react'
import { ChevronRight } from 'lucide-react'
import CourseLoading from '@/components/loading/CourseLoading'
import { ProblemSection } from '@/components/problem/ProblemSection'
import { CourseCarousel } from '@/components/courses/CourseCarousel'
import authServiceInstance from '@/oidc/AuthService'
import SurveyModal from '@/components/surrvey/SurveyModal'
import AssessmentPrompt from '@/components/surrvey/AssessmentPromptProps'
import QuizModal from '@/components/surrvey/QuizModal'
import { LearningPathPolling } from '@/components/loading/LearningPathPolling'
import { LearningAPI } from '@/services/api/learningApi'

import { QuizAPI } from '@/services/api/quizApi'
import { UserAPI } from '@/services/api/userApi'
import { CourseAPI } from '@/services/api/courseApi'
import { useToast } from '@/hooks/use-toast'

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
  const initialState = {
    courses: [],
    loading: false,
    error: false,
    userInfo: null,
    isSurveyOpen: false,
    isAssessmentPromptOpen: false,
    isQuizOpen: false,
    quizAssessment: null,
    isQuizSubmitted: false,
    pollingStatus: null
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, loading: action.payload }
      case 'SET_ERROR':
        return { ...state, error: action.payload }
      case 'SET_COURSES':
        return { ...state, courses: action.payload }
      case 'SET_USER_INFO':
        return { ...state, userInfo: action.payload }
      case 'SET_IS_SURVEY_OPEN':
        return { ...state, isSurveyOpen: action.payload }
      case 'SET_IS_ASSESSMENT_PROMPT_OPEN':
        return { ...state, isAssessmentPromptOpen: action.payload }
      case 'SET_IS_QUIZ_OPEN':
        return { ...state, isQuizOpen: action.payload }
      case 'SET_QUIZ_ASSESSMENT':
        return { ...state, quizAssessment: action.payload }
      case 'SET_IS_QUIZ_SUBMITTED':
        return { ...state, isQuizSubmitted: action.payload }
      case 'SET_POLLING_STATUS':
        return { ...state, pollingStatus: action.payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuizAssessment = async () => {
      if (state.userInfo) {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
          const data = await QuizAPI.getQuizAssessment()
          dispatch({ type: 'SET_QUIZ_ASSESSMENT', payload: data.quiz })
        } catch (error) {
          console.error('Error fetching quiz assessment:', error)
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }

    fetchQuizAssessment()
  }, [state.userInfo])

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await authServiceInstance.getUser()
        if (user) {
          dispatch({ type: 'SET_USER_INFO', payload: user.profile })

          // Kiểm tra điều kiện để hiển thị survey
          const isSurveyCompleted = localStorage.getItem('isSurveyCompleted')
          if (isSurveyCompleted !== 'true' && user.profile.issurvey === 'false') {
            updateSurveyStatus(user.profile.sub)
            dispatch({ type: 'SET_IS_SURVEY_OPEN', payload: true })
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }
    fetchUserInfo()
  }, [])

  async function updateSurveyStatus(userId) {
    try {
      console.log('Updating survey status for user:', userId)
      await UserAPI.changeSurveyStatus(userId)
      authServiceInstance.refreshToken()
      localStorage.setItem('isSurveyCompleted', 'true')
    } catch (error) {
      console.error('Error updating survey status:', error)
    }
  }

  useEffect(() => {
    const fetchCourseDetail = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: false })
      try {
        const data = await CourseAPI.getCoursePopular(1, 5)
        dispatch({ type: 'SET_COURSES', payload: data?.courseDtos?.data })
      } catch (error) {
        console.error('Error fetching course detail:', error)
        if (error.response) {
          if (error.response.status >= 500) {
            dispatch({ type: 'SET_ERROR', payload: true })
          } else if (error.response.status === 404) {
            dispatch({ type: 'SET_COURSES', payload: null })
          }
        } else {
          dispatch({ type: 'SET_ERROR', payload: true })
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    fetchCourseDetail()
  }, [])

  // Các hàm xử lý sự kiện khác, cập nhật trạng thái bằng dispatch

  // Ví dụ:
  const handleSurveySubmit = (data) => {
    // Xử lý submit survey
    dispatch({ type: 'SET_IS_SURVEY_OPEN', payload: false })
    dispatch({ type: 'SET_IS_ASSESSMENT_PROMPT_OPEN', payload: true })
  }

  const handleAssessmentAccept = () => {
    dispatch({ type: 'SET_IS_ASSESSMENT_PROMPT_OPEN', payload: false })
    dispatch({ type: 'SET_IS_QUIZ_OPEN', payload: true })
  }

  const handleAssessmentDecline = () => {
    dispatch({ type: 'SET_IS_ASSESSMENT_PROMPT_OPEN', payload: false })
    // updateUserFirstLogin()
  }

  const handleQuizComplete = (score) => {
    dispatch({ type: 'SET_IS_QUIZ_OPEN', payload: false })
    dispatch({ type: 'SET_IS_QUIZ_SUBMITTED', payload: true })
  }

  const handleClosePolling = () => {
    dispatch({ type: 'SET_POLLING_STATUS', payload: null })
    if (state.pollingStatus === 'error') {
      dispatch({ type: 'SET_IS_QUIZ_SUBMITTED', payload: false })
    }
  }

  const pollLearningPaths = useCallback(() => {
    let attempts = 0
    const maxAttempts = 15
    let pollInterval

    dispatch({ type: 'SET_POLLING_STATUS', payload: 'polling' })

    const poll = async () => {
      try {
        const response = await LearningAPI.getLearningPath()
        const paths = response.learningPathDtos

        if (paths && paths.length > 0) {
          dispatch({ type: 'SET_IS_QUIZ_SUBMITTED', payload: false })
          clearInterval(pollInterval)
          dispatch({ type: 'SET_POLLING_STATUS', payload: 'success' })
          return true
        }
        return false
      } catch (error) {
        console.error('Lỗi khi poll lộ trình:', error)
        dispatch({ type: 'SET_POLLING_STATUS', payload: 'error' })
        return false
      }
    }

    pollInterval = setInterval(async () => {
      // console.log('Polling for learning paths...', attempts)
      const found = await poll()
      
      if (found || attempts >= maxAttempts) {
        clearInterval(pollInterval)
        if (!found) {
          console.log('Không tìm thấy lộ trình sau 15 giây')
          dispatch({ type: 'SET_POLLING_STATUS', payload: 'error' })
        }
      }
      attempts++
    }, 2000)

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [])

  useEffect(() => {
    let cleanup
    if (state.isQuizSubmitted) {
      cleanup = pollLearningPaths()
    }
    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [state.isQuizSubmitted, pollLearningPaths])

  const { loading, courses, userInfo, isSurveyOpen, isAssessmentPromptOpen, isQuizOpen, quizAssessment } = state

  //console.log('Loading state:', loading)

  return (
    <>
      <Layout>
        <div className='flex flex-col min-h-screen pt-12 mt-4'>
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
                    <Button
                      onClick={() => navigate(AUTHENTICATION_ROUTERS.COURSELIST)}
                      className='text-black bg-white hover:bg-blue-100'
                    >
                      Explore courses
                    </Button>
                    <Button
                      onClick={() => navigate(AUTHENTICATION_ROUTERS.PROBLEMS)}
                      className='border border-white hover:bg-red-600'
                    >
                      Participate in the algorithm
                    </Button>
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
              {loading ? <CourseLoading /> : <CourseCarousel courses={courses} />}
              <div className='mt-8 text-center md:mt-10'>
                <Button
                  onClick={() => navigate(AUTHENTICATION_ROUTERS.COURSELIST)}
                  className='border border-primaryButton hover:bg-primaryButton hover:text-white'
                >
                  View All Courses
                  <ChevronRight className='inline-block ml-2' />
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: 'Scheduled: Catch up',
                      description: 'Friday, February 10, 2023 at 5:57 PM'
                    })
                  }}
                >
                  Show Toast
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
            dispatch({ type: 'SET_IS_SURVEY_OPEN', payload: false })
          }}
          onSubmit={handleSurveySubmit}
        />

        <AssessmentPrompt
          isOpen={isAssessmentPromptOpen}
          onClose={() => {
            dispatch({ type: 'SET_IS_ASSESSMENT_PROMPT_OPEN', payload: false })
          }}
          onAccept={handleAssessmentAccept}
          onDecline={handleAssessmentDecline}
        />

        <QuizModal
          isOpen={isQuizOpen}
          onClose={() => {
            dispatch({ type: 'SET_IS_QUIZ_OPEN', payload: false })
          }}
          onComplete={handleQuizComplete}
          quiz={quizAssessment}
          setIsQuizSubmitted={(value) => dispatch({ type: 'SET_IS_QUIZ_SUBMITTED', payload: value })}
        />

        {state.pollingStatus && (
          <LearningPathPolling
            status={state.pollingStatus}
            message={
              state.pollingStatus === 'error'
                ? 'Error occurs when creating a roadmap. Please try again later.'
                : state.pollingStatus === 'success'
                ? 'Your learning path has been created successfully.'
                : 'Creating your learning path based on your assessment results...'
            }
            onClose={handleClosePolling}
          />
        )}
      </Layout>
    </>
  )
}
export default HomePage
