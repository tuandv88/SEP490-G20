import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { X, GripVertical, Clock, DollarSign, Search } from 'lucide-react'
import { LearningPathAPI } from '@/services/api/learningPathApi'
import { formatTimeEstimation } from '@/utils/formatTimeEstimation'

export const EditPathModal = ({ path, availableCoursesList, courses, isOpen, onClose, onSave }) => {
  const [editedPath, setEditedPath] = useState({
    ...path,
    pathSteps: path.pathSteps.map((step) => {
      const course = courses.find((c) => c.id === step.courseId) || {}
      return {
        ...step,
        title: course.title || '',
        headline: course.headline || '',
        timeEstimation: course.timeEstimation || 0,
        price: course.price || 0
      }
    })
  })

  const [availableCourses, setAvailableCourses] = useState(
    availableCoursesList.filter((course) => !path.pathSteps.find((step) => step.courseId === course.courseId))
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCourses, setFilteredCourses] = useState(availableCourses)

  useEffect(() => {
    const filtered = availableCourses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.headline?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCourses(filtered)
  }, [searchTerm, availableCourses])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    const items = Array.from(editedPath.pathSteps)
    const [reorderedItem] = items.splice(sourceIndex, 1)
    items.splice(destinationIndex, 0, reorderedItem)

    const updatedSteps = items.map((item, index) => ({
      ...item,
      stepOrder: index + 1
    }))

    setEditedPath({ ...editedPath, pathSteps: updatedSteps })
  }

  const addCourse = (course) => {
    const newStep = {
      id: `temp-${Date.now()}`,
      learningPathId: path.id,
      courseId: course.courseId,
      stepOrder: editedPath.pathSteps.length + 1,
      status: course.status || 'NotEnrolled',
      completionPercentage: course.completionPercentage || 0,
      enrollmentDate: course.enrollmentDate || null,
      completionDate: course.completionDate || null,
      expectedCompletionDate: new Date().toISOString(),
      title: course.title,
      headline: course.headline,
      timeEstimation: course.timeEstimation,
      price: course.price
    }

    setEditedPath({
      ...editedPath,
      pathSteps: [...editedPath.pathSteps, newStep]
    })
    setAvailableCourses(availableCourses.filter((c) => c.courseId !== course.courseId))
  }

  const removeCourse = (stepId) => {
    const removedStep = editedPath.pathSteps.find((step) => step.id === stepId)
    if (removedStep) {
      const removedCourse = courses.find((course) => course.courseId === removedStep.courseId) || 
                           availableCoursesList.find((course) => course.courseId === removedStep.courseId)
      
      if (removedCourse) {
        const isAlreadyAvailable = availableCourses.some(course => course.courseId === removedCourse.courseId)
        if (!isAlreadyAvailable) {
          setAvailableCourses([...availableCourses, removedCourse])
        }
      }
    }

    setEditedPath({
      ...editedPath,
      pathSteps: editedPath.pathSteps
        .filter((step) => step.id !== stepId)
        .map((step, index) => ({
          ...step,
          stepOrder: index + 1
        }))
    })
  }

  const handleSaveChanges = async () => {
    try {
      const pathStepsData = {
        PathSteps: editedPath.pathSteps.map(step => ({
          learningPathId: path.id,
          courseId: step.courseId,
          stepOrder: step.stepOrder
        }))
      }

      await LearningPathAPI.swapCourseInPath(pathStepsData)
      
      onSave(editedPath, availableCourses)
    } catch (error) {
      console.error('Error saving path changes:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-[90vw] h-[90vh] flex flex-col'>
        <div className='p-4 border-b flex justify-between items-center'>
          <h2 className='text-2xl font-bold px-4 py-2'>Edit Learning Path</h2>
          <input
            type='text'
            value={editedPath.pathName}
            onChange={(e) => setEditedPath({ ...editedPath, pathName: e.target.value })}
            className='w-[50%] px-3 py-2 border rounded-lg focus:ring-2 focus:border-red-500'
          />
          <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
            <X size={24} />
          </button>
        </div>

        <div className='flex-1 flex overflow-hidden'>
          <div className='flex-1 p-4 overflow-y-auto'>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId='steps'>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-4'>
                    {editedPath.pathSteps.map((step, index) => (
                      <Draggable key={step.id} draggableId={step.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className='bg-gray-50 p-4 rounded-lg flex items-center gap-4'
                          >
                            <div {...provided.dragHandleProps} className='text-gray-400'>
                              <GripVertical size={20} />
                            </div>
                            <div className='w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full'>
                              {index + 1}
                            </div>
                            <div className='flex-1'>
                              <h3 className='font-semibold'>{step.title}</h3>
                              <div className='flex gap-4 text-sm text-gray-500'>
                                <span className='flex items-center gap-1'>
                                  <Clock size={16} />
                                  {formatTimeEstimation(step.timeEstimation) || 'N/A'}
                                </span>
                                <span className='flex items-center gap-1'>
                                  <DollarSign size={16} />
                                  {step.price || 'Free'}
                                </span>
                              </div>
                            </div>
                            <button onClick={() => removeCourse(step.id)} className='text-red-500 hover:text-red-700'>
                              <X size={20} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className='w-[30vw] border-l p-4 overflow-y-auto'>
            <div className='space-y-4'>
              <h3 className='font-bold'>Available Courses</h3>
              
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Search courses...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:border-primaryButton focus:outline-none'
                />
                <Search 
                  size={18} 
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                />
              </div>

              <p className='text-sm text-gray-500'>
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
              </p>

              <div className='space-y-2'>
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className='p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100'
                    onClick={() => addCourse(course)}
                  >
                    <h4 className='font-semibold'>{course.title}</h4>
                    <p className='text-sm text-gray-600'>{course.headline}</p>
                    <div className='flex items-center gap-4 text-sm text-gray-500 mt-2'>
                      <span className='flex items-center gap-1'>
                        <Clock size={14} />
                        {course.timeEstimation || 0} hours
                      </span>
                      <span className='flex items-center gap-1'>
                        <DollarSign size={14} />
                        {course.price === 0 ? 'Free' : course.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='p-4 border-t flex justify-end gap-4'>
          <button onClick={onClose} className='px-4 py-2 text-gray-600 hover:text-gray-800'>
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className='px-4 py-2 bg-primaryButton text-white rounded-lg hover:bg-[#3e80c1]'
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
