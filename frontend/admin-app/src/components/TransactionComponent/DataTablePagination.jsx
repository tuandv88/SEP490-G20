import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function DataTablePagination({ table, isLoading }) {
  const { pageSize, pageIndex } = table.getState().pagination
  const totalCount = table.options.pageCount * pageSize
  const currentPageStart = pageIndex * pageSize + 1
  const currentPageEnd = Math.min((pageIndex + 1) * pageSize, totalCount)

  const handlePageSizeChange = (value) => {
    const newSize = Number(value)
    table.options.onPaginationChange({
      pageIndex: 0,
      pageSize: newSize
    })
  }

  const handlePageChange = (newPageIndex) => {
    table.options.onPaginationChange({
      pageIndex: newPageIndex,
      pageSize
    })
  }

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex-1 text-sm text-muted-foreground'>
        View {currentPageStart}-{currentPageEnd} of {totalCount} records
      </div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select value={`${pageSize}`} onValueChange={handlePageSizeChange} disabled={isLoading}>
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {pageIndex + 1} of {table.getPageCount() || 1}
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => handlePageChange(0)}
            disabled={pageIndex === 0 || isLoading}
          >
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex === 0 || isLoading}
          >
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex >= table.getPageCount() - 1 || isLoading}
          >
            <ChevronRightIcon className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => handlePageChange(table.getPageCount() - 1)}
            disabled={pageIndex >= table.getPageCount() - 1 || isLoading}
          >
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
