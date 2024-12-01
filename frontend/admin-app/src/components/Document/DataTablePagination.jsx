import React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DOCUMENT_AI_TABLE_PATH } from '@/routers/router'

export function DataTablePagination({ table, setPageIndex, setPageSize, isLoading }) {
  return (
    <div className='flex items-center gap-6'>
      <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
        <span>
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
        </span>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium'>Rows per page</span>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            setPageSize(Number(value))
          }}
          disabled={isLoading}
        >
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side='top'>
            {[10].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center gap-6'>
        <span className='text-sm'>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            asChild
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            <Link to={DOCUMENT_AI_TABLE_PATH} search={(prev) => ({ ...prev, page: 1 })} aria-label='First page'>
              <ChevronsLeft className='h-4 w-4' />
            </Link>
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            asChild
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            <Link
              to={DOCUMENT_AI_TABLE_PATH}
              search={(prev) => ({ ...prev, page: Math.max(1, Number(prev.page) - 1) })}
              aria-label='Previous page'
            >
              <ChevronLeft className='h-4 w-4' />
            </Link>
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            asChild
            disabled={!table.getCanNextPage() || isLoading}
          >
            <Link
              to={DOCUMENT_AI_TABLE_PATH}
              search={(prev) => ({ ...prev, page: Math.min(table.getPageCount(), Number(prev.page) + 1) })}
              aria-label='Next page'
            >
              <ChevronRight className='h-4 w-4' />
            </Link>
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            asChild
            disabled={!table.getCanNextPage() || isLoading}
          >
            <Link
              to={DOCUMENT_AI_TABLE_PATH}
              search={(prev) => ({ ...prev, page: table.getPageCount() })}
              aria-label='Last page'
            >
              <ChevronsRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
