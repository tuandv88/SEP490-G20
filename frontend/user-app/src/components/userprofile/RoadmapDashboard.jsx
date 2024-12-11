import React, { useEffect, useState, useCallback } from 'react'
import { PlusCircle } from 'lucide-react'
import { LearningAPI } from '@/services/api/learningApi'
import { QuizAPI } from '@/services/api/quizApi'
import { LearningPathAPI } from '@/services/api/learningPathApi'
import { Button } from '../ui/button'
import { LearningPathCard } from './LearningPathCard'
import { EditPathModal } from './EditPathModal'
import { DeleteConfirmModal } from './DeleteConfirmModalProps'
import AssessmentPrompt from '../surrvey/AssessmentPromptProps'
import QuizModal from '../surrvey/QuizModal'
import UserRoadMapLoading from '../loading/UserRoadMapLoading'
import { LearningPathPolling } from '../loading/LearningPathPolling'

const RoadmapDashboard = ({ user }) => {
  // State declarations
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
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false)
  const [pollingStatus, setPollingStatus] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch course details helper function
  const fetchCourseDetails = async (courseIds) => {
    const courseDetailsPromises = Array.from(courseIds).map(async (courseId) => {
      const response = await LearningAPI.getCoursePreview(courseId)
      return { courseId, course: response.course }
    })

    const coursesData = await Promise.all(courseDetailsPromises)
    return coursesData.reduce((acc, { courseId, course }) => {
      acc[courseId] = course
      return acc
    }, {})
  }

  // Poll for learning paths
  const pollLearningPaths = useCallback(() => {
    let attempts = 0
    const maxAttempts = 7
    let pollInterval

    setPollingStatus('polling')

    const poll = async () => {
      try {
        const response = await LearningAPI.getLearningPath()
        const paths = response.learningPathDtos

        if (paths && paths.length > 0) {
          setLearningPaths(paths)
          setIsQuizSubmitted(false)
          clearInterval(pollInterval)
          setPollingStatus('success')

          const courseIds = new Set()
          paths.forEach((path) => {
            path.pathSteps.forEach((step) => {
              if (!courseDetails[step.courseId]) {
                courseIds.add(step.courseId)
              }
            })
          })

          const newCourseDetails = await fetchCourseDetails(courseIds)
          setCourseDetails((prev) => ({ ...prev, ...newCourseDetails }))
          return true
        }

        return false
      } catch (error) {
        console.error('Lỗi khi poll lộ trình:', error)
        setPollingStatus('error')
        return false
      }
    }

    pollInterval = setInterval(async () => {
      console.log('Polling for learning paths...', attempts)
      const found = await poll()
      
      if (found || attempts >= maxAttempts) {
        clearInterval(pollInterval)
        if (!found) {
          console.log('Không tìm thấy lộ trình sau 15 giây')
          setPollingStatus('error')
        }
      }
      attempts++
    }, 2000)

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [courseDetails])

  // Initial data fetch
  useEffect(() => {
    let isSubscribed = true

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await LearningAPI.getLearningPath()
        
        if (!isSubscribed) return

        const fetchedLearningPaths = response.learningPathDtos
        setLearningPaths(fetchedLearningPaths)

        if (user && fetchedLearningPaths.length === 0) {
          const data = await QuizAPI.getQuizAssessment()
          if (!isSubscribed) return
          setQuizAssessment(data.quiz)
        }

        // Fetch course details
        const courseIds = new Set()
        fetchedLearningPaths.forEach((path) => {
          path.pathSteps.forEach((step) => {
            if (!courseDetails[step.courseId]) {
              courseIds.add(step.courseId)
            }
          })
        })

        if (!isSubscribed) return
        const newCourseDetails = await fetchCourseDetails(courseIds)
        setCourseDetails(newCourseDetails)

        // Fetch available courses
        const allCourses = await LearningAPI.getCourseList(1, 20)
        if (!isSubscribed) return
        
        const filteredCourses = allCourses.courseDtos.data.filter(
          (course) => !fetchedLearningPaths.some((path) => 
            path.pathSteps.some((step) => step.courseId === course.id)
          )
        )
        setAvailableCourses(filteredCourses)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        if (isSubscribed) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isSubscribed = false
    }
  }, [user])

  // Effect for polling
  useEffect(() => {
    let cleanup
    if (isQuizSubmitted) {
      cleanup = pollLearningPaths()
    }
    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [isQuizSubmitted, pollLearningPaths])

  // Event handlers
  const handleEditPath = (path) => {
    setSelectedPath(path)
    setIsEditModalOpen(true)
  }

  const handleDeletePath = (pathId) => {
    setIsDeleteModalOpen(true)
    setPathToDelete(pathId)
  }

  const handleConfirmDelete = async () => {
    if (pathToDelete) {
      setIsDeleting(true)
      try {
        await LearningPathAPI.deleteLearningPath(pathToDelete)
        setLearningPaths((prev) => prev.filter((path) => path.id !== pathToDelete))
        setIsQuizSubmitted(false)
      } catch (error) {
        console.error('Error deleting path:', error)
      } finally {
        setIsDeleting(false)
        setIsDeleteModalOpen(false)
        setPathToDelete(null)
      }
    }
  }

  const handleSavePath = async (updatedPath) => {
    try {
      setLearningPaths((prevPaths) => 
        prevPaths.map((path) => (path.id === updatedPath.id ? updatedPath : path))
      )
      setIsEditModalOpen(false)
      setSelectedPath(null)
    } catch (error) {
      console.error('Error saving path:', error)
    }
  }

  const handleQuizComplete = (score) => {
    console.log('Quiz completed with score:', score)
    setIsQuizOpen(false)
  }

  const handleClosePolling = () => {
    setPollingStatus(null)
    if (pollingStatus === 'error') {
      setIsQuizSubmitted(false)
    }
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
            onClick={() => setIsAssessmentPromptOpen(true)}
            className='flex items-center px-4 py-2 bg-primaryButton text-white rounded-lg hover:bg-primaryButtonHover transition-colors'
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
        isDeleting={isDeleting}
      />

      <AssessmentPrompt
        isOpen={isAssessmentPromptOpen}
        onClose={() => setIsAssessmentPromptOpen(false)}
        onAccept={() => {
          setIsAssessmentPromptOpen(false)
          setIsQuizOpen(true)
        }}
        onDecline={() => setIsAssessmentPromptOpen(false)}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onComplete={handleQuizComplete}
        quiz={quizAssessment}
        setIsQuizSubmitted={setIsQuizSubmitted}
      />

      {pollingStatus && (
        <LearningPathPolling
          status={pollingStatus}
          message={
            pollingStatus === 'error'
              ? 'Error occurs when creating a roadmap. Please try again later.'
              : pollingStatus === 'success'
              ? 'Your learning path has been created successfully.'
              : 'Creating your learning path based on your assessment results...'
          }
          onClose={handleClosePolling}
        />
      )}
    </div>
  )
}

export default React.memo(RoadmapDashboard)
