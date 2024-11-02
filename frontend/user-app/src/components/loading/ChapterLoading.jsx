/* eslint-disable no-unused-vars */
import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ChapterLoading = () => {
  return (
    <div>
      <div className='md:col-span-1 p-6 border-r'>
        <h2 className='text-2xl font-bold mb-4'>
          <Skeleton className='w-full h-[32px]' />
        </h2>
        <div className='space-y-2'>
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
          <div>
            <Skeleton className='w-full h-[40px]' />
          </div>
          <div>
            <Skeleton className='w-full h-[40px]' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterLoading
