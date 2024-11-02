/* eslint-disable no-unused-vars */
import React from 'react'
import { Skeleton } from '../ui/skeleton'

const DescriptionLoading = () => {
  return (
    <div className='bg-gray-900 text-gray-300 p-6 mx-auto font-sans'>
      <div className='relative pb-[56.25%] h-0'>
        <Skeleton className='w-full h-[293px]' />
      </div>

      <div className='prose max-w-fit prose-invert w-full markdown-des mt-5'>
        <Skeleton className='w-full h-[25px] mb-3' />
        <Skeleton className='w-full h-[25px] mb-3' />
        <Skeleton className='w-full h-[25px] mb-3' />
      </div>
    </div>
  )
}

export default DescriptionLoading
