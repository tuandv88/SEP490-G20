/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Check, ChevronDown, ChevronRight, Circle, TableOfContents, Tag, X } from 'lucide-react'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

const ToggleProblem = forwardRef(
  ({ currentProblemId, problems, isProblemListOpen, toggleProblemList, navigate }, ref) => {
    const [activeProblemIndex, setActiveProblemIndex] = useState(0)

    const handlePreviousProblem = () => {
      if (activeProblemIndex > 0) {
        const newIndex = activeProblemIndex - 1
        setActiveProblemIndex(newIndex)
        navigateToProblem(newIndex)
      }
    }

    const handleNextProblem = () => {
      if (activeProblemIndex < problems.length - 1) {
        const newIndex = activeProblemIndex + 1
        setActiveProblemIndex(newIndex)
        navigateToProblem(newIndex)
      }
    }

    const navigateToProblem = (index) => {
      const problemId = problems[index].problemsId
      navigate(`/problem-solve/${problemId}`)
      if (isProblemListOpen) {
        toggleProblemList(false)
      }
    }

    useImperativeHandle(ref, () => ({
      handlePreviousProblem,
      handleNextProblem
    }))

    return (
      <div
        className={`z-50 bg-white dark:bg-gray-800 fixed left-0 top-0 flex h-full w-[600px] flex-col transition-all duration-500 ${
          isProblemListOpen ? 'transform-none' : '-translate-x-full'
        }`}
      >
        <div className='flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700'>
          <TableOfContents size={30} color='#000000' />
          <h2 className='text-2xl font-medium'>Problem List</h2>
          <div className='flex items-center space-x-2'>
            <button className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
              <Tag className='w-4 h-4 text-gray-500' />
            </button>
            <button onClick={toggleProblemList} className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
              <X className='w-4 h-4 text-gray-500' />
            </button>
          </div>
        </div>
        <div className='p-1'>
          <div className='bg-[#1b2a32] rounded-b-lg shadow-xl overflow-hidden'>
            <div className='p-4 border-b border-gray-700'>
              <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold text-white'>Problems</h1>
                <button className='px-3 py-1 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors'>
                  Tag
                </button>
              </div>
            </div>
            <div className='divide-y divide-gray-700'>
              {problems.map((problem, index) => (
                <button onClick={() => navigateToProblem(index)} key={problem.id} className='w-full flex items-center p-4 hover:bg-[#243642] transition-colors group'>
                  <div className='w-8 text-gray-400'>
                    {problem.completed ? <Check className='w-5 h-5 text-green-500' /> : <Circle className='w-5 h-5' />}
                  </div>
                  <span className='w-8 text-gray-400'>{index + 1}.</span>
                  <span className='flex-1 text-gray-400 hover:text-blue-400 cursor-pointer'>{problem.title}</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      problem.difficulty === 'Easy'
                        ? 'text-green-400'
                        : problem.difficulty === 'Medium'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

export default React.memo(ToggleProblem)
