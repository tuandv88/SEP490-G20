import React, { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { Card, CardHeader, CardTitle } from 'react-bootstrap'
import { CardContent } from '../ui/card'
import ReactMarkdown from 'react-markdown'
import { Button } from '../ui/button'
import { QuizAPI } from '@/services/api/quizApi'
import QuizSuggestUser from './QuizSuggestUser'


const QuizModal = ({ isOpen, onClose, quiz }) => {
  if (!isOpen) return null

  console.log('Quiz: ', quiz.timeLimit)

  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [quizData, setQuizData] = useState(null)


  const startQuiz = async () => {
    try {
      // Bắt đầu quiz
      await handleStartQuiz()

      // Sau khi quiz được bắt đầu (isQuizStarted được cập nhật), lấy chi tiết quiz
      const quizDetails = await QuizAPI.getQuizDetails(quiz.id)
      setQuizData(quizDetails)
      console.log('Quiz Data: ', quizDetails)
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
    onClose()
    setIsQuizStarted(false)
    // Không cần gọi fetchQuizSubmission ở đây nếu đã gọi trong startQuiz
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-4xl mx-4 relative'>
        <button onClick={onClose} className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'>
          <X className='w-6 h-6' />
        </button>

        <Card className='w-full'>
          <CardHeader className='bg-primary text-primary-foreground py-6 px-6 rounded-t-lg'>
            <CardTitle className='text-2xl font-bold'>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className='p-6 space-y-6'>
            <ReactMarkdown className='prose dark:prose-invert max-w-none'>{quiz.description}</ReactMarkdown>

            <div className='grid grid-cols-2 gap-4'>
              <InfoCard label='Passing Mark' value={`${quiz.passingMark}%`} />
              <InfoCard label='Time Limit' value={quiz.hasTimeLimit ? `${quiz.timeLimit} minutes` : 'No limit'} />
              <InfoCard
                label='Attempt Limit'
                value={quiz.hasAttemptLimit ? `${quiz.attemptLimit - quiz.attemptCount} left` : 'Unlimited'}
              />
              <InfoCard label='Attempts Made' value={quiz.attemptCount.toString()} />
            </div>

            <div className='flex justify-center mt-6'>
              <Button size='lg' onClick={startQuiz}>
                Start Quiz
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {isQuizStarted && quizData && (
        <QuizSuggestUser quiz={quizData.quiz} answer={quizData.answer} timeLimit={quiz.timeLimit} onComplete={() => handleCloseQuiz()} />
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

export default QuizModal
