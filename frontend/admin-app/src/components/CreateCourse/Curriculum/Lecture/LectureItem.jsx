import React, { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createFile } from '@/services/api/fileApi'
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
import { useForm, Controller, FormProvider, set } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { createQuiz, deleteQuiz } from '@/services/api/quizApi'
import { getLectureDetails, deleteLecture, deleteFileFromLecture } from '@/services/api/lectureApi'
import { getVideoDuration } from '@/lib/utils'
import { GripVertical, Loader2 } from 'lucide-react'
import QuizCreationForm from './QuizCreationForm'
import { FileQuestion, PencilIcon, TrashIcon, PlusIcon } from 'lucide-react'
import { deleteProblem } from '@/services/api/problemApi'
import EditLectureDialog from './EditLectureDialog'
import { CREATE_QUESTION_PATH, CREATE_PROBLEM_LECTURE_PATH, UPDATE_PROBLEM_LECTURE_PATH } from '@/routers/router'

export default function LectureItem({
  chapterId,
  lecture,
  onUpdateLecture,
  onDeleteLecture,
  setIsUpdateLecture,
  isUpdateLecture,

  courseId,
  dragHandleProps,
  lectureIndex
}) {
  const [isRunning1, setIsRunning1] = useState(false)
  const [isRunning2, setIsRunning2] = useState(false)
  const navigate = useNavigate()
  const [isUpdate, setIsUpdate] = useState(false)
  const [lectureFiles, setLectureFiles] = useState(null)
  const [codeProblem, setCodeProblem] = useState(null)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false)
  const [createdQuiz, setCreatedQuiz] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()
  const methods = useForm({
    defaultValues: {
      title: '',
      description: '',
      passingMark: 0,
      hasTimeLimit: false,
      attemptLimit: 0,
      hasAttemptLimit: false,
      isActive: true,
      isRandomized: false,
      quizType: 'PRACTICE'
    }
  })

  const handleEdit = () => {
    setIsEditDialogOpen(true)
  }

  useEffect(() => {
    const fetchLectureDetails = async () => {
      try {
        const response = await getLectureDetails(lecture.id)
        setCreatedQuiz(response.lectureDetailsDto.quiz)
        setLectureFiles(response.lectureDetailsDto.files)
        setCodeProblem(response.lectureDetailsDto.problem)
      } catch (error) {}
    }
    fetchLectureDetails()
  }, [lecture.id, isUpdate])

  useEffect(() => {
    const restoreScroll = () => {
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
    }

    if (!isQuizFormOpen && !isEditDialogOpen) {
      restoreScroll()
    }

    return () => {
      restoreScroll()
    }
  }, [isQuizFormOpen, isEditDialogOpen])
  const { control, handleSubmit } = methods

  const handleFileUpload = async (lectureId, file, fileType) => {
    try {
      setIsRunning1(true)
      // Prepare the file data for the API
      const fileData = new FormData()
      fileData.append('file', file)
      fileData.append('fileType', fileType)
      // Call the API to upload the file
      const uploadedFile = await createFile(fileData, lectureId)
      toast({
        title: 'File uploaded',
        description: 'The file has been successfully uploaded.',
        duration: 1500
      })
      setIsUpdate(!isUpdate)

      // Show a success message
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the file.',
        duration: 1500
      })
    } finally {
      setIsRunning1(false)
    }
  }

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setIsRunning2(true)
      const videoDuration = await getVideoDuration(file)
      const fileData = new FormData()
      fileData.append('file', file)
      fileData.append('fileType', 'VIDEO')
      fileData.append('duration', videoDuration)
      const uploadedFile = await createFile(fileData, lecture.id)
      toast({
        title: 'Video uploaded',
        description: 'The video has been successfully uploaded.',
        duration: 1500
      })
      setIsUpdate(!isUpdate)
      event.target.value = null
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the video.',
        duration: 1500
      })
    } finally {
      setIsRunning2(false)
    }
  }
  const handleEditCodeProblem = (problem) => {
    navigate({ to: UPDATE_PROBLEM_LECTURE_PATH, params: { courseId, lectureId: lecture.id, problemId: problem.id } })
  }
  const handleDeleteCodeProblem = async (problemId) => {
    try {
      const response = await deleteProblem(problemId)
      setIsUpdate(!isUpdate)
      toast({
        title: 'Problem deleted',
        description: 'The problem has been successfully deleted.',
        duration: 1500
      })
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the problem.',
        duration: 1500
      })
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current.click()
  }

  const triggerVideoUpload = () => {
    videoInputRef.current.click()
  }
  const handleCreateCodeProblem = () => {
    navigate({
      to: CREATE_PROBLEM_LECTURE_PATH,
      params: { courseId, lectureId: lecture.id }
    })
  }

  const handleQuizFormOpen = () => {
    setIsQuizFormOpen(true)
  }

  const handleQuizFormClose = () => {
    setIsQuizFormOpen(false)
  }
  const handleVideoRemove = async (fileId) => {
    try {
      const response = await deleteFileFromLecture(fileId, lecture.id)
      setIsUpdate(!isUpdate)
      toast({
        title: 'File deleted',
        description: 'The file has been successfully deleted.',
        duration: 1500
      })
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the file.',
        duration: 1500
      })
    }
  }

  const handleFileRemove = async (fileId) => {
    try {
      const response = await deleteFileFromLecture(fileId, lecture.id)
      setIsUpdate(!isUpdate)
      toast({
        title: 'File deleted',
        description: 'The file has been successfully deleted.',
        duration: 1500
      })
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the file.',
        duration: 1500
      })
    }
  }

  const onSubmit = async (data) => {
    const quizCreate = {
      createQuizDto: {
        ...data
      }
    }
    try {
      const response = await createQuiz(quizCreate, lecture.id)
      toast({
        title: 'Quiz created successfully',
        description: 'Quiz created successfully',
        duration: 1500
      })
      setIsUpdate(!isUpdate)
      setIsQuizFormOpen(false)
      // Optionally, navigate to another page or show a success message
    } catch (error) {
      toast({
        title: 'Quiz creation failed',
        description: 'There was an error creating the quiz.',
        duration: 1500
      })
      // Optionally, show an error message to the user
    }
    handleQuizFormClose()
  }

  const handleEditQuiz = (quizId) => {
    // Implement edit functionality
    navigate({ to: CREATE_QUESTION_PATH, params: { quizId } })
  }

  const handleDeleteQuiz = async (quizId) => {
    try {
      const response = await deleteQuiz(quizId)
      setIsUpdate(!isUpdate)
      toast({
        title: 'Quiz deleted',
        description: 'The quiz has been successfully deleted.',
        duration: 1500
      })
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the quiz.',
        duration: 1500
      })
    }
  }

  const handleDelete = async () => {
    await onDeleteLecture(chapterId, lecture.id)
  }

  const handleSave = async (updatedLecture) => {
    await onUpdateLecture(chapterId, lecture.id, updatedLecture)
    setIsEditDialogOpen(false)
  }
  return (
    <div className='flex flex-col p-4 mt-4 rounded-md shadow-sm bg-gray-50'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <div {...dragHandleProps}>
            <GripVertical className='w-4 h-4 text-gray-400 cursor-grab' />
          </div>
          <span className='text-lg font-medium'>
            Lecture {lecture.order || lectureIndex + 1}: {lecture.title}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='ghost' size='sm' onClick={handleEdit}>
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
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <span className='px-2 py-1 text-sm bg-gray-200 rounded'>{lecture.lectureType}</span>
          <span className='px-2 py-1 text-sm bg-gray-200 rounded'>
            {lecture.point} {lecture.point <= 1 ? 'point' : 'points'}
          </span>
          <span
            className={`text-sm px-2 py-1 rounded ${
              lecture.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {lecture.isFree ? 'Free' : 'Paid'}
          </span>
        </div>
      </div>
      <EditLectureDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        lecture={lecture}
        onSave={handleSave}
        chapterId={chapterId}
      />
      {lecture.lectureType === 'Lesson' && (
        <div className='space-y-4'>
          <div className='flex gap-2 mb-4'>
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              onChange={(event) => handleFileUpload(lecture.id, event.target.files[0], 'DOCUMENT')}
              accept='.pdf,.doc,.docx,.txt'
              multiple
            />
            <Button onClick={triggerFileUpload} size='sm'>
              {isRunning1 ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <FileIcon className='w-4 h-4 mr-2' /> Upload Files
                </>
              )}
            </Button>

            <input
              type='file'
              ref={videoInputRef}
              className='hidden'
              onChange={handleVideoUpload}
              accept='video/*'
              multiple
            />
            <Button
              onClick={triggerVideoUpload}
              size='sm'
              disabled={lectureFiles && lectureFiles.some((file) => file.fileType === 'VIDEO')}
            >
              {isRunning2 ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <VideoIcon className='w-4 h-4 mr-2' /> Upload Video
                </>
              )}
            </Button>
          </div>

          <div className='grid grid-cols-1 gap-2'>
            {/* Files section */}
            {lectureFiles && lectureFiles.some((file) => file.fileType === 'DOCUMENT') && (
              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Uploaded Files</h4>
                {lectureFiles.map(
                  (file) =>
                    file.fileType === 'DOCUMENT' && (
                      <div key={file.fileId} className='flex items-center p-2 bg-white rounded-md'>
                        <FileIcon className='w-4 h-4 mr-2 text-blue-500' />
                        <span className='flex-grow text-sm truncate'>{file.fileName}</span>
                        <Button
                          onClick={() => handleFileRemove(file.fileId)}
                          size='sm'
                          variant='ghost'
                          className='ml-2'
                        >
                          <Cross2Icon className='w-4 h-4 text-red-500' />
                          <span className='sr-only'>Remove file</span>
                        </Button>
                      </div>
                    )
                )}
              </div>
            )}

            {/* Videos section */}
            {lectureFiles && lectureFiles.some((file) => file.fileType === 'VIDEO') && (
              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Uploaded Videos</h4>
                {lectureFiles.map(
                  (file) =>
                    file.fileType === 'VIDEO' && (
                      <div key={file.fileId} className='flex items-center p-2 bg-white rounded-md'>
                        <VideoIcon className='w-4 h-4 mr-2 text-blue-500' />
                        <span className='flex-grow text-sm truncate'>{file.fileName}</span>
                        <Button
                          onClick={() => handleVideoRemove(file.fileId)}
                          size='sm'
                          variant='ghost'
                          className='ml-2'
                        >
                          <Cross2Icon className='w-4 h-4 text-red-500' />
                          <span className='sr-only'>Remove video</span>
                        </Button>
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {lecture.lectureType === 'Practice' && (
        <div className='space-y-4'>
          <div className='flex gap-2 mb-4'>
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              onChange={(event) => handleFileUpload(lecture.id, event.target.files[0], 'DOCUMENT')}
              accept='.pdf,.doc,.docx,.txt'
              multiple
            />
            <Button onClick={triggerFileUpload} size='sm'>
              {isRunning1 ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <FileIcon className='w-4 h-4 mr-2' /> Upload Files
                </>
              )}
            </Button>

            <input
              type='file'
              ref={videoInputRef}
              className='hidden'
              onChange={handleVideoUpload}
              accept='video/*'
              multiple
            />
            <Button
              onClick={triggerVideoUpload}
              size='sm'
              disabled={lectureFiles && lectureFiles.some((file) => file.fileType === 'VIDEO')}
            >
              {isRunning2 ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <VideoIcon className='w-4 h-4 mr-2' /> Upload Video
                </>
              )}
            </Button>

            <Button onClick={handleCreateCodeProblem} size='sm' disabled={codeProblem}>
              <CodeIcon className='w-4 h-4 mr-2' /> Create Code Problem
            </Button>
          </div>

          <div className='grid grid-cols-1 gap-2'>
            {/* Files section */}
            {lectureFiles && lectureFiles.some((file) => file.fileType === 'DOCUMENT') && (
              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Uploaded Files</h4>
                {lectureFiles.map(
                  (file) =>
                    file.fileType === 'DOCUMENT' && (
                      <div key={file.fileId} className='flex items-center p-2 bg-white rounded-md'>
                        <FileIcon className='w-4 h-4 mr-2 text-blue-500' />
                        <span className='flex-grow text-sm truncate'>{file.fileName}</span>
                        <Button
                          onClick={() => handleFileRemove(file.fileId)}
                          size='sm'
                          variant='ghost'
                          className='ml-2'
                        >
                          <Cross2Icon className='w-4 h-4 text-red-500' />
                          <span className='sr-only'>Remove file</span>
                        </Button>
                      </div>
                    )
                )}
              </div>
            )}

            {/* Videos section */}
            {lectureFiles && lectureFiles.some((file) => file.fileType === 'VIDEO') && (
              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Uploaded Videos</h4>
                {lectureFiles.map(
                  (file) =>
                    file.fileType === 'VIDEO' && (
                      <div key={file.fileId} className='flex items-center p-2 bg-white rounded-md'>
                        <VideoIcon className='w-4 h-4 mr-2 text-blue-500' />
                        <span className='flex-grow text-sm truncate'>{file.fileName}</span>
                        <Button
                          onClick={() => handleVideoRemove(file.fileId)}
                          size='sm'
                          variant='ghost'
                          className='ml-2'
                        >
                          <Cross2Icon className='w-4 h-4 text-red-500' />
                          <span className='sr-only'>Remove video</span>
                        </Button>
                      </div>
                    )
                )}
              </div>
            )}

            {/* Code Problem section */}
            {codeProblem && (
              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Code Problem</h4>
                <div className='flex items-center p-2 bg-white rounded-md'>
                  <CodeIcon className='w-4 h-4 mr-2 text-blue-500' />
                  <span className='flex-grow text-sm truncate'>{codeProblem.title}</span>
                  <Button onClick={() => handleEditCodeProblem(codeProblem)} size='sm' variant='ghost' className='ml-2'>
                    <PencilIcon className='w-4 h-4 text-blue-500' />
                    <span className='sr-only'>Edit problem</span>
                  </Button>
                  <Button
                    onClick={() => handleDeleteCodeProblem(codeProblem.id)}
                    size='sm'
                    variant='ghost'
                    className='ml-2'
                  >
                    <TrashIcon className='w-4 h-4 text-red-500' />
                    <span className='sr-only'>Delete problem</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {lecture.lectureType === 'Quiz' && (
        <div className='space-y-4'>
          <div className='flex gap-2 mb-4'>
            <Button onClick={handleQuizFormOpen} size='sm' disabled={createdQuiz}>
              <QuestionMarkCircledIcon className='w-4 h-4 mr-2' /> Create Quiz
            </Button>
          </div>

          {createdQuiz && (
            <div key={createdQuiz.id} className='flex items-center p-2 mt-2 bg-white rounded-md'>
              <FileQuestion className='w-4 h-4 mr-2 text-blue-500' />
              <span className='flex-grow text-sm truncate'>{createdQuiz.title}</span>
              <Button onClick={() => handleEditQuiz(createdQuiz.id)} size='sm' variant='outline' className='ml-2'>
                <PlusIcon className='w-4 h-4 mr-2' />
              </Button>
              <Button onClick={() => handleDeleteQuiz(createdQuiz.id)} size='sm' variant='destructive' className='ml-2'>
                <TrashIcon className='w-4 h-4 mr-2' />
              </Button>
            </div>
          )}
        </div>
      )}
      <QuizCreationForm isOpen={isQuizFormOpen} onOpenChange={setIsQuizFormOpen} onSubmit={onSubmit} />
    </div>
  )
}
