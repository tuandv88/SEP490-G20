import React from 'react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { ToastAction } from '@/components/ui/toast'
import { Loading } from '@/components/overlay'
import { getProblemDetail } from '@/services/api/problemApi'

import { questionSchema, problemSchema } from './basic-info-step'
import FormTabs from './FormTabs'
import BottomTabs from './BottomTabs'
import { updateProblemQuestion } from '@/services/api/quizApi'

const UpdateProblemQuiz = ({ onClose, quizId, question, problem, setIsUpdate, isUpdate }) => {
  const { toast } = useToast()

  // UI States
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaveTemplate, setIsSaveTemplate] = useState(false)
  const [isRunSuccess, setIsRunSuccess] = useState(false)

  // Data & Loading States
  const [problemDetail, setProblemDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  // Forms
  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: 'This is a description for the problem',
      language: 'Java',
      problemType: 'Assessment',
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

  const form2 = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: '',
      questionType: 'CodeSnippet',
      questionLevel: 'Easy',
      mark: 1,
      isActive: true,
      questionOptions: []
    }
  })

  // Fetch problem details
  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        setIsLoading(true)
        const response = await getProblemDetail(problem.problemDto.id)
        setProblemDetail(response.problemDetailsDto)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch problem details'
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchProblemDetail()
  }, [problem.problemDto.id])

  // Initialize form2 with question data
  useEffect(() => {
    if (question) {
      form2.reset({
        content: question.content,
        questionType: question.questionType,
        questionLevel: question.questionLevel,
        mark: question.mark,
        isActive: question.isActive,
        questionOptions: question.questionOptions
      })
    }
  }, [question, form2])

  // Initialize form with problem data
  useEffect(() => {
    if (problemDetail) {
      form.reset({
        title: problemDetail.title || '',
        description: problemDetail.description || '',
        language: 'Java',
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

  const handleSubmit = async (data) => {
    try {
      setIsLoadingSubmit(true)

      const updatedData = {
        ...data,
        memoryLimit: data.memoryLimit * 1024,
        maxFileSize: data.maxFileSize * 1024,
        stackLimit: data.stackLimit * 1024
      }

      const problemData = {
        question: {
          ...form2.getValues(),
          problemId: problem.problemDto.id,
          problem: updatedData
        }
      }


      await updateProblemQuestion(quizId, question.id, problemData)

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Question updated successfully'
      })

      setIsUpdate(!isUpdate)
      onClose()
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update question',
        action: (
          <ToastAction altText='Try again' onClick={() => handleSubmit(data)}>
            Try again
          </ToastAction>
        )
      })
    } finally {
      setIsLoadingSubmit(false)
    }
  }

  if (isLoading) return <Loading />
  if (!problemDetail) return null

  return (
    <div className='min-h-screen bg-gray-50 h-full'>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormTabs
            activeTab={activeTab}
            form={form}
            form2={form2}
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
            form2={form2}
            isLoadingSubmit={isLoadingSubmit}
          />
        </form>
      </FormProvider>
    </div>
  )
}

export default React.memo(UpdateProblemQuiz)
