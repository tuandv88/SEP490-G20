import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import ChapterHeader from './ChapterHeader'
import LectureList from '../Lecture/LectureList'
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { swapChapterOrder } from '@/services/api/chapterApi'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

export default function ChapterList({
  curriculum,
  courseId,
  onEditChapter,
  onDeleteChapter,
  onAddLecture,
  onUpdateLecture,
  onDeleteLecture,
  onReorderLectures,
  setIsUpdate,
  isUpdate
}) {
  const { toast } = useToast()
  const [chapters, setChapters] = useState(curriculum)
  
  // Cập nhật chapters local khi prop thay đổi
  React.useEffect(() => {
    setChapters(curriculum)
  }, [curriculum])

  const [expandedChapters, setExpandedChapters] = useState(
    curriculum.reduce((acc, chapter) => {
      acc[chapter.chapterDto.id] = false
      return acc
    }, {})
  )

  const expandAll = () => {
    const newExpandedState = {}
    chapters.forEach(chapter => {
      newExpandedState[chapter.chapterDto.id] = true
    })
    setExpandedChapters(newExpandedState)
  }

  const collapseAll = () => {
    const newExpandedState = {}
    chapters.forEach(chapter => {
      newExpandedState[chapter.chapterDto.id] = false
    })
    setExpandedChapters(newExpandedState)
  }

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }))
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    
    if (sourceIndex === destinationIndex) return

    try {
      const sourceChapterId = chapters[sourceIndex].chapterDto.id
      const destinationChapterId = chapters[destinationIndex].chapterDto.id

      // Cập nhật UI ngay lập tức
      const newChapters = Array.from(chapters)
      const [removed] = newChapters.splice(sourceIndex, 1)
      newChapters.splice(destinationIndex, 0, removed)
      setChapters(newChapters)

      // Gọi API để swap thứ tự
      const response = await swapChapterOrder(sourceChapterId, destinationChapterId)
      
      if (response) {
        setIsUpdate(prev => !prev)
        toast({
          title: 'Success',
          description: 'Chapter order updated successfully',
          duration: 1500
        })
      }
    } catch (error) {
      // Nếu có lỗi, hoàn tác lại UI
      setChapters(curriculum)
      toast({
        title: 'Error',
        description: 'Failed to update chapter order',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={expandAll}>
          Expand All
        </Button>
        <Button variant="outline" size="sm" onClick={collapseAll}>
          Collapse All
        </Button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {chapters.map((chapter, index) => (
                <Draggable
                  key={chapter.chapterDto.id}
                  draggableId={chapter.chapterDto.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        'w-full p-6 mb-6',
                        snapshot.isDragging ? 'opacity-50' : ''
                      )}
                    >
                      <div className='flex items-center gap-2'>
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="h-5 w-5 text-gray-500 cursor-grab" />
                        </div>
                        <div 
                          className='flex items-center cursor-pointer flex-1'
                          onClick={() => toggleChapter(chapter.chapterDto.id)}
                        >
                          {expandedChapters[chapter.chapterDto.id] ? (
                            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                          )}
                          <div className='flex-1'>
                            <ChapterHeader
                              chapter={{
                                ...chapter.chapterDto,
                                order: index + 1
                              }}
                              onEdit={() => onEditChapter(chapter.chapterDto.id)}
                              onDelete={() => onDeleteChapter(chapter.chapterDto.id)}
                            />
                          </div>
                        </div>
                      </div>

                      <div 
                        className={cn(
                          'transition-all duration-200 ease-in-out overflow-hidden pl-7',
                          expandedChapters[chapter.chapterDto.id] ? 'opacity-100 mt-4' : 'opacity-0 h-0'
                        )}
                      >
                        <LectureList
                          chapterId={chapter.chapterDto.id}
                          lectures={chapter.lectureDtos}
                          chapterIndex={index}
                          onAddLecture={() => onAddLecture(chapter.chapterDto.id)}
                          onUpdateLecture={onUpdateLecture}
                          onDeleteLecture={onDeleteLecture}
                          onReorderLectures={onReorderLectures}
                          courseId={courseId}
                          setIsUpdate={setIsUpdate}
                          isUpdate={isUpdate}
                        />
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
    </>
  )
}
