/* eslint-disable no-unused-vars */
import React from 'react'
import { Skeleton } from '../ui/skeleton'

const CourseLoading = () => {
  const items = Array(4).fill(0)
  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
      {items.map((_, index) => (
        <div
          key={index}
          className='overflow-hidden transition-shadow duration-300 bg-white border rounded-lg shadow-lg hover:shadow-xl'
        >
          <div className='p-6'>
            <h2 className='mb-2 text-xl font-semibold text-gray-800'>
              <Skeleton className='w-full h-[28px]' />
            </h2>

            <Skeleton className='mb-2 w-full h-[20px]' />

            <Skeleton className='mb-2 w-full h-[20px]' />

            <Skeleton className='mb-4 w-full h-[20px]' />

            <button className='w-full py-2 text-white transition duration-300'>
              <Skeleton className='w-full h-[40px]' />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CourseLoading
