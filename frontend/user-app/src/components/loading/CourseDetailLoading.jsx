// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Skeleton } from '../ui/skeleton'

const CourseDetailLoading = () => {
  return (
    <div className='min-h-screen bg-gray-100 p-4 mt-[96px]'>
      <div className='max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Left Column - Course Content */}
          <div className='md:col-span-1 p-6 border-r'>
            <Skeleton className='mb-4 w-[360px] h-[24px]' />
            <div className='mb-3'>
              <Skeleton className='px-2 py-1 rounded mb-5 w-[360px] h-[24px]' />
            </div>
            <div className='text-sm text-gray-600 mb-4'>
              <Skeleton className='w-[360px] h-[24px]'></Skeleton>
            </div>
            <div className='space-y-2'>
              <Skeleton className='w-[360px] h-[500px]'></Skeleton>
            </div>
          </div>

          <div className='md:col-span-2 gridgap-4 mt-8'>
            <div className='max-w-3xl mx-auto'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                {/* Publisher Information */}
                <div className='bg-white rounded-lg'>
                  <Skeleton className='mb-4 w-[324px] h-[24px]' />
                  <div className='flex items-center mb-4'>
                    <Skeleton className='h-12 w-12 rounded-full mr-4' />
                    <div>
                      <Skeleton className='w-[260px] h-[48px]' />
                    </div>
                  </div>
                  <Skeleton className='mb-4 w-[324px] h-[24px]' />
                  <div className='text-sm space-y-2'>
                    <Skeleton className='w-[324px] h-[195px]' />
                  </div>
                </div>

                {/* Course Information and CTA */}
                <div className='rounded-lg'>
                  <Skeleton className='w-[372px] h-[375px]'></Skeleton>
                </div>
              </div>

              {/* Course Banner */}
              <div className='relative w-full aspect-video rounded-lg overflow-hidden mb-8'>
                <Skeleton className='w-[768px] h-[432px]'></Skeleton>
              </div>

              {/* Course Description */}
              <div className='max-w-none mb-8 rounded-lg'>
                <Skeleton className='w-[768px] h-[536px]' />
              </div>

              {/* Feedback Section */}
              <Skeleton className='w-[768px] h-[536px] mb-4' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailLoading
