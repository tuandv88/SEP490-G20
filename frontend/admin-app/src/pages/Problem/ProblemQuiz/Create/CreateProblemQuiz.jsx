import React from 'react'
import { useEffect, useState } from 'react'
import Header from './Header'
import BottomTabs from './BottomTabs'
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import FormTabs from './FormTabs'
import { createProblemQuestion } from '@/services/api/questionApi'
import { useStore } from '@/data/store'
import { ToastAction } from '@/components/ui/toast'

const CreateProblemQuiz = ({ onClose, quizId }) => {
  const { quizIdToCreateProblem } = useStore()
  console.log(quizIdToCreateProblem)
  console.log(quizId)
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaveTemplate, setIsSaveTemplate] = useState(false)
  const { toast } = useToast()
  const [isRunSuccess, setIsRunSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      title: '',
      description: 'This is a description for the problem',
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
      createTestScriptDto: []
    }
  })

  const form2 = useForm({
    defaultValues: {
      content: '',
      questionType: 'CodeSnippet',
      questionLevel: 'Easy',
      mark: 1,
      isActive: true,
      questionOptions: []
    }
  })

  const onSubmit = async (data) => {
    const updatedData = { ...data }

    // Quy đổi memoryLimit từ MB sang KB
    updatedData.memoryLimit = updatedData.memoryLimit * 1024
    updatedData.maxFileSize = updatedData.maxFileSize * 1024
    updatedData.stackLimit = updatedData.stackLimit * 1024

    const problemData = {
      createQuestionDto: {
        ...form2.getValues(),
        problem: updatedData
      }
    }

    console.log(problemData)

    try {
      const response = await createProblemQuestion(quizIdToCreateProblem, problemData)   
      onClose()
      toast({
        variant: 'success',
        title: 'Create question successfully T',
        description: 'Create question successfully'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops! Something went wrong',
        description: 'Please try again!',
        action: <ToastAction altText='Try again' onClick={() => onSubmit(form.getValues())}>Try again</ToastAction>
      })
      console.error('Error creating question:', error)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 h-full'>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormTabs
            activeTab={activeTab}
            form={form}
            form2={form2}
            setIsSaveTemplate={setIsSaveTemplate}
            setIsRunSuccess={setIsRunSuccess}
          />
          <BottomTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSaveTemplate={isSaveTemplate}
            isRunSuccess={isRunSuccess}
          />
        </form>
      </FormProvider>
    </div>
  )
}

export default React.memo(CreateProblemQuiz)
