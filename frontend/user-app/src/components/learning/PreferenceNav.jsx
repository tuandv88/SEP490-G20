/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { AlarmClock, CloudUpload, Loader2, Play, Send } from 'lucide-react'
import styled, { keyframes } from 'styled-components'
import useStore from '../../data/store'
import Popup from '../ui/popup'
import { Button } from '../ui/button'
import { LearningAPI } from '@/services/api/learningApi'

// Định nghĩa animation xoay
const spinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);  // Bắt đầu ở vị trí 0 độ
  }
  100% {
    transform: rotate(360deg); // Kết thúc ở vị trí 360 độ
  }
`

// Tạo button với hiệu ứng loading
const LoadingButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  color: #fff;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  // Phong cách cho vòng tròn xoay loading
  &::after {
    content: '';
    display: ${(props) => (props.loading ? 'inline-block' : 'none')};
    width: 1.01rem;
    height: 1.01rem;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${spinnerAnimation} 0.75s linear infinite; // Hiệu ứng xoay
    position: absolute;
    right: 0.5rem; // Vị trí của spinner
    color: #42e7dd;
  }
`

const PreferenceNav = ({ onSubmit, loading, problemId, setActiveTab, setResultCodeSubmit, setCurrentCode }) => {
  const codeRun = useStore((state) => state.codeRun)
  const [isSubmit, setIsSubmit] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleFetchData = async () => {
    const submissionData = {
      submission: {
        languageCode: 'Java',
        solutionCode: codeRun
      }
    }


    setIsSubmit(true)

    try {
      const response = await LearningAPI.submitCode(problemId, submissionData)
      setResultCodeSubmit(response.submissionResponse)
      setCurrentCode(submissionData.submission.solutionCode)
      setActiveTab('submissionResult')
      setIsSubmit(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setIsOpen(true)
    } finally {
      setIsSubmit(false)
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between p-2 bg-gray-800'>
        <div className='flex items-center'>
          <div className='text-blue-400 mr-2'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <select className='bg-gray-700 text-white text-sm rounded-md px-2 py-1'>
            <option>Java</option>
          </select>
        </div>
        <div className='flex items-center space-x-2 mr-5'>
          <button className='p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
            <AlarmClock className='w-5 h-5' color='white' />
          </button>
          <button
            onClick={onSubmit}
            className='flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'
          >
            {loading ? (
              <>
                <LoadingButton loading={loading.toString()} disabled={loading} />
                <span className='font-medium' style={{ marginLeft: '5px' }}>
                  Running...
                </span>
              </>
            ) : (
              <>
                <Play className='w-4 h-4 mr-2 text-gray-600 dark:text-gray-300' />
                <span className='text-sm font-medium'>Run</span>
              </>
            )}
          </button>
          <Button
            disabled={loading}
            onClick={handleFetchData}
            className='flex items-center bg-green-100 dark:bg-green-700 rounded-md hover:bg-green-200 dark:hover:bg-green-600 text-green-700 dark:text-green-100'
          >
            {isSubmit ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Submitting...
              </>
            ) : (
              <>
                <CloudUpload className='w-4 h-4 mr-2' />
                <span className='text-sm font-medium'>Submit</span>
              </>
            )}
          </Button>
        </div>
      </div>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        message='Have an error when submit code. Please try again.'
      />
    </div>
  )
}

export default PreferenceNav
