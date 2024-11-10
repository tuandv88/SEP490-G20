/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const questions = [
  {
    id: 1,
    type: 'multiple',
    label: 'Multiple response',
    question: 'What is the main advantage of using a rolling budget instead of an annual budget?',
    options: [
      { id: 1, text: 'It requires less effort to create.' },
      { id: 2, text: 'It provides a longer-term financial outlook.' },
      { id: 3, text: 'It allows for more flexibility in adapting to changing circumstances.' },
      { id: 4, text: 'It is a legal requirement for some businesses.' }
    ]
  },
  {
    id: 2,
    type: 'single',
    label: 'Select one',
    question: 'Which cloud service model is best for complete infrastructure control?',
    options: [
      { id: 1, text: 'Infrastructure as a Service (IaaS)' },
      { id: 2, text: 'Platform as a Service (PaaS)' },
      { id: 3, text: 'Software as a Service (SaaS)' },
      { id: 4, text: 'Function as a Service (FaaS)' }
    ]
  },
  {
    id: 3,
    type: 'boolean',
    label: 'True/False',
    question: 'A marketing strategy should always prioritize social media over traditional marketing channels.',
    options: [
      { id: 1, text: 'True' },
      { id: 2, text: 'False' }
    ]
  }
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [answeredQuestions, setAnsweredQuestions] = useState([])

  useEffect(() => {
    const answered = questions
      .filter((q) => selectedOptions[q.id] && Object.values(selectedOptions[q.id]).some((v) => v))
      .map((q) => q.id)
    setAnsweredQuestions(answered)
  }, [selectedOptions])

  const handleOptionChange = (questionId, optionId) => {
    const currentType = questions[currentQuestion].type

    if (currentType === 'single' || currentType === 'boolean') {
      setSelectedOptions((prev) => ({
        ...prev,
        [questionId]: {
          [optionId]: true
        }
      }))
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [optionId]: !prev[questionId]?.[optionId]
        }
      }))
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    console.log('Quiz submitted:', selectedOptions)
    // Handle submission logic here
  }

  const renderQuestionProgress = () => {
    return (
      <div className='flex justify-center space-x-2 mb-8'>
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentQuestion ? 'bg-blue-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    )
  }

  const renderOptions = () => {
    const question = questions[currentQuestion]
    const type = question.type

    if (type === 'single' || type === 'boolean') {
      const selectedValue = Object.entries(selectedOptions[question.id] || {}).find(([_, value]) => value)?.[0]

      return (
        <RadioGroup
          value={selectedValue}
          onValueChange={(value) => {
            handleOptionChange(question.id, value)
          }}
          className='space-y-3'
        >
          {question.options.map((option) => (
            <div
              key={option.id}
              className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <RadioGroupItem value={option.id.toString()} id={`${question.id}-${option.id}`} />
              <Label htmlFor={`${question.id}-${option.id}`} className='flex-grow cursor-pointer'>
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )
    }

    return (
      <div className='space-y-3'>
        {question.options.map((option) => (
          <div
            key={option.id}
            className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <Checkbox
              id={`${question.id}-${option.id}`}
              checked={selectedOptions[question.id]?.[option.id] || false}
              onCheckedChange={() => handleOptionChange(question.id, option.id)}
            />
            <Label htmlFor={`${question.id}-${option.id}`} className='flex-grow cursor-pointer'>
              {option.text}
            </Label>
          </div>
        ))}
      </div>
    )
  }

  const renderQuestionStatus = () => {
    return (
      <div className='flex justify-center space-x-2 mt-8'>
        {questions.map((question, index) => (
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
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <div className='max-w-2xl mx-auto p-6 space-y-6'>
      {renderQuestionProgress()}

      <div className='flex justify-between pt-4'>
        <Button variant='outline' onClick={handlePrevious} disabled={currentQuestion === 0}>
          Previous
        </Button>

        {currentQuestion === questions.length - 1 ? (
          <Button onClick={handleSubmit}>Submit</Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>

      <div className='space-y-4'>
        <span className='text-sm text-gray-500'>{currentQuestionData.label}</span>

        <h2 className='text-xl font-semibold text-gray-900'>{currentQuestionData.question}</h2>

        {renderOptions()}
      </div>

      {renderQuestionStatus()}
    </div>
  )
}

