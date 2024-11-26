'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Quiz1 from './Quiz1'
import { QuizAPI } from '@/services/api/quizApi'
import QuizPopup from '../quiz/QuizPopup'
import { QuizSubmissionHistory } from '../quiz/QuizSubmissionHistory'

export default function QuizComponent({ quiz }) {
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [quizData, setQuizData] = useState(null)
  const [quizSubmission, setQuizSubmission] = useState(null)
  useEffect(() => {
    const fetchQuizSubmission = async () => {
      try {
        const quizSubmission = await QuizAPI.getQuizSubmission(quiz.id)
        console.log('Quiz Submission: ', quizSubmission.quizSubmissions)
        setQuizSubmission(quizSubmission.quizSubmissions)
      } catch (error) {
        console.error('Error fetching quiz submission:', error)
      }
    }
    fetchQuizSubmission()
  }, [quizData])

  const startQuiz = async () => {
    setIsQuizStarted(true)
    handleStartQuiz()
    try {
      const quizDetails = await QuizAPI.getQuizDetails(quiz.id)

      setQuizData(quizDetails)
    } catch (error) {
      console.error('Error fetching quiz details:', error)
    }
  }

  const handleStartQuiz = async () => {
    try {
      const response = await QuizAPI.startQuiz(quiz.id)
      console.log('Quiz Started: ', response)
    } catch (error) {
      console.error('Error starting quiz:', error)
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
            <div className='mx-auto py-10'>
              {quizSubmission && <QuizSubmissionHistory submissions={quizSubmission} />}
            </div>
          </CardContent>
        </Card>
      </div>

      {isQuizStarted && quizData && (
        <QuizPopup quiz={quizData.quiz} answer={quizData.answer} onClose={() => setIsQuizStarted(false)} />
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
