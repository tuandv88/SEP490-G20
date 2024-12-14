'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { QuizAPI } from '@/services/api/quizApi'
import QuizPopup from '../quiz/QuizPopup'
import { QuizSubmissionHistory } from '../quiz/QuizSubmissionHistory'

export default function QuizComponent({ quiz }) {
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [quizData, setQuizData] = useState(null)
  const [quizSubmission, setQuizSubmission] = useState(null)
  const [quizStatus, setQuizStatus] = useState(null)
  const [timeLimit, setTimeLimit] = useState(quiz.timeLimit)
  const [hasTimeLimit, setHasTimeLimit] = useState(quiz.hasTimeLimit)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchQuizSubmission = async () => {
    try {
      const quizSubmission = await QuizAPI.getQuizSubmission(quiz.id)
      setQuizSubmission(quizSubmission.quizSubmissions)
    } catch (error) {
      console.error('Error fetching quiz submission:', error)
    }
  }


  useEffect(() => {
    fetchQuizSubmission()
  }, [quiz.id])

  useEffect(() => {
    const checkQuizStatus = async () => {
      try {
        const status = await QuizAPI.getQuizStatus(quiz.id)
        setQuizStatus(status.status)
      } catch (error) {
        console.error('Error checking quiz status:', error)
      }
    }
    checkQuizStatus()
  }, [quiz.id])

  const handleQuizComplete = async (submitted = false) => {
    if (submitted) {
      await fetchQuizSubmission()
      setQuizStatus(null)
    }
    setIsQuizStarted(false)
  }

  const startQuiz = async () => {
    try {
      // Bắt đầu quiz
      await handleStartQuiz()

      // Sau khi quiz được bắt đầu, cập nhật status thành 'InProgress'
      setQuizStatus('InProgress')

      // Lấy chi tiết quiz
      const quizDetails = await QuizAPI.getQuizDetails(quiz.id)
      setQuizData(quizDetails)
    } catch (error) {
      console.error('Error starting or fetching quiz details:', error)
    }
  }

  const handleStartQuiz = async () => {
    try {
      const response = await QuizAPI.startQuiz(quiz.id)
      console.log('Quiz Started: ', response)

      // Đặt trạng thái quiz đã bắt đầu
      setIsQuizStarted(true)
    } catch (error) {
      console.error('Error starting quiz:', error)
      throw error // Đảm bảo lỗi được trả về để xử lý trong `startQuiz`
    }
  }

  const handleCloseQuiz = () => {
    setIsQuizStarted(false)
    // Không cần gọi fetchQuizSubmission ở đây nếu đã gọi trong startQuiz
  }

  const handleContinue = async () => {
    try {
      const quizDetails = await QuizAPI.getQuizDetails(quiz.id)

      // Lưu answer vào state
      setQuizAnswer(quizDetails.answer)

      // Kiểm tra thời gian với answer từ API
      if (checkTimeExpired(quizDetails.answer)) {
        setQuizStatus(null)
        alert('The quiz time limit has expired.')
        return
      }

      setQuizData(quizDetails)
      setIsQuizStarted(true)
    } catch (error) {
      console.error('Error getting quiz details:', error)
    }
  }

  // Thêm biến kiểm tra giới hạn lượt làm
  const hasReachedAttemptLimit =
    quiz.hasAttemptLimit && quiz.attemptCount >= quiz.attemptLimit && quizStatus !== 'InProgress'

  // Thêm hàm để kiểm tra thời gian
  const checkTimeExpired = (answer) => {
    if (!hasTimeLimit || !quizStatus === 'InProgress' || !answer?.startTime) return false

    const startTime = new Date(answer.startTime)
    const now = new Date()
    const elapsedMinutes = (now - startTime) / (1000 * 60)

    return elapsedMinutes >= timeLimit
  }

  // Thêm useEffect để định kỳ kiểm tra status và thời gian
  useEffect(() => {
    let intervalId

    if (quizStatus === 'InProgress' && quizAnswer) {
      intervalId = setInterval(async () => {
        try {
          // Kiểm tra xem đã hết thời gian chưa
          if (checkTimeExpired(quizAnswer)) {
            setQuizStatus(null)
            alert('The quiz time limit has expired.')
            return
          }

          // Nếu chưa hết thời gian, kiểm tra status từ server
          const status = await QuizAPI.getQuizStatus(quiz.id)
          if (status.status !== quizStatus) {
            setQuizStatus(status.status)
          }
        } catch (error) {
          console.error('Error checking quiz status:', error)
        }
      }, 30000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [quizStatus, quiz.id, timeLimit, quizAnswer])

  const toggleHistory = async () => {
    if (!showHistory) {
      await fetchQuizSubmission()
    }
    setShowHistory(!showHistory)
  }

  const handleUpdateResult = async () => {
    try {
      setIsUpdating(true)
      await fetchQuizSubmission()
    } catch (error) {
      console.error('Error updating results:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <Card className='w-full'>
          <CardHeader className='bg-primary text-primary-foreground py-6 px-6 rounded-t-lg'>
            <CardTitle className='text-2xl font-bold'>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className='p-6 space-y-6'>
            <ReactMarkdown className='prose dark:prose-invert max-w-none'>{quiz.description}</ReactMarkdown>

            <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg className='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'>
                    <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                  </svg>
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-yellow-700'>
                    <strong>Note:</strong> You must pass this quiz with a score of at least {quiz.passingMark}% to mark it as completed.
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <InfoCard label='Passing Mark' value={`${quiz.passingMark}%`} />
              <InfoCard label='Time Limit' value={quiz.hasTimeLimit ? `${quiz.timeLimit} minutes` : 'No limit'} />
              <InfoCard
                label='Attempt Limit'
                value={quiz.hasAttemptLimit ? `${quiz.attemptLimit - quiz.attemptCount} left` : 'Unlimited'}
              />
              <InfoCard label='Attempts Made' value={quiz.attemptCount.toString()} />
            </div>

            <div className='flex flex-col items-center gap-4'>
              <div className='flex flex-col items-center mt-6 space-y-2'>
                {hasReachedAttemptLimit ? (
                  <p className='text-sm text-red-500 font-medium'>You have reached the maximum number of attempts</p>
                ) : quizStatus === 'InProgress' ? (
                  <Button size='lg' onClick={handleContinue}>
                    Continue Quiz
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                ) : (
                  <Button size='lg' onClick={startQuiz}>
                    Start Quiz
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                )}
              </div>

              <Button variant='outline' onClick={handleUpdateResult} disabled={isUpdating} className='mt-4'>
                {isUpdating ? 'Updating...' : 'Update Result'}
              </Button>
            </div>

            <div className='mx-auto py-10'>
              {quizSubmission && <QuizSubmissionHistory submissions={quizSubmission} />}
            </div>
          </CardContent>
        </Card>
      </div>

      {isQuizStarted && quizData && (
        <QuizPopup
          quiz={quizData.quiz}
          answer={quizData.answer}
          timeLimit={quiz.timeLimit}
          hasTimeLimit={quiz.hasTimeLimit}
          onClose={(submitted) => handleQuizComplete(submitted)}
        />
      )}
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className='bg-muted p-4 rounded-lg'>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='text-lg font-semibold'>{value}</p>
    </div>
  )
}
