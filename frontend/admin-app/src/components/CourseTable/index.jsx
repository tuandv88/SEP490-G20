import React from 'react'
import PropTypes from 'prop-types'
import CourseTableHeader from './CourseTableHeader'
import CourseTableBody from './CourseTableBody'
import CourseTablePagination from './CourseTablePagination'
import CourseTableFilters from './CourseTableFilters'
import { Table } from '@/components/ui/table'
import useCourseTable from '@/hooks/useCourseTable'

function CourseTable() {
  const { table } = useCourseTable()

  return (
    <div className='w-full h-full'>
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
