import React from 'react';
import { useEffect, useState } from 'react';
import Header from './Header';
import BottomTabs from './BottomTabs';
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import FormTabs from './FormTabs';
import { createProblemLecture } from '@/services/api/problemApi'
import { useMatch, useNavigate } from '@tanstack/react-router';
import { createProblemLectureRoute } from '@/routers/router';
import { ToastAction } from '@/components/ui/toast';


const CreateProblemLecture = ({ }) => {

  //new
  const { params } = useMatch(createProblemLectureRoute.id);
  const { lectureId } = params;
  const { courseId } = params;
  const navigate = useNavigate()


  const [activeTab, setActiveTab] = useState('basic');
  const [isSaveTemplate, setIsSaveTemplate] = useState(false)
  const { toast } = useToast();
  const [isRunSuccess, setIsRunSuccess] = useState(false)
  const [hasLecture, setHasLecture] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  //new
  useEffect(() => {
    if (lectureId) {
      setHasLecture(true)
    }
  }, [lectureId])
  
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      problemType: "Practice",
      difficultyType: "Medium",
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

  const onSubmit = async (data) => {

    const updatedData = { ...data };

    // Quy đổi memoryLimit từ MB sang KB
    updatedData.memoryLimit = updatedData.memoryLimit * 1024;
    updatedData.maxFileSize = updatedData.maxFileSize * 1024;
    updatedData.stackLimit = updatedData.stackLimit * 1024;


    const problemData = {
      createProblemDto: updatedData
    }

    console.log(problemData)

    setIsLoadingSubmit(true)
    try {
      const response = await createProblemLecture(problemData, lectureId)
      toast({
        variant: 'success',
        title: 'Create problem successfully',
        description: 'Create problem successfully'
      })
      navigate({ to: `/edit-curriculum-course/${courseId}` })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops! Something went wrong',
        description: 'Please try again!',
        action: <ToastAction altText='Try again' onClick={() => onSubmit(form.getValues())}>Try again</ToastAction>
      })
      console.error('Error creating problem:', error)
    } finally {
      setIsLoadingSubmit(false)
    }
  
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header courseId={courseId} />
      <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormTabs 
          activeTab={activeTab} 
          form={form} 
          setIsSaveTemplate={setIsSaveTemplate} 
          setIsRunSuccess={setIsRunSuccess} 
          hasLecture={hasLecture}
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
  );
}

export default React.memo(CreateProblemLecture);
