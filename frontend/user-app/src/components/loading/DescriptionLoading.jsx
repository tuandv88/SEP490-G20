/* eslint-disable no-unused-vars */
import React from 'react'
import { Skeleton } from '../ui/skeleton'

const DescriptionLoading = () => {
  return (
    <div className='bg-bGprimary p-6 mx-auto font-sans h-full'>
      <div className='relative pb-[56.25%] h-0'>
        <Skeleton className='w-full h-[293px]' />
      </div>

      <div className='prose max-w-fit prose-invert w-full markdown-des mt-5'>
        <Skeleton className='w-full h-[25px] mb-3' />
        <Skeleton className='w-full h-[25px] mb-3' />
        <Skeleton className='w-full h-[25px] mb-3' />
        <div>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div>
          <Skeleton className='w-full h-[40px]' />
        </div>
      </div>
    </div>
  )
}

export default DescriptionLoading
