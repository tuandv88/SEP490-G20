/* eslint-disable no-unused-vars */
import React from 'react'
import { Skeleton } from '../ui/skeleton'

const TestResultLoading = () => {
  return (
    <div>
      <h2 className='mb-4 rounded-lg'>
        <Skeleton className='w-full rounded-md h-[30px]' />
      </h2>
      <pre className='rounded-md whitespace-pre-wrap overflow-hidden'>
        <Skeleton className='w-full h-[100px]' />
      </pre>
    </div>
  )
}

export default TestResultLoading
