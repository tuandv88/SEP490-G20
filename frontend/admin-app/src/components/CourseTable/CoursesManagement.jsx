'use client'

import { useState } from 'react'
import { Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'

const courses = [
  {
    id: 1,
    title: 'Hello',
    timeEstimate: '12 hours',
    scheduledPublishDate: 'N/A',
    status: 'Draft',
    level: 'Advanced',
    price: 12.0
  },
  {
    id: 2,
    title: 'Introduction To Programming',
    timeEstimate: '20.5 hours',
    scheduledPublishDate: 'N/A',
    status: 'Draft',
    level: 'Basic',
    price: 49.99
  }
]

export default function CoursesManagement() {
  const [selectedCourses, setSelectedCourses] = useState([])

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Courses</h1>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> New Course
        </Button>
      </div>

      <div className='flex space-x-4 mb-6'>
        <Input placeholder='Filter courses...' className='max-w-sm' />
        <Select>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select Statuses' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='draft'>Draft</SelectItem>
            <SelectItem value='published'>Published</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select Levels' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='basic'>Basic</SelectItem>
            <SelectItem value='advanced'>Advanced</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Checkbox id='title' className='mr-2' />
              <label htmlFor='title'>Title</label>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Checkbox id='timeEstimate' className='mr-2' />
              <label htmlFor='timeEstimate'>Time Estimate</label>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Checkbox id='scheduledPublishDate' className='mr-2' />
              <label htmlFor='scheduledPublishDate'>Scheduled Publish Date</label>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Checkbox id='status' className='mr-2' />
              <label htmlFor='status'>Status</label>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Checkbox id='level' className='mr-2' />
              <label htmlFor='level'>Level</label>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Checkbox id='price' className='mr-2' />
              <label htmlFor='price'>Price (USD)</label>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table className='rounded-lg border border-gray-200 p-4'>
        <TableHeader>
          <TableRow className='bg-gray-200'>
            <TableHead className='w-[50px]'>
              <Checkbox
                checked={selectedCourses.length === courses.length}
                onCheckedChange={(checked) => {
                  setSelectedCourses(checked ? courses.map((course) => course.id) : [])
                }}
              />
            </TableHead>
            <TableHead className='font-semibold text-gray-800'>Title</TableHead>
            <TableHead className='font-semibold text-gray-800'>Time Estimate</TableHead>
            <TableHead className='font-semibold text-gray-800'>Scheduled Publish Date</TableHead>
            <TableHead className='font-semibold text-gray-800'>Status</TableHead>
            <TableHead className='font-semibold text-gray-800'>Level</TableHead>
            <TableHead className='font-semibold text-gray-800'>Price (USD)</TableHead>
            <TableHead className='w-[50px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>
                <Checkbox
                  checked={selectedCourses.includes(course.id)}
                  onCheckedChange={() => toggleCourseSelection(course.id)}
                />
              </TableCell>
              <TableCell>{course.title}</TableCell>
              <TableCell>
                <div className='flex items-center'>
                  <Clock className='mr-2 h-4 w-4 text-muted-foreground' />
                  {course.timeEstimate}
                </div>
              </TableCell>
              <TableCell>{course.scheduledPublishDate}</TableCell>
              <TableCell>
                <span className='inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'>
                  {course.status}
                </span>
              </TableCell>
              <TableCell>{course.level}</TableCell>
              <TableCell>${course.price.toFixed(2)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Open menu</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-6 h-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(course.id)}>
                      Copy course ID
                    </DropdownMenuItem>
                    <DropdownMenuItem>View course details</DropdownMenuItem>
                    <DropdownMenuItem>Edit course</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='text-sm text-muted-foreground'>
          {selectedCourses.length} of {courses.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {}} // Add functionality for previous page
          >
            Previous
          </Button>
          <Button variant='outline' size='sm' className='px-4'>
            1
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {}} // Add functionality for next page
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
