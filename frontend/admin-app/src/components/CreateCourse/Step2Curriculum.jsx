import React, { useState, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  PlusIcon,
  Pencil1Icon,
  Cross2Icon,
  FileIcon,
  VideoIcon,
  CodeIcon,
  QuestionMarkCircledIcon
} from '@radix-ui/react-icons'
import ChapterForm from './ChapterForm'
import LectureForm from './LectureForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Step2Curriculum({ onSubmit, initialData }) {
  const [curriculum, setCurriculum] = useState(initialData || [])
  const [editingChapter, setEditingChapter] = useState(null)
  const [editingLecture, setEditingLecture] = useState(null)
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false)
  const [editingChapterIndex, setEditingChapterIndex] = useState(null)
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false)
  const [addingLectureToChapter, setAddingLectureToChapter] = useState(null)
  const { toast } = useToast()
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const addChapter = (newChapter) => {
    const chapterNumber = curriculum.length + 1
    setCurriculum([
      ...curriculum,
      { ...newChapter, title: `Chapter ${chapterNumber}: ${newChapter.title}`, lectures: [] }
    ])
    setIsAddChapterOpen(false)
  }

  const saveChapter = (chapter, index) => {
    const newCurriculum = [...curriculum]
    newCurriculum[index] = { ...newCurriculum[index], ...chapter }
    setCurriculum(newCurriculum)
  }

  const deleteChapter = (index) => {
    const newCurriculum = curriculum.filter((_, i) => i !== index)
    setCurriculum(newCurriculum)
    toast({
      title: 'Chapter deleted',
      description: 'The chapter has been successfully removed.'
    })
  }

  const addLecture = (chapterIndex, newLecture) => {
    const newCurriculum = [...curriculum]
    const lectureNumber = newCurriculum[chapterIndex].lectures.length + 1
    newCurriculum[chapterIndex].lectures.push({
      ...newLecture,
      title: `Lecture ${lectureNumber}: ${newLecture.title}`
    })
    setCurriculum(newCurriculum)
    setIsAddLectureOpen(false)
  }

  const saveLecture = (lecture, chapterIndex, lectureIndex = -1) => {
    const newCurriculum = [...curriculum]
    if (lectureIndex === -1) {
      newCurriculum[chapterIndex].lectures.push(lecture)
    } else {
      newCurriculum[chapterIndex].lectures[lectureIndex] = lecture
    }
    setCurriculum(newCurriculum)
    setEditingLecture(null)
  }

  const deleteLecture = (chapterIndex, lectureIndex) => {
    const newCurriculum = [...curriculum]
    newCurriculum[chapterIndex].lectures = newCurriculum[chapterIndex].lectures.filter((_, i) => i !== lectureIndex)
    setCurriculum(newCurriculum)
    toast({
      title: 'Lecture deleted',
      description: 'The lecture has been successfully removed.'
    })
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const newCurriculum = Array.from(curriculum)
    const [reorderedItem] = newCurriculum.splice(result.source.index, 1)
    newCurriculum.splice(result.destination.index, 0, reorderedItem)

    setCurriculum(newCurriculum)
  }

  const handleFileUpload = (chapterIndex, lectureIndex) => {
    fileInputRef.current.click()
    fileInputRef.current.onchange = (event) => {
      const file = event.target.files[0]
      if (file) {
        const newCurriculum = [...curriculum]
        newCurriculum[chapterIndex].lectures[lectureIndex].file = file
        setCurriculum(newCurriculum)
        toast({
          title: 'File uploaded',
          description: `File "${file.name}" has been uploaded.`
        })
      }
    }
  }

  const handleVideoUpload = (chapterIndex, lectureIndex) => {
    videoInputRef.current.click()
    videoInputRef.current.onchange = (event) => {
      const file = event.target.files[0]
      if (file) {
        const newCurriculum = [...curriculum]
        newCurriculum[chapterIndex].lectures[lectureIndex].video = file
        setCurriculum(newCurriculum)
        toast({
          title: 'Video uploaded',
          description: `Video "${file.name}" has been uploaded.`
        })
      }
    }
  }

  const removeFile = (chapterIndex, lectureIndex) => {
    const newCurriculum = [...curriculum]
    delete newCurriculum[chapterIndex].lectures[lectureIndex].file
    setCurriculum(newCurriculum)
    toast({
      title: 'File removed',
      description: 'The file has been removed from the lecture.'
    })
  }

  const removeVideo = (chapterIndex, lectureIndex) => {
    const newCurriculum = [...curriculum]
    delete newCurriculum[chapterIndex].lectures[lectureIndex].video
    setCurriculum(newCurriculum)
    toast({
      title: 'Video removed',
      description: 'The video has been removed from the lecture.'
    })
  }

  const navigateToCodeProblem = () => {
    // Replace with your navigation logic
    console.log('Navigating to create code problem page')
  }

  const navigateToCreateQuiz = () => {
    // Replace with your navigation logic
    console.log('Navigating to create quiz page')
  }

  const handleCreateCodeProblem = (chapterIndex, lectureIndex) => {
    // Implement navigation to code problem creation page
    console.log(`Creating code problem for chapter ${chapterIndex}, lecture ${lectureIndex}`)
  }

  const handleCreateQuiz = (chapterIndex, lectureIndex) => {
    // Implement navigation to quiz creation page
    console.log(`Creating quiz for chapter ${chapterIndex}, lecture ${lectureIndex}`)
  }

  return (
    <div className='w-full'>
      <h3 className='mb-4 text-2xl font-semibold'>Curriculum</h3>
      <Dialog open={isAddChapterOpen} onOpenChange={setIsAddChapterOpen}>
        <DialogTrigger asChild>
          <Button className='mb-4' onClick={() => setIsAddChapterOpen(true)}>
            <PlusIcon className='mr-2' /> Add Chapter
          </Button>
        </DialogTrigger>
        <DialogContent className='w-[95vw] max-w-[1000px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Add New Chapter</DialogTitle>
          </DialogHeader>
          <ChapterForm onSave={addChapter} onCancel={() => setIsAddChapterOpen(false)} />
        </DialogContent>
      </Dialog>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='chapters'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {curriculum.map((chapter, index) => (
                <Draggable key={index} draggableId={`chapter-${index}`} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className='w-full p-6 mb-6'
                    >
                      <div className='max-h-[300px] overflow-y-auto'>
                        <div className='flex items-center justify-between'>
                          <h4 className='text-lg font-semibold'>{chapter.title}</h4>
                          <div className='flex items-center space-x-4'>
                            <Button variant='ghost' size='sm' onClick={() => setEditingChapterIndex(index)}>
                              <Pencil1Icon />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant='ghost' size='sm'>
                                  <Cross2Icon />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to delete this chapter?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the chapter and all its
                                    lectures.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteChapter(index)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <span>
                              {chapter.timeEstimation} hour{chapter.timeEstimation !== 1 ? 's' : ''}
                            </span>
                            <span
                              className={`px-2 py-1 rounded ${chapter.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {chapter.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <Dialog open={isAddLectureOpen} onOpenChange={setIsAddLectureOpen}>
                          <DialogTrigger asChild>
                            <Button
                              className='mt-2'
                              onClick={() => {
                                setAddingLectureToChapter(index)
                                setIsAddLectureOpen(true)
                              }}
                            >
                              <PlusIcon className='mr-2' /> Add Lecture
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='w-[95vw] max-w-[1000px] max-h-[90vh] overflow-y-auto'>
                            <DialogHeader>
                              <DialogTitle>Add New Lecture</DialogTitle>
                            </DialogHeader>
                            <LectureForm
                              onSave={(lecture) => {
                                addLecture(addingLectureToChapter, lecture)
                                setIsAddLectureOpen(false)
                              }}
                              onCancel={() => setIsAddLectureOpen(false)}
                            />
                          </DialogContent>
                        </Dialog>
                        {chapter.lectures.map((lecture, lectureIndex) => (
                          <div key={lectureIndex} className='flex flex-col p-2 mt-2 rounded-md bg-gray-50'>
                            <div className='flex items-center justify-between'>
                              <span className='font-medium'>{lecture.title}</span>
                              <div className='flex items-center space-x-2'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => setEditingLecture({ chapterIndex: index, lecture, lectureIndex })}
                                >
                                  <Pencil1Icon className='w-4 h-4' />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant='ghost' size='sm'>
                                      <Cross2Icon className='w-4 h-4' />
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
                                      <AlertDialogAction onClick={() => deleteLecture(index, lectureIndex)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <span className='text-sm'>{lecture.lectureType}</span>
                                <span className='text-sm'>{lecture.point} points</span>
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
                              <div className='mt-2 space-y-2'>
                                <Button onClick={() => handleFileUpload(index, lectureIndex)} size='sm'>
                                  <FileIcon className='w-4 h-4 mr-2' /> Upload File
                                </Button>
                                {lecture.file && (
                                  <div className='flex items-center space-x-2'>
                                    <span>{lecture.file.name}</span>
                                    <Button
                                      onClick={() => removeFile(index, lectureIndex)}
                                      size='sm'
                                      variant='destructive'
                                    >
                                      <Cross2Icon className='w-4 h-4' />
                                    </Button>
                                  </div>
                                )}
                                <Button onClick={() => handleVideoUpload(index, lectureIndex)} size='sm'>
                                  <VideoIcon className='w-4 h-4 mr-2' /> Upload Video
                                </Button>
                                {lecture.video && (
                                  <div className='flex items-center space-x-2'>
                                    <span>{lecture.video.name}</span>
                                    <Button
                                      onClick={() => removeVideo(index, lectureIndex)}
                                      size='sm'
                                      variant='destructive'
                                    >
                                      <Cross2Icon className='w-4 h-4' />
                                    </Button>
                                  </div>
                                )}
                                <Button onClick={() => handleCreateCodeProblem(index, lectureIndex)} size='sm'>
                                  <CodeIcon className='w-4 h-4 mr-2' /> Create Code Problem
                                </Button>
                              </div>
                            )}
                            {lecture.lectureType === 'Practice' && (
                              <div className='mt-2'>
                                <Button onClick={() => handleCreateCodeProblem(index, lectureIndex)} size='sm'>
                                  <CodeIcon className='w-4 h-4 mr-2' /> Create Code Problem
                                </Button>
                              </div>
                            )}
                            {lecture.lectureType === 'Quiz' && (
                              <div className='mt-2'>
                                <Button onClick={() => handleCreateQuiz(index, lectureIndex)} size='sm'>
                                  <QuestionMarkCircledIcon className='w-4 h-4 mr-2' /> Create Quiz
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Dialog open={editingChapterIndex !== null} onOpenChange={() => setEditingChapterIndex(null)}>
        <DialogContent className='w-[95vw] max-w-[1000px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Chapter</DialogTitle>
          </DialogHeader>
          {editingChapterIndex !== null && (
            <ChapterForm
              chapter={curriculum[editingChapterIndex]}
              onSave={(updatedChapter) => {
                saveChapter(updatedChapter, editingChapterIndex)
                setEditingChapterIndex(null)
              }}
              onCancel={() => setEditingChapterIndex(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      <input type='file' ref={fileInputRef} className='hidden' accept='.pdf,.doc,.docx,.txt' />
      <input type='file' ref={videoInputRef} className='hidden' accept='video/*' />
    </div>
  )
}
