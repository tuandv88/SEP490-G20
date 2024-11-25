import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Step1Form from '@/components/CreateCourse/Step1Form'
import Step2Curriculum from '@/components/CreateCourse/Curriculum'
import CourseLandingPage from '@/components/CreateCourse/Step2LandingPage'
import { PageContainer } from '@/components/page-container'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query';
import { createCourse } from '@/services/api/courseApi';
import { Navigate } from '@tanstack/react-router'
import { useToast } from '@/hooks/use-toast'

export default function CourseCreator() {
  const breadcrumbs = [
    { label: 'Course Table', href: '/course-table' },
    { label: 'Create Course', href: '/create-course' }
  ]
  const [step, setStep] = useState(1)
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    headline: '',
    // courseStatus: 'Draft',
    timeEstimation: 0,
    prerequisites: '',
    objectives: '',
    targetAudiences: '',
    // scheduledPublishDate: '',
    image: null,
    // orderIndex: 1,      
    courseLevel: 'Basic',
    price: 0
  })
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleBackToCourseList = () => {
    navigate({ to: '/course-table' })
  }

  const handleStep1Submit = (data) => {
    setCourseData({ ...courseData, ...data })
    setStep(2)
  }




  const handleLandingPageSubmit = async (data) => {
    console.log('Dữ liệu khóa học cuối cùng:', data)
    const courseCreate = { 
      createCourseDto: {
        ...data
      }
    }
    try {
      console.log('createCourseDto', courseCreate)
      const response = await createCourse(courseCreate)
      console.log('Course created successfully:', response)
      toast({
        title: 'Course created successfully',
        description: 'Course created successfully',
      })
      navigate({ to: '/course-table' })
      // Optionally, navigate to another page or show a success message
    } catch (error) {
      console.error('Error creating course:', error)
      // Optionally, show an error message to the user
    }
  }

  const handleTabChange = (value) => {
    const newStep = parseInt(value.replace('step', ''))
    // Lưu dữ liệu của tab hiện tại trước khi chuyển
    if (step === 1) {
      handleStep1Submit(courseData)
    // } else if (step === 2) {
    //   handleStep2Submit(courseData.curriculum)
    } else if (step === 2) {
      handleLandingPageSubmit(courseData)
    }
    setStep(newStep)
  }

  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <div className='container p-4 mx-auto'>
        <div className='flex justify-end mb-4'>
          <Button onClick={handleBackToCourseList}>Back course list</Button>
        </div>
        <Card className='p-6'>
          <Tabs value={`step${step}`} onValueChange={handleTabChange}>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='step1'>Step 1: Course Details</TabsTrigger>
              {/* <TabsTrigger value='step2'>Step 2: Curriculum</TabsTrigger> */}
              <TabsTrigger value='step2'>Step 2: Course Landing page</TabsTrigger>
            </TabsList>
            <div className='mt-6 '>
              <TabsContent value='step1'>
                <Step1Form onSubmit={handleStep1Submit} initialData={courseData} />
              </TabsContent>
              {/* <TabsContent value='step2'>
                <Step2Curriculum onSubmit={handleStep2Submit} initialData={courseData.curriculum} />
              </TabsContent> */}
              <TabsContent value='step2'>
                <CourseLandingPage onSubmit={handleLandingPageSubmit} initialData={courseData} />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </PageContainer>
  )
}
