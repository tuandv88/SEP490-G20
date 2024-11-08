import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { PlusCircle, Edit, Trash2, Video, FileText, Code } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
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

const LectureType = {
  LESSON: 'Lesson',
  QUIZ: 'Quiz',
  PRACTICE: 'Practice'
}

export default function Curriculum() {
  const [chapters, setChapters] = useState([])
  const [newChapter, setNewChapter] = useState({
    id: 0,
    title: '',
    description: '',
    timeEstimate: 0
  })
  const [newLecture, setNewLecture] = useState({
    title: '',
    summary: '',
    timeEstimate: 0,
    lectureType: LectureType.LESSON,
    point: 0,
    isFree: false
  })
  const [selectedChapterId, setSelectedChapterId] = useState(null)
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false)
  const [isLectureDialogOpen, setIsLectureDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const { toast } = useToast()

  const handleAddOrUpdateChapter = () => {
    if (isEditMode) {
      setChapters(
        chapters.map((chapter) =>
          chapter.id === newChapter.id ? { ...newChapter, lectures: chapter.lectures } : chapter
        )
      )
      toast({
        title: 'Chapter updated',
        description: 'The chapter has been updated successfully.'
      })
    } else {
      const chapterNumber = chapters.length + 1
      const chapter = {
        id: Date.now(),
        title: `Chapter ${chapterNumber}: ${newChapter.title}`,
        description: newChapter.description,
        timeEstimate: newChapter.timeEstimate,
        lectures: []
      }
      setChapters([...chapters, chapter])
      toast({
        title: 'Chapter added',
        description: 'The new chapter has been added successfully.'
      })
    }
    setNewChapter({ id: 0, title: '', description: '', timeEstimate: 0 })
    setIsChapterDialogOpen(false)
    setIsEditMode(false)
  }

  const handleAddLecture = () => {
    if (selectedChapterId === null) return

    const chapter = chapters.find((c) => c.id === selectedChapterId)
    const lectureNumber = chapter.lectures.length + 1

    if (isEditMode) {
      setChapters(
        chapters.map((chapter) =>
          chapter.id === selectedChapterId
            ? {
                ...chapter,
                lectures: chapter.lectures.map((lecture) =>
                  lecture.id === newLecture.id
                    ? {
                        ...newLecture,
                        title: `Lecture ${lectureNumber} (${newLecture.lectureType}): ${newLecture.title}`
                      }
                    : lecture
                )
              }
            : chapter
        )
      )
      toast({
        title: 'Lecture updated',
        description: 'The lecture has been updated successfully.'
      })
    } else {
      const lecture = {
        id: Date.now(),
        ...newLecture,
        title: `Lecture ${lectureNumber} (${newLecture.lectureType}): ${newLecture.title}`
      }
      setChapters(
        chapters.map((chapter) =>
          chapter.id === selectedChapterId ? { ...chapter, lectures: [...chapter.lectures, lecture] } : chapter
        )
      )
      toast({
        title: 'Lecture added',
        description: 'The new lecture has been added successfully.'
      })
    }
    setNewLecture({
      title: '',
      summary: '',
      timeEstimate: 0,
      lectureType: LectureType.LESSON,
      point: 0,
      isFree: false
    })
    setIsLectureDialogOpen(false)
    setIsEditMode(false)
  }

  const handleDeleteChapter = (chapterId) => {
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId))
    toast({
      title: 'Chapter deleted',
      description: 'The chapter has been deleted successfully.'
    })
  }

  const handleDeleteLecture = (chapterId, lectureId) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              lectures: chapter.lectures.filter((lecture) => lecture.id !== lectureId)
            }
          : chapter
      )
    )
    toast({
      title: 'Lecture deleted',
      description: 'The lecture has been deleted successfully.'
    })
  }

  const handleEditChapter = (chapter) => {
    setNewChapter(chapter)
    setIsEditMode(true)
    setIsChapterDialogOpen(true)
  }

  const handleEditLecture = (chapterId, lectureId) => {
    const chapter = chapters.find((c) => c.id === chapterId)
    const lecture = chapter.lectures.find((l) => l.id === lectureId)
    setNewLecture({ ...lecture })
    setSelectedChapterId(chapterId)
    setIsEditMode(true)
    setIsLectureDialogOpen(true)
  }

  const handleFileUpload = (chapterId, lectureId, fileType) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = fileType === 'video' ? 'video/*' : '*/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        // Xử lý file upload ở đây (ví dụ: gửi lên server)
        console.log(`Uploading ${fileType}:`, file.name)
        toast({
          title: `${fileType} uploaded`,
          description: `${file.name} has been uploaded successfully.`
        })
      }
    }
    input.click()
  }

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h1 className='mb-6 text-2xl font-bold'>Curriculum</h1>

      <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Chapter' : 'Add New Chapter'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='chapter-title'>Title</Label>
              <Input
                id='chapter-title'
                value={newChapter.title}
                onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor='chapter-description'>Description (Markdown)</Label>
              <Textarea
                id='chapter-description'
                value={newChapter.description}
                onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor='chapter-time'>Time Estimate (hours)</Label>
              <Input
                id='chapter-time'
                type='number'
                value={newChapter.timeEstimate}
                onChange={(e) =>
                  setNewChapter({
                    ...newChapter,
                    timeEstimate: Number(e.target.value)
                  })
                }
              />
            </div>
            <Button onClick={handleAddOrUpdateChapter}>{isEditMode ? 'Update Chapter' : 'Add Chapter'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {chapters.map((chapter) => (
        <div key={chapter.id} className='p-4 mb-6 border rounded-lg bg-gray-50'>
          <Accordion type='single' collapsible>
            <AccordionItem value={chapter.id.toString()}>
              <AccordionTrigger className='hover:no-underline'>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center'>
                    <span className='font-semibold text-gray-900'>{chapter.title}</span>
                    <span className='ml-4 text-sm text-gray-600'>{chapter.timeEstimate} hours</span>
                  </div>
                  <div className='flex items-center'>
                    <Button variant='ghost' size='sm' onClick={() => handleEditChapter(chapter)}>
                      <Edit className='w-4 h-4' />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' size='sm' className='ml-2'>
                          <Trash2 className='w-4 h-4 text-red-500' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the chapter and all its contents.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteChapter(chapter.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='mt-4'>
                  <Dialog open={isLectureDialogOpen} onOpenChange={setIsLectureDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setSelectedChapterId(chapter.id)
                          setIsLectureDialogOpen(true)
                        }}
                        size='sm'
                      >
                        Add Lecture
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Edit Lecture' : 'Add New Lecture'}</DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <div>
                          <Label htmlFor='lecture-title'>Title</Label>
                          <Input
                            id='lecture-title'
                            value={newLecture.title}
                            onChange={(e) =>
                              setNewLecture({
                                ...newLecture,
                                title: e.target.value
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor='lecture-summary'>Summary (Markdown)</Label>
                          <Textarea
                            id='lecture-summary'
                            value={newLecture.summary}
                            onChange={(e) =>
                              setNewLecture({
                                ...newLecture,
                                summary: e.target.value
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor='lecture-time'>Time Estimate (minutes)</Label>
                          <Input
                            id='lecture-time'
                            type='number'
                            value={newLecture.timeEstimate}
                            onChange={(e) =>
                              setNewLecture({
                                ...newLecture,
                                timeEstimate: Number(e.target.value)
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor='lecture-type'>Lecture Type</Label>
                          <Select
                            value={newLecture.lectureType}
                            onValueChange={(value) =>
                              setNewLecture({
                                ...newLecture,
                                lectureType: value
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select lecture type' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={LectureType.LESSON}>Lesson</SelectItem>
                              <SelectItem value={LectureType.QUIZ}>Quiz</SelectItem>
                              <SelectItem value={LectureType.PRACTICE}>Practice</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor='lecture-point'>Point</Label>
                          <Input
                            id='lecture-point'
                            type='number'
                            min='0'
                            value={newLecture.point}
                            onChange={(e) =>
                              setNewLecture({
                                ...newLecture,
                                point: Number(e.target.value)
                              })
                            }
                          />
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Switch
                            id='lecture-free'
                            checked={newLecture.isFree}
                            onCheckedChange={(checked) => setNewLecture({ ...newLecture, isFree: checked })}
                          />
                          <Label htmlFor='lecture-free'>Is Free</Label>
                        </div>
                        <Button onClick={handleAddLecture}>{isEditMode ? 'Update Lecture' : 'Add Lecture'}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {chapter.lectures.map((lecture) => (
                    <div key={lecture.id} className='pl-4 mt-4 border-l-2 border-gray-200'>
                      <div className='flex items-center justify-between'>
                        <span className='font-medium'>{lecture.title}</span>
                        <div className='flex items-center'>
                          <span className='mr-2 text-sm text-gray-600'>
                            {lecture.timeEstimate} minutes | {lecture.lectureType} | {lecture.point} points |{' '}
                            {lecture.isFree ? 'Free' : 'Paid'}
                          </span>
                          <Button variant='ghost' size='sm' onClick={() => handleEditLecture(chapter.id, lecture.id)}>
                            <Edit className='w-4 h-4' />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <Trash2 className='w-4 h-4 text-red-500' />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the lecture.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteLecture(chapter.id, lecture.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className='mt-2'>
                        {lecture.lectureType === LectureType.LESSON && (
                          <div className='space-x-2'>
                            <Button size='sm' onClick={() => handleFileUpload(chapter.id, lecture.id, 'video')}>
                              <Video className='w-4 h-4 mr-2' />
                              Add Video
                            </Button>
                            <Button size='sm' onClick={() => handleFileUpload(chapter.id, lecture.id, 'file')}>
                              <FileText className='w-4 h-4 mr-2' />
                              Add File
                            </Button>
                            <Button size='sm'>
                              <Code className='w-4 h-4 mr-2' />
                              Create Code Problem
                            </Button>
                          </div>
                        )}
                        {lecture.lectureType === LectureType.QUIZ && <Button size='sm'>Add Question</Button>}
                        {lecture.lectureType === LectureType.PRACTICE && (
                          <Button size='sm'>
                            <Code className='w-4 h-4 mr-2' />
                            Create Code Problem
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
      <Button
        onClick={() => {
          setIsEditMode(false)
          setNewChapter({ id: 0, title: '', description: '', timeEstimate: 0 })
          setIsChapterDialogOpen(true)
        }}
        className='mb-4'
      >
        <PlusCircle className='w-5 h-5 mr-2' />
        Add Chapter
      </Button>
    </div>
  )
}
