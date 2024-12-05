'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createQuestion } from '@/services/api/questionApi'
import { useToast } from '@/hooks/use-toast'
import { Trash2, Plus } from 'lucide-react'
import CustomMarkdownEditor from '@/components/custom-markdown-editor'

const QUESTION_TYPES = ['MultipleChoice', 'MultipleSelect', 'TrueFalse']
const QUESTION_LEVELS = ['EASY', 'MEDIUM', 'HARD', 'EXPERT']

const questionSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  isActive: z.boolean(),
  questionType: z.enum(['MultipleChoice', 'MultipleSelect', 'TrueFalse', 'CodeSnippet']),
  questionLevel: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  mark: z.number().min(1, 'Mark must be at least 1'),
  questionOptions: z
    .array(
      z.object({
        content: z.string().min(1, 'Option content is required'),
        isCorrect: z.boolean()
      })
    )
    .min(2, 'At least two answer options are required')
    .refine((options) => options.some((option) => option.isCorrect), {
      message: 'At least one correct answer is required',
      path: ['questionOptions']
    })
})

export function AddQuestionForm({ onClose, quizId, onQuestionAdded }) {
  const [questionType, setQuestionType] = useState('MultipleChoice')
  const { toast } = useToast()
  const [showErrors, setShowErrors] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: '',
      isActive: true,
      questionType: 'MultipleChoice',
      questionLevel: 'EASY',
      mark: 1,
      questionOptions: [
        { content: '', isCorrect: true },
        { content: '', isCorrect: false }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questionOptions'
  })

  const watchQuestionType = watch('questionType')
  const watchQuestionOptions = watch('questionOptions')

  useEffect(() => {
    if (watchQuestionType === 'MultipleChoice') {
      const correctAnswers = watchQuestionOptions.filter((option) => option.isCorrect)
      if (correctAnswers.length > 1) {
        const lastCorrectIndex = watchQuestionOptions.findIndex((option) => option.isCorrect)
        watchQuestionOptions.forEach((_, index) => {
          setValue(`questionOptions.${index}.isCorrect`, index === lastCorrectIndex)
        })
      }
    }
    trigger('questionOptions')
  }, [watchQuestionType, watchQuestionOptions, setValue, trigger])

  useEffect(() => {
    if (watchQuestionOptions) {
      setShowErrors(false) // Reset error display when options change
      trigger('questionOptions')
    }
  }, [watchQuestionOptions, trigger])

  const onSubmit = async (data) => {
    setShowErrors(true)
    if (Object.keys(errors).length > 0) {
      return
    }

    const updatedQuestionOptions = data.questionOptions.map((option, index) => ({
      ...option,
      orderIndex: index
    }))

    const createQues = {
      createQuestionDto: {
        ...data,
        questionOptions: updatedQuestionOptions
      }
    }

    try {
      await createQuestion(createQues, quizId)
      toast({
        title: 'Success',
        description: 'Question created successfully',
        duration: 1500
      })
      onQuestionAdded() // Call this function to trigger a reload of QuizDetail
      onClose()
    } catch (error) {}
  }
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-[800px] h-[600px] p-0 overflow-hidden flex flex-col'>
        <DialogHeader className='px-6 py-4 border-b'>
          <DialogTitle className='text-xl font-semibold'>Add New Question</DialogTitle>
        </DialogHeader>

        <ScrollArea className='flex-grow px-6 py-4'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='content'>Question Content</Label>
              <Controller
                name='content'
                control={control}
                render={({ field }) => (
                  <CustomMarkdownEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Enter your question here'
                    height={250}
                  />
                )}
              />
              {showErrors && errors.content && <p className='text-sm text-red-500'>{errors.content.message}</p>}
            </div>

            <div className='flex items-center space-x-2'>
              <Controller
                name='isActive'
                control={control}
                render={({ field }) => <Switch id='isActive' checked={field.value} onCheckedChange={field.onChange} />}
              />
              <Label htmlFor='isActive'>Active</Label>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='questionType'>Question Type</Label>
                <Controller
                  name='questionType'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setQuestionType(value)
                      }}
                      value={field.value}
                    >
                      <SelectTrigger id='questionType'>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='questionLevel'>Difficulty Level</Label>
                <Controller
                  name='questionLevel'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id='questionLevel'>
                        <SelectValue placeholder='Select level' />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0) + level.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='mark'>Mark</Label>
              <Controller
                name='mark'
                control={control}
                render={({ field }) => (
                  <Input
                    id='mark'
                    type='number'
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    min={1}
                  />
                )}
              />
              {showErrors && errors.mark && <p className='text-sm text-red-500'>{errors.mark.message}</p>}
            </div>

            {(questionType === 'MultipleChoice' || questionType === 'MultipleSelect') && (
              <div className='space-y-2'>
                <Label>Answer Options</Label>
                <div className='max-h-[200px] overflow-y-auto pr-2'>
                  {fields.map((field, index) => (
                    <div key={field.id} className='flex flex-col gap-2 mb-2'>
                      <div className='flex items-center gap-2'>
                        <Controller
                          name={`questionOptions.${index}.content`}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder={`Option ${index + 1}`} className='flex-1' />
                          )}
                        />
                        <Controller
                          name={`questionOptions.${index}.isCorrect`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Switch
                              checked={value}
                              onCheckedChange={(newValue) => {
                                if (questionType === 'MultipleChoice' && newValue) {
                                  watchQuestionOptions.forEach((_, i) => {
                                    setValue(`questionOptions.${i}.isCorrect`, i === index)
                                  })
                                } else {
                                  onChange(newValue)
                                }
                                trigger('questionOptions')
                              }}
                              className='mx-2'
                            />
                          )}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => remove(index)}
                          className='h-8 w-8'
                          disabled={fields.length <= 2}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                      {showErrors && errors.questionOptions?.[index]?.content && (
                        <p className='text-sm text-red-500'>{errors.questionOptions[index].content.message}</p>
                      )}
                    </div>
                  ))}
                </div>
                {showErrors && errors.questionOptions && 'root' in errors.questionOptions && (
                  <p className='text-sm text-red-500'>{errors.questionOptions.root?.message}</p>
                )}
                <Button
                  type='button'
                  onClick={() => append({ content: '', isCorrect: false })}
                  variant='outline'
                  className='w-full mt-2'
                >
                  <Plus className='h-4 w-4 mr-2 mt-1' />
                  Add Answer Option
                </Button>
              </div>
            )}

            {watchQuestionType === 'TrueFalse' && (
              <div className='space-y-2'>
                <Label>Correct Answer</Label>
                <Controller
                  name='questionOptions'
                  control={control}
                  defaultValue={[
                    { content: 'True', isCorrect: true },
                    { content: 'False', isCorrect: false }
                  ]}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) =>
                        field.onChange([
                          { content: 'True', isCorrect: value === 'True' },
                          { content: 'False', isCorrect: value === 'False' }
                        ])
                      }
                      defaultValue='True'
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select correct answer' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='True'>True</SelectItem>
                        <SelectItem value='False'>False</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
            {/* {watchQuestionType === 'CodeSnippet' && (
              <Button type='button' variant='outline' className='w-full'>
                Create Problem Code Question
              </Button>
            )} */}
          </form>
        </ScrollArea>

        <DialogFooter className='px-6 py-4 border-t'>
          <div className='flex justify-end space-x-2 w-full'>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowErrors(true)
                handleSubmit(onSubmit)()
              }}
            >
              Add Question
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
