import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import LectureItem from './LectureItem'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { swapLectureOrder } from '@/services/api/lectureApi'
import { useToast } from '@/hooks/use-toast'

export default function LectureList({
  chapterId,
  lectures: initialLectures,
  chapterIndex,
  onAddLecture,
  onUpdateLecture,
  onDeleteLecture,
  courseId,
  setIsUpdate,
  isUpdate
}) {
  const { toast } = useToast()
  const [lectures, setLectures] = useState(initialLectures)

  // Cập nhật lectures local khi prop thay đổi
  React.useEffect(() => {
    setLectures(initialLectures)
  }, [initialLectures])

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    
    if (sourceIndex === destinationIndex) return

    try {
      // Lấy ID của 2 lecture cần swap
      const sourceLectureId = lectures[sourceIndex].id
      const destinationLectureId = lectures[destinationIndex].id

      // Cập nhật UI ngay lập tức
      const newLectures = Array.from(lectures)
      const [removed] = newLectures.splice(sourceIndex, 1)
      newLectures.splice(destinationIndex, 0, removed)
      setLectures(newLectures)

      // Gọi API để swap thứ tự
      const response = await swapLectureOrder(sourceLectureId, destinationLectureId)
      
      if (response) {
        setIsUpdate(prev => !prev)
        toast({
          title: 'Success',
          description: 'Lecture order updated successfully',
          duration: 1500
        })
      }
    } catch (error) {
      // Nếu có lỗi, hoàn tác lại thay đổi UI
      setLectures(initialLectures)
      toast({
        title: 'Error',
        description: 'Failed to update lecture order',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`chapter-${chapterId}`}>
          {(provided, snapshot) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
            >
              {lectures.map((lecture, index) => (
                <Draggable 
                  key={lecture.id} 
                  draggableId={lecture.id.toString()} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1
                      }}
                    >
                      <LectureItem
                        chapterId={chapterId}
                        lecture={lecture}
                        onUpdateLecture={onUpdateLecture}
                        onDeleteLecture={onDeleteLecture}
                        courseId={courseId}
                        setIsUpdateLecture={setIsUpdate}
                        isUpdateLecture={isUpdate}
                        dragHandleProps={provided.dragHandleProps}
                        lectureIndex={index}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='mt-2' onClick={onAddLecture}>
            <PlusIcon className='mr-2' /> Add Lecture
          </Button>
        </DialogTrigger>
      </Dialog>
    </>
  )
}
