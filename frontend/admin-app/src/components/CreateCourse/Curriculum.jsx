import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import ChapterForm from './Curriculum/Chapter/ChapterForm'
import ChapterList from './Curriculum/Chapter/ChapterList'
import AddLectureDialog from './Curriculum/Lecture/AddLectureDialog'
import EditChapterDialog from './Curriculum/Chapter/EditChapterDialog'
import EditLectureDialog from './Curriculum/Lecture/EditLectureDialog'
import { createChapter, updateChapter, deleteChapter } from '@/services/api/chapterApi'
import { createLecture, updateLecture, deleteLecture } from '@/services/api/lectureApi'

const Step2Curriculum = ({ chapter, handleUpdateChapter, courseId }) => {
  const [isUpdate, setIsUpdate] = useState(false)
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [editingChapterIndex, setEditingChapterIndex] = useState(null)
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false)
  const [addingLectureToChapter, setAddingLectureToChapter] = useState(null)
  const [editingLecture, setEditingLecture] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  // Thêm useEffect để khôi phục trạng thái cuộn
  useEffect(() => {
    const restoreScroll = () => {
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
    }

    if (!isAddChapterOpen && editingChapter === null && !isAddLectureOpen && editingLecture === null) {
      restoreScroll()
    }

    return () => {
      restoreScroll()
    }
  }, [isAddChapterOpen, editingChapter, isAddLectureOpen, editingLecture, isUpdate])

  const handleEditChapter = (chapterId) => {
    // Find the chapter in the array
    const chapterToEdit = chapter.find((c) => {
      return c.chapterDto && c.chapterDto.id === chapterId
    })

    if (chapterToEdit) {
      setEditingChapter(chapterToEdit.chapterDto)
    } else {
      toast({
        title: 'Error',
        description: 'Could not find chapter to edit',
        variant: 'destructive'
      })
    }
  }

  const saveEditedChapter = async (updatedChapter) => {
    try {
      // Format the chapter data to match the API expectations
      const formattedChapterData = {
        chapter: {
          title: updatedChapter.title,
          description: updatedChapter.description,
          isActive: updatedChapter.isActive
        }
      }

      // Call the updateChapter API function
      await updateChapter(formattedChapterData, courseId, updatedChapter.id)

      handleUpdateChapter()
      setEditingChapter(null)
      toast({
        title: 'Chapter updated successfully',
        description: 'The chapter has been updated.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update the chapter. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateLecture = useCallback(
    async (chapterId, lectureId, updatedLecture) => {
      try {
        await updateLecture(chapterId, lectureId, updatedLecture)
        handleUpdateChapter()
        toast({
          title: 'Lecture updated successfully',
          description: 'The lecture has been updated.'
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update the lecture. Please try again.',
          variant: 'destructive'
        })
      }
    },
    [handleUpdateChapter, toast]
  )

  const handleDeleteLecture = useCallback(
    async (chapterId, lectureId) => {
      try {
        await deleteLecture(chapterId, lectureId)
        handleUpdateChapter()
        toast({
          title: 'Lecture deleted successfully',
          description: 'The lecture has been removed.'
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete the lecture. Please try again.',
          variant: 'destructive'
        })
      }
    },
    [handleUpdateChapter, toast]
  )

  const addChapter = async (newChapter, courseId) => {
    const chapterCreate = {
      createChapterDto: {
        ...newChapter
      }
    }
    setIsLoading(true)
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
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false)
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

  const handleDeleteChapter = async (chapterId) => {
    try {
      await deleteChapter(courseId, chapterId)
      handleUpdateChapter()
      toast({
        title: 'Chapter deleted successfully',
        description: 'The chapter has been removed.',
        duration: 1500
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the chapter. Please try again.',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  const addLecture = async (chapterId, newLecture) => {
    const lectureCreate = {
      createLectureDto: {
        ...newLecture
      }
    }
    setIsLoading(true)
    try {
      const response = await createLecture(chapterId, lectureCreate)
      toast({
        title: 'Lecture created successfully',
        description: 'Lecture created successfully',
        variant: 'default',
        duration: 1500
      })
      setIsAddLectureOpen(false)
      handleUpdateChapter()
      // Optionally, navigate to another page or show a success message
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create the lecture. Please try again.',
        variant: 'destructive',
        duration: 1500
      })
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false)
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

  return (
    <div className='w-full'>
      <h3 className='mb-4 text-2xl font-semibold'>Curriculum</h3>

      <ChapterList
        setIsUpdate={setIsUpdate}
        isUpdate={isUpdate}
        curriculum={chapter}
        onEditChapter={handleEditChapter}
        onDeleteChapter={handleDeleteChapter}
        onAddLecture={(chapterId) => {
          setAddingLectureToChapter(chapterId)
          setIsAddLectureOpen(true)
        }}
        onUpdateLecture={handleUpdateLecture}
        onDeleteLecture={handleDeleteLecture}
        courseId={courseId}
      />

      <AddLectureDialog
        isOpen={isAddLectureOpen}
        onClose={() => setIsAddLectureOpen(false)}
        onSave={(lecture) => addLecture(addingLectureToChapter, lecture)}
        isLoading={isLoading}
      />
      {editingChapter && (
        <EditChapterDialog
          isOpen={editingChapter !== null}
          onClose={() => setEditingChapter(null)}
          chapter={editingChapter}
          onSave={saveEditedChapter}
        />
      )}
      <EditLectureDialog
        isOpen={editingLecture !== null}
        onClose={() => setEditingLecture(null)}
        lecture={editingLecture?.lecture}
        onSave={(updatedLecture) =>
          saveLecture(updatedLecture, editingLecture.chapterIndex, editingLecture.lectureIndex)
        }
      />
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
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default React.memo(Step2Curriculum)
