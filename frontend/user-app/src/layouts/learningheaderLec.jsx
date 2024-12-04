/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  ArrowRight,
  Bell,
  BotMessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Indent,
  Medal,
  Settings,
  Trophy
} from 'lucide-react'
import React, { useState } from 'react'

const HeaderCode = ({ onButtonClick, onChatClick, toggleCurriculumRef, header }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const triggerPreviousLecture = () => {
    if (toggleCurriculumRef.current) {
      toggleCurriculumRef.current.handlePreviousLecture()
    }
  }

  const triggerNextLecture = () => {
    if (toggleCurriculumRef.current) {
      toggleCurriculumRef.current.handleNextLecture()
    }
  }

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
                  className='p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                  onClick={triggerPreviousLecture}
                >
                  <ChevronLeft className='w-5 h-5 ' />
                </button>
                <div className='h-7 w-px bg-gray-300 dark:bg-gray-600'></div>
                <button
                  className='p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                  onClick={triggerNextLecture}
                >
                  <ChevronRight className='w-5 h-5 ' />
                </button>
              </div>
            </div>
            {/* <div className='flex items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-200 mr-2'>Lession 12 Lecture</span> */}
            {/* {currentLesson.isCompleted ? ( */}
            {/* <Check className='w-4 h-4 text-green-500' /> */}
            {/* // ) : (
              //   <Clock className='w-4 h-4 text-gray-400' />
              // )} */}
            {/* </div> */}
            <div className='flex items-center space-x-2'>
              <button
                onClick={onChatClick}
                className='mr-4 p-2 text-white bg-primaryButton hover:bg-gray-500 rounded-md'
              >
                <BotMessageSquare className='w-5 h-5' />
              </button>

              <div className='flex items-center space-x-4 mr-10 relative'>
                <div className='rounded-lg bg-yellow-500 p-2 cursor-pointer' onClick={() => setIsPopupOpen(!isPopupOpen)}>
                  {/* <Trophy className='w-5 h-5 text-white' color='yellow' /> */}
                  <Medal className='w-5 h-5 text-white' color='#dee114' />
                </div>
                {isPopupOpen && (
                  <>
                    <div className='absolute right-0 mt-[200px] w-64 bg-white rounded-lg shadow-xl py-2 z-50'>
                      <div className='px-4 py-3 border-b border-gray-100'>
                        <div className='flex items-center space-x-3 mb-3'>
                          <div className='p-2 bg-blue-100 rounded-lg'>
                            <Trophy className='w-5 h-5 text-blue-600' />
                          </div>
                          <div>
                            <p className='text-sm text-gray-500'>Your Score</p>
                            <p className='text-lg font-bold text-gray-900'>24</p>
                          </div>
                        </div>

                        <div className='flex items-center space-x-3'>
                          <div className='p-2 bg-green-100 rounded-lg'>
                            <GraduationCap className='w-5 h-5 text-green-600' />
                          </div>
                          <div>
                            <p className='text-sm text-gray-500'>Lecture Score</p>
                            <p className='text-lg font-bold text-gray-900'>12</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default HeaderCode
