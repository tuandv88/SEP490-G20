import React from 'react'
import { useEffect, useState } from 'react'
import Header from './Header'
import BottomTabs from './BottomTabs'
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import FormTabs from './FormTabs'
import { getProblemDetail, updateProblemAg } from '@/services/api/problemApi'
import { ToastAction } from '@/components/ui/toast'
import { useMatch, useNavigate } from '@tanstack/react-router'
import { updateLectureProblemRoute } from '@/routers/router'
import { Loading } from '@/components/ui/overlay'
import { EDIT_CURRICULUM_COURSE_PATH } from '@/routers/router'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateBasicInfoSchema } from './basic-info-step'

const UpdateProblemAg = ({}) => {
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaveTemplate, setIsSaveTemplate] = useState(false)
  const { toast } = useToast()
  const [isRunSuccess, setIsRunSuccess] = useState(false)
  const [problemDetail, setProblemDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const navigate = useNavigate()

  const { params } = useMatch(updateLectureProblemRoute.id)
  const { problemId } = params
  const { lectureId } = params
  const { courseId } = params

  const form = useForm({
    resolver: zodResolver(updateBasicInfoSchema),
    defaultValues: {
      title: '',
      description: 'This is a problem description for Lecture',
      problemType: 'Practice',
      difficultyType: 'Medium',
      cpuTimeLimit: 2,
      cpuExtraTime: 2.5,
      memoryLimit: 250,
      stackLimit: 64,
      maxThread: 70,
      maxFileSize: 10,
      enableNetwork: false,
      isActive: true,
      testCases: {},
      testcripts: []
    }
  })

  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        const response = await getProblemDetail(problemId)
        setProblemDetail(response.problemDetailsDto)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    }
    fetchProblemDetail()
  }, [])

  useEffect(() => {
    if (problemDetail) {
      form.reset({
        title: problemDetail.title || '',
        description: problemDetail.description || '',
        problemType: problemDetail.problemType || 'Challenge',
        difficultyType: problemDetail.difficultyType || 'Medium',
        cpuTimeLimit: problemDetail.cpuTimeLimit || 2,
        cpuExtraTime: problemDetail.cpuExtraTime || 2.5,
        memoryLimit: (problemDetail.memoryLimit || 250) / 1024,
        stackLimit: (problemDetail.stackLimit || 64) / 1024,
        maxThread: problemDetail.maxThread || 70,
        maxFileSize: (problemDetail.maxFileSize || 10) / 1024,
        enableNetwork: problemDetail.enableNetwork || false,
        isActive: problemDetail.isActive || true,
        testCases: problemDetail.testCases || {},
        testcripts: problemDetail.testScrips || []
      })
    }
  }, [problemDetail, form])

  if (isLoading) {
    return <Loading />
  }

  const onSubmit = async (data) => {
    const updatedData = { ...data }

    // Quy đổi memoryLimit từ MB sang KB
    updatedData.memoryLimit = updatedData.memoryLimit * 1024
    updatedData.maxFileSize = updatedData.maxFileSize * 1024
    updatedData.stackLimit = updatedData.stackLimit * 1024

    const problemData = {
      problem: updatedData
    }

    setIsLoadingSubmit(true)
    try {
      const response = await updateProblemAg(problemData, problemId)
      toast({
        variant: 'success',
        title: 'Update problem successfully',
        description: 'Update problem successfully'
      })
      navigate({ to: EDIT_CURRICULUM_COURSE_PATH, params: { courseId } })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops! Something went wrong',
        description: 'Please try again!',
        action: (
          <ToastAction altText='Try again' onClick={() => onSubmit(form.getValues())}>
            Try again
          </ToastAction>
        )
      })
    } finally {
      setIsLoadingSubmit(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header backTo='Back to Curriculum' courseId={courseId} />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormTabs
            activeTab={activeTab}
            form={form}
            setIsSaveTemplate={setIsSaveTemplate}
            setIsRunSuccess={setIsRunSuccess}
            testCaseUpdate={problemDetail?.testCases}
            solutionUpdate={problemDetail?.testScrips[0]}
          />
          <BottomTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSaveTemplate={isSaveTemplate}
            isRunSuccess={isRunSuccess}
            isLoadingSubmit={isLoadingSubmit}
          />
        </form>
      </FormProvider>
    </div>
  )
}

export default React.memo(UpdateProblemAg)
