import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import CourseTableHeader from './CourseTableHeader'
import CourseTableBody from './CourseTableBody'
import CourseTablePagination from './CourseTablePagination'
import CourseTableFilters from './CourseTableFilters'
import { Table } from '@/components/ui/table'
import useCourseTable from '@/hooks/useCourseTable'

function CourseTable() {
  const { table } = useCourseTable()
  const navigate = useNavigate()

  const handleNewCourse = () => {
    navigate({ to: '/create-course' })
  }
  return (
    <div className='w-full h-full'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold'>Courses</h2>
        <Button onClick={handleNewCourse}>
          <PlusCircle className='w-4 h-4 mr-2' /> New Course
        </Button>
      </div>
      <CourseTableFilters table={table} />
      <div className='border rounded-md border-border bg-background'>
        <Table>
          <CourseTableHeader table={table} />
          <CourseTableBody table={table} />
        </Table>
      </div>
      <CourseTablePagination table={table} />
    </div>
  )
}

CourseTable.propTypes = {
  // No props for this component, but we can add them if needed in the future
}
export default CourseTable
