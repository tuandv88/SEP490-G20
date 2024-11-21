import { useEffect, useState } from 'react';
import Header from './Header';
import BottomTabs from './BottomTabs';
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import FormTabs from './FormTabs';
import { createProblem } from '@/services/api/problemApi'
export default function Primary({ navigationUrl, navigationTitle, lectureId, problemType }) {


  const [activeTab, setActiveTab] = useState('basic');
  const [isSaveTemplate, setIsSaveTemplate] = useState(false)
  const { toast } = useToast();

  console.log(isSaveTemplate)
  
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      problemType: "Practice",
      difficultyType: "Medium",
      cpuTimeLimit: 2,
      cpuExtraTime: 2.5,
      memoryLimit: 250,
      stackLimit: 250,
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
      const response = await createProblem(problemData)
      toast({
        title: 'Create problem successfully',
        description: 'Create problem successfully'
      })
    } catch (error) {
      console.error('Error creating problem:', error)
    }

   
  };

   // Hàm xử lý submit tùy chỉnh
  //  const handleCustomSubmit = (event) => {
  //   event.preventDefault(); // Ngăn chặn hành vi mặc định của form

  //   // Lấy dữ liệu từ form
  //   const formData = form.getValues();

  //   toast({
  //     title: "Form submitted successfully!",
  //     description: <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
  //       <code className="text-white">{JSON.stringify(formData, null, 2)}</code>
  //     </pre>,
  //   });

  //   // Thực hiện các hành động khác nếu cần
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header backTo='Back to Curriculum' />
      <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormTabs activeTab={activeTab} form={form} setIsSaveTemplate={setIsSaveTemplate}/>
        <BottomTabs 
          
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isSaveTemplate={isSaveTemplate}
        />
        </form>
      </FormProvider>
     
    </div>
  );
}