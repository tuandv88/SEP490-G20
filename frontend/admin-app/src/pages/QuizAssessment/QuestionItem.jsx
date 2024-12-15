import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Edit, Trash2, Code, FileQuestion, Info } from 'lucide-react'
import { getProblemById } from '@/services/api/problemApi'
import { EditQuestionForm } from './EditQuestionForm'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { UpdateProblemQuizModal } from '../Quiz/UpdateProblemQuizModal'
export function QuestionItem({ question, onEdit, onDelete, onToggleActive, quizId, onQuestionUpdated, setIsUpdate, isUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [problem, setProblem] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isUpdateProblemQuiz, setIsUpdateProblemQuiz] = useState(false)

  useEffect(() => {
    if (isEditing || isUpdateProblemQuiz) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isEditing, isUpdateProblemQuiz])

  useEffect(() => {
    if (question.questionType === 'CodeSnippet' && question.problemId) {
      const fetchProblemById = async () => {
        try {
          const problem = await getProblemById(question.problemId)
          setProblem(problem)
        } catch (error) {
          console.error('Error fetching problem details:', error)
        }
      }
      fetchProblemById()
    }
  }, [question.questionType, question.problemId])

  const handleEdit = () => {
    setIsEditing(true)
  }
  const handleEditComplete = (editedQuestion) => {
    onEdit(editedQuestion)
    setIsEditing(false)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    onDelete(question.id)
    setShowDeleteConfirm(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  const handleProblemEdit = () => {
    setIsUpdateProblemQuiz(true)
  }

  const handleProblemDelete = () => {
  }

  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'CodeSnippet':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'MultipleChoice':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'TrueFalse':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'MultipleSelect':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <>
      <Card className='mb-4 overflow-hidden'>
        <CardHeader className='space-y-0 pb-2'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
            <div className='flex items-center space-x-2'>
              {question.questionType === 'CodeSnippet' ? (
                <Code className='h-5 w-5 text-blue-500 flex-shrink-0' />
              ) : (
                <FileQuestion className='h-5 w-5 text-green-500 flex-shrink-0' />
              )}
              <CardTitle className='text-base sm:text-lg font-semibold line-clamp-2'>
                <div className='prose prose-sm sm:prose-base max-w-none'>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.content}</ReactMarkdown>
                </div>
              </CardTitle>
            </div>
            <div className='flex items-center space-x-2'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant={question.isActive ? 'outline' : 'destructive'} className='text-xs'>
                      {question.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Question status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button variant='ghost' size='icon' onClick={handleEdit} aria-label='Edit question'>
                <Edit className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' onClick={handleDeleteClick} aria-label='Delete question'>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap items-center gap-3 mb-4'>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getQuestionTypeColor(question.questionType)}`}
            >
              {question.questionType}
            </div>
            <div className='px-3 py-1 rounded-full text-xs font-semibold bg-white-100 text-purple-800 border border-purple-300'>
              Level: {question.questionLevel}
            </div>
            <div className='px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-300'>
              Mark: {question.mark}
            </div>
          </div>

          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='details'>
              <AccordionTrigger className='text-sm font-medium'>
                <span className='flex items-center'>
                  View Details
                  <Info className='ml-2 h-4 w-4 text-muted-foreground' />
                </span>
              </AccordionTrigger>
              <AccordionContent>
                {question.questionType === 'CodeSnippet' && problem && (
                  <Card className='mt-2 mb-4 bg-muted'>
                    <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Problem: {problem.problemDto.title}</CardTitle>
                      <div className='flex space-x-2'>
                        <Button variant='ghost' size='sm' onClick={handleProblemEdit} className='h-8'>
                          <Edit className='h-3 w-3 mr-1' />
                          Edit
                        </Button>
                        <Button variant='ghost' size='sm' onClick={handleProblemDelete} className='h-8'>
                          <Trash2 className='h-3 w-3 mr-1' />
                          Delete
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                )}
                {question.questionType !== 'CodeSnippet' && (
                  <div className='space-y-2'>
                    <p className='font-medium'>Answers:</p>
                    <ul className='space-y-1'>
                      {question.questionOptions.map((answer, index) => (
                        <li
                          key={index}
                          className={`flex items-center space-x-2 ${answer.isCorrect ? 'text-green-600' : ''}`}
                        >
                          <span>{answer.isCorrect ? '✓' : '○'}</span>
                          <span className='text-sm'>{answer.content}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      {isEditing && (
        <EditQuestionForm
          quizId={quizId}
          question={question}
          onSave={handleEditComplete}
          onCancel={() => setIsEditing(false)}
          onQuestionUpdated={onQuestionUpdated}
        />
      )}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the question and remove it from the quiz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {isUpdateProblemQuiz && (
        <UpdateProblemQuizModal
          isOpen={isUpdateProblemQuiz}
          onClose={() => setIsUpdateProblemQuiz(false)}
          quizId={quizId}
          question={question}
          problem={problem}
          setIsUpdate={setIsUpdate}
          isUpdate={isUpdate}
        />
      )}
    </>
  )
}

QuestionItem.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    questionType: PropTypes.string.isRequired,
    questionLevel: PropTypes.string.isRequired,
    mark: PropTypes.number.isRequired,
    questionOptions: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string.isRequired,
        isCorrect: PropTypes.bool.isRequired
      })
    ).isRequired,
    problemId: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired
}
