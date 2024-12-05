import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMatch } from '@tanstack/react-router'
import { ChevronLeft, Clock, RotateCcw, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { AddQuestionForm } from '@/pages/Quiz/AddQuestionForm'
import { QuestionItem } from './QuestionItem'
import { quizManagementRoute } from '@/routers/router'
import { getFullQuizDetail, deleteQuestion } from '@/services/api/questionApi'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/data/store'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FileQuestion, Award } from 'lucide-react'
import { EDIT_CURRICULUM_COURSE_PATH } from '@/routers/router'
import { FullScreenPopup } from './FullScreenPopup'
import { UpdateProblemQuizModal } from './UpdateProblemQuizModal'

export default function QuizManagement() {
  const { params } = useMatch(quizManagementRoute.id)
  const { courseIdToBack } = useStore()
  const { quizId } = params
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [quizDetail, setQuizDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isFullScreenPopupOpen, setIsFullScreenPopupOpen] = useState(false)

  useEffect(() => {
    if (showAddQuestionForm || showCreateQuizForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [showAddQuestionForm, showCreateQuizForm])

  useEffect(() => {
    const fetchQuizDetail = async () => {
      setIsLoading(true)
      try {
        const response = await getFullQuizDetail(quizId)
        setQuizDetail(response)
      } catch (error) {
        console.error('Error fetching quiz detail:', error)
        toast({
          title: 'Error',
          description: 'Failed to load quiz details. Please try again.',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuizDetail()
  }, [quizId, isUpdate, toast])

  const handleEditQuestion = (editedQuestion) => {
    setQuizDetail((prev) => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        questions: prev.quiz.questions.map((q) => (q.id === editedQuestion.id ? editedQuestion : q))
      }
    }))
    setIsUpdate(!isUpdate)
  }

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(quizId, questionId)
      setIsUpdate(!isUpdate)
      toast({
        title: 'Success',
        description: 'Question deleted successfully',
        duration: 1500
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete question. Please try again.',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  const handleToggleActive = (questionId) => {
    setQuizDetail((prev) => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        questions: prev.quiz.questions.map((q) => (q.id === questionId ? { ...q, isActive: !q.isActive } : q))
      }
    }))
  }

  const LoadingSkeleton = () => (
    <div className='space-y-6'>
      <Skeleton className='h-10 w-40' />
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-3/4' />
        </CardHeader>
        <CardContent className='grid gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
          </div>
          <div className='space-y-4'>
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <Skeleton className='h-8 w-1/4' />
          <Skeleton className='h-10 w-40' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-24 w-full' />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (isLoading) {
    return (
      <div className='container mx-auto p-4 space-y-6'>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <Button
        variant='outline'
        className='flex items-center gap-2'
        onClick={() => navigate({ to: EDIT_CURRICULUM_COURSE_PATH, params: { courseId: courseIdToBack } })}
      >
        <ChevronLeft className='h-4 w-4' />
        Back to Curriculum
      </Button>

      <div className='grid gap-6'>
        <Card className='w-full'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-2xl font-bold'>{quizDetail?.quiz?.title}</CardTitle>
              <Badge variant={quizDetail?.quiz?.isActive ? 'success' : 'secondary'}>
                {quizDetail?.quiz?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                    <FileQuestion className='h-5 w-5 text-primary' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>Quiz Type</p>
                    <p className='text-sm text-muted-foreground'>{quizDetail?.quiz?.quizType}</p>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                    <Award className='h-5 w-5 text-primary' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>Passing Mark</p>
                    <p className='text-sm text-muted-foreground'>{quizDetail?.quiz?.passingMark}%</p>
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                      <Clock className='h-5 w-5 text-primary' />
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>Time Limit</p>
                      {quizDetail?.quiz?.hasTimeLimit && (
                        <p className='text-sm text-muted-foreground'>{quizDetail?.quiz?.timeLimit} minutes</p>
                      )}
                    </div>
                  </div>
                  <Switch checked={quizDetail?.quiz?.hasTimeLimit} />
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                      <RotateCcw className='h-5 w-5 text-primary' />
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>Attempt Limit</p>
                      {quizDetail?.quiz?.hasAttemptLimit && (
                        <p className='text-sm text-muted-foreground'>{quizDetail?.quiz?.attemptLimit} attempts</p>
                      )}
                    </div>
                  </div>
                  <Switch checked={quizDetail?.quiz?.hasAttemptLimit} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <Button className='mt-4 w-full' onClick={() => setShowAddQuestionForm(true)}>
          Add Question Normal
        </Button> */}
        <Button className='mt-4 w-full' onClick={() => setIsFullScreenPopupOpen(true)}>
          Create Problem Quiz
        </Button>

        <Card className='md:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Questions</CardTitle>
            <Button onClick={() => setShowAddQuestionForm(true)}>
              <Plus className='h-4 w-4 mr-2' />
              Add Question
            </Button>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {quizDetail?.quiz?.questions.length > 0 ? (
                quizDetail.quiz.questions.map((question) => (
                  <QuestionItem
                    key={question.id}
                    quizId={quizId}
                    question={question}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                    onToggleActive={handleToggleActive}                   
                  />
                ))
              ) : (
                <p className='text-center text-muted-foreground'>No questions added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddQuestionForm && (
        <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50'>
          <div className='container flex items-center justify-center h-full max-w-lg mx-auto'>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
              </CardHeader>
              <CardContent>
                <AddQuestionForm
                  quizId={quizId}
                  setIsUpdate={setIsUpdate}
                  isUpdate={isUpdate}
                  onClose={() => setShowAddQuestionForm(false)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {isFullScreenPopupOpen && (
        <FullScreenPopup
          isOpen={isFullScreenPopupOpen}
          onClose={() => setIsFullScreenPopupOpen(false)}
          quizId={quizId}
        />
      )}
      
    </div>
  )
}
