/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Play, Send } from 'lucide-react'
import styled, { keyframes } from 'styled-components'

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
const LoadingButton = styled.button`
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
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${spinnerAnimation} 0.75s linear infinite; // Hiệu ứng xoay
    position: absolute;
    right: 0.5rem; // Vị trí của spinner
  }
`

const PreferenceNav = ({ onSubmit, loading }) => {
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
            <option>C#</option>
            <option>Python</option>
          </select>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={onSubmit}
            className='bg-blue-500 flex items-center text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors'
          >
            {loading ? (
              <>
                <LoadingButton loading={loading} disabled={loading} />
                <span style={{ marginLeft: '5px' }}>Running...</span>
              </>
            ) : (
              <>
                <Play size={18} className='mr-2 inline-block' />
                Run
              </>
            )}
          </button>
          <button className='bg-gray-700 flex items-center text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600 transition-colors'>
            <Send size={18} className='mr-2 inline-block' />
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreferenceNav
