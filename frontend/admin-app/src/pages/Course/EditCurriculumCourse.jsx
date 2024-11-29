import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button' // Added Button import
import Curriculum from '@/components/CreateCourse/Curriculum'
import { getCourseDetails } from '@/services/api/courseApi'
import { useMatch } from '@tanstack/react-router'
import { editCurriculumCourseRoute } from '@/routers/router'
import { useStore } from '@/data/store'
import { Loading } from '@/components/ui/overlay'
const EditCourse = () => {
  const { params } = useMatch(editCurriculumCourseRoute.id)
  const { courseId } = params
  const { setCourseIdToBack } = useStore()
  const [course, setCourse] = useState(null)
  const [chapter, setChapter] = useState(null)
  const [updateChapter, setUpdateChapter] = useState(false)
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseData = await getCourseDetails(courseId)
        console.log(courseData)
        setCourseIdToBack(courseId)
        setCourse(courseData.courseDetailsDto.courseDto)
        setChapter(courseData.courseDetailsDto.chapterDetailsDtos)
        console.log(courseData.courseDetailsDto.chapterDetailsDtos)
      } catch (error) {
        console.error('Failed to fetch course details:', error)
      }
    }

    fetchCourseDetails()
  }, [updateChapter])

  const handleUpdateChapter = () => {
    setUpdateChapter(!updateChapter)
  }

  const handleEditInfo = () => {
    console.log('Edit info button clicked')
    // You can replace this with your desired edit functionality
    alert('Edit course info functionality to be implemented')
  }

  if (!course) return <Loading />

  return (
    <div className='flex flex-col lg:flex-row min-h-screen'>
      <div className='w-full lg:w-1/4 p-4 overflow-auto'>
        <Card>
          <CardHeader>
            <img src={course.imageUrl} alt='Course Image' className='w-full h-48 object-cover rounded-t-lg' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <CardTitle className='text-xl lg:text-2xl'>{course.title}</CardTitle>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0'>
              <span className='text-xl lg:text-2xl font-bold'>${course.price}</span>
              <div className='space-x-2'>
                <Badge variant='secondary'>{course.courseLevel}</Badge>
                <Badge variant='outline'>{course.courseStatus}</Badge>
              </div>
            </div>
            <Separator />
            <p className='text-sm lg:text-base text-muted-foreground'>{course.headline}</p>
            {/* Add Edit Info button */}
            <Button onClick={handleEditInfo} className='w-full mt-4'>
              Edit Info
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right side: Curriculum */}
      <div className='w-full lg:w-3/4 p-4 overflow-auto'>
        <Curriculum chapter={chapter} courseId={courseId} handleUpdateChapter={handleUpdateChapter} />
      </div>
    </div>
  )
}

export default React.memo(EditCourse)
