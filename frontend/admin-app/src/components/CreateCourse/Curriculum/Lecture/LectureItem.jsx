import React, { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createFile } from '@/services/api/fileApi';
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
import { getLectureDetails } from '@/services/api/lectureApi'
import { deleteFileFromLecture } from '@/services/api/lectureApi'
import { getVideoDuration } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import QuizCreationForm from './QuizCreationForm'
import { FileQuestion } from 'lucide-react'

export default function LectureItem({
  lecture,
  onEdit,
  onDelete,
  onFileUpload,
  onVideoUpload,
  onFileRemove,
  onVideoRemove,
  courseId
}) {
  const [isRunning1, setIsRunning1] = useState(false)
  const [isRunning2, setIsRunning2] = useState(false)
  const navigate = useNavigate()
  const [isUpdate, setIsUpdate] = useState(false)
  const [lectureFiles, setLectureFiles] = useState(null)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false)
  const [createdQuiz, setCreatedQuiz] = useState(null);
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
    const fetchLectureDetails = async () => {
      try {
        const response = await getLectureDetails(lecture.id)
        setCreatedQuiz(response.lectureDetailsDto.quiz)
        setLectureFiles(response.lectureDetailsDto.files)
        console.log(response.lectureDetailsDto.files)
      } catch (error) {
        console.error('Error getting lecture details:', error)
      }
    }
    fetchLectureDetails()
  }, [lecture.id,isUpdate])


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
  const handleFileUpload = async (lectureId,file,fileType ) => {
    try {
      setIsRunning1(true)
      // Prepare the file data for the API
      const fileData = new FormData();
      fileData.append('file', file);
      fileData.append('fileType', fileType); 
      console.log(fileData)
      // Call the API to upload the file
      const uploadedFile = await createFile(fileData, lectureId);
      toast({
        title: 'File uploaded',
        description: 'The file has been successfully uploaded.',
        duration: 1500,
      });
      setIsUpdate(!isUpdate)
  
      // Show a success message
      
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the file.',
        duration: 1500,
      });
    }
    finally{
      setIsRunning1(false)
    }
  };

  const handleVideoUpload = async (event) => {
    
    const file = event.target.files[0];
    if (!file) return;

    try{
      setIsRunning2(true)
      const videoDuration = await getVideoDuration(file);
      const fileData = new FormData();
      fileData.append('file', file);
      fileData.append('fileType', 'VIDEO'); 
      fileData.append('duration', videoDuration);
      console.log(fileData)
      const uploadedFile = await createFile(fileData, lecture.id);
      toast({
        title: 'Video uploaded',
        description: 'The video has been successfully uploaded.',
        duration: 1500,
      });
      setIsUpdate(!isUpdate)
      event.target.value = null;
    }catch(error){
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the video.',
        duration: 1500,
      });
      console.error('Failed to upload video:', error);
    }
    finally{
      setIsRunning2(false)
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click()
  }

  const triggerVideoUpload = () => {
    videoInputRef.current.click()
  }
  const handleCreateCodeProblem = () => {
    navigate({
      to: `/edit-course/${courseId}/create-problem-lecture/${lecture.id}`
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
      console.log(response)
      toast({
        title: 'File deleted',
        description: 'The file has been successfully deleted.',
        duration: 1500,
      })

    } catch (error) {
      console.error('Error deleting file:', error)
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the file.',
        duration: 1500,
      })
    }
  }

  const handleFileRemove = async (fileId) => {
    try {
      const response = await deleteFileFromLecture(fileId, lecture.id)
      setIsUpdate(!isUpdate)
      console.log(response)
      toast({
        title: 'File deleted',
        description: 'The file has been successfully deleted.',
        duration: 1500,
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the file.',
        duration: 1500,
      })
    }
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
        duration: 1500,
      })
      setIsUpdate(!isUpdate)
      setIsQuizFormOpen(false)
      // Optionally, navigate to another page or show a success message
    } catch (error) {
      toast({
        title: 'Quiz creation failed',
        description: 'There was an error creating the quiz.',
        duration: 1500,
      })
      console.error('Error creating quiz:', error)
      // Optionally, show an error message to the user
    }
    console.log(data)
    handleQuizFormClose()
  }

  const handleEditQuiz = (quizId) => {
    // Implement edit functionality
    navigate({ to: `/create-question/${quizId}` })
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const response = await deleteQuiz(quizId)
      setIsUpdate(!isUpdate)
      toast({
        title: 'Quiz deleted',
        description: 'The quiz has been successfully deleted.',
        duration: 1500,
      })
    } catch (error) {
      console.error('Error deleting quiz:', error)
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the quiz.',
        duration: 1500,
      })
    }
  };
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
              onChange={(event) => handleFileUpload(lecture.id, event.target.files[0], 'DOCUMENT')}
              accept='.pdf,.doc,.docx,.txt'
              multiple
            />
            <Button onClick={triggerFileUpload} size='sm' className='w-full sm:w-auto'>
              
              {isRunning1 ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Uploading...
                      </>
                    )
                    :(<><FileIcon className='w-4 h-4 mr-2' /> Upload Files</>)}
            </Button>
            {lectureFiles &&
              lectureFiles.map((file, index) => (
                file.fileType === 'DOCUMENT' && (
                  <div key={file.fileId} className='flex items-center p-2 mt-2 bg-white rounded-md'>
                  <FileIcon className='w-4 h-4 mr-2 text-blue-500' />
                  <span className='flex-grow text-sm truncate'>{file.fileName}</span>
                  <Button onClick={() => handleFileRemove(file.fileId,)} size='sm' variant='ghost' className='ml-2'>
                    <Cross2Icon className='w-4 h-4 text-red-500' />
                    <span className='sr-only'>Remove file</span>
                  </Button>
                </div>
                )
              ))}
          </div>
          <div>
            <input type='file' ref={videoInputRef} className='hidden' onChange={handleVideoUpload} accept='video/*' multiple/>
            <Button onClick={triggerVideoUpload} size='sm' className='w-full sm:w-auto' disabled={lectureFiles && lectureFiles.some(file => file.fileType === 'VIDEO')}>
             
              {isRunning2 ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Uploading...
                      </>
                    )
                    :(<> <VideoIcon className='w-4 h-4 mr-2' /> Upload Video</>)}
            </Button>
            {lectureFiles && 
              lectureFiles.map((file, index) => ( 
                file.fileType === 'VIDEO' && (
                  <div key={index} className='flex items-center p-2 mt-2 bg-white rounded-md'>
                <VideoIcon className='w-4 h-4 mr-2 text-blue-500' />
                <span className='flex-grow text-sm truncate'>{file.fileName}</span>
                <Button onClick={() => handleVideoRemove(file.fileId)} size='sm' variant='ghost' className='ml-2'>
                  <Cross2Icon className='w-4 h-4 text-red-500' />
                  <span className='sr-only'>Remove video</span>
                </Button>
              </div>
                )
            ))}
          </div>

        </div>
      )}
      {lecture.lectureType === 'Practice' && (
        <div className='space-y-4'>
        <div>
          <input
            type='file'
            ref={fileInputRef}
            className='hidden'
            onChange={(event) => handleFileUpload(lecture.id, event.target.files[0], 'DOCUMENT')}
            accept='.pdf,.doc,.docx,.txt'
            multiple
          />
          <Button onClick={triggerFileUpload} size='sm' className='w-full sm:w-auto'>
            
            {isRunning1 ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Uploading...
                    </>
                  )
                  :(<><FileIcon className='w-4 h-4 mr-2' /> Upload Files</>)}
          </Button>
          {lectureFiles &&
            lectureFiles.map((file, index) => (
              file.fileType === 'DOCUMENT' && (
                <div key={file.fileName} className='flex items-center p-2 mt-2 bg-white rounded-md'>
                <FileIcon className='w-4 h-4 mr-2 text-blue-500' />
                <span className='flex-grow text-sm truncate'>{file.fileName}</span>
                <Button onClick={() => handleFileRemove(file.fileId,)} size='sm' variant='ghost' className='ml-2'>
                  <Cross2Icon className='w-4 h-4 text-red-500' />
                  <span className='sr-only'>Remove file</span>
                </Button>
              </div>
              )
            ))}
        </div>
        <div>
          <input type='file' ref={videoInputRef} className='hidden' onChange={handleVideoUpload} accept='video/*' multiple/>
          <Button onClick={triggerVideoUpload} size='sm' className='w-full sm:w-auto' disabled={lectureFiles && lectureFiles.some(file => file.fileType === 'VIDEO')}>
           
            {isRunning2 ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Uploading...
                    </>
                  )
                  :(<> <VideoIcon className='w-4 h-4 mr-2' /> Upload Video</>)}
          </Button>
          {lectureFiles && 
            lectureFiles.map((file, index) => ( 
              file.fileType === 'VIDEO' && (
                <div className='flex items-center p-2 mt-2 bg-white rounded-md'>
              <VideoIcon className='w-4 h-4 mr-2 text-blue-500' />
              <span className='flex-grow text-sm truncate'>{file.fileName}</span>
              <Button onClick={() => handleVideoRemove(file.fileId)} size='sm' variant='ghost' className='ml-2'>
                <Cross2Icon className='w-4 h-4 text-red-500' />
                <span className='sr-only'>Remove video</span>
              </Button>
            </div>
              )
          ))}
        </div>
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
          {createdQuiz && (
            <div key={createdQuiz.id} className='flex items-center p-2 mt-2 bg-white rounded-md'>
            <FileQuestion className='w-4 h-4 mr-2 text-blue-500' />
            <span className='flex-grow text-sm truncate'>{createdQuiz.title}</span>
            <Button onClick={() => handleEditQuiz(createdQuiz.id)} size="sm" variant="outline" className='ml-2' >
                    <Pencil1Icon className="w-4 h-4 mr-2" /> 
                  </Button>
                  <Button onClick={() => handleDeleteQuiz(createdQuiz.id)} size="sm" variant="destructive" className='ml-2'>
                    <Cross2Icon className="w-4 h-4 mr-2" /> 
                  </Button>
            </div>
            
          )}
        </div>
      )}
      <QuizCreationForm
        isOpen={isQuizFormOpen}
        onOpenChange={setIsQuizFormOpen}
        onSubmit={onSubmit}
      />
    </div>
  )
}