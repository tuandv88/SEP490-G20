import React from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import LectureItem from './LectureItem'

export default function LectureList({
  chapterId,
  lectures,
  chapterIndex,
  onAddLecture,
  onUpdateLecture,
  onDeleteLecture,
  courseId,
  setIsUpdate,
  isUpdate
}) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='mt-2' onClick={onAddLecture}>
            <PlusIcon className='mr-2' /> Add Lecture
          </Button>
        </DialogTrigger>
      </Dialog>
      {lectures.map((lecture, lectureIndex) => (
        <LectureItem
          chapterId={chapterId}
          key={lectureIndex}
          lecture={lecture}
          onUpdateLecture={onUpdateLecture}
          onDeleteLecture={onDeleteLecture}
          courseId={courseId}
          setIsUpdateLecture={setIsUpdate}
          isUpdateLecture={isUpdate}
        />
      ))}
    </>
  )
}
