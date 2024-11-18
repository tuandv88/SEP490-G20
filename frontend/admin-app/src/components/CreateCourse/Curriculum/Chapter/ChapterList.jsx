import React from 'react'
import { Card } from '@/components/ui/card'
import ChapterHeader from './ChapterHeader'
import LectureList from '../Lecture/LectureList'

export default function ChapterList({
  curriculum,
  onEditChapter,
  onDeleteChapter,
  onAddLecture,
  onEditLecture,
  onDeleteLecture,
  onFileUpload,
  onVideoUpload,
  onFileRemove,
  onVideoRemove
}) {
  console.log(curriculum)
  return curriculum.map((chapter, chapterIndex) => (
    <Card key={chapterIndex} className='w-full p-6 mb-6'>
      <div className='max-h-[300px] overflow-y-auto'>
        <ChapterHeader
          chapter={chapter.chapterDto}
          onEdit={() => onEditChapter(chapterIndex)}
          onDelete={() => onDeleteChapter(chapterIndex)}
        />
        <LectureList
          lectures={chapter.lectureDtos}
          chapterIndex={chapterIndex}
          onAddLecture={() => onAddLecture(chapter.chapterDto.id)}
          onEditLecture={(lecture, lectureIndex) => onEditLecture(lecture, chapterIndex, lectureIndex)}
          onDeleteLecture={(lectureIndex) => onDeleteLecture(chapterIndex, lectureIndex)}
          onFileUpload={(file, lectureIndex) => onFileUpload(file, chapterIndex, lectureIndex)}
          onVideoUpload={(file, lectureIndex) => onVideoUpload(file, chapterIndex, lectureIndex)}
          onFileRemove={(lectureIndex) => onFileRemove(chapterIndex, lectureIndex)}
          onVideoRemove={(lectureIndex) => onVideoRemove(chapterIndex, lectureIndex)}
        />
      </div>
    </Card>
  ))
}
