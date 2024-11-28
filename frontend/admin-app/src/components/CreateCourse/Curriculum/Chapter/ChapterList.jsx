import React from 'react'
import { Card } from '@/components/ui/card'
import ChapterHeader from './ChapterHeader'
import LectureList from '../Lecture/LectureList'

export default function ChapterList({
  curriculum,
  courseId,
  onEditChapter,
  onDeleteChapter,
  onAddLecture,
  onUpdateLecture,
  onDeleteLecture,
  setIsUpdate,
  isUpdate
}) {
  return curriculum.map((chapter, chapterIndex) => (
    <Card key={chapterIndex} className='w-full p-6 mb-6'>
      <div className='max-h-[300px] overflow-y-auto'>
        <ChapterHeader
          chapter={chapter.chapterDto}
          onEdit={() => onEditChapter(chapter.chapterDto.id)}
          onDelete={() => onDeleteChapter(chapter.chapterDto.id)}
        />
        <LectureList
          chapterId={chapter.chapterDto.id}
          lectures={chapter.lectureDtos}
          chapterIndex={chapterIndex}
          onAddLecture={() => onAddLecture(chapter.chapterDto.id)}
          onUpdateLecture={onUpdateLecture}
          onDeleteLecture={onDeleteLecture}
          courseId={courseId}
          setIsUpdate={setIsUpdate}
          isUpdate={isUpdate}
        />
      </div>
    </Card>
  ))
}
