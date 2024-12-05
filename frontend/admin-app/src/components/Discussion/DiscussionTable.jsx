'use client'

import React from 'react'
import PropTypes from 'prop-types'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ViolationDetailsDialog } from './violation-details-dialog'

export function DiscussionTable({ data = [] }) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [violationDetails, setViolationDetails] = React.useState(null)

  const handleViolationClick = (rowData) => {
    setViolationDetails(rowData)
  }

  const deleteDiscussion = (id) => {
    // Implement delete functionality here
    console.log(`Deleting discussion with id: ${id}`)
  }

  const columns = [
    {
      accessorKey: 'index',
      header: 'STT',
      cell: ({ row }) => row.index + 1
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Title
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      }
    },
    {
      accessorKey: 'nameCategory',
      header: 'Category'
    },
    {
      accessorKey: 'dateCreated',
      header: 'Date Created',
      cell: ({ row }) => new Date(row.getValue('dateCreated')).toLocaleDateString()
    },
    {
      accessorKey: 'viewCount',
      header: 'View Count'
    },
    {
      accessorKey: 'voteCount',
      header: 'Vote Count'
    },
    {
      accessorKey: 'commentsCount',
      header: 'Comment Count'
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('isActive') ? 'success' : 'destructive'}>
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => (
        <div className='flex flex-wrap gap-1'>
          {row.getValue('tags').map((tag, index) => (
            <Badge key={index} variant='outline'>
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
    {
      accessorKey: 'violationLevel',
      header: 'Violation',
      cell: ({ row }) => {
        const violationLevel = row.getValue('violationLevel')
        let status = 'None'
        let color = 'bg-gray-100 text-gray-800'

        switch (violationLevel) {
          case 1:
            status = 'Low'
            color = 'bg-yellow-100 text-yellow-800'
            break
          case 2:
            status = 'Medium'
            color = 'bg-orange-100 text-orange-800'
            break
          case 3:
            status = 'High'
            color = 'bg-red-100 text-red-800'
            break
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${color} cursor-pointer`}
            onClick={() => handleViolationClick(row.original)}
          >
            {status}
          </span>
        )
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const discussion = row.original
        const navigate = useNavigate()
        const discussionId = discussion.discussionId
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(discussionId)}>
                Copy discussion ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit discussion</DropdownMenuItem>
              <DropdownMenuItem>Delete discussion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className='w-full space-y-4'>
      <div className='flex items-center justify-between'>
        <Input
          placeholder='Filter titles...'
          value={table.getColumn('title')?.getFilterValue() ?? ''}
          onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader className='bg-muted'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='font-bold text-muted-foreground'>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                  No discussion found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
          <span className='text-sm text-muted-foreground'>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <p className='text-sm text-muted-foreground'>Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[8, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {violationDetails && (
        <ViolationDetailsDialog
          isOpen={!!violationDetails}
          onClose={() => setViolationDetails(null)}
          details={violationDetails}
        />
      )}
    </div>
  )
}

// DiscussionTable.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       discussionId: PropTypes.string.isRequired,
//       title: PropTypes.string.isRequired,
//       nameCategory: PropTypes.string.isRequired,
//       dateCreated: PropTypes.string.isRequired,
//       viewCount: PropTypes.number.isRequired,
//       voteCount: PropTypes.number.isRequired,
//       commentsCount: PropTypes.number.isRequired,
//       isActive: PropTypes.bool.isRequired,
//       tags: PropTypes.arrayOf(PropTypes.string).isRequired,
//       violationLevel: PropTypes.number.isRequired,
//       reason: PropTypes.string.isRequired,
//       flaggedDate: PropTypes.string.isRequired
//     })
//   ).isRequired
// }
