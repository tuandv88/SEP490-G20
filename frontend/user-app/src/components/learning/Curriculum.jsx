/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

import { ChevronRight, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Curriculum = ({ courseId, chapters, 
  setSelectedLectureId, title, 
  setActiveLectureId,
  activeLectureId,
  courseProgress
 }) => {
  
  const navigate = useNavigate()
  
  const [expandedSections, setExpandedSections] = useState(() => {
    // Lấy trạng thái từ Local Storage khi component mount
    const savedSections = localStorage.getItem('expandedSections')
    return savedSections ? JSON.parse(savedSections) : [0]
  })



  const handleLectureClick = (lectureId) => {
    console.log(lectureId)
    setActiveLectureId(lectureId)
    setSelectedLectureId(lectureId)
    navigate(`/learning-space/${courseId}/lecture/${lectureId}`);
    console.log("Navigate")
  }

  const isLectureCompleted = (lectureId) => {
    return courseProgress.some(progress => progress.lectureId === lectureId && progress.completionDate)
  }


  const toggleSection = (index) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  useEffect(() => {
    // Lưu trạng thái vào Local Storage mỗi khi expandedSections thay đổi
    localStorage.setItem('expandedSections', JSON.stringify(expandedSections))
  }, [expandedSections])



  return (
    <div className='md:col-span-1 p-6 border-r border-[#243b47] bg-[#1b2a32] h-full overflow-y-auto'>
      <h2 className='text-2xl font-bold mb-4 text-white'>{title}</h2>
      <div className='space-y-2'>
        {chapters.map((chapter, index) => (
          <div key={chapter.chapterDto.id}>
            <button
              className='flex justify-between items-center w-full text-left py-2 hover:bg-[#243b47] rounded transition-colors text-white'
              onClick={() => toggleSection(index)}
            >
              <span className='font-medium'>{chapter.chapterDto.title}</span>
              {expandedSections.includes(index) ? (
                <ChevronDown className='w-5 h-5 text-[#4a9eff]' />
              ) : (
                <ChevronRight className='w-5 h-5 text-[#4a9eff]' />
              )}
            </button>
            {expandedSections.includes(index) && chapter.lectureDtos.length > 0 && (
              <div className='ml-4 mt-2 space-y-2 cursor-pointer'>
                {chapter.lectureDtos.map((lecture) => (
                  <div
                    key={lecture.id}
                    onClick={() => handleLectureClick(lecture.id)}
                    className={`${
                      activeLectureId === lecture.id 
                        ? 'bg-[#34515f]' 
                        : 'hover:bg-[#243b47]'
                    } rounded-sm p-2 transition-colors`}
                  >
                    <div className='flex justify-between items-center mb-1'>
                      <span className='text-sm text-gray-200'>{lecture.title}</span>
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
  )
}

export default React.memo(Curriculum)
