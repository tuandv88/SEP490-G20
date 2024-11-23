import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import ChapterForm from './Curriculum/Chapter/ChapterForm'
import ChapterList from './Curriculum/Chapter/ChapterList'
import AddLectureDialog from './Curriculum/Lecture/AddLectureDialog'
import EditChapterDialog from './Curriculum/Chapter/EditChapterDialog'
import EditLectureDialog from './Curriculum/Lecture/EditLectureDialog'
import { createChapter } from '@/services/api/chapterApi'
import { createLecture } from '@/services/api/lectureApi'

const Step2Curriculum = ({ chapter, handleUpdateChapter, courseId }) => {
  console.log(chapter)
  const [curriculum, setCurriculum] = useState([])
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false)
  const [editingChapterIndex, setEditingChapterIndex] = useState(null)
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false)
  const [addingLectureToChapter, setAddingLectureToChapter] = useState(null)
  const [editingLecture, setEditingLecture] = useState(null)
  const { toast } = useToast()

  // Thêm useEffect để khôi phục trạng thái cuộn
  useEffect(() => {
    const restoreScroll = () => {
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
    }

    if (!isAddChapterOpen && editingChapterIndex === null && !isAddLectureOpen && editingLecture === null) {
      restoreScroll()
    }

    return () => {
      restoreScroll()
    }
  }, [isAddChapterOpen, editingChapterIndex, isAddLectureOpen, editingLecture])

  const handleFileUpload = (file, chapterIndex, lectureIndex) => {
    const newCurriculum = [...curriculum]
    if (!newCurriculum[chapterIndex].lectures[lectureIndex].files) {
      newCurriculum[chapterIndex].lectures[lectureIndex].files = []
    }
    newCurriculum[chapterIndex].lectures[lectureIndex].files.push(file)
    setCurriculum(newCurriculum)
    toast({
      title: 'File uploaded',
      description: 'The file has been successfully uploaded.',
      duration: 1500
    })
  }

  const handleVideoUpload = (file, chapterIndex, lectureIndex) => {
    const newCurriculum = [...curriculum]
    newCurriculum[chapterIndex].lectures[lectureIndex].video = file
    setCurriculum(newCurriculum)
    toast({
      title: 'Video uploaded',
      description: 'The video has been successfully uploaded.',
      duration: 1500
    })
  }

  const handleFileRemove = (chapterIndex, lectureIndex, fileIndex) => {
    const newCurriculum = [...curriculum]
    newCurriculum[chapterIndex].lectures[lectureIndex].files.splice(fileIndex, 1)
    setCurriculum(newCurriculum)
    toast({
      title: 'File removed',
      description: 'The file has been successfully removed.',
      duration: 1500
    })
  }

  const handleVideoRemove = (chapterIndex, lectureIndex) => {
    const newCurriculum = [...curriculum]
    newCurriculum[chapterIndex].lectures[lectureIndex].video = null
    setCurriculum(newCurriculum)
    toast({
      title: 'Video removed',
      description: 'The video has been successfully removed.',
      duration: 1500
    })
  }

  const addChapter = async (newChapter, courseId) => {
    const chapterCreate = {
      createChapterDto: {
        ...newChapter
      }
    }
    try {
      const response = await createChapter(chapterCreate, courseId)
      toast({
        title: 'Chapter created successfully',
        description: 'Chapter created successfully'
      })
      setIsAddChapterOpen(false)
      handleUpdateChapter()
      // Optionally, navigate to another page or show a success message
    } catch (error) {
      console.error('Error creating course:', error)
      // Optionally, show an error message to the user
    }
  }

  const saveChapter = (updatedChapter, index) => {
    const newCurriculum = [...curriculum]
    newCurriculum[index] = { ...newCurriculum[index], ...updatedChapter }
    setCurriculum(newCurriculum)
    setEditingChapterIndex(null)
    toast({
      title: 'Chapter updated',
      description: 'The chapter has been successfully updated.',
      duration: 1500
    })
  }

  const deleteChapter = (index) => {
    const newCurriculum = curriculum.filter((_, i) => i !== index)
    setCurriculum(newCurriculum)
    toast({
      title: 'Chapter deleted',
      description: 'The chapter has been successfully removed.'
    })
  }

  const addLecture = async (chapterId, newLecture) => {
    const lectureCreate = {
      createLectureDto: {
        ...newLecture
      }
    }
    try {
      const response = await createLecture(chapterId, lectureCreate)
      toast({
        title: 'Lecture created successfully',
        description: 'Lecture created successfully'
      })
      setIsAddLectureOpen(false)
      handleUpdateChapter()
      // Optionally, navigate to another page or show a success message
    } catch (error) {
      console.error('Error creating course:', error)
      // Optionally, show an error message to the user
    }
  }

  const saveLecture = (updatedLecture, chapterIndex, lectureIndex) => {
    const newCurriculum = [...curriculum]
    newCurriculum[chapterIndex].lectures[lectureIndex] = {
      ...newCurriculum[chapterIndex].lectures[lectureIndex],
      ...updatedLecture
    }
    setCurriculum(newCurriculum)
    setEditingLecture(null)
    toast({
      title: 'Lecture updated',
      description: 'The lecture has been successfully updated.',
      duration: 1500
    })
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
          <ChapterForm
            onSave={(newChapter) => addChapter(newChapter, courseId)}
            onCancel={() => setIsAddChapterOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <ChapterList
        curriculum={chapter}
        onEditChapter={(index) => setEditingChapterIndex(index)}
        onDeleteChapter={deleteChapter}
        onAddLecture={(index) => {
          setAddingLectureToChapter(index)
          setIsAddLectureOpen(true)
        }}
        onEditLecture={(lecture, chapterIndex, lectureIndex) => {
          setEditingLecture({ lecture, chapterIndex, lectureIndex })
        }}
        onDeleteLecture={deleteLecture}
        onFileUpload={handleFileUpload}
        onVideoUpload={handleVideoUpload}
        onFileRemove={handleFileRemove}
        onVideoRemove={handleVideoRemove}
      />

      <AddLectureDialog
        isOpen={isAddLectureOpen}
        onClose={() => setIsAddLectureOpen(false)}
        onSave={(lecture) => addLecture(addingLectureToChapter, lecture)}
      />
      <EditChapterDialog
        isOpen={editingChapterIndex !== null}
        onClose={() => setEditingChapterIndex(null)}
        chapter={editingChapterIndex !== null ? curriculum[editingChapterIndex] : null}
        onSave={(updatedChapter) => saveChapter(updatedChapter, editingChapterIndex)}
      />
      <EditLectureDialog
        isOpen={editingLecture !== null}
        onClose={() => setEditingLecture(null)}
        lecture={editingLecture?.lecture}
        onSave={(updatedLecture) =>
          saveLecture(updatedLecture, editingLecture.chapterIndex, editingLecture.lectureIndex)
        }
      />
    </div>
  )
}
export default React.memo(Step2Curriculum)
