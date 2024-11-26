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
import { getFullQuizDetail } from "@/services/api/questionApi"
import { useToast } from "@/hooks/use-toast"
import { deleteQuestion } from "@/services/api/questionApi"
import { FullScreenPopup } from "./FullScreenPopup"
import { useStore } from "@/data/store"
export default function QuizManagement() {
  const { params } = useMatch(quizManagementRoute.id)
  const { courseIdToBack } = useStore()
  console.log(courseIdToBack)
  const { quizId } = params
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [quizDetail, setQuizDetail] = useState(null)
  const [questions, setQuestions] = useState()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isFullScreenPopupOpen, setIsFullScreenPopupOpen] = useState(false)
  const { setQuizIdToCreateProblem } = useStore()
  
  // Set quizId to create problem
  useEffect(() => {
    setQuizIdToCreateProblem(quizId)
  }, [])

  useEffect(() => {
    const fetchQuizDetail = async () => {
      console.log(quizId)
      try {
        const response = await getFullQuizDetail(quizId)
        console.log(response)
        setQuizDetail(response)
      } catch (error) {
        console.error('Error fetching quiz detail:', error)
      }
    }
    fetchQuizDetail()
  }, [isUpdate])

  const handleEditQuestion = (editedQuestion) => {
    setQuestions(questions.map(q => q.id === editedQuestion.id ? editedQuestion : q))
  }

  const handleDeleteQuestion = async (questionId) => {
    try {
      const response = await deleteQuestion(quizId, questionId)
      console.log(response)
      setIsUpdate(!isUpdate)
      toast({
        title: 'Question deleted successfully',
        description: 'The question has been deleted successfully',
        duration: 1500
      })
    } catch (error) {
      toast({
        title: 'Error deleting question',
        description: 'An error occurred while deleting the question',
        duration: 1500
      })
      console.error('Error deleting question:', error)
    }
  }

  const handleToggleActive = (questionId) => {
    setQuestions(questions.map(q => q.id === questionId ? { ...q, isActive: !q.isActive } : q))
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 mb-8 md:mb-0 md:mr-4">
        <Button variant="outline" className="flex items-center gap-2 mb-4" onClick={() => navigate({ to: `/edit-course/${courseIdToBack}` })}>
          <ChevronLeft className="h-4 w-4" />
          Back to Curriculum
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{quizDetail?.quiz?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Quiz Type:</span>
                <span>{quizDetail?.quiz?.quizType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Passing Mark:</span>
                <span>{quizDetail?.quiz?.passingMark}</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Time Limit</span>
                  </div>
                  <Switch checked={quizDetail?.quiz?.hasTimeLimit} />
                </div>
                {quizDetail?.quiz?.hasTimeLimit && (
                  <div className="flex justify-between items-center pl-7">
                    <span>Duration:</span>
                    <span>{quizDetail?.quiz?.timeLimit} minutes</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    <span className="font-semibold">Attempt Limit</span>
                  </div>
                  <Switch checked={quizDetail?.quiz?.hasAttemptLimit} />
                </div>
                {quizDetail?.quiz?.hasAttemptLimit && (
                  <div className="flex justify-between items-center pl-7">
                    <span>Max Attempts:</span>
                    <span>{quizDetail?.quiz?.attemptLimit}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Button className="mt-4 w-full" onClick={() => setShowAddQuestionForm(true)}>Add Question Normal</Button>
        <Button className="mt-4 w-full" onClick={() => setIsFullScreenPopupOpen(true)}>Create Problem Quiz</Button>
      </div>

      <div className="w-full md:w-3/4 pl-4">
        {quizDetail?.quiz?.questions.map((question) => (
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
        <AddQuestionForm quizId={quizId} setIsUpdate={setIsUpdate} isUpdate={isUpdate} onClose={() => setShowAddQuestionForm(false)} />
      )}

      <FullScreenPopup
        isOpen={isFullScreenPopupOpen}
        onClose={() => setIsFullScreenPopupOpen(false)}
        quizId={quizId}
      />
    </div>
  )
}

