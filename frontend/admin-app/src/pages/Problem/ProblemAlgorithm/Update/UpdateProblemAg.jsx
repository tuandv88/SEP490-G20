import React from 'react'
import { useEffect, useState } from 'react'
import Header from './Header'
import BottomTabs from './BottomTabs'
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import FormTabs from './FormTabs'
import { getProblemDetail, updateProblemAg } from '@/services/api/problemApi'
import { ToastAction } from '@/components/ui/toast'
const UpdateProblemAg = ({}) => {
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaveTemplate, setIsSaveTemplate] = useState(false)
  const { toast } = useToast()
  const [isRunSuccess, setIsRunSuccess] = useState(false)
  const [problemDetail, setProblemDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
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
  });

  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        const response = await getProblemDetail('4e3538a1-843b-4d36-8f2a-1fac561384b0');
        setProblemDetail(response.problemDetailsDto);
        setIsLoading(false);
      } catch (error) {
        console.error('Error get problem detail:', error);
        setIsLoading(false);
      }
    };
    fetchProblemDetail();
  }, []);

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
      });
    }
  }, [problemDetail, form]);

  if (isLoading) {
    return <div>Loading...</div>;
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


    try {
      const response = await updateProblemAg(problemData, '4e3538a1-843b-4d36-8f2a-1fac561384b0')
      toast({
        variant: 'success',
        title: 'Create problem successfully',
        description: 'Create problem successfully'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops! Something went wrong',
        description: 'Please try again!',
        action: <ToastAction altText='Try again' onClick={() => onSubmit(form.getValues())}>Try again</ToastAction>
      })
      console.error('Error creating problem:', error)
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
            testCaseUpdate={problemDetail?.testCases}
            solutionUpdate={problemDetail?.testScrips[0]}
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

export default React.memo(UpdateProblemAg)
