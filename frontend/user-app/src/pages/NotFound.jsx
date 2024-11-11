/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import Layout from '@/layouts/layout'

const NotFound = ({ mess }) => {
  const navigate = useNavigate()

  const handleTryAgain = () => {
    window.location.reload()
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <Layout>
      <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4'>
        <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center'>
          <AlertTriangle className='mx-auto h-16 w-16 text-yellow-500 mb-4' />
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>404</h1>
          <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Page Not Found</h2>
          <p className='text-gray-600 mb-8'>{mess}</p>
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
export default NotFound
