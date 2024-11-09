/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import { X } from 'lucide-react'

export default function Popup({ isOpen, onClose, message }) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 relative'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
          aria-label='Close popup'
        >
          <X size={24} />
        </button>
        <h2 className='text-xl font-bold mb-4 text-center'>Notice</h2>
        <p className='text-center text-gray-700 mb-6'>
          {message || 'The source code is empty. Please choose one lecture.'}
        </p>
        <div className='flex justify-center'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
