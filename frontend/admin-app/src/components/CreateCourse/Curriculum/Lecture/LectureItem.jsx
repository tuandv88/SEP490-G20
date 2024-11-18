import React, { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Pencil1Icon, Cross2Icon, FileIcon, VideoIcon, CodeIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import { useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import MarkdownFormField from '@/components/markdown-form-field'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { createQuiz } from '@/services/api/quizApi'

export default function LectureItem({
  lecture,
  onEdit,
  onDelete,
  onFileUpload,
  onVideoUpload,
  onFileRemove,
  onVideoRemove
}) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false)
  const { toast } = useToast()
  const methods = useForm({
    defaultValues: {
      title: '',
      description: '',
      passingMark: 0,
      timeLimit: 0,
      hasTimeLimit: false,
      attemptLimit: 0,
      hasAttemptLimit: false,
      isActive: true,
      isRandomized: false,
      quizType: 'PRACTICE'
    }
  })

  useEffect(() => {
    const restoreScroll = () => {
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
    }

    if (!isQuizFormOpen) {
      restoreScroll()
    }

    return () => {
      restoreScroll()
    }
  }, [isQuizFormOpen])
  const { control, handleSubmit } = methods

  const handleFileUpload = (event) => {
    const files = event.target.files
    for (let i = 0; i < files.length; i++) {
      onFileUpload(files[i])
    }
  }

  const handleVideoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      onVideoUpload(file)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current.click()
  }

  const triggerVideoUpload = () => {
    videoInputRef.current.click()
  }
  const handleCreateCodeProblem = () => {
    navigate({ to: '/create-code-problem' })
  }

  const handleQuizFormOpen = () => {
    setIsQuizFormOpen(true)
  }

  const handleQuizFormClose = () => {
    setIsQuizFormOpen(false)
  }



  const onSubmit = async (data) => {
    const quizCreate = { 
      createQuizDto: {
        ...data,
      }
    }
    try {
      const response = await createQuiz(quizCreate, lecture.id)
      toast({
        title: 'Quiz created successfully',
        description: 'Quiz created successfully',
      })
      setIsQuizFormOpen(false)
      // Optionally, navigate to another page or show a success message
    } catch (error) {
      console.error('Error creating quiz:', error)
      // Optionally, show an error message to the user
    }
    console.log(data)
    handleQuizFormClose()
  }
  return (
    <div className='flex flex-col p-4 mt-4 rounded-md shadow-sm bg-gray-50'>
      <div className='flex items-center justify-between mb-4'>
        <span className='text-lg font-medium'>{lecture.title}</span>
        <div className='flex items-center space-x-2'>
          <Button variant='ghost' size='sm' onClick={() => onEdit(lecture)}>
            <Pencil1Icon className='w-4 h-4' />
            <span className='sr-only'>Edit lecture</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size='sm'>
                <Cross2Icon className='w-4 h-4' />
                <span className='sr-only'>Delete lecture</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this lecture?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the lecture.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <span className='px-2 py-1 text-sm bg-gray-200 rounded'>{lecture.lectureType}</span>
          <span className='px-2 py-1 text-sm bg-gray-200 rounded'>{lecture.point} points</span>
          <span
            className={`text-sm px-2 py-1 rounded ${
              lecture.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {lecture.isFree ? 'Free' : 'Paid'}
          </span>
        </div>
      </div>
      {lecture.lectureType === 'Lesson' && (
        <div className='space-y-4'>
          <div>
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              onChange={handleFileUpload}
              accept='.pdf,.doc,.docx,.txt'
              multiple
            />
            <Button onClick={triggerFileUpload} size='sm' className='w-full sm:w-auto'>
              <FileIcon className='w-4 h-4 mr-2' /> Upload Files
            </Button>
            {lecture.files &&
              lecture.files.map((file, index) => (
                <div key={index} className='flex items-center p-2 mt-2 bg-white rounded-md'>
                  <FileIcon className='w-4 h-4 mr-2 text-blue-500' />
                  <span className='flex-grow text-sm truncate'>{file.name}</span>
                  <Button onClick={() => onFileRemove(index)} size='sm' variant='ghost' className='ml-2'>
                    <Cross2Icon className='w-4 h-4 text-red-500' />
                    <span className='sr-only'>Remove file</span>
                  </Button>
                </div>
              ))}
          </div>
          <div>
            <input type='file' ref={videoInputRef} className='hidden' onChange={handleVideoUpload} accept='video/*' />
            <Button onClick={triggerVideoUpload} size='sm' className='w-full sm:w-auto' disabled={lecture.video}>
              <VideoIcon className='w-4 h-4 mr-2' /> {lecture.video ? 'Change Video' : 'Upload Video'}
            </Button>
            {lecture.video && (
              <div className='flex items-center p-2 mt-2 bg-white rounded-md'>
                <VideoIcon className='w-4 h-4 mr-2 text-blue-500' />
                <span className='flex-grow text-sm truncate'>{lecture.video.name}</span>
                <Button onClick={onVideoRemove} size='sm' variant='ghost' className='ml-2'>
                  <Cross2Icon className='w-4 h-4 text-red-500' />
                  <span className='sr-only'>Remove video</span>
                </Button>
              </div>
            )}
          </div>
          <Button onClick={handleCreateCodeProblem} size='sm' className='w-full sm:w-auto'>
            <CodeIcon className='w-4 h-4 mr-2' /> Create Code Problem
          </Button>
        </div>
      )}
      {lecture.lectureType === 'Practice' && (
        <div className='mt-2'>
          <Button onClick={handleCreateCodeProblem} size='sm' className='w-full sm:w-auto'>
            <CodeIcon className='w-4 h-4 mr-2' /> Create Code Problem
          </Button>
        </div>
      )}
       {lecture.lectureType === 'Quiz' && (
        <div className='mt-2'>
          <Button onClick={handleQuizFormOpen} size='sm' className='w-full sm:w-auto'>
            <QuestionMarkCircledIcon className='w-4 h-4 mr-2' /> Create Quiz
          </Button>
        </div>
      )}
      <Dialog open={isQuizFormOpen} onOpenChange={setIsQuizFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Quiz</DialogTitle>
            <DialogDescription>Fill in the details to create a new quiz.</DialogDescription>
          </DialogHeader>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-4 py-4'>
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label htmlFor="title" className="text-right col-span-2">
                    Title
                  </Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id="title" className="col-span-4" />
                    )}
                  />
                </div>
                <div className='grid grid-cols-6 items-start gap-4'>
                  <Label htmlFor='description' className='text-right col-span-2 pt-2'>
                    Description
                  </Label>
                  <div className="col-span-4">
                    <MarkdownFormField
                      name="description"
                      label=""
                      placeholder="Enter quiz description"
                    />
                  </div>
                </div>
                <div className='grid grid-cols-6 items-center gap-4'>
                  <Label htmlFor='passingMark' className='text-right col-span-2'>
                    Passing Mark
                  </Label>
                  <Controller
                    name="passingMark"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id="passingMark" type="number" className="col-span-4" />
                    )}
                  />
                </div>
                <div className='grid grid-cols-6 items-center gap-4'>
                  <Label htmlFor='timeLimit' className='text-right col-span-2'>
                    Time Limit (minutes)
                  </Label>
                  <Controller
                    name="timeLimit"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id="timeLimit" type="number" className="col-span-4" />
                    )}
                  />
                </div>
                <div className='grid grid-cols-6 items-center gap-4'>
                  <Label htmlFor='hasTimeLimit' className='text-right col-span-2'>
                    Has Time Limit
                  </Label>
                  <Controller
                    name="hasTimeLimit"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id='hasTimeLimit'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className='grid grid-cols-6 items-center gap-4'>
                  <Label htmlFor='attemptLimit' className='text-right col-span-2'>
                    Attempt Limit
                  </Label>
                  <Controller
                    name="attemptLimit"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id="attemptLimit" type="number" className="col-span-4" />
                    )}
                  />
                </div>
                <div className='grid grid-cols-6 items-center gap-4'>
                  <Label htmlFor='hasAttemptLimit' className='text-right col-span-2'>
                    Has Attempt Limit
                  </Label>
                  <Controller
                    name="hasAttemptLimit"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id='hasAttemptLimit'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className='grid grid-cols-6 items-center gap-4'>
                  <Label htmlFor='isActive' className='text-right col-span-2'>
                    Is Active
                  </Label>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id='isActive'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className='grid grid-cols-6 items-center gap-4'>
                  <Label htmlFor='isRandomized' className='text-right col-span-2'>
                    Is Randomized
                  </Label>
                  <Controller
                    name="isRandomized"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id='isRandomized'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className='grid grid-cols-6 items-center gap-4'>
                  <Label htmlFor='quizType' className='text-right col-span-2'>
                    Quiz Type
                  </Label>
                  <Controller
                    name="quizType"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className='col-span-4'>
                          <SelectValue placeholder='Select quiz type' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='PRACTICE'>Practice</SelectItem>
                          <SelectItem value='ASSESSMENT'>Assessment</SelectItem>
                          <SelectItem value='FINAL'>Final</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type='button' variant='secondary'>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type='submit'>Create Quiz</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  )
}