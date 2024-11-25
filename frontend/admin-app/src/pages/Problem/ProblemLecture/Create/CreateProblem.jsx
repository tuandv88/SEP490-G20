import React from 'react';
import { useEffect, useState } from 'react';
import Header from './Header';
import BottomTabs from './BottomTabs';
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import FormTabs from './FormTabs';
import { createProblem } from '@/services/api/problemApi'
import { useMatch } from '@tanstack/react-router';
import { createProblemRoute } from '@/routers/router';

const CreateProblem = ({ }) => {

  //new
  const { params } = useMatch(createProblemRoute.id);
  const { lectureId } = params;
  console.log(lectureId)
  
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaveTemplate, setIsSaveTemplate] = useState(false)
  const { toast } = useToast();
  const [isRunSuccess, setIsRunSuccess] = useState(false)
  const [hasLecture, setHasLecture] = useState(false)

  //new
  useEffect(() => {
    if (lectureId) {
      setHasLecture(true)
    }
  }, [lectureId])
  
  const form = useForm({
    defaultValues: {
      title: "",
      description: "This is a problem for lecture", //new
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

    try {
      const response = await createProblem(problemData, lectureId)
      toast({
        title: 'Create problem successfully',
        description: 'Create problem successfully'
      })
      //navigate here
    } catch (error) {
      console.error('Error creating problem:', error)
    }
  
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormTabs activeTab={activeTab} form={form} setIsSaveTemplate={setIsSaveTemplate} setIsRunSuccess={setIsRunSuccess} hasLecture={hasLecture}/>
        <BottomTabs 
          
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isSaveTemplate={isSaveTemplate}
          isRunSuccess={isRunSuccess}
        />
        </form>
      </FormProvider>
     
    </div>
  );
}

export default React.memo(CreateProblem);
