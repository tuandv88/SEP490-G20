import React, { useState, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table'

import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { DataTablePagination } from './DataTablePagination'
import { DataTableToolbar } from './DataTableToolbar'

export function DataTable({ columns, data, pagination, onPaginationChange, onFiltersChange, onColumnFiltersChange, isLoading, onUserSelect, onClearFilters }) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState({})
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])

  const handleColumnFiltersChange = useCallback((filters) => {
    if (!Array.isArray(filters)) {
      filters = []
    }
    setColumnFilters(filters)
    
    if (filters.length > 0) {
      const [filter] = filters
      onColumnFiltersChange(filter.id, filter.value)
    } else {
      onColumnFiltersChange(null, null)
    }
  }, [onColumnFiltersChange])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize
      }
    },
    pageCount: Math.ceil(pagination.totalCount / pagination.pageSize),
    onPaginationChange: onPaginationChange,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onUserSelect,
  })

  const LoadingRow = () => (
    <TableRow>
      {columns.map((column, idx) => (
        <TableCell key={idx}>
          <Skeleton className='h-6 w-full' />
        </TableCell>
      ))}
    </TableRow>
  )

  const LoadingRows = () => (
    <>
      {Array.from({ length: pagination.pageSize }).map((_, idx) => (
        <LoadingRow key={idx} />
      ))}
    </>
  )

  return (
    <div className='space-y-4'>
      <DataTableToolbar 
        table={table} 
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows />
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
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} isLoading={isLoading} />
    </div>
  )
}
