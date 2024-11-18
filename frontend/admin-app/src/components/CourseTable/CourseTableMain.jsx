import React, { useState , useEffect} from 'react'
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
  const [pageIndex, setPageIndex] = useState(1); // Start at 0
  const pageSize = 10;
  const { table, isLoading, error } = useCourseTable(pageIndex, pageSize)
  const navigate = useNavigate()

  const handleNewCourse = () => {
    navigate({ to: '/create-course' })
  }


  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading courses</div>
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
      <CourseTablePagination
        table={table}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
      />
    </div>
  )
}

CourseTable.propTypes = {
  // No props for this component, but we can add them if needed in the future
}
export default CourseTable
