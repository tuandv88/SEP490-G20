/* eslint-disable no-unused-vars */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Layout from '@/layouts/layout'

export default function ErrorPage() {
  const navigate = useNavigate()

  const handleTryAgain = () => {
    window.location.reload()
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4'>
        <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center'>
          <AlertCircle className='mx-auto h-16 w-16 text-red-500 mb-6' />
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Oops! Something went wrong</h1>
          <p className='text-gray-600 mb-8'>
            Something went wrong while fetching the course details. Please try again later.
          </p>
          <div className='flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4'>
            <Button onClick={handleTryAgain} className='bg-blue-500 hover:bg-blue-600 text-white'>
              Try Again
            </Button>
            <Button
              onClick={handleGoBack}
              variant='outline'
              className='border-gray-300 text-gray-700 hover:bg-gray-100'
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
