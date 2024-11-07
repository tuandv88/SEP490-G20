/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  AlarmClock,
  ArrowRight,
  Bell,
  BotMessageSquare,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Indent,
  NotebookPen,
  Play,
  Settings,
  Tag,
  X
} from 'lucide-react'
import React, { useState } from 'react'

const HeaderCode = ({ onButtonClick }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState('00:00:00')
  const [isProblemListOpen, setIsProblemListOpen] = useState(false)

  const toggleTimer = () => {
    setIsRunning(!isRunning)
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
                      src='https://static.vecteezy.com/system/resources/previews/008/386/481/non_2x/ic-or-ci-initial-letter-logo-design-vector.jpg'
                      alt='LeetCode Logo'
                      className='h-12'
                    />
                  </div>
                </a>
                <li className='h-4 w-px bg-gray-300 dark:bg-gray-600'></li>
              </ul>
              <div className='flex items-center overflow-hidden rounded hover:bg-gray-100 dark:hover:bg-gray-700'>
                <div className='group flex items-center h-8 px-2 cursor-pointer' onClick={onButtonClick}>
                  <Indent className='w-5 h-5 mr-2 text-gray-500' />
                  <span className='text-sm font-medium truncate max-w-[170px]'>Chapter List</span>
                </div>
                <div className='h-7 w-px bg-gray-300 dark:bg-gray-600'></div>
                <button className='p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'>
                  <ChevronLeft className='w-5 h-5 ' />
                </button>
                <div className='h-7 w-px bg-gray-300 dark:bg-gray-600'></div>
                <button className='p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'>
                  <ChevronRight className='w-5 h-5 ' />
                </button>
                <div className='h-7 w-px bg-gray-300 dark:bg-gray-600'></div>
                <button className='p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'>
                  <ArrowRight className='w-5 h-5 ' />
                </button>
              </div>
            </div>
            {/* <div className='flex items-center space-x-2'>
              <button className='flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'>
                <Play className='w-4 h-4 mr-2 text-gray-600 dark:text-gray-300' />
                <span className='text-sm font-medium'>Run</span>
              </button>
              <button className='flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-700 rounded-md hover:bg-green-200 dark:hover:bg-green-600 text-green-700 dark:text-green-100'>
                <CloudUpload className='w-4 h-4 mr-2' />
                <span className='text-sm font-medium'>Submit</span>
              </button>
              <button className='p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
                <AlarmClock className='w-5 h-5' />
              </button>
            </div> */}
            <div className='flex items-center space-x-2 mr-4'>
              <button className='p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
                <BotMessageSquare className='w-5 h-5' />
              </button>
              <button className='p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
                <Settings className='w-5 h-5' />
              </button>
              <button className='p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
                <Bell className='w-5 h-5' />
              </button>
              <div className='relative'>
                <button className='flex items-center focus:outline-none'>
                  <img
                    src='https://lh3.googleusercontent.com/a/ACg8ocKsfTHylfAszH0NVPU4Zj-X21su07AFw9wCwAZgiEM4hTEffIZ0EQ=s288-c-no'
                    alt='User Avatar'
                    className='w-8 h-8 rounded-full'
                  />
                </button>
              </div>
              <a
                href='/subscribe'
                className='hidden lg:inline-block h-8 w-[84px] rounded-lg bg-orange-100 text-center leading-8 text-orange-500 hover:bg-orange-200'
              >
                Premium
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default HeaderCode
