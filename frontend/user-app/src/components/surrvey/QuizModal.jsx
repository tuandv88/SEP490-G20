import React, { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { Card, CardHeader, CardTitle } from 'react-bootstrap'
import { CardContent } from '../ui/card'
import ReactMarkdown from 'react-markdown'
import { Button } from '../ui/button'
import { QuizAPI } from '@/services/api/quizApi'
import QuizSuggestUser from './QuizSuggestUser'

const QuizModal = ({ isOpen, onClose, quiz, setIsQuizSubmitted }) => {
  if (!isOpen || !quiz) return null

  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [quizData, setQuizData] = useState(null)
  const [error, setError] = useState(null)

  const startQuiz = async () => {
    try {
      setError(null)
      // Bắt đầu quiz
      await handleStartQuiz()

      // Sau khi quiz được bắt đầu, lấy chi tiết quiz
      const quizDetails = await QuizAPI.getQuizDetails(quiz.id)
      if (!quizDetails) {
        throw new Error('Failed to fetch quiz details')
      }
      setQuizData(quizDetails)
      console.log('Quiz Data: ', quizDetails)
    } catch (error) {
      console.error('Error starting or fetching quiz details:', error)
      setError('Failed to start quiz. Please try again.')
      setIsQuizStarted(false)
    }
  }

  const handleStartQuiz = async () => {
    try {
      const response = await QuizAPI.startQuiz(quiz.id)
      if (!response) {
        throw new Error('Failed to start quiz')
      }
      console.log('Quiz Started: ', response)
      setIsQuizStarted(true)
    } catch (error) {
      console.error('Error starting quiz:', error)
      throw error
    }
  }

  const handleCloseQuiz = () => {
    setError(null)
    setIsQuizStarted(false)
    setQuizData(null)
    onClose()
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-4xl mx-4 relative'>
        <button onClick={handleCloseQuiz} className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'>
          <X className='w-6 h-6' />
        </button>

        <Card className='w-full'>
          <CardHeader className='bg-primary text-primary-foreground py-6 px-6 rounded-t-lg'>
            <CardTitle className='text-2xl font-bold'>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className='p-6 space-y-6'>
            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                {error}
              </div>
            )}
            
            <ReactMarkdown className='prose dark:prose-invert max-w-none'>
              {quiz.description || 'No description available'}
            </ReactMarkdown>

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
              <Button 
                size='lg' 
                onClick={startQuiz}
                disabled={isQuizStarted}
              >
                {isQuizStarted ? 'Starting Quiz...' : 'Start Quiz'}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {isQuizStarted && quizData && (
        <QuizSuggestUser
          quiz={quizData.quiz}
          answer={quizData.answer}
          timeLimit={quiz.timeLimit}
          onComplete={handleCloseQuiz}
          setIsQuizSubmitted={setIsQuizSubmitted}
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

export default QuizModal
