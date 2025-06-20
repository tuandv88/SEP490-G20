/* eslint-disable no-unused-vars */
import CodeEditor from '@/components/learning/CodeEditor'
import Comments from '@/components/learning/Comment'
import Description from '@/components/learning/Description'
import HeaderTab from '@/components/learning/HeaderTab'
import { LearningAPI } from '@/services/api/learningApi'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import NotFound from './NotFound'
import ChapterLoading from '@/components/loading/ChapterLoading'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import ToggleCurriculum from '@/components/learning/ToggleCurriculum'
import ChatAI from '@/components/chat/ChatAI'
import Quiz from '@/components/learning/Quiz'
import Quiz1 from '@/components/learning/Quiz1'
import QuizScreen from '@/components/learning/QuizScreen'
import Curriculum from '@/components/learning/Curriculum'
import NormalLecture from '@/components/lecture/NormalLecture'
import Quiz2 from '@/components/learning/Quiz2'
import SubmissionHistory from '@/components/learning/submission/SubmissionHistory'
import { ProblemAPI } from '@/services/api/problemApi'
import SubmissionResult from '@/components/learning/submission/SubmissionResult'
import HeaderCode from '@/layouts/learningheaderLec'
import CourseLoadingDetail from '@/components/loading/CourseLoadingDetail'
import { CourseAPI } from '@/services/api/courseApi'
import { UserAPI } from '@/services/api/userApi'



const LearningSpace = () => {
  const navigate = useNavigate()
  const { id, lectureId } = useParams()
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
  const toggleCurriculumRef = useRef()
  const [isSuccessCode, setIsSuccessCode] = useState(false)
  const [problemSubmission, setProblemSubmission] = useState(null)
  const [resultCodeSubmit, setResultCodeSubmit] = useState(null)
  const [currentCode, setCurrentCode] = useState(null)
  const [activeLectureId, setActiveLectureId] = useState(lectureId) 
  const [courseProgress, setCourseProgress] = useState([])
  const [userPoint, setUserPoint] = useState(0)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  //courseId
  
  const toggleProblemList = () => {
    setIsProblemListOpen(!isProblemListOpen)
  }

  const handleNextLecture = () => {
    setActiveLectureId(lectureId)
    toggleCurriculumRef.current.handleNextLecture()
  }
  

  const handleLectureChange = (lectureId) => {
    setActiveLectureId(lectureId)
  }

  const handleVideoTimeUpdate = useCallback((time) => {
    videoTimeRef.current = time
  }, [])

  const togglePanelLayout = () => {
    setIsThreePanels(!isThreePanels)
  }

  useEffect(() => {
    if (lectureDetail) {
      if (lectureDetail.lectureDetailsDto.problem) {
        setActiveTab('descriptions') 
      } else {
        setActiveTab('curriculum') 
      }
    }
  }, [lectureDetail])

  useEffect(() => {
    const fetchCourseProgress = async () => {
      try {
        const data = await CourseAPI.getCourseProgress(id)
        setCourseProgress(data.progress)
      } catch (error) {
        console.error('Error fetching course progress:', error)
      }
    }
    fetchCourseProgress()
  }, [lectureId, id])

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
        setIsInitialLoading(false)
      }
    }

    fetchCourseDetail()
  }, [id])

  useEffect(() => {
    if (activeLectureId) {
      const fetchLectureDetail = async () => {
        try {

          const data = await LearningAPI.getLectureDetails(lectureId)
          setLectureDetail(data)


          //Gọi API để lấy ra file của lecutre đó.
          const lectureFiles = data?.lectureDetailsDto?.files || []
          if (lectureFiles.length === 0) {
            // Nếu không có file nào, đặt videoBlobUrl thành null
            setVideoBlobUrl(null)
          } else {
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
                  fileType: file.fileType,
                  fileName: file.fileName
                }
              })
            )
            setFiles(fileDetails)
          }

          // Kiểm tra nếu problem tồn tại
          const problemId = data?.lectureDetailsDto?.problem?.id
          if (problemId) {
            fetchSubmissionHistory(problemId)
          }
        } catch (error) {
          console.error('Error fetching chapter detail:', error)
        } 
      }

      const fetchSubmissionHistory = async (problemId) => {
        try {
          const response = await ProblemAPI.getSubmissionHistory(problemId)
          setProblemSubmission(response.submissions)
        } catch (error) {
          console.error('Error fetching submission history:', error)
        } 
      }

      fetchLectureDetail()
    }
  }, [lectureId])

  const updateCourseProgressState = async () => {
    try {
      const data = await CourseAPI.getCourseProgress(id)
      setCourseProgress(data.progress)
    } catch (error) {
      console.error('Error fetching course progress:', error)
    }
  }

  useEffect(() => {
    const fetchUserPoint = async () => {
      try {
        const response = await UserAPI.getUserPoint()
        setUserPoint(response.totalPoints)
      } catch (error) {
        console.error('Error fetching user points:', error)
        setUserPoint(0)
      }
    }
    fetchUserPoint()
  }, [lectureId])

  if (isInitialLoading || loading) {
    return <CourseLoadingDetail />
  }

  if (error) {
    return <ErrorPage />
  }

  if (!isInitialLoading && (!chapters || chapters.length === 0)) {
    return (
      <NotFound mess='We cannot find documents in this course. Please check the link or search for other courses.' />
    )
  }


  return (
    <div>
      <div>
        <HeaderCode
          onButtonClick={toggleProblemList}
          onChatClick={togglePanelLayout}
          toggleCurriculumRef={toggleCurriculumRef}
          header='Chapter List'
          userPoint={userPoint}
          lectureScore={lectureDetail?.lectureDetailsDto?.point}
        />
      </div>
      {lectureDetail?.lectureDetailsDto?.problem && (
        <ResizablePanelGroup
          direction='horizontal'
          className='min-h-[200px] rounded-lg border md:min-w-[450px] !h-[94vh]'
        >
          <ResizablePanel id='panel-1' order={1} defaultSize={35}>
            <div className='scroll-container h-full bg-bGprimary'>
              <HeaderTab activeTab={activeTab} setActiveTab={setActiveTab} isNormalLecture={false} />
              {loading && <ChapterLoading />}
              {(activeTab === 'descriptions' || activeTab === 'default' || activeTab === 'curriculum') && !loading && (
                <Description
                  description={lectureDetail?.lectureDetailsDto?.summary}
                  videoSrc={videoBlobUrl}
                  loading={loading}
                  titleProblem={lectureDetail?.lectureDetailsDto?.problem?.title}
                  initialTime={videoTimeRef.current}
                  onTimeUpdate={handleVideoTimeUpdate}
                  handleNextLecture={handleNextLecture}
                  courseId={id}
                  lectureId={lectureId}
                  files={files}
                  lectureScore={lectureDetail?.lectureDetailsDto?.point}
                  updateCourseProgress={updateCourseProgressState}
                  courseProgress={courseProgress}
                />
              )}
              {activeTab === 'submissionResult' && !loading && (
                <SubmissionResult currentCode={currentCode} resultCodeSubmit={resultCodeSubmit} />
              )}
              {activeTab === 'submission' && !loading && <SubmissionHistory submissions={problemSubmission} />}
              {activeTab === 'comments' && !loading && <Comments lectureId={lectureId} courseId={id} />}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className='resize-sha w-[3px]' />
          <ResizablePanel id='panel-2' order={2} defaultSize={isThreePanels ? 40 : 60}>
            <CodeEditor
              isSuccessCode={isSuccessCode}
              setIsSuccessCode={setIsSuccessCode}
              templates={lectureDetail?.lectureDetailsDto?.problem?.templates.Java}
              arrayTestcase={lectureDetail?.lectureDetailsDto?.problem?.testCases}
              problemId={lectureDetail?.lectureDetailsDto?.problem?.id}
              setActiveTab={setActiveTab}
              setResultCodeSubmit={setResultCodeSubmit}
              setCurrentCode={setCurrentCode}
            />
          </ResizablePanel>
          {isThreePanels && (
            <>
              <ResizableHandle withHandle className='resize-sha w-[3px]' />
              <ResizablePanel id='panel-3' order={3} defaultSize={35}>
                <div className='scroll-container h-full'>
                  <ChatAI lectureId={lectureId} problemId={lectureDetail?.lectureDetailsDto?.problem?.id} />
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
             <Curriculum 
             courseId={id} 
             chapters={chapters} 
             setSelectedLectureId={handleLectureChange} title={title} 
             setActiveLectureId={handleLectureChange}
             activeLectureId={activeLectureId}
             courseProgress={courseProgress} />
             
             //<Curriculum3 />
            )}
            {activeTab === 'comments' && !loading && <Comments lectureId={lectureId} courseId={id} />}
          </ResizablePanel>
          <ResizableHandle withHandle className='resize-sha w-[3px]' />
          <ResizablePanel id='panel-2' order={2} defaultSize={isThreePanels ? 50 : 75}>
            <div className='scroll-container h-full bg-bGprimary'>
              {/* {loading && <ChapterLoading />} */}

              <NormalLecture
                description={lectureDetail?.lectureDetailsDto?.summary}
                videoSrc={videoBlobUrl}
                loading={loading}
                titleProblem={lectureDetail?.lectureDetailsDto?.title}   
                handleNextLecture={handleNextLecture}
                courseId={id}
                lectureId={lectureId}
                files={files}
                lectureScore={lectureDetail?.lectureDetailsDto?.point}
                updateCourseProgress={updateCourseProgressState}
                courseProgress={courseProgress}
              />
            </div>
          </ResizablePanel>
          {isThreePanels && (
            <>
              <ResizableHandle withHandle className='resize-sha w-[3px]' />
              <ResizablePanel id='panel-3' order={3} defaultSize={25}>
                <div className='scroll-container h-full'>
                  <ChatAI lectureId={lectureId} problemId={lectureDetail?.lectureDetailsDto?.problem?.id} />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      )}

      {lectureDetail?.lectureDetailsDto?.quiz && (
        <div className='h-[94vh] w-full bg-bGprimary scroll-container'>
          <Quiz2 quiz={lectureDetail?.lectureDetailsDto?.quiz} lectureId={lectureId} />
        </div>
      )}

      {isProblemListOpen && (
        <div
          onClick={() => setIsProblemListOpen(!isProblemListOpen)}
          className='z-40 fixed inset-0 bg-gray-800 opacity-60'
        ></div>
      )}

      <ToggleCurriculum
        ref={toggleCurriculumRef}
        title={title}
        chapters={chapters}
        setSelectedLectureId={handleLectureChange}
        isProblemListOpen={isProblemListOpen}
        toggleProblemList={toggleProblemList}
        setActiveLectureId={handleLectureChange}
        navigate={navigate}
        courseId={id}
        activeLectureId={activeLectureId}
        courseProgress={courseProgress}
      />
    </div>
  )
}

export default React.memo(LearningSpace)
