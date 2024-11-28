import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loading } from '@/components/ui/overlay'
import Step1Form from '@/components/CreateCourse/Step1Form'
import CourseLandingPage from '@/components/CreateCourse/Step2LandingPage'
import { PageContainer } from '@/components/page-container'
import { useNavigate } from '@tanstack/react-router'
import { createCourse } from '@/services/api/courseApi'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, BookOpen, Rocket, AlertCircle, CheckCircle, X } from 'lucide-react'

export default function CourseCreator() {
  const breadcrumbs = [
    { label: 'Course Table', href: '/course-table' },
    { label: 'Create Course', href: '/create-course' }
  ]
  const [activeTab, setActiveTab] = useState('step1')
  const [error, setError] = useState(null)
  const [courseData, setCourseData] = useState({
    // Step 1 data
    title: '',
    description: '',
    headline: '',
    timeEstimation: 0,
    prerequisites: '',
    objectives: '',
    targetAudiences: '',
    // Step 2 data
    image: null,
    courseLevel: 'Basic',
    price: 0
  })
  const [isStep1Complete, setIsStep1Complete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleBackToCourseList = () => {
    if (window.confirm('Are you sure you want to leave? Your progress will be lost.')) {
      navigate({ to: '/course-table' })
    }
  }

  const handleStep1Submit = (data) => {
    setCourseData((prevData) => ({ ...prevData, ...data }))
    setIsStep1Complete(true)
    setActiveTab('step2')
  }

  const handleStep2DataChange = (data) => {
    setCourseData((prevData) => ({ ...prevData, ...data }))
  }

  const handleLandingPageSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    const courseCreate = {
      createCourseDto: {
        ...courseData,
        ...data
      }
    }
    console.log('courseCreate', courseCreate)
    try {
      const response = await createCourse(courseCreate)
      console.log('Course created successfully:', response)
      toast({
        title: 'Course created successfully',
        description: 'Your new course has been added to the course list.',
        duration: 3000
      })
      navigate({ to: '/course-table' })
    } catch (error) {
      console.error('Error creating course:', error)
      setError('There was a problem creating your course. Please try again.')
      toast({
        title: 'Error creating course',
        description: 'There was a problem creating your course. Please try again.',
        variant: 'destructive',
        duration: 3000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (value) => {
    if (value === 'step2' && !isStep1Complete) {
      toast({
        title: 'Please complete Step 1',
        description: 'You need to fill out all required fields in Step 1 before proceeding.',
        variant: 'destructive',
        duration: 3000
      })
      return
    }
    setActiveTab(value)
  }

  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
        <Card className='shadow-lg w-full max-w-6xl mx-auto'>
          <CardHeader>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <div>
                <CardTitle className='text-2xl sm:text-3xl font-bold'>Create New Course</CardTitle>
                <CardDescription className='mt-1'>Fill in the details to create your new course</CardDescription>
              </div>
              <Button variant='outline' onClick={handleBackToCourseList} className='w-full sm:w-auto'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Course List
              </Button>
            </div>
          </CardHeader>
          <CardContent className='w-full'>
            <div className='mb-6'>
              <Progress value={activeTab === 'step1' ? 50 : 100} className='w-full' />
              <div className='flex justify-between mt-2 text-sm text-gray-500'>
                <span>Step {activeTab === 'step1' ? '1' : '2'} of 2</span>
                <span>{activeTab === 'step1' ? '50%' : '100%'} Complete</span>
              </div>
            </div>
            {error && (
              <Alert variant='destructive' className='mb-6'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button variant='ghost' className='h-4 w-4 p-0 absolute top-4 right-4' onClick={() => setError(null)}>
                  <X className='h-4 w-4' />
                </Button>
              </Alert>
            )}
            <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
              <TabsList className='w-full h-auto p-0 bg-transparent border-b border-gray-200'>
                <div className='grid w-full grid-cols-2'>
                  <TabsTrigger
                    value='step1'
                    className={`
                      flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 
                      border-b-2 transition-all duration-200 text-sm sm:text-base
                      hover:text-primary hover:bg-gray-50
                      data-[state=active]:border-primary data-[state=active]:text-primary
                      data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500
                    `}
                  >
                    <BookOpen className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
                    Course Details
                    {isStep1Complete && <CheckCircle className='w-3 h-3 sm:w-4 sm:h-4 ml-2 text-green-500' />}
                  </TabsTrigger>
                  <TabsTrigger
                    value='step2'
                    disabled={!isStep1Complete}
                    className={`
                      flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 
                      border-b-2 transition-all duration-200 text-sm sm:text-base
                      hover:text-primary hover:bg-gray-50
                      data-[state=active]:border-primary data-[state=active]:text-primary
                      data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500
                      ${!isStep1Complete ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <Rocket className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
                    Landing Page
                  </TabsTrigger>
                </div>
              </TabsList>
              <div className='mt-6 w-full'>
                <TabsContent value='step1' className='w-full'>
                  <Step1Form onSubmit={handleStep1Submit} initialData={courseData} />
                </TabsContent>
                <TabsContent value='step2' className='w-full'>
                  <CourseLandingPage
                    onSubmit={handleLandingPageSubmit}
                    onChange={handleStep2DataChange}
                    initialData={courseData}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        {isLoading && <Loading />}
      </div>
    </PageContainer>
  )
}
