import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'

export default function CourseTablePagination({ table }) {
  console.log('Page Count:', table.getPageCount());
  console.log('Current Page Index:', table.getState().pagination.pageIndex);

  return (
    <div className='flex items-center justify-between py-4 space-x-2'>
      <div className='flex-1 text-sm text-muted-foreground'>
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className='flex items-center space-x-2'>
        <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <div className='flex items-center space-x-1'>
          {table.getPageCount() > 3 && table.getState().pagination.pageIndex > 1 && (
            <>
              <Button variant='outline' size='sm' onClick={() => table.setPageIndex(0)}>
                1
              </Button>
              {table.getState().pagination.pageIndex > 2 && <span>...</span>}
            </>
          )}
          {table.getState().pagination.pageIndex > 0 && (
            <Button variant='outline' size='sm' onClick={() => table.previousPage()}>
              {table.getState().pagination.pageIndex}
            </Button>
          )}
          <Button
            variant='default'
            size='sm'
            onClick={() => table.setPageIndex(table.getState().pagination.pageIndex)}
            className='bg-primary text-primary-foreground hover:bg-primary/90'
          >
            {table.getState().pagination.pageIndex + 1}
          </Button>
          {table.getState().pagination.pageIndex < table.getPageCount() - 1 && (
            <Button variant='outline' size='sm' onClick={() => table.nextPage()}>
              {table.getState().pagination.pageIndex + 2}
            </Button>
          )}

          {table.getPageCount() > 3 && table.getState().pagination.pageIndex < table.getPageCount() - 2 && (
            <>
              {table.getState().pagination.pageIndex < table.getPageCount() - 3 && <span>...</span>}
              <Button variant='outline' size='sm' onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                {table.getPageCount()}
              </Button>
            </>
          )}
        </div>
        <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )

}
CourseTablePagination.propTypes = {
  table: PropTypes.object.isRequired
}