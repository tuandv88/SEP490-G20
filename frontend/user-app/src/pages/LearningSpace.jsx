/* eslint-disable no-unused-vars */
import CodeEditor from '@/components/learning/CodeEditor'
import Comments from '@/components/learning/Comment'
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
import ChatAI from '@/components/chat/ChatAI'
import Quiz from '@/components/learning/Quiz'
import Quiz1 from '@/components/learning/Quiz1'
import QuizScreen from '@/components/learning/QuizScreen'
import Curriculum from '@/components/learning/Curriculum'
import NormalLecture from '@/components/lecture/NormalLecture'

const LearningSpace = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('default')
  const [chapters, setChapters] = useState([])
  const [title, setTitle] = useState('')
  const [selectLectureId, setSelectedLectureId] = useState(null)
  const [lectureDetail, setLectureDetail] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [videoBlobUrl, setVideoBlobUrl] = useState(null)
  const [isProblemListOpen, setIsProblemListOpen] = useState(false)
  const videoTimeRef = useRef(0)
  const [isThreePanels, setIsThreePanels] = useState(false)
  const [firstLectureId, setFirstLectureId] = useState(null)

  //courseId
  const { id, lectureId } = useParams()
  console.log(id)
  console.log(lectureId)
  const toggleProblemList = () => {
    setIsProblemListOpen(!isProblemListOpen)
  }
  console.log('Load')

  const handleVideoTimeUpdate = (time) => {
    videoTimeRef.current = time
  }

  const togglePanelLayout = () => {
    setIsThreePanels(!isThreePanels)
  }

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true)
      setError(false)
      try {
        const data = await LearningAPI.getCourseDetails(id)
        console.log(data)
        setChapters(data?.courseDetailsDto?.chapterDetailsDtos)
        setTitle(data?.courseDetailsDto?.courseDto?.title)
        // setFirstLectureId(data?.courseDetailsDto.chapterDetailsDtos[4].lectureDtos[0].id)
        // console.log(firstLectureId)
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

  
  useEffect(() => {
    if (lectureId) {
      const fetchLectureDetail = async () => {
        try {
          //console.log(firstLectureId)
          const data = await LearningAPI.getLectureDetails(lectureId)
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

  if (error) {
    return <ErrorPage />
  }



  if (!chapters || chapters.length === 0 && !loading) {
    return (
      <NotFound mess='We cannot find documents in this course. Please check the link or search for other courses.' />
    )
  }

  return (
    <div>
      <div>
        <HeaderCode onButtonClick={toggleProblemList} onChatClick={togglePanelLayout} />
      </div>
      {lectureDetail?.lectureDetailsDto?.problem && (
        <ResizablePanelGroup
          direction='horizontal'
        className='min-h-[200px] rounded-lg border md:min-w-[450px] !h-[94vh]'
      >
        <ResizablePanel id='panel-1' order={1} defaultSize={40}>
          <div className='scroll-container h-full'>
            <HeaderTab activeTab={activeTab} setActiveTab={setActiveTab} isNormalLecture={false} />
            {loading && <ChapterLoading />}
            {(activeTab === 'descriptions' || activeTab === 'default' || activeTab === 'curriculum') && !loading && (
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
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className='resize-sha w-[3px]' />
        <ResizablePanel id='panel-2' order={2} defaultSize={isThreePanels ? 40 : 60}>
          {/* <QuizScreen></QuizScreen> */}
          <CodeEditor
            templates={lectureDetail?.lectureDetailsDto?.problem?.templates.Java}
            arrayTestcase={lectureDetail?.lectureDetailsDto?.problem?.testCases}
            problemId={lectureDetail?.lectureDetailsDto?.problem?.id}
          />
        </ResizablePanel>
        {isThreePanels && (
          <>
            <ResizableHandle withHandle className='resize-sha w-[3px]' />
            <ResizablePanel id='panel-3' order={3} defaultSize={30}>
              <div className='scroll-container h-full'>
              <ChatAI lectureId={lectureId} problemId={lectureDetail?.lectureDetailsDto?.problem?.id}/>
              </div>
            </ResizablePanel>
          </>
          )}
        </ResizablePanelGroup>
      )}

      {/* With case Lecture is normal lecture */}
      {!lectureDetail?.lectureDetailsDto?.problem && !lectureDetail?.lectureDetailsDto?.quiz && (
        <ResizablePanelGroup
          direction='horizontal'
        className='min-h-[200px] rounded-lg border md:min-w-[450px] !h-[94vh]'
      >
        <ResizablePanel id='panel-1' order={1} defaultSize={25}>
          <HeaderTab activeTab={activeTab} setActiveTab={setActiveTab} isNormalLecture={true} />
            {loading && <ChapterLoading />}
            {(activeTab === 'curriculum' || activeTab === 'default') && !loading && (
              <Curriculum chapters={chapters} setSelectedLectureId={setSelectedLectureId} title={title} />  
            )}
            {activeTab === 'comments' && !loading && <Comments />}                  
        </ResizablePanel>
        <ResizableHandle withHandle className='resize-sha w-[3px]' />
        <ResizablePanel id='panel-2' order={2} defaultSize={isThreePanels ? 50 : 75}>        
        <div className='scroll-container h-full'>            
            {/* {loading && <ChapterLoading />} */}

              <NormalLecture
                description={lectureDetail?.lectureDetailsDto?.summary}
                videoSrc={videoBlobUrl}
                loading={loading}
                titleProblem={lectureDetail?.lectureDetailsDto?.title}
              />           
          </div>
        </ResizablePanel>
        {isThreePanels && (
          <>
            <ResizableHandle withHandle className='resize-sha w-[3px]' />
            <ResizablePanel id='panel-3' order={3} defaultSize={25}>
              <div className='scroll-container h-full'>
              <ChatAI lectureId={lectureId} problemId={lectureDetail?.lectureDetailsDto?.problem?.id}/>
              </div>
            </ResizablePanel>
          </>
          )}
        </ResizablePanelGroup>
      )}

      {lectureDetail?.lectureDetailsDto?.quiz && (
        <div className='h-[94vh] w-full bg-bGprimary scroll-container'>
          <Quiz1 quiz={lectureDetail?.lectureDetailsDto?.quiz}/>
        </div>
      )}

      {isProblemListOpen && (
        <div
          onClick={() => setIsProblemListOpen(!isProblemListOpen)}
          className='z-40 fixed inset-0 bg-gray-800 opacity-60'
        ></div>
      )}

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
