import React, { useEffect, useState } from 'react'
import { BarChart2, BookOpen, Calendar, Layout, ListChecks, PlusCircle } from 'lucide-react'
import CourseStep from './CourseStep'
import { LearningAPI } from '@/services/api/learningApi'
import ChapterLoading from '../loading/ChapterLoading'
import { QuizAPI } from '@/services/api/quizApi'
import AssessmentPrompt from '../surrvey/AssessmentPromptProps'
import QuizModal from '../surrvey/QuizModal'
import { Button } from '../ui/button'
import { LearningPathCard } from './LearningPathCard'
import { EditPathModal } from './EditPathModal'
import { DeleteConfirmModal } from './DeleteConfirmModalProps'
import UserRoadMapLoading from '../loading/UserRoadMapLoading'
import { LearningPathAPI } from '@/services/api/learningPathApi'

const RoadmapDashboard = ({ user }) => {
  const [learningPaths, setLearningPaths] = useState([])
  const [courseDetails, setCourseDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedPath, setSelectedPath] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [pathToDelete, setPathToDelete] = useState(null)
  const [isAssessmentPromptOpen, setIsAssessmentPromptOpen] = useState(false)
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [quizAssessment, setQuizAssessment] = useState(null)
  const [availableCourses, setAvailableCourses] = useState([])


  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Lấy danh sách Learning Paths
        const response = await LearningAPI.getLearningPath()
        const fetchedLearningPaths = response.learningPathDtos
        setLearningPaths(fetchedLearningPaths)

        // Nếu có người dùng, lấy Quiz Assessment
        if (user && fetchedLearningPaths.length === 0) {
          const data = await QuizAPI.getQuizAssessment()
          setQuizAssessment(data.quiz)
        }

        // Lấy thông tin chi tiết các khóa học
        const courseIds = new Set()
        fetchedLearningPaths.forEach((path) => {
          path.pathSteps.forEach((step) => {
            if (!courseDetails[step.courseId]) {
              courseIds.add(step.courseId)
            }
          })
        })

        const courseDetailsPromises = Array.from(courseIds).map(async (courseId) => {
          const response = await LearningAPI.getCoursePreview(courseId)
          return { courseId, course: response.course }
        })

        const coursesData = await Promise.all(courseDetailsPromises)
        const newCourseDetails = {}
        coursesData.forEach(({ courseId, course }) => {
          newCourseDetails[courseId] = course
        })
        setCourseDetails(newCourseDetails)

        // Lấy danh sách tất cả các khóa học và lọc các khóa học có sẵn
        const allCourses = await LearningAPI.getCourseList(1, 20)
        const filteredCourses = allCourses.courseDtos.data.filter(
          (course) => !fetchedLearningPaths.some((path) => path.pathSteps.some((step) => step.courseId === course.id))
        )
        setAvailableCourses(filteredCourses)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleEditPath = (path) => {
    setSelectedPath(path)
    setIsEditModalOpen(true)
    console.log(path)
  }

  const handleDeletePath = async (pathId) => {
    setIsDeleteModalOpen(true)
    setPathToDelete(pathId)
    try {
      await LearningPathAPI.deleteLearningPath(pathId)
    } catch (error) {
      console.error('Error deleting path:', error)
    }
  }

  const handleConfirmDelete = async () => {
    if (pathToDelete) {
      try {
        await mockApiService.deleteLearningPath(pathToDelete)
        setLearningPaths((prev) => prev.filter((path) => path.id !== pathToDelete))
      } catch (error) {
        console.error('Error deleting path:', error)
      }
      setIsDeleteModalOpen(false)
      setPathToDelete(null)
    }
  }

  const handleSavePath = async (updatedPath) => {
    try {
      //const savedPath = await mockApiService.updateLearningPath(updatedPath.id, updatedPath)
      //setLearningPaths((prev) => prev.map((path) => (path.id === savedPath.id ? savedPath : path)))
      setLearningPaths((prevPaths) => prevPaths.map((path) => (path.id === updatedPath.id ? updatedPath : path)))
      setIsEditModalOpen(false)
      setSelectedPath(null)
      console.log(updatedPath)
    } catch (error) {
      console.error('Error saving path:', error)
    }
  }

  const handleGeneratePath = () => {
    setIsAssessmentPromptOpen(true)
  }

  const handleAssessmentAccept = () => {
    setIsAssessmentPromptOpen(false)
    setIsQuizOpen(true)
  }

  const handleAssessmentDecline = () => {
    setIsAssessmentPromptOpen(false)
    //updateUserFirstLogin()
  }

  const handleQuizComplete = (score) => {
    console.log('Quiz completed with score:', score)
    setIsQuizOpen(false)
    //updateUserFirstLogin()
  }

  if (loading) {
    return <UserRoadMapLoading />
  }

  return (
    <div className='space-y-6 mt-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Recommended Path</h1>
        {!learningPaths.length && (
          <Button
            onClick={handleGeneratePath}
            className='flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
          >
            <PlusCircle className='w-5 h-5 mr-2' />
            Generate Path
          </Button>
        )}
      </div>

      <div className='space-y-6'>
        {learningPaths.map((path) => (
          <LearningPathCard
            key={path.id}
            path={path}
            courseDetails={courseDetails}
            onEdit={handleEditPath}
            onDelete={handleDeletePath}
          />
        ))}
      </div>

      {selectedPath && (
        <EditPathModal
          path={selectedPath}
          courses={Object.values(courseDetails)}
          availableCoursesList={availableCourses}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedPath(null)
          }}
          onSave={handleSavePath}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setPathToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        pathName={learningPaths.find((p) => p.id === pathToDelete)?.pathName || ''}
      />

      <AssessmentPrompt
        isOpen={isAssessmentPromptOpen}
        onClose={() => {
          setIsAssessmentPromptOpen(false)
        }}
        onAccept={handleAssessmentAccept}
        onDecline={handleAssessmentDecline}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => {
          setIsQuizOpen(false)
        }}
        onComplete={handleQuizComplete}
        quiz={quizAssessment}
      />
    </div>
  )
}

export default React.memo(RoadmapDashboard)
