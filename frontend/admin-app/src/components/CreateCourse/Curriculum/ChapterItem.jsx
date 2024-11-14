import React, { forwardRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import LectureItem from './LectureItem'
import AddLectureDialog from './AddLectureDialog'
import EditChapterDialog from './EditChapterDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'

const ChapterItem = forwardRef(
  ({ chapter, index, onUpdate, onDelete, onAddLecture, onUpdateLecture, onDeleteLecture, ...props }, ref) => {
    // Check if chapter is undefined and provide a default empty object
    const safeChapter = chapter || {}

    return (
      <Card ref={ref} {...props} className='p-4 mb-4'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='font-semibold'>{safeChapter.title || 'Untitled Chapter'}</h4>
          <div className='space-x-2'>
            <EditChapterDialog chapter={safeChapter} onSave={onUpdate} />
            <DeleteConfirmDialog
              title='Delete Chapter'
              description='Are you sure you want to delete this chapter? This action cannot be undone.'
              onConfirm={onDelete}
            />
          </div>
        </div>
        <AddLectureDialog onSave={onAddLecture} />
        <div className='mt-2 space-y-2'>
          {safeChapter.lectures &&
            safeChapter.lectures.map((lecture, lectureIndex) => (
              <LectureItem
                key={lectureIndex}
                lecture={lecture}
                onUpdate={(updatedLecture) => onUpdateLecture(updatedLecture, lectureIndex)}
                onDelete={() => onDeleteLecture(lectureIndex)}
              />
            ))}
        </div>
      </Card>
    )
  }
)

ChapterItem.displayName = 'ChapterItem'

export default ChapterItem
