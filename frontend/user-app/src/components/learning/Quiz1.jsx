'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { X, Clock, RefreshCcw, ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const StatCard = ({ label, value, className = "" }) => (
  <div className={`text-center p-4 rounded-lg bg-secondary/20 ${className}`}>
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
)

export default function QuizComponent({ quiz, userAttempt = null }) {
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [answeredQuestions, setAnsweredQuestions] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit * 60)
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false)
  const [quizResults, setQuizResults] = useState(null)

  useEffect(() => {
    let timer
    if (isQuizStarted && quiz.hasTimeLimit) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isQuizStarted, quiz.hasTimeLimit])

  const startQuiz = () => setIsQuizStarted(true)
  const closeQuiz = () => setIsQuizStarted(false)

  const handleOptionChange = (questionId, optionId) => {
    const currentType = quiz.questions[currentQuestion].questionType

    setSelectedOptions((prev) => {
      const newOptions = { ...prev }
      if (currentType === 'MultipleChoice') {
        newOptions[questionId] = { [optionId]: true }
      } else if (currentType === 'MultipleSelect') {
        newOptions[questionId] = { ...prev[questionId], [optionId]: !prev[questionId]?.[optionId] }
      } else if (currentType === 'ShortAnswer') {
        newOptions[questionId] = optionId
      }
      return newOptions
    })

    setAnsweredQuestions((prev) => 
      prev.includes(questionId) ? prev : [...prev, questionId]
    )
  }

  const handleNext = () => currentQuestion < quiz.questions.length - 1 && setCurrentQuestion((prev) => prev + 1)
  const handlePrevious = () => currentQuestion > 0 && setCurrentQuestion((prev) => prev - 1)

  const handleSubmit = () => {
    const totalQuestions = quiz.questions.length
    const answeredCount = answeredQuestions.length
    const score = (answeredCount / totalQuestions) * 100
    setQuizResults({ score, answeredCount, totalQuestions })
    setIsConfirmSubmitOpen(false)
  }

  const renderQuestionProgress = () => (
    <div className='flex justify-center space-x-2 mb-8'>
      {quiz.questions.map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full ${index === currentQuestion ? 'bg-blue-500' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  )

  const renderOptions = () => {
    const question = quiz.questions[currentQuestion]
    const type = question.questionType

    if (type === 'MultipleChoice') {
      const selectedValue = Object.keys(selectedOptions[question.id] || {})[0]
      return (
        <RadioGroup
          value={selectedValue}
          onValueChange={(value) => handleOptionChange(question.id, value)}
          className='space-y-3'
        >
          {question.questionOptions.map((option) => (
            <div key={option.id} className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
              <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
              <Label htmlFor={`${question.id}-${option.id}`} className='flex-grow cursor-pointer'>{option.content}</Label>
            </div>
          ))}
        </RadioGroup>
      )
    } else if (type === 'MultipleSelect') {
      return (
        <div className='space-y-3'>
          {question.questionOptions.map((option) => (
            <div key={option.id} className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
              <Checkbox
                id={`${question.id}-${option.id}`}
                checked={selectedOptions[question.id]?.[option.id] || false}
                onCheckedChange={() => handleOptionChange(question.id, option.id)}
              />
              <Label htmlFor={`${question.id}-${option.id}`} className='flex-grow cursor-pointer'>{option.content}</Label>
            </div>
          ))}
        </div>
      )
    } else if (type === 'ShortAnswer') {
      return (
        <textarea
          className='w-full p-2 border rounded'
          value={selectedOptions[question.id] || ''}
          onChange={(e) => handleOptionChange(question.id, e.target.value)}
          placeholder='Enter your answer here'
        />
      )
    }
  }

  const renderQuestionStatus = () => (
    <div className='flex justify-center space-x-2 mt-8'>
      {quiz.questions.map((question, index) => (
        <div
          key={index}
          className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
            answeredQuestions.includes(question.id) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  )

  const renderSidebar = () => (
    <div className="lg:w-96 p-6 mt-5 border-border/50 bg-bGprimary backdrop-blur-sm">
      <div className="space-y-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary rounded-lg">
                  <Clock className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Passing Mark</p>
                  <p className="text-lg font-semibold">{quiz.passingMark}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary rounded-lg">
                  <Clock className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                  <p className="text-lg font-semibold">{quiz.timeLimit} minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary rounded-lg">
                  <RefreshCcw className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Attempts Left</p>
                  <p className="text-lg font-semibold">{quiz.attemptLimit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>Quiz Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total Questions" value={quiz.questions.length} />
              <StatCard label="Answered" value={answeredQuestions.length} />
              <StatCard 
                label="Remaining" 
                value={quiz.questions.length - answeredQuestions.length}
                className="bg-yellow-100 dark:bg-yellow-900/20" 
              />
              <StatCard 
                label="Time Left" 
                value={`${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`}
                className="bg-blue-100 dark:bg-blue-900/20" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-bGprimary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row min-h-screen">
            <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
              <Card className="max-w-2xl mx-auto border-none">
                <CardHeader className="bg-primary py-12 rounded-t-lg">       
                  <ReactMarkdown 
                    className='prose prose-h1:text-primaryText prose-h2:text-primaryText 
                    prose-h3:text-primaryText prose-h4:text-primaryText prose-p:text-primaryText 
                    prose-ol:text-primaryText prose-ul:text-primaryText prose-li:text-primaryText'
                  >
                    {quiz.description}
                  </ReactMarkdown>
                </CardHeader>
                <CardContent className="p-8 text-center">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 rounded-full"
                    onClick={startQuiz}
                  >
                    Start Quiz
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            {renderSidebar()}
          </div>
        </div>
      </div>
    )
  }

  const currentQuestionData = quiz.questions[currentQuestion]

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white w-full h-full max-w-6xl max-h-[90vh] rounded-lg shadow-lg overflow-auto relative flex'>
        <div className='flex-1 p-6 space-y-6'>
          <Button variant='ghost' size='icon' className='absolute top-4 right-4' onClick={closeQuiz}>
            <X className='h-4 w-4' />
          </Button>
          {quiz.hasTimeLimit && (
            <div className="text-center text-xl font-bold">
              Time Remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          )}
          {renderQuestionProgress()}
          <div className='space-y-4'>
            <span className='text-sm text-gray-500'>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <h2 className='text-xl font-semibold text-gray-900'>{currentQuestionData.content}</h2>
            {renderOptions()}
          </div>
          <div className='flex justify-between pt-4'>
            <Button variant='outline' onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button onClick={() => setIsConfirmSubmitOpen(true)}>Submit</Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
          {renderQuestionStatus()}
          <AlertDialog open={isConfirmSubmitOpen} onOpenChange={setIsConfirmSubmitOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have answered {answeredQuestions.length} out of {quiz.questions.length} questions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {/* {renderSidebar()} */}
      </div>
    </div>
  )
}