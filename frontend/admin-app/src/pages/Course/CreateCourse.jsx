import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Step1Form from '@/components/CreateCourse/Step1Form'
import Step2Curriculum from '@/components/CreateCourse/Step2Curriculum'
import CourseLandingPage from '@/components/CreateCourse/CourseLandingPage'
import { PageContainer } from '@/components/page-container'
import { useNavigate } from '@tanstack/react-router'

export default function CourseCreator() {
  const breadcrumbs = [{ label: 'Create Course', href: '/create-course' }]
  const [step, setStep] = useState(1)
  const [courseData, setCourseData] = useState({
    title: '',
    headline: '',
    prerequisites: '',
    objectives: '',
    targetAudiences: '',
    timeEstimation: 0,
    curriculum: [],
    courseStatus: 'Draft',
    scheduledPublishDate: '',
    imageCourse: null,
    courseLevel: 'Basic',
    price: 0
  })
  const navigate = useNavigate()

  const handleBackToCourseList = () => {
    navigate({ to: '/course-table' })
  }

  const handleStep1Submit = (data) => {
    setCourseData({ ...courseData, ...data })
    setStep(2)
  }

  const handleStep2Submit = (curriculum) => {
    setCourseData({ ...courseData, curriculum })
    setStep(3)
  }

  const handleLandingPageSubmit = (data) => {
    setCourseData({ ...courseData, ...data })
    console.log('Dữ liệu khóa học cuối cùng:', courseData)
    // Ở đây bạn thường sẽ gửi dữ liệu đến backend
  }

  const handleTabChange = (value) => {
    const newStep = parseInt(value.replace('step', ''))
    // Lưu dữ liệu của tab hiện tại trước khi chuyển
    if (step === 1) {
      handleStep1Submit(courseData)
    } else if (step === 2) {
      handleStep2Submit(courseData.curriculum)
    } else if (step === 3) {
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
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='step1'>Step 1: Course Details</TabsTrigger>
              <TabsTrigger value='step2'>Step 2: Curriculum</TabsTrigger>
              <TabsTrigger value='step3'>Step 3: Course Landing page</TabsTrigger>
            </TabsList>
            <div className='mt-6 '>
              <TabsContent value='step1'>
                <Step1Form onSubmit={handleStep1Submit} initialData={courseData} />
              </TabsContent>
              <TabsContent value='step2'>
                <Step2Curriculum onSubmit={handleStep2Submit} initialData={courseData.curriculum} />
              </TabsContent>
              <TabsContent value='step3'>
                <CourseLandingPage onSubmit={handleLandingPageSubmit} initialData={courseData} />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </PageContainer>
  )
}
