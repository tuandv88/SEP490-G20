/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import PreCoppy from '../ui/PreCoppy'
import { BookOpenCheck, CheckCircle, Frown, GraduationCap, Smile, Trophy, FileText, Download } from 'lucide-react'
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
  lectureScore,
  updateCourseProgress,
  courseProgress,
}) => {
  const [videoBlobUrl, setVideoBlobUrl] = useState(null)
  const [documentUrls, setDocumentUrls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const updateTimeoutRef = useRef(null)

  const isLectureCompleted = courseProgress?.some(
    progress => progress.lectureId === lectureId
  )

  const handleComplete = async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true)
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      await CourseAPI.updateCourseProgress(courseId, lectureId)
      await updateCourseProgress()

      updateTimeoutRef.current = setTimeout(() => {
        setIsUpdating(false)
        handleNextLecture()
      }, 1000)

    } catch (error) {
      console.error('Error updating progress:', error)
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

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
            {isLectureCompleted ? (
              <div className='flex items-center space-x-2 bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg opacity-75'>
                <CheckCircle className='w-5 h-5' />
                <span>Completed</span>
              </div>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isUpdating}
                className={`flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 
                  hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 
                  rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg
                  ${isUpdating ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className='w-5 h-5' />
                    <span>Mark as complete</span>
                  </>
                )}
              </Button>
            )}

            <div className='flex items-center space-x-4 mr-10'>
              <div className='p-3 bg-green-100 rounded-lg'>
                <GraduationCap className='w-5 h-5 text-green-600' />
              </div>
              <div className='flex flex-col'>
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
            <div className='document-list mt-8'>
              <div className='flex items-center space-x-2 mb-4'>
                <FileText className='w-6 h-6 text-blue-500' />
                <h3 className='text-xl font-bold'>Documents</h3>
              </div>
              <div className='space-y-3'>
                {documentFiles.map((file, index) => {
                  if (file && file.presignedUrl) {
                    return (
                      <div 
                        key={index} 
                        className='flex items-center justify-between bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-all duration-200'
                      >
                        <div className='flex items-center space-x-3 flex-grow'>
                          <FileText className='w-5 h-5 text-blue-500 flex-shrink-0' />
                          <div className='flex flex-col'>
                            <span className='text-gray-200 font-medium truncate max-w-md' title={file.fileName}>
                              {file.fileName}
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center space-x-4'>
                          <a
                            href={file.presignedUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-gray-600'
                            title='Open in new tab'
                          >
                            <Download className='w-5 h-5' />
                          </a>                         
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(NormalLecture)
