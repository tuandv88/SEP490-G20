/* eslint-disable no-unused-vars */
import CodeEditor from '@/components/learning/CodeEditor'
import { LearningAPI } from '@/services/api/learningApi'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ChapterLoading from '@/components/loading/ChapterLoading'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import HeaderCode from '@/layouts/learningheader'
import ToggleProblem from '@/components/problem/SolveChallenge/ToggleProblem'
import { ProblemAPI } from '@/services/api/problemApi'
import SubmissionResult from '@/components/learning/submission/SubmissionResult'
import ErrorPage from '@/pages/ErrorPage'
import { NotFound } from '@/pages'
import HeaderTabCode from './HeaderTabCode'
import DescriptionProblem from './DescriptionProblem'
import SubmissionHistoryProblem from '@/components/learning/submission/SubmissionHistoryProblem'
import CourseLoadingDetail from '@/components/loading/CourseLoadingDetail'

const ProblemSpace = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('descriptions')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isProblemListOpen, setIsProblemListOpen] = useState(false)

  const toggleProblemRef = useRef()
  const [isSuccessCode, setIsSuccessCode] = useState(false)
  const [problemSubmission, setProblemSubmission] = useState(null)
  const [resultCodeSubmit, setResultCodeSubmit] = useState(null)
  const [currentCode, setCurrentCode] = useState(null)
  const [problemDetail, setProblemDetail] = useState(null)
  const [problemList, setProblemList] = useState([])
  //problemId
  const { problemId } = useParams()
  const toggleProblemList = () => {
    setIsProblemListOpen(!isProblemListOpen)
  }

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  useEffect(() => {
    const fetchProblemList = async () => {
      try {
        const data = await ProblemAPI.getAllProblems(1, 30)
        setProblemList(data.problems.data)
      } catch (error) {
        console.error('Error fetching problem list:', error)
        setError(true)
      }
    }
    fetchProblemList()
  }, [])

  useEffect(() => {
    if (problemId) {
      const fetchProblemDetail = async () => {
        setLoading(true)
        try {
          const data = await ProblemAPI.getProblem(problemId)
          setProblemDetail(data.problemDto)
          if (data.problemDto?.id) {
            fetchSubmissionHistory(data.problemDto.id)
          }
        } catch (error) {
          console.error('Error fetching problem detail:', error)
          setError(true)
        } finally {
          setLoading(false)
          setIsInitialLoading(false)
        }
      }

      const fetchSubmissionHistory = async (problemId) => {
        try {
          const response = await ProblemAPI.getSubmissionHistoryProblem(problemId)
          setProblemSubmission(response.submissions)
        } catch (error) {
          console.error('Error fetching submission history:', error)
        }
      }

      fetchProblemDetail()
    }
  }, [problemId])

  useEffect(() => {
    const fetchSubmissionHistory = async () => {
        try {
          const response = await ProblemAPI.getSubmissionHistoryProblem(problemId)
          setProblemSubmission(response.submissions)
        } catch (error) {
          console.error('Error fetching submission history:', error)
        }
      }
      fetchSubmissionHistory()
  }, [activeTab])

  useEffect(() => {
    if (problemList.length > 0 && problemId) {
      const index = problemList.findIndex(problem => problem.problemsId === problemId);
      if (index !== -1) {
        setCurrentProblemIndex(index);
      }
    }
  }, [problemId, problemList]);

  useEffect(() => {
    setResultCodeSubmit(null);
    setCurrentCode(null);
    setIsSuccessCode(false);
    setActiveTab('descriptions');
  }, [problemId]);

  if (isInitialLoading || loading) {
    return <CourseLoadingDetail />
  }

  if (error) {
    return <ErrorPage />
  }

  if (!isInitialLoading && !problemDetail) {
    return <NotFound />
  }

  return (
    <div>
      <div>
        <HeaderCode onButtonClick={toggleProblemList} toggleCurriculumRef={toggleProblemRef} header='Problem List' currentProblemIndex={currentProblemIndex} problemList={problemList} navigate={navigate} />
      </div>

      {problemDetail && (
        <ResizablePanelGroup
          direction='horizontal'
          className='min-h-[200px] rounded-lg border md:min-w-[450px] !h-[94vh]'
        >
          <ResizablePanel id='panel-1' order={1} defaultSize={40}>
            <div className='scroll-container h-full bg-[#1b2a32]'>
              <HeaderTabCode activeTab={activeTab} setActiveTab={setActiveTab} />
              {loading && <ChapterLoading />}
              {activeTab === 'descriptions' && !loading && (
                <DescriptionProblem
                  description={problemDetail?.description}
                  loading={loading}
                  titleProblem={problemDetail?.title}
                />
              )}
              {activeTab === 'submissionResult' && !loading && (
                <SubmissionResult currentCode={currentCode} resultCodeSubmit={resultCodeSubmit} />
              )}
              {activeTab === 'submission' && !loading && <SubmissionHistoryProblem submissions={problemSubmission} />}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className='resize-sha w-[3px]' />
          <ResizablePanel id='panel-2' order={2} defaultSize={60}>
            <CodeEditor
              isSuccessCode={isSuccessCode}
              setIsSuccessCode={setIsSuccessCode}
              templates={problemDetail?.templates.Java}
              arrayTestcase={problemDetail?.testCases}
              problemId={problemDetail?.id}
              setActiveTab={setActiveTab}
              setResultCodeSubmit={setResultCodeSubmit}
              setCurrentCode={setCurrentCode}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )} 

      {isProblemListOpen && (
        <div
          onClick={() => setIsProblemListOpen(!isProblemListOpen)}
          className='z-40 fixed inset-0 bg-gray-800 opacity-60'
        ></div>
      )}

      <ToggleProblem
        ref={toggleProblemRef}
        isProblemListOpen={isProblemListOpen}
        toggleProblemList={toggleProblemList}
        navigate={navigate}
        problems={problemList}
        currentProblemId={problemId}
      />
    </div>
  )
}

export default React.memo(ProblemSpace)
