import React from 'react'
import { useEffect, useState } from 'react'
import Header from './Header'
import BottomTabs from './BottomTabs'
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import FormTabs from './FormTabs'
import { createProblemAg } from '@/services/api/problemApi'
import { PROBLEM_TABLE_PATH } from '@/routers/router'
import { useNavigate } from '@tanstack/react-router'
import { ToastAction } from '@/components/ui/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { basicInfoSchema } from './basic-info-step'

const CreateProblemAg = ({}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaveTemplate, setIsSaveTemplate] = useState(false)
  const { toast } = useToast()
  const [isRunSuccess, setIsRunSuccess] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)


  const form = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: '',
      description: '',
      language: 'Java',
      problemType: 'Challenge',
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

  const onSubmit = async (data) => {
    const updatedData = { ...data }

    // Quy đổi memoryLimit từ MB sang KB
    updatedData.memoryLimit = updatedData.memoryLimit * 1024
    updatedData.maxFileSize = updatedData.maxFileSize * 1024
    updatedData.stackLimit = updatedData.stackLimit * 1024

    const problemData = {
      createProblemDto: updatedData
    }


    setIsLoadingSubmit(true)
    try {
      const response = await createProblemAg(problemData)
      toast({
        variant: 'success',
        title: 'Create problem successfully',
        description: 'Create problem successfully'
      })
      navigate({ to: PROBLEM_TABLE_PATH })
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
      console.error('Error creating problem:', error)
    } finally {
      setIsLoadingSubmit(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header backTo='Back to Curriculum' />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormTabs
            activeTab={activeTab}
            form={form}
            setIsSaveTemplate={setIsSaveTemplate}
            setIsRunSuccess={setIsRunSuccess}
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

export default React.memo(CreateProblemAg)
