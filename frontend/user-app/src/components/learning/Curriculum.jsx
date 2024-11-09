/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

import { ChevronRight, ChevronDown } from 'lucide-react'

const Curriculum = ({ chapters, setSelectedLectureId, title }) => {
  console.log('Load')
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
    <div>
      <div className='md:col-span-1 p-6 border-r'>
        <h2 className='text-2xl font-bold mb-4'>{title}</h2>
        <div className='space-y-2'>
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
                      className={`${activeLectureId === lecture.id ? 'bg-gray-300 rounded-sm p-1' : ''}`}
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

export default React.memo(Curriculum)
