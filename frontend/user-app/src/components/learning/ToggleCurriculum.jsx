/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ChevronDown, ChevronRight, TableOfContents, Tag, X } from 'lucide-react'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import useStore from '@/data/store'
const ToggleCurriculum = forwardRef(
  (
    {
      title,
      chapters,
      setSelectedLectureId,
      isProblemListOpen,
      toggleProblemList,
      navigate,
      courseId,
      activeLectureId,
      setActiveLectureId,
      courseProgress
    },
    ref
  ) => {
    //const selectedCourse = useStore((state) => state.selectedCourse)
    const selectedCourse = courseId
    useImperativeHandle(ref, () => ({
      handlePreviousLecture,
      handleNextLecture
    }))


    const handlePreviousLecture = () => {
      const currentChapterIndex = chapters.findIndex((chapter) =>
        chapter.lectureDtos.some((lecture) => lecture.id === activeLectureId)
      )
      const currentLectureIndex = chapters[currentChapterIndex].lectureDtos.findIndex(
        (lecture) => lecture.id === activeLectureId
      )

      if (currentLectureIndex > 0) {
        const previousLectureId = chapters[currentChapterIndex].lectureDtos[currentLectureIndex - 1].id
        handleLectureClick(previousLectureId)
      } else if (currentChapterIndex > 0) {
        // Move to the last lecture of the previous chapter
        const previousChapter = chapters[currentChapterIndex - 1]
        const previousLectureId = previousChapter.lectureDtos[previousChapter.lectureDtos.length - 1].id
        handleLectureClick(previousLectureId)
      }
    }

    const handleNextLecture = () => {
      const currentChapterIndex = chapters.findIndex((chapter) =>
        chapter.lectureDtos.some((lecture) => lecture.id === activeLectureId)
      )
      const currentLectureIndex = chapters[currentChapterIndex].lectureDtos.findIndex(
        (lecture) => lecture.id === activeLectureId
      )

      if (currentLectureIndex < chapters[currentChapterIndex].lectureDtos.length - 1) {
        const nextLectureId = chapters[currentChapterIndex].lectureDtos[currentLectureIndex + 1].id
        handleLectureClick(nextLectureId)
      } else if (currentChapterIndex < chapters.length - 1) {
        // Move to the first lecture of the next chapter
        const nextChapter = chapters[currentChapterIndex + 1]
        if (nextChapter.lectureDtos.length > 0) {
          const nextLectureId = nextChapter.lectureDtos[0].id
          handleLectureClick(nextLectureId)
        }
      }
    }

    const [expandedSections, setExpandedSections] = useState(() => {
      // Lấy trạng thái từ Local Storage khi component mount
      const savedSections = localStorage.getItem('expandedSections')
      return savedSections ? JSON.parse(savedSections) : [0]
    })

    // const [activeLectureId, setActiveLectureId] = useState(() => {
    //   const savedLectureId = localStorage.getItem('activeLectureId')
    //   return savedLectureId ? JSON.parse(savedLectureId) : null
    // })

    const handleLectureClick = (lectureId) => {
      setActiveLectureId(lectureId)
      setSelectedLectureId(lectureId)
      navigate(`/learning-space/${selectedCourse}/lecture/${lectureId}`)
      if (isProblemListOpen) {
        toggleProblemList(false)
      }
    }

    const toggleSection = (index) => {
      setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
    }

    useEffect(() => {
      // Lưu trạng thái vào Local Storage mỗi khi expandedSections thay đổi
      localStorage.setItem('expandedSections', JSON.stringify(expandedSections))
    }, [expandedSections])

    const isLectureCompleted = (lectureId) => {
      return courseProgress.some((progress) => progress.lectureId === lectureId && progress.completionDate)
    }

    return (
      <div
        className={`z-50 bg-white dark:bg-gray-800 fixed left-0 top-0 flex h-full w-[600px] flex-col transition-all duration-500 ${
          isProblemListOpen ? 'transform-none' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full bg-[#1b2a32]'>
          <div className='flex justify-between items-center p-4 border-b border-gray-700'>
            <TableOfContents size={30} color='#ffffff' />
            <h2 className='text-2xl font-medium text-white'>Chapter List</h2>
            <div className='flex items-center space-x-2'>
              <button className='p-1.5 hover:bg-[#2a3b44] rounded-md'>
                <Tag className='w-4 h-4 text-gray-300' />
              </button>
              <button onClick={toggleProblemList} className='p-1.5 hover:bg-[#2a3b44] rounded-md'>
                <X className='w-4 h-4 text-gray-300' />
              </button>
            </div>
          </div>
          <div className='flex-1 overflow-y-auto'>
            <h2 className='ml-4 text-2xl font-bold mb-4 text-white'>{title}</h2>
            <div className='space-y-2 mx-4'>
              {chapters.map((chapter, index) => (
                <div key={chapter.chapterDto.id}>
                  <button
                    className='flex justify-between items-center w-full text-left py-2 hover:bg-[#2a3b44] rounded transition-colors'
                    onClick={() => toggleSection(index)}
                  >
                    <span className='font-medium text-white'>{chapter.chapterDto.title}</span>
                    {expandedSections.includes(index) ? (
                      <ChevronDown className='w-5 h-5 text-gray-300' />
                    ) : (
                      <ChevronRight className='w-5 h-5 text-gray-300' />
                    )}
                  </button>
                  {expandedSections.includes(index) && chapter.lectureDtos.length > 0 && (
                    <div className='ml-4 mt-2 space-y-2 cursor-pointer'>
                      {chapter.lectureDtos.map((lecture) => (
                        <div
                          key={lecture.id}
                          onClick={() => handleLectureClick(lecture.id)}
                          className={`p-2 rounded-sm ${
                            activeLectureId === lecture.id
                              ? 'bg-[#2a3b44] text-white'
                              : 'text-gray-300 hover:bg-[#2a3b44]'
                          }`}
                        >
                          <div className='flex justify-between items-center mb-1'>
                            <span className='text-sm'>{lecture.title}</span>
                            <span className='text-xs text-gray-500'>
                              {isLectureCompleted(lecture.id) ? 'Completed' : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

export default React.memo(ToggleCurriculum)
