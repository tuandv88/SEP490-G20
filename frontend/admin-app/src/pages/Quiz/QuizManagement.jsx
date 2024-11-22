"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AddQuestionForm } from "@/pages/Quiz/AddQuestionForm"
import { useNavigate } from "@tanstack/react-router"
import { ChevronLeft, Clock, RotateCcw } from 'lucide-react'
import { QuestionItem } from "./QuestionItem"
import { useMatch } from "@tanstack/react-router"
import { quizManagementRoute } from "@/routers/router"

// Fake question data
const fakeQuestions = [
  {
    id: "1",
    content: "What is the capital of France?",
    isActive: true,
    questionType: "MultipleChoice",
    questionLevel: "easy",
    mark: 1,
    answers: [
      { text: "London", isCorrect: false },
      { text: "Berlin", isCorrect: false },
      { text: "Paris", isCorrect: true },
      { text: "Madrid", isCorrect: false }
    ]
  },
]


export default function QuizManagement() {
const { params } = useMatch( quizManagementRoute.id )
  const { quizId } = params
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false)
  const [questions, setQuestions] = useState(fakeQuestions)
  const navigate = useNavigate()

  // Mock data for quiz info
  const quizInfo = {
    title: "Sample Quiz",
    passingMark: 70,
    hasTimeLimit: true,
    timeLimit: 60,
    hasAttemptLimit: true,
    attemptLimit: 3,
    quizType: "Graded"
  }

  

  const handleAddQuestion = async (newQuestion) => {
    console.log(newQuestion)
    // try {
    //   const response = await addQuestionToQuiz(quizId, newQuestion)
    //   console.log(response)
    // } catch (error) {
    //   console.error('Error adding question:', error)
    // }
  }

  const handleEditQuestion = (editedQuestion) => {
    setQuestions(questions.map(q => q.id === editedQuestion.id ? editedQuestion : q))
  }

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId))
  }

  const handleToggleActive = (questionId) => {
    setQuestions(questions.map(q => q.id === questionId ? {...q, isActive: !q.isActive} : q))
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 mb-8 md:mb-0 md:mr-4">
        <Button variant="outline" className="flex items-center gap-2 mb-4" onClick={() => navigate({ to: '/curriculum' })}>
          <ChevronLeft className="h-4 w-4" />
          Back to Curriculum
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{quizInfo.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Quiz Type:</span>
                <span>{quizInfo.quizType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Passing Mark:</span>
                <span>{quizInfo.passingMark}%</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Time Limit</span>
                  </div>
                  <Switch checked={quizInfo.hasTimeLimit} />
                </div>
                {quizInfo.hasTimeLimit && (
                  <div className="flex justify-between items-center pl-7">
                    <span>Duration:</span>
                    <span>{quizInfo.timeLimit} minutes</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    <span className="font-semibold">Attempt Limit</span>
                  </div>
                  <Switch checked={quizInfo.hasAttemptLimit} />
                </div>
                {quizInfo.hasAttemptLimit && (
                  <div className="flex justify-between items-center pl-7">
                    <span>Max Attempts:</span>
                    <span>{quizInfo.attemptLimit}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Button className="mt-4 w-full" onClick={() => setShowAddQuestionForm(true)}>Add Question</Button>
      </div>

      <div className="w-full md:w-3/4 pl-4">
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            onEdit={handleEditQuestion}
            onDelete={handleDeleteQuestion}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>
      
      {showAddQuestionForm && (
        <AddQuestionForm quizId={quizId} onClose={() => setShowAddQuestionForm(false)}  />
      )}
    </div>
  )
}

