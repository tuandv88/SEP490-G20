import React from 'react'
import { Link } from '@tanstack/react-router'
import { DASHBOARD_PATH } from '@/routers/router'

function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-gray-800 mb-4 animate-bounce'>404</h1>
        <h2 className='text-3xl font-semibold text-gray-700 mb-4'>Page Not Found</h2>
        <p className='text-xl text-gray-600 mb-8'>Oops! The page you're looking for doesn't exist.</p>
        <Link
          to={DASHBOARD_PATH}
          className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-2'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound
