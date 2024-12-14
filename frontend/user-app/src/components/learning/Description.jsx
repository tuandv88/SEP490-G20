/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import PreCoppy from '../ui/PreCoppy'
import { BookOpenCheck, CheckCircle, Frown, GraduationCap, Smile, FileText, Download } from 'lucide-react'
import DescriptionLoading from '../loading/DescriptionLoading'
import ChapterLoading from '../loading/ChapterLoading'
import { Button } from '../ui/button'
import { CourseAPI } from '@/services/api/courseApi'

const Description = ({
  description,
  videoSrc,
  loading,
  titleProblem,
  initialTime,
  onTimeUpdate,
  handleNextLecture,
  courseId,
  lectureId,
  files,
  lectureScore,
  updateCourseProgress,
  courseProgress,
}) => {
  const videoRef = useRef(null)
  const [videoTime, setVideoTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const updateTimeoutRef = useRef(null)

  const isLectureCompleted = courseProgress?.some(
    progress => progress.lectureId === lectureId
  )

  // Khôi phục thời gian khi component mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = initialTime
    }
  }, [initialTime, videoSrc])

  // Lưu thời gian hiện tại khi component unmount
  useEffect(() => {
    const handlePause = () => {
      if (videoRef.current) {
        onTimeUpdate(videoRef.current.currentTime)
      }
    }

    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener('pause', handlePause)
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('pause', handlePause)
        onTimeUpdate(videoElement.currentTime) // Lưu thời gian khi unmount
      }
    }
  }, [onTimeUpdate])

  if (loading) {
    return <ChapterLoading />
  }

  const handleVideoLoaded = () => {
    setIsVideoLoading(false) // Video đã sẵn sàng
  }

  const handleComplete = async () => {
    if (isUpdating) return; // Prevent spam if already updating
    
    try {
      setIsUpdating(true)
      
      // Clear any existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      await CourseAPI.updateCourseProgress(courseId, lectureId)
      await updateCourseProgress()

      // Add delay before allowing next update
      updateTimeoutRef.current = setTimeout(() => {
        setIsUpdating(false)
        handleNextLecture()
      }, 1000) // 1 second delay

    } catch (error) {
      console.error('Error updating progress:', error)
      setIsUpdating(false)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  const documentFiles = files.filter((file) => file && file.fileType === 'DOCUMENT')

  return (
    <div>
      {loading ? (
        <ChapterLoading />
      ) : (
        <div className='bg-bGprimary text-gray-300 p-6 mx-auto font-sans h-full'>
          {videoSrc && (
            <div className='relative pb-[56.25%] h-0'>
              <video
                ref={videoRef}
                className='absolute top-0 left-0 w-full h-full'
                controls
                src={videoSrc}
                title='Lecture Video'
                preload='auto'
                onLoadedData={handleVideoLoaded}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className='flex items-center justify-between rounded-xl py-4 shadow-lg mt-5'>
            {isLectureCompleted && (
              <div className='flex items-center space-x-2 bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg opacity-75'>
                <CheckCircle className='w-5 h-5' />
                <span>Completed</span>
              </div>
            // ) : (
            //   <Button
            //     onClick={handleComplete}
            //     disabled={isUpdating}
            //     className={`flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 
            //       hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 
            //       rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg
            //       ${isUpdating ? 'opacity-75 cursor-not-allowed' : ''}`}
            //   >
            //     {isUpdating ? (
            //       <>
            //         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            //         <span>Updating...</span>
            //       </>
            //     ) : (
            //       <>
            //         <CheckCircle className='w-5 h-5' />
            //         <span>Mark as complete</span>
            //       </>
            //     )}
            //   </Button>
            // )
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
                      className='bg-gray-200 inline-block text-black rounded px-1 py-0.3 text-sm font-mono opacity-60'
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

export default React.memo(Description)
