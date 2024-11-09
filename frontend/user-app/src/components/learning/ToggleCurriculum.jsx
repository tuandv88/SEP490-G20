/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ChevronDown, ChevronRight, TableOfContents, Tag, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const ToggleCurriculum = ({ title, chapters, setSelectedLectureId, isProblemListOpen, toggleProblemList, navigate }) => {
  const [expandedSections, setExpandedSections] = useState(() => {
    // Lấy trạng thái từ Local Storage khi component mount
    const savedSections = localStorage.getItem('expandedSections')
    return savedSections ? JSON.parse(savedSections) : [0]
  })

  const [activeLectureId, setActiveLectureId] = useState(() => {
    const savedLectureId = localStorage.getItem('activeLectureId')
    return savedLectureId ? JSON.parse(savedLectureId) : null
  })

  const handleLectureClick = (lectureId) => {
    // console.log(lectureId)
    setActiveLectureId(lectureId)
    setSelectedLectureId(lectureId)
    navigate(`/learning-space/9209cb44-0581-4107-a080-fa210fe9b09c/lecture/${lectureId}`);
    console.log("Navigate")
    if (toggleProblemList) {
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

  useEffect(() => {
    if (activeLectureId !== null) {
      localStorage.setItem('activeLectureId', JSON.stringify(activeLectureId))
    }
  }, [activeLectureId])

  return (
    <div
      className={`z-50 bg-white dark:bg-gray-800 fixed left-0 top-0 flex h-full w-[600px] flex-col transition-all duration-500 ${
        isProblemListOpen ? 'transform-none' : '-translate-x-full'
      }`}
    >
      <div className='flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700'>
        <TableOfContents size={30} color='#000000' />
        <h2 className='text-2xl font-medium'>Chapter List</h2>
        <div className='flex items-center space-x-2'>
          <button className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
            <Tag className='w-4 h-4 text-gray-500' />
          </button>
          <button onClick={toggleProblemList} className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
            <X className='w-4 h-4 text-gray-500' />
          </button>
        </div>
      </div>
      <div className='flex-1 overflow-y-auto'>
        <h2 className='ml-4 text-2xl font-bold mb-4'>{title}</h2>
        <div className='space-y-2 mx-4'>
          {chapters.map((chapter, index) => (
            <div key={chapter.chapterDto.id}>
              <button
                className='flex justify-between items-center w-full text-left py-2 hover:bg-gray-100 rounded transition-colors'
                onClick={() => toggleSection(index)}
              >
                <span className='font-medium'>{chapter.chapterDto.title}</span>
                {expandedSections.includes(index) ? (
                  <ChevronDown className='w-5 h-5 text-gray-500' />
                ) : (
                  <ChevronRight className='w-5 h-5 text-gray-500' />
                )}
              </button>
              {expandedSections.includes(index) && chapter.lectureDtos.length > 0 && (
                <div className='ml-4 mt-2 space-y-2 cursor-pointer'>
                  {chapter.lectureDtos.map((lecture) => (
                    <div
                      key={lecture.id}
                      onClick={() => handleLectureClick(lecture.id)}
                      className={`${activeLectureId === lecture.id ? 'bg-black text-white rounded-sm p-2' : ''}`}
                    >
                      <div className='flex justify-between items-center mb-1'>
                        <span className='text-sm'>{lecture.title}</span>
                        <span className='text-xs text-gray-500'>{lecture.timeEstimation} mins</span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-1'>
                        <div className='bg-purple-600 h-1 rounded-full' style={{ width: `${lecture.point}%` }}></div>
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
  )
}

export default React.memo(ToggleCurriculum)
