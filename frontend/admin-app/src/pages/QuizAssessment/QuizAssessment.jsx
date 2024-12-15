import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Clock, RotateCcw, Plus, Loader2, FileQuestion, Award, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { AddQuestionForm } from './AddQuestionForm'
import { QuizCreationForm } from './QuizCreationForm'
import { QuestionItem } from './QuestionItem'
import { deleteQuestion } from '@/services/api/questionApi'
import { getQuizAssessment, createQuizAssessment, updateQuiz } from '@/services/api/quizApi'
import { getFullQuizDetail } from '@/services/api/questionApi'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { QuizEditForm } from './QuizEditForm'
export default function QuizAssessment() {
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [quizId, setQuizId] = useState(null)
  const [showCreateQuizForm, setShowCreateQuizForm] = useState(false)
  const [quizAssessment, setQuizAssessment] = useState(null)
  const [quizDetail, setQuizDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [showEditQuizForm, setShowEditQuizForm] = useState(false)

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
    fetchQuizAssessment()
  }, [])

  const fetchQuizAssessment = async () => {
    setIsLoading(true)
    try {
      const data = await getQuizAssessment()
      setQuizAssessment(data)
      setQuizId(data.quiz.id)
      if (data && data.quiz && data.quiz.id) {
        await fetchQuizDetail(data.quiz.id)
      }
    } catch (error) {
      // Handle 404 gracefully
      if (error?.response?.status === 404) {
        setQuizAssessment(null)
        setQuizDetail(null)
        return
      }
      // Handle other errors
      console.error('Error fetching quiz assessment:', error)
      toast({
        title: 'Error',
        description: 'Failed to load quiz assessment. Please try again.',
        variant: 'destructive'
      })
      setQuizAssessment(null)
      setQuizDetail(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchQuizDetail = async (quizId) => {
    setIsLoading(true)
    try {
      const detailData = await getFullQuizDetail(quizId)
      setQuizDetail(detailData)
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

  const handleQuestionAdded = () => {
    if (quizDetail && quizDetail.quiz && quizDetail.quiz.id) {
      fetchQuizDetail(quizDetail.quiz.id)
    }
  }

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
      await deleteQuestion(quizDetail.quiz.id, questionId)
      await fetchQuizDetail(quizDetail.quiz.id)
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

  const handleCreateQuiz = async (quizData) => {
    try {
      const createdQuiz = await createQuizAssessment(quizData)
      setQuizAssessment(createdQuiz)
      await fetchQuizDetail(createdQuiz.quiz.id)
      setShowCreateQuizForm(false)
      toast({
        title: 'Success',
        description: 'Quiz created successfully',
        duration: 1500
      })
    } catch (error) {
      console.error('Error creating quiz:', error)
      toast({
        title: 'Error',
        description: 'Failed to create quiz. Please try again.',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  const handleUpdateQuiz = async (updatedQuizData) => {
    try {
      const response = await updateQuiz(quizDetail.quiz.id, updatedQuizData)
      if (response) {
        await fetchQuizDetail(quizDetail.quiz.id)
        toast({
          title: 'Success',
          description: 'Quiz updated successfully',
          duration: 1500
        })
      }
    } catch (error) {
      console.error('Error updating quiz:', error)
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update quiz. Please try again.',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  if (isLoading) {
    return (
      <div className='container p-4 mx-auto space-y-6'>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className='container p-4 mx-auto space-y-6'>
      {!quizDetail ? (
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <p className='mb-4 text-lg'>No Quiz Assessment found</p>
              <Button onClick={() => setShowCreateQuizForm(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Create Quiz Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className='w-full'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <CardTitle className='text-2xl font-bold'>{quizDetail.quiz.title}</CardTitle>
                  <Badge variant={quizDetail.quiz.isActive ? 'success' : 'secondary'}>
                    {quizDetail.quiz.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Button variant='outline' size='icon' onClick={() => setShowEditQuizForm(true)}>
                  <Pencil className='h-4 w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='grid gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-muted'>
                      <FileQuestion className='w-5 h-5 text-primary' />
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>Quiz Type</p>
                      <p className='text-sm text-muted-foreground'>{quizDetail.quiz.quizType}</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-muted'>
                      <Award className='w-5 h-5 text-primary' />
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>Passing Mark</p>
                      <p className='text-sm text-muted-foreground'>{quizDetail.quiz.passingMark}</p>
                    </div>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='flex items-center justify-center w-10 h-10 rounded-full bg-muted'>
                        <Clock className='w-5 h-5 text-primary' />
                      </div>
                      <div className='space-y-1'>
                        <p className='text-sm font-medium leading-none'>Time Limit</p>
                        <p className='text-sm text-muted-foreground'>
                          {quizDetail.quiz.hasTimeLimit ? `${quizDetail.quiz.timeLimit} minutes` : 'No limit'}
                        </p>
                      </div>
                    </div>
                    <Switch checked={quizDetail.quiz.hasTimeLimit} />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='flex items-center justify-center w-10 h-10 rounded-full bg-muted'>
                        <RotateCcw className='w-5 h-5 text-primary' />
                      </div>
                      <div className='space-y-1'>
                        <p className='text-sm font-medium leading-none'>Attempt Limit</p>
                        <p className='text-sm text-muted-foreground'>
                          {quizDetail.quiz.hasAttemptLimit ? `${quizDetail.quiz.attemptLimit} attempts` : 'No limit'}
                        </p>
                      </div>
                    </div>
                    <Switch checked={quizDetail.quiz.hasAttemptLimit} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='md:col-span-2'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Questions</CardTitle>
              <Button onClick={() => setShowAddQuestionForm(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Add Question
              </Button>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {quizDetail.quiz.questions.length > 0 ? (
                  quizDetail.quiz.questions.map((question) => (
                    <QuestionItem
                      key={question.id}
                      quizId={quizDetail.quiz.id}
                      question={question}
                      onEdit={handleEditQuestion}
                      onDelete={handleDeleteQuestion}
                      onToggleActive={handleToggleActive}
                      onQuestionUpdated={handleQuestionAdded}
                    />
                  ))
                ) : (
                  <p className='text-center text-muted-foreground'>No questions added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {showAddQuestionForm && (
        <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50'>
          <div className='container flex items-center justify-center h-full max-w-lg mx-auto'>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
              </CardHeader>
              <CardContent>
                <AddQuestionForm
                  quizId={quizDetail.quiz.id}
                  onQuestionAdded={handleQuestionAdded}
                  onClose={() => setShowAddQuestionForm(false)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {showCreateQuizForm && (
        <QuizCreationForm
          isOpen={showCreateQuizForm}
          onOpenChange={setShowCreateQuizForm}
          onSubmit={handleCreateQuiz}
        />
      )}

      {showEditQuizForm && (
        <QuizEditForm
          isOpen={showEditQuizForm}
          onOpenChange={setShowEditQuizForm}
          onSubmit={handleUpdateQuiz}
          defaultValues={quizDetail.quiz}
        />
      )}
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className='space-y-6'>
    <Skeleton className='w-40 h-10' />
    <Card>
      <CardHeader>
        <Skeleton className='w-3/4 h-8' />
      </CardHeader>
      <CardContent className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-4'>
          <Skeleton className='w-full h-6' />
          <Skeleton className='w-full h-6' />
        </div>
        <div className='space-y-4'>
          <Skeleton className='w-full h-6' />
          <Skeleton className='w-full h-6' />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <Skeleton className='w-1/4 h-8' />
        <Skeleton className='w-40 h-10' />
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='w-full h-24' />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)
