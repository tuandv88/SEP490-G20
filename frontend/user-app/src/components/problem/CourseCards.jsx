/* eslint-disable react/no-unescaped-entities */
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Code2, Database, MessageSquare } from 'lucide-react'

function CourseCards() {
  return (
    <div className='mb-12'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='relative overflow-hidden bg-[#0D4B3E] text-white'>
          <CardContent className='p-6'>
            <div className='relative z-10'>
              <h3 className='text-xl font-semibold mb-2'>LeetCode's Interview Crash Course:</h3>
              <p className='text-sm mb-4'>System Design for Interviews and Beyond</p>
              <Button variant='secondary' className='bg-white text-[#0D4B3E] hover:bg-gray-100'>
                Start Learning
              </Button>
            </div>
            <div className='absolute right-4 top-1/2 -translate-y-1/2'>
              <Code2 className='w-24 h-24 text-[#15705D] opacity-50' />
            </div>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden bg-[#6366F1] text-white'>
          <CardContent className='p-6'>
            <div className='relative z-10'>
              <h3 className='text-xl font-semibold mb-2'>LeetCode's Interview Crash Course:</h3>
              <p className='text-sm mb-4'>Data Structures and Algorithms</p>
              <Button variant='secondary' className='bg-white text-[#6366F1] hover:bg-gray-100'>
                Start Learning
              </Button>
            </div>
            <div className='absolute right-4 top-1/2 -translate-y-1/2'>
              <Database className='w-24 h-24 text-[#818CF8] opacity-50' />
            </div>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden bg-[#2563EB] text-white'>
          <CardContent className='p-6'>
            <div className='relative z-10'>
              <h3 className='text-xl font-semibold mb-2'>Top Interview Questions</h3>
              <p className='text-sm mb-4'>Master the most common interview topics</p>
              <Button variant='secondary' className='bg-white text-[#2563EB] hover:bg-gray-100'>
                Get Started
              </Button>
            </div>
            <div className='absolute right-4 top-1/2 -translate-y-1/2'>
              <MessageSquare className='w-24 h-24 text-[#3B82F6] opacity-50' />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CourseCards
