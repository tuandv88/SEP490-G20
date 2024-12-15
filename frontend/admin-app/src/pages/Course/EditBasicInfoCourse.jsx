import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loading } from '@/components/ui/overlay'
import Step1EditForm from '@/pages/Course/EditBasic/Step1EditForm'
import Step2EditLandingPage from '@/pages/Course/EditBasic/Step2EditLandingPage'
import { PageContainer } from '@/components/page-container'
import { useNavigate } from '@tanstack/react-router'
import { updateCourse, getCourseDetails, changeCourseLevel, changeCourseStatus } from '@/services/api/courseApi'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, BookOpen, Rocket, AlertCircle, CheckCircle, X } from 'lucide-react'
import { useMatch } from '@tanstack/react-router'
import { editBasicCourseRoute } from '@/routers/router'
import { COURSE_TABLE_PATH, EDIT_BASIC_COURSE_PATH } from '@/routers/router'
export default function EditBasicInfoCourse() {
  const { params } = useMatch(editBasicCourseRoute.id)
  const { courseId } = params
  const breadcrumbs = [
    { label: 'Course Table', href: COURSE_TABLE_PATH },
    { label: 'Edit Course', href: EDIT_BASIC_COURSE_PATH }
  ]
  const [activeTab, setActiveTab] = useState('step1')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [courseData, setCourseData] = useState(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await getCourseDetails(courseId)
        const courseDto = data.courseDetailsDto.courseDto
        setCourseData({
          ...courseDto
        })
        setIsLoading(false)
      } catch (error) {
        setError('Failed to load course details. Please try again.')
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  const handleStep1Submit = (data) => {
    setCourseData((prevData) => ({ ...prevData, ...data }))
    setActiveTab('step2') // Switch to Step 2 after submitting Step 1
  }

  const handleStep2DataChange = (data) => {
    setCourseData((prevData) => ({ ...prevData, ...data }))
  }

  const handleLandingPageUpdate = async (data) => {
    setIsLoading(true)
    setError(null)
    const courseUpdate = {
      updateCourseDto: {
        title: courseData.title,
        description: courseData.description,
        headline: courseData.headline,
        timeEstimation: courseData.timeEstimation,
        prerequisites: courseData.prerequisites,
        objectives: courseData.objectives,
        targetAudiences: courseData.targetAudiences,
        price: data.price
      }
    }
    try {
      const response = await updateCourse(courseId, courseUpdate)
      toast({
        title: 'Course updated successfully',
        description: 'Your course has been updated.',
        duration: 3000
      })
      navigate({ to: COURSE_TABLE_PATH })
    } catch (error) {
      setError('There was a problem updating your course. Please try again.')
      toast({
        title: 'Error updating course',
        description: 'There was a problem updating your course. Please try again.',
        variant: 'destructive',
        duration: 3000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!courseData) {
    return <div>No course data available.</div>
  }

  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
        <Card className='shadow-lg w-full max-w-6xl mx-auto'>
          <CardHeader>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <div>
                <CardTitle className='text-2xl sm:text-3xl font-bold'>Edit Course: {courseData.title}</CardTitle>
                <CardDescription className='mt-1'>Update your course information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='w-full'>
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
                  </TabsTrigger>
                  <TabsTrigger
                    value='step2'
                    className={`
                      flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 
                      border-b-2 transition-all duration-200 text-sm sm:text-base
                      hover:text-primary hover:bg-gray-50
                      data-[state=active]:border-primary data-[state=active]:text-primary
                      data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500
                    `}
                  >
                    <Rocket className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
                    Landing Page
                  </TabsTrigger>
                </div>
              </TabsList>
              <div className='mt-6 w-full'>
                <TabsContent value='step1' className='w-full'>
                  <Step1EditForm onSubmit={handleStep1Submit} initialData={courseData} />
                </TabsContent>
                <TabsContent value='step2' className='w-full'>
                  <Step2EditLandingPage
                    onSubmit={handleLandingPageUpdate}
                    onChange={handleStep2DataChange}
                    initialData={courseData}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
