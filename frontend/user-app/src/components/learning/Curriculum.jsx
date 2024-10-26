/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

import { ChevronRight, ChevronDown } from 'lucide-react'

const courseSections = [
  {
    title: 'Course Introduction',
    lessons: []
  },
  {
    title: 'Basics of Blender 3D',
    lessons: [
      { title: 'Absolute Tuan', duration: '03:28', progress: 100 },
      { title: 'Object Editing', duration: '04:12', progress: 72 },
      { title: 'Modifiers', duration: '03:32', progress: 16 },
      { title: 'Shaders, Textures & UV', duration: '07:15', progress: 0 },
      { title: 'Lighting', duration: '03:18', progress: 0 }
    ]
  },
  {
    title: 'Mesh Modeling',
    lessons: []
  },
  {
    title: 'Mesh Editing Operations',
    lessons: []
  },
  {
    title: 'Most Common Modifiers',
    lessons: []
  },
  {
    title: 'Orthographic References',
    lessons: []
  },
  {
    title: 'Sculpting',
    lessons: []
  },
  {
    title: 'Subdivision Methods',
    lessons: []
  },
  {
    title: 'Sculpting with Symmetry',
    lessons: []
  },
  {
    title: 'Retopology',
    lessons: []
  },
  {
    title: 'Files and tools',
    lessons: []
  }
]

const Curriculum = () => {
  const [expandedSections, setExpandedSections] = useState([1])

  const toggleSection = (index) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }
  return (
    <div>
      <div className='md:col-span-1 p-6 border-r'>
        <h2 className='text-xl font-bold mb-4'>Blender 3D Fundamentals</h2>
        <div className='text-sm text-gray-600 mb-4'>15 sections • 128 lectures • 25h 28m total length</div>
        <div className='space-y-2'>
          {courseSections.map((section, index) => (
            <div key={index}>
              <button
                className='flex justify-between items-center w-full text-left py-2 hover:bg-gray-100 rounded transition-colors'
                onClick={() => toggleSection(index)}
              >
                <span className='font-medium'>{section.title}</span>
                {expandedSections.includes(index) ? (
                  <ChevronDown className='w-5 h-5 text-gray-500' />
                ) : (
                  <ChevronRight className='w-5 h-5 text-gray-500' />
                )}
              </button>
              {expandedSections.includes(index) && section.lessons.length > 0 && (
                <div className='ml-4 mt-2 space-y-2'>
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex}>
                      <div className='flex justify-between items-center mb-1 cursor-pointer'>
                        <span className='text-sm'>{lesson.title}</span>
                        <span className='text-xs text-gray-500'>{lesson.duration}</span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-1'>
                        <div className='bg-purple-600 h-1 rounded-full' style={{ width: `${lesson.progress}%` }}></div>
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

export default Curriculum
