/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  ArrowRight,
  Bell,
  BotMessageSquare,
  ChevronLeft,
  ChevronRight,
  Indent,
  Settings
} from 'lucide-react'
import React, { useState } from 'react'

const HeaderCode = ({ onButtonClick, toggleCurriculumRef, header, currentProblemIndex, problemList, navigate }) => {
  const [isRunning, setIsRunning] = useState(false)

  const triggerPreviousLecture = () => {
    if (currentProblemIndex > 0) {
      const previousProblem = problemList[currentProblemIndex - 1];
      navigate(`/problem-solve/${previousProblem.problemsId}`);
    }
  };

  const triggerNextLecture = () => {
    if (currentProblemIndex < problemList.length - 1) {
      const nextProblem = problemList[currentProblemIndex + 1];
      navigate(`/problem-solve/${nextProblem.problemsId}`);
    }
  };

  return (
    <div>
      <nav className='flex h-12 w-full shrink-0 items-center px-5 pr-2.5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex w-full justify-between'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center'>
              <ul className='relative mr-2 flex h-10 items-center'>
                <a href='/' className='mr-2 self-center'>
                  <div className='mb-0.5 pl-1'>
                    <img
                      src='https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/frontend/assets/icodervn-logo-removebg-preview.png'
                      alt='Icoder Logo'
                      className='h-12'
                    />
                  </div>
                </a>
                <li className='h-4 w-px bg-gray-300 dark:bg-gray-600'></li>
              </ul>
              <div className='flex items-center overflow-hidden rounded hover:bg-gray-100 dark:hover:bg-gray-700'>
                <div className='group flex items-center h-8 px-2 cursor-pointer' onClick={onButtonClick}>
                  <Indent className='w-5 h-5 mr-2 text-gray-500' />
                  <span className='text-sm font-medium truncate max-w-[170px]'>{header}</span>
                </div>
                <div className='h-7 w-px bg-gray-300 dark:bg-gray-600'></div>
                <button 
                  className={`p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    currentProblemIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`} 
                  onClick={triggerPreviousLecture}
                  disabled={currentProblemIndex === 0}
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>
                <div className='h-7 w-px bg-gray-300 dark:bg-gray-600'></div>
                <button 
                  className={`p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    currentProblemIndex === problemList.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={triggerNextLecture}
                  disabled={currentProblemIndex === problemList.length - 1}
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </nav>
    </div>
  )
}

export default HeaderCode
