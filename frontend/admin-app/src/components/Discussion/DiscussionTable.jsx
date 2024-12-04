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
import { ArrowUpDown, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
    header: 'Is Active',
    cell: ({ row }) => (row.getValue('isActive') ? 'Yes' : 'No')
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => row.getValue('tags').join(', ')
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

      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
    }
  }
]

export function DiscussionTable({ data }) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

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
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter titles...'
          value={table.getColumn('title')?.getFilterValue() ?? ''}
          onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
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
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className='space-x-2'>
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
        </div>
      </div>
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
//       reason: PropTypes.string.isRequired
//     })
//   ).isRequired
// }
