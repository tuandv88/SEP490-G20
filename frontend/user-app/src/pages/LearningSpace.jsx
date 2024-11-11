/* eslint-disable no-unused-vars */
import CodeEditor from '@/components/learning/CodeEditor'
import Comments from '@/components/learning/Comment'
import Curriculum from '@/components/learning/Curriculum'
import Description from '@/components/learning/Description'
import HeaderTab from '@/components/learning/HeaderTab'
import { LearningAPI } from '@/services/api/learningApi'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import NotFound from './NotFound'
import ChapterLoading from '@/components/loading/ChapterLoading'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import HeaderCode from '@/layouts/learningheader'
import ToggleCurriculum from '@/components/learning/ToggleCurriculum'
import useClickOutside from '@/components/hooks/useClickOutside'
import ChatAI from '@/components/chat/ChatAI'

const LearningSpace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('descriptions')
  const [chapters, setChapters] = useState([])
  const [title, setTitle] = useState('')
  const [selectLectureId, setSelectedLectureId] = useState(null)
  const [lectureDetail, setLectureDetail] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [videoBlobUrl, setVideoBlobUrl] = useState(null)
  const [isProblemListOpen, setIsProblemListOpen] = useState(false)
  const videoTimeRef = useRef(0);

  //courseId
  const { id, lectureId } = useParams();
  const toggleProblemList = () => {
    setIsProblemListOpen(!isProblemListOpen)
  }
  console.log("Load")

  const handleVideoTimeUpdate = (time) => {
    videoTimeRef.current = time;
  };

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true)
      setError(false)
      try {
        const data = await LearningAPI.getCourseDetails(id)
        setChapters(data?.courseDetailsDto?.chapterDetailsDtos)
        setTitle(data?.courseDetailsDto?.courseDto?.title)
      } catch (error) {
        console.error('Error fetching course detail:', error)
        if (error.response) {
          if (error.response.status >= 500) {
            setError(true)
          } else if (error.response.status === 404) {
            setChapters(null)
          }
        } else {
          setError(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetail()
  }, [id])
 
  // Gọi API lấy lectureDetail khi selectedLectureId thay đổi
  useEffect(() => {
    if ( lectureId) {
      const fetchLectureDetail = async () => {
        try {
          const data = await LearningAPI.getLectureDetails( lectureId)
          setLectureDetail(data)

          //Gọi API để lấy ra file của lecutre đó.
          const lectureFiles = data?.lectureDetailsDto?.files
          const fileDetails = await Promise.all(
            lectureFiles.map(async (file) => {
              const data = await LearningAPI.getLectureFiles(lectureId, file.fileId)

              if (file.fileType === 'VIDEO') {
                const videoResponse = await fetch(data.presignedUrl)
                const videoBlob = await videoResponse.blob()
                const blobUrl = URL.createObjectURL(videoBlob)
                setVideoBlobUrl(blobUrl)
                // Giải phóng bộ nhớ blob khi component unmount
                return () => URL.revokeObjectURL(blobUrl)
              }

              return {
                ...data,
                fileType: file.fileType
              }
            })
          )
          setFiles(fileDetails)
        } catch (error) {
          console.error('Error fetching chapter detail:', error)
        }
      }
      fetchLectureDetail()
    }
  }, [lectureId])

  // if (error) {
  //   return <ErrorPage />
  // }

  // if (!chapters && !loading) {
  //   return (
  //     <NotFound mess='We cannot find documents in this course. Please check the link or search for other courses.' />
  //   )
  // }

  return (
    <div>
      <div>
        <HeaderCode onButtonClick={toggleProblemList} />
      </div>
      <ResizablePanelGroup
        direction='horizontal'
        className='min-h-[200px] rounded-lg border md:min-w-[450px] !h-[94vh]'
      >
        <ResizablePanel defaultSize={40}>
          <div className='scroll-container h-screen'>
            <HeaderTab activeTab={activeTab} setActiveTab={setActiveTab} />
            {loading && <ChapterLoading />}
            {activeTab === 'descriptions' && !loading && (
              <Description
                description={lectureDetail?.lectureDetailsDto?.problem?.description}
                videoSrc={videoBlobUrl}
                loading={loading}
                titleProblem={lectureDetail?.lectureDetailsDto?.problem?.title}
                initialTime={videoTimeRef.current}
                onTimeUpdate={handleVideoTimeUpdate}
              />
            )}
            {activeTab === 'comments' && !loading && <Comments />}
            {activeTab === 'chatbot' && !loading && <ChatAI />}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className='resize-sha w-[3px]' />
        <ResizablePanel defaultSize={60}>
          {/* <QuizScreen></QuizScreen> */}
          <CodeEditor
            templates={lectureDetail?.lectureDetailsDto?.problem?.templates.Java}
            arrayTestcase={lectureDetail?.lectureDetailsDto?.problem?.testCases}
            problemId={lectureDetail?.lectureDetailsDto?.problem?.id}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      {isProblemListOpen && <div onClick={() => setIsProblemListOpen(!isProblemListOpen)} className='z-40 fixed inset-0 bg-gray-800 opacity-60'></div>}

      <ToggleCurriculum
        title={title}
        chapters={chapters}
        setSelectedLectureId={setSelectedLectureId}
        isProblemListOpen={isProblemListOpen}
        toggleProblemList={toggleProblemList}
        navigate={navigate}
      />
    </div>
  )
}

export default React.memo(LearningSpace)

