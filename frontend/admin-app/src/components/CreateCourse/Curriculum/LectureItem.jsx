import React from 'react'
import { Card } from '@/components/ui/card'
import EditLectureDialog from './EditLectureDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'

export default function LectureItem({ lecture, onUpdate, onDelete }) {
  return (
    <Card className='p-2'>
      <div className='flex items-center justify-between'>
        <div>
          <h5 className='font-medium'>{lecture.title}</h5>
          <p className='text-sm text-gray-500'>Type: {lecture.lectureType}</p>
          <p className='text-sm text-gray-500'>Duration: {lecture.timeEstimation} minutes</p>
          <p className='text-sm text-gray-500'>Points: {lecture.point}</p>
          <p className='text-sm text-gray-500'>{lecture.isFree ? 'Free' : 'Paid'}</p>
        </div>
        <div className='space-x-2'>
          <EditLectureDialog lecture={lecture} onSave={onUpdate} />
          <DeleteConfirmDialog
            title='Delete Lecture'
            description='Are you sure you want to delete this lecture? This action cannot be undone.'
            onConfirm={onDelete}
          />
        </div>
      </div>
    </Card>
  )
}
