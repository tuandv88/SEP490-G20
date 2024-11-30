/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import PreCoppy from '../ui/PreCoppy'
import { BookOpenCheck, Frown } from 'lucide-react'
import DescriptionLoading from '../loading/DescriptionLoading'
import ChapterLoading from '../loading/ChapterLoading'
import { Button } from '../ui/button'
import { CourseAPI } from '@/services/api/courseApi'

const Description = ({ description, videoSrc, loading, titleProblem, initialTime, onTimeUpdate, handleNextLecture, courseId, lectureId }) => {
  const videoRef = useRef(null)
  const [videoTime, setVideoTime] = useState(0) // Lưu thời gian video khi dừng
  const [isPaused, setIsPaused] = useState(false) // Trạng thái video có tạm dừng hay không
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  console.log(videoSrc)

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

  const updateProgress = async () => {
    try {
      const response = await CourseAPI.updateCourseProgress(courseId, lectureId)
      console.log('Progress updated:', response)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleComplete = () => {
    updateProgress();
    handleNextLecture();
  }

  return (
    // !videoSrc
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

          <Button
            onClick={handleComplete}
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-5'
          >
            Mark as complete
          </Button>

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
        </div>
      )}
    </div>
  )
}

export default React.memo(Description)
