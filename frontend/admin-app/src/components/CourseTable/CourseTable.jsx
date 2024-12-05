import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PlusCircle, ChevronDown, GraduationCap, Trash } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { flexRender } from '@tanstack/react-table'
import MultiSelect from './MultiSelect'
import SelectedFilters from './SelectedFilters'
import { TableRowSkeleton } from './TableRowSkeleton'
import useCourseTable from '@/hooks/useCourseTable'

import SchedulePublishDialog from '@/components/SchedulePublishDialog'
import { CREATE_COURSE_PATH } from '@/routers/router'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'

function CourseTable() {
  const navigate = useNavigate()
  const [resetKey, setResetKey] = useState(0)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false)

  const {
    table,
    isLoading,
    error,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    totalCount,
    isStatusChangeDialogOpen,
    setIsStatusChangeDialogOpen,
    scheduledDateTime,
    setScheduledDateTime,
    handleScheduledStatusConfirm,
    handleStatusChange,
    selectedCourse,
    newStatus,
    handleLevelChange,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleShowDeleteDialog,
    handleDeleteCourse
  } = useCourseTable()

  const handleNewCourse = () => {
    navigate({ to: CREATE_COURSE_PATH })
  }

  const hasActiveFilters = () => {
    return table.getState().columnFilters.length > 0
  }

  const resetFilters = () => {
    table.resetColumnFilters()
    setResetKey((prev) => prev + 1)
    setStatusDropdownOpen(false)
    setLevelDropdownOpen(false)
  }

  if (error) return <div>Error loading courses: {error.message}</div>

  return (
    <div className='w-full h-full'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold'>Courses</h2>
        <Button onClick={handleNewCourse}>
          <PlusCircle className='w-4 h-4 mr-2' /> New Course
        </Button>
      </div>

      <div
        className='flex flex-wrap items-
center gap-4 py-4'
      >
        <Input
          placeholder='Filter courses...'
          value={table.getColumn('title')?.getFilterValue() ?? ''}
          onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <MultiSelect
          options={['Draft', 'Published', 'Scheduled', 'Archived']}
          placeholder='Select Statuses'
          value={table.getColumn('courseStatus')?.getFilterValue() ?? []}
          onChange={(values) => table.getColumn('courseStatus')?.setFilterValue(values)}
          resetKey={resetKey}
          isOpen={statusDropdownOpen}
          setIsOpen={setStatusDropdownOpen}
        />
        <MultiSelect
          options={['Basic', 'Intermediate', 'Advanced', 'Expert']}
          placeholder='Select Levels'
          value={table.getColumn('courseLevel')?.getFilterValue() ?? []}
          onChange={(values) => table.getColumn('courseLevel')?.setFilterValue(values)}
          resetKey={resetKey}
          isOpen={levelDropdownOpen}
          setIsOpen={setLevelDropdownOpen}
          icon={<GraduationCap className='w-4 h-4 mr-2' />}
        />
        {hasActiveFilters() && (
          <Button variant='outline' onClick={resetFilters}>
            Reset Filters
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='w-4 h-4 ml-2' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='mt-2 mb-4'>
        <SelectedFilters column='courseStatus' table={table} />
        <SelectedFilters column='courseLevel' table={table} />
      </div>

      <div className='border rounded-md border-border bg-background'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='text-center'>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => <TableRowSkeleton key={index} />)
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {/* {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected. */}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
            disabled={pageIndex === 1}
          >
            Previous
          </Button>
          <div className='flex items-center space-x-1'>
            {pageIndex > 2 && (
              <>
                <Button variant='outline' size='sm' onClick={() => setPageIndex(1)}>
                  1
                </Button>
                {pageIndex > 3 && <span>...</span>}
              </>
            )}
            {pageIndex > 1 && (
              <Button variant='outline' size='sm' onClick={() => setPageIndex(pageIndex - 1)}>
                {pageIndex - 1}
              </Button>
            )}
            <Button variant='default' size='sm' className='bg-primary text-primary-foreground hover:bg-primary/90'>
              {pageIndex}
            </Button>
            {pageIndex < Math.ceil(totalCount / pageSize) && (
              <Button variant='outline' size='sm' onClick={() => setPageIndex(pageIndex + 1)}>
                {pageIndex + 1}
              </Button>
            )}
            {pageIndex < Math.ceil(totalCount / pageSize) - 1 && (
              <>
                {pageIndex < Math.ceil(totalCount / pageSize) - 2 && <span>...</span>}
                <Button variant='outline' size='sm' onClick={() => setPageIndex(Math.ceil(totalCount / pageSize))}>
                  {Math.ceil(totalCount / pageSize)}
                </Button>
              </>
            )}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, Math.ceil(totalCount / pageSize)))}
            disabled={pageIndex === Math.ceil(totalCount / pageSize)}
          >
            Next
          </Button>
        </div>
      </div>

      <SchedulePublishDialog
        open={isStatusChangeDialogOpen}
        onOpenChange={setIsStatusChangeDialogOpen}
        onConfirm={handleScheduledStatusConfirm}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteCourse}
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone."
      />
    </div>
  )
}

export default CourseTable
