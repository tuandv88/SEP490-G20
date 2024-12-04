/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import PreCoppy from '../ui/PreCoppy'
import { BookOpenCheck, CheckCircle, Frown, GraduationCap, Smile } from 'lucide-react'
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
}) => {
  const videoRef = useRef(null)
  const [videoTime, setVideoTime] = useState(0) // Lưu thời gian video khi dừng
  const [isPaused, setIsPaused] = useState(false) // Trạng thái video có tạm dừng hay không
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  console.log(lectureScore)

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
    try {
      await CourseAPI.updateCourseProgress(courseId, lectureId)
      await updateCourseProgress() // Cập nhật state sau khi mark complete
      handleNextLecture()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

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
            <div className='document-list mt-5'>
              <h3 className='text-xl font-bold mb-3'>Documents</h3>
              <ul>
                {documentFiles.map((file, index) => (
                  <li key={index} className='mb-2'>
                    <a href={file.presignedUrl} download className='text-blue-500 hover:underline'>
                      Download document {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(Description)
