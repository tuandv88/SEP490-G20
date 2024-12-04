/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import PreCoppy from '../ui/PreCoppy'
import { BookOpenCheck, CheckCircle, Frown, GraduationCap, Smile, Trophy } from 'lucide-react'
import DescriptionLoading from '../loading/DescriptionLoading'
import { Button } from '../ui/button'
import { LearningAPI } from '@/services/api/learningApi'
import { CourseAPI } from '@/services/api/courseApi'

const NormalLecture = ({
  description,
  videoSrc,
  loading,
  titleProblem,
  handleNextLecture,
  courseId,
  lectureId,
  files,
  lectureScore
}) => {
  console.log(lectureScore)
  const updateProgress = async () => {
    try {
      const response = await CourseAPI.updateCourseProgress(courseId, lectureId)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleComplete = () => {
    updateProgress()
    handleNextLecture()
  }

  const documentFiles = files.filter((file) => file && file.fileType === 'DOCUMENT')

  const handleDownload = (e, fileUrl, fileName) => {
    e.preventDefault()

    // Tạo một thẻ a ẩn và kích hoạt sự kiện click để tải xuống
    const link = document.createElement('a')
    link.href = fileUrl
    link.setAttribute('download', fileName || 'document')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      {loading ? (
        <DescriptionLoading />
      ) : (
        <div className='bg-bGprimary text-gray-300 p-6 mx-auto font-sans h-full'>
          {videoSrc && (
            <div className='relative pb-[56.25%] h-0'>
              <video
                className='absolute top-0 left-0 w-full h-full'
                controls
                src={videoSrc}
                title='Lecture Video'
                preload='auto'
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className='flex items-center justify-between rounded-xl py-4 shadow-lg mt-5'>
            <Button
              onClick={handleComplete}
              className='flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg'
            >
              <CheckCircle className='w-5 h-5' />
              <span>Mark as complete</span>
            </Button>

            <div className='flex items-center space-x-4 mr-10'>

              <div className='p-3 bg-green-100 rounded-lg'>
                <GraduationCap className='w-5 h-5 text-green-600' />
              </div>
              <div className='flex flex-col'>
                {/* <span className='text-gray-400 text-sm font-medium'>Lecture Score</span> */}
                <span className='text-white text-3xl font-bold'>{lectureScore}</span>
              </div>
            </div>
          </div>

          <div className='p-3 rounded-lg flex items-center mb-10 mt-10 w-full border border-spacing-10'>
            <BookOpenCheck className='inline mr-4' size={40} color='#ffffff' />
            <h1 className=' text-white text-2xl font-bold'>{titleProblem}</h1>
            <div className='mt-6'></div>
          </div>

          <hr className='border-b-2 border-gray-100 mb-6 mt-6 overflow-visible' />

          <div className='prose max-w-fit prose-invert w-full markdown-des mt-5'>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div className='relative'>
                      <SyntaxHighlighter style={oneDark} language={match[1]} PreTag='div' {...props}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                      <PreCoppy code={String(children)} />
                    </div>
                  ) : (
                    <code
                      className='bg-gray-300 inline-block text-black rounded px-1 py-0.3 text-sm font-mono'
                      style={{ content: 'none' }}
                      {...props}
                    >
                      {children}
                    </code>
                  )
                }
              }}
            >
              {description}
            </ReactMarkdown>
          </div>
          {documentFiles.length > 0 && (
            <div className='document-list mt-5'>
              <h3 className='text-xl font-bold mb-3'>Documents</h3>
              <ul>
                {documentFiles.map((file, index) => {
                  if (file && file.presignedUrl) {
                    return (
                      <li key={index} className='mb-2'>
                        <a
                          href={file.presignedUrl}
                          onClick={(e) => handleDownload(e, file.presignedUrl, `Document ${index + 1}`)}
                          className='text-blue-500 hover:underline cursor-pointer'
                          target='_blank'
                        >
                          Download document {index + 1}
                        </a>
                      </li>
                    )
                  } else {
                    console.warn('File bị thiếu hoặc thiếu presignedUrl:', file)
                    return null
                  }
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(NormalLecture)
