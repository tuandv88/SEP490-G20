import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { X, GripVertical, Clock, DollarSign } from 'lucide-react'
import { LearningPathAPI } from '@/services/api/learningPathApi'

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
    availableCoursesList.filter((course) => !path.pathSteps.find((step) => step.courseId === course.id))
  )

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    // Lấy ra course id của source và destination
    const sourceItem = editedPath.pathSteps[sourceIndex]
    const destinationItem = editedPath.pathSteps[destinationIndex]

    const sourceCourseId = sourceItem.id
    const sourceStepOrder = sourceItem.stepOrder
    const destinationCourseId = destinationItem.id
    const destinationStepOrder = destinationItem.stepOrder

    const data = {
      PathSteps: [
        {
          id: sourceCourseId,
          stepOrder: destinationStepOrder
        },
        {
          id: destinationCourseId,
          stepOrder: sourceStepOrder
        }
      ]
    }

    try {
      const response = await LearningPathAPI.swapCourseInPath(data)
      console.log('Response:', response)
    } catch (error) {
      console.error('Error swapping courses:', error)
    }

    const items = Array.from(editedPath.pathSteps)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedSteps = items.map((item, index) => ({
      ...item,
      stepOrder: index + 1
    }))

    setEditedPath({ ...editedPath, pathSteps: updatedSteps })
  }

  const addCourse = async (course) => {
    const newStep = {
      id: `temp-${Date.now()}`,
      learningPathId: path.id,
      courseId: course.id,
      stepOrder: editedPath.pathSteps.length + 1,
      status: 0,
      enrollmentDate: null,
      completionDate: null,
      expectedCompletionDate: new Date().toISOString(),
      title: course.title,
      headline: course.headline,
      timeEstimation: course.timeEstimation,
      price: course.price
    }

    const data = {
      createPathStepDto: {
        learningPathId: path.id,
        courseId: course.id,
        stepOrder: editedPath.pathSteps.length + 1
      }
    }

    try {
      const response = await LearningPathAPI.createPathStep(data)
      console.log('Response:', response)
    } catch (error) {
      console.error('Error creating path step:', error)
    }

    setEditedPath({
      ...editedPath,
      pathSteps: [...editedPath.pathSteps, newStep]
    })
    setAvailableCourses(availableCourses.filter((c) => c.id !== course.id))
  }

  const removeCourse = async (stepId) => {
    console.log(stepId)
    const removedStep = editedPath.pathSteps.find((step) => step.id === stepId)
    if (removedStep) {
      const removedCourse = courses.find((course) => course.id === removedStep.courseId)
      if (removedCourse) {
        setAvailableCourses([...availableCourses, removedCourse])
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

    try {
      const response = await LearningPathAPI.deletePathStep(stepId)
      console.log('Response:', response)
    } catch (error) {
      console.error('Error deleting path step:', error)
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
                                  {step.timeEstimation || 'N/A'} hours
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
            <h3 className='font-bold mb-4'>Available Courses</h3>
            <div className='space-y-2'>
              {availableCourses.map((course) => (
                <div
                  key={course.id}
                  className='p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100'
                  onClick={() => addCourse(course)}
                >
                  <h4 className='font-semibold'>{course.title}</h4>
                  <p className='text-sm text-gray-600'>{course.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='p-4 border-t flex justify-end gap-4'>
          <button onClick={onClose} className='px-4 py-2 text-gray-600 hover:text-gray-800'>
            Cancel
          </button>
          <button
            onClick={() => onSave(editedPath)}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
